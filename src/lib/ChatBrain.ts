import { GoogleGenerativeAI } from "@google/generative-ai";

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
    // Google Generative AI requires the first message in history to be from the 'user' role.
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
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
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
    // Silently observe and note user behavior
    const observerModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "You are a silent observer. Summarize the user's current behavior, intent, and cooperation level in 5 words or less. Be objective."
    });

    const conversationContext = history.slice(-3).map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
    const prompt = `CONTEXT:\n${conversationContext}\nUSER: ${userInput}\n\nObservation:`;

    try {
      const result = await observerModel.generateContent(prompt);
      return (await result.response).text().trim();
    } catch (e) {
      return "Observation unavailable";
    }
  }

  async analyzeBehaviorPatterns(behaviorNotes: string) {
    // Analyze the behavior log for odd patterns
    const analyzerModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "Analyze the following behavior log for odd, erratic, or uncooperative patterns. Return 'true' if a pattern of odd behavior is found, 'false' otherwise. Only return 'true' or 'false'."
    });

    try {
      const result = await analyzerModel.generateContent(`BEHAVIOR LOG:\n${behaviorNotes}\n\nPattern detected?`);
      return (await result.response).text().toLowerCase().includes("true");
    } catch (e) {
      return false;
    }
  }

  async getBehaviorPatternSummary(behaviorNotes: string) {
    // Get a concise summary of the patterns in the behavior notes
    const summarizerModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "You are a behavioral psychologist. Analyze the interaction notes and provide a ONE SENTENCE high-level summary of the user's behavioral patterns and psychological state during the session. Be direct and analytical."
    });

    try {
      const result = await summarizerModel.generateContent(`BEHAVIOR NOTES:\n${behaviorNotes}\n\nSummary of patterns:`);
      return (await result.response).text().trim();
    } catch (e) {
      return "Pattern summary unavailable";
    }
  }
}
