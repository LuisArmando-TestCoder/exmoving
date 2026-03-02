import { GoogleGenerativeAI } from "@google/generative-ai";
import { IntelligenceUnit } from "./IntelligenceUnit";
import { useChatbotStore } from "@/store/useChatbotStore";

export interface ChatMessage {
  role: "model" | "user";
  text: string;
}

export interface ChatConfig {
  apiKey: string;
  modelId?: string;
  systemInstruction?: string;
}

export class ChatBrain {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(config: ChatConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: config.modelId || "gemini-flash-latest",
      systemInstruction: config.systemInstruction,
    });
  }

  async *sendMessageStream(userInput: string, history: ChatMessage[]) {
    const validHistory = history
      .filter((_, index) => index > 0 || (history.length > 0 && history[0].role === "user"))
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

    const chat = this.model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessageStream(userInput);
    let fullText = "";
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      yield chunkText;
    }

    // Telemetry Report
    const metrics = {
      inputTokens: IntelligenceUnit.estimateTokens(JSON.stringify(validHistory) + userInput),
      outputTokens: IntelligenceUnit.estimateTokens(fullText),
      modelId: this.model.model,
      operation: "conversational_core_stream"
    };
    const cost = IntelligenceUnit.calculateCost(metrics);
    IntelligenceUnit.logTelemetry(metrics, cost, "Primary dialogue stream complete.");
    useChatbotStore.getState().addUsage({ ...metrics, cost });
  }

  async sendMessage(userInput: string, history: ChatMessage[]) {
    // Keep non-streaming version for other uses if needed
    const validHistory = history
      .filter((_, index) => index > 0 || (history.length > 0 && history[0].role === "user"))
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

    const chat = this.model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    return response.text();
  }

  async observeBehavior(userInput: string, history: ChatMessage[]) {
    const observerModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "You are a silent observer. Summarize the user's current behavior, intent, and cooperation level in 5 words or less. Be objective."
    });

    const conversationContext = history.slice(-3).map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
    const prompt = `CONTEXT:\n${conversationContext}\nUSER: ${userInput}\n\nObservation:`;

    try {
      const result = await observerModel.generateContent(prompt);
      const responseText = (await result.response).text().trim();
      
      // Telemetry
      const metrics = {
        inputTokens: IntelligenceUnit.estimateTokens(prompt),
        outputTokens: IntelligenceUnit.estimateTokens(responseText),
        modelId: observerModel.model,
        operation: "behavior_observation"
      };
      const cost = IntelligenceUnit.calculateCost(metrics);
      IntelligenceUnit.logTelemetry(metrics, cost, "Silent background observation logged.");
      useChatbotStore.getState().addUsage({ ...metrics, cost });

      return responseText;
    } catch (e) {
      return "Observation unavailable";
    }
  }

  async analyzeBehaviorPatterns(behaviorNotes: string) {
    const analyzerModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: `Analyze the following behavior log. 
      The user is ALLOWED to be uncooperative, skeptical, or frustrated if the chatbot is acting erratic, repetitive, or unhelpful.
      
      You must ONLY return 'true' if the user's behavior is TRULY ABSURD, malicious, or completely nonsensical regardless of the chatbot's performance.
      If the user is just being difficult but within reason for a frustrated customer, return 'false'.
      
      Return 'true' if a pattern of truly absurd behavior is found, 'false' otherwise. Only return 'true' or 'false'.`
    });

    try {
      const result = await analyzerModel.generateContent(`BEHAVIOR LOG (Interaction history and notes):\n${behaviorNotes}\n\nTruly absurd pattern detected?`);
      const responseText = (await result.response).text().toLowerCase();
      
      // Telemetry
      const metrics = {
        inputTokens: IntelligenceUnit.estimateTokens(behaviorNotes),
        outputTokens: IntelligenceUnit.estimateTokens(responseText),
        modelId: analyzerModel.model,
        operation: "pattern_analysis"
      };
      const cost = IntelligenceUnit.calculateCost(metrics);
      IntelligenceUnit.logTelemetry(metrics, cost, "Behavioral pattern analysis cycle complete.");
      useChatbotStore.getState().addUsage({ ...metrics, cost });

      return responseText.includes("true");
    } catch (e) {
      return false;
    }
  }

  async getBehaviorPatternSummary(behaviorNotes: string) {
    const summarizerModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "You are a behavioral psychologist. Analyze the interaction notes and provide a ONE SENTENCE high-level summary of the user's behavioral patterns and psychological state during the session. Be direct and analytical."
    });

    try {
      const result = await summarizerModel.generateContent(`BEHAVIOR NOTES:\n${behaviorNotes}\n\nSummary of patterns:`);
      const responseText = (await result.response).text().trim();

      // Telemetry
      const metrics = {
        inputTokens: IntelligenceUnit.estimateTokens(behaviorNotes),
        outputTokens: IntelligenceUnit.estimateTokens(responseText),
        modelId: summarizerModel.model,
        operation: "psychological_profiling"
      };
      const cost = IntelligenceUnit.calculateCost(metrics);
      IntelligenceUnit.logTelemetry(metrics, cost, "Final behavioral profiling dossier complete.");
      useChatbotStore.getState().addUsage({ ...metrics, cost });

      return responseText;
    } catch (e) {
      return "Pattern summary unavailable";
    }
  }

  async generateUserChatSummary(historyText: string) {
    const summarizerModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "You are a professional business consultant. Summarize the following consultation chat in a single, high-impact paragraph. Focus on the business objectives and the value of automation for their specific case. Be encouraging and professional."
    });

    try {
      const result = await summarizerModel.generateContent(`CHAT HISTORY:\n${historyText}\n\nSummary for the user:`);
      const responseText = (await result.response).text().trim();

      // Telemetry
      const metrics = {
        inputTokens: IntelligenceUnit.estimateTokens(historyText),
        outputTokens: IntelligenceUnit.estimateTokens(responseText),
        modelId: summarizerModel.model,
        operation: "user_chat_summary"
      };
      const cost = IntelligenceUnit.calculateCost(metrics);
      IntelligenceUnit.logTelemetry(metrics, cost, "User-facing chat summary generated.");
      useChatbotStore.getState().addUsage({ ...metrics, cost });

      return responseText;
    } catch (e) {
      return "Thank you for your consultation. Our team is reviewing your requirements and will contact you shortly.";
    }
  }
}
