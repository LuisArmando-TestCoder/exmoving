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

  async checkErraticBehavior(userInput: string, history: ChatMessage[]) {
    // A separate prompt to evaluate if the user is being erratic or uncooperative.
    const evaluationModel = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "Evaluate the user's latest message and overall conversation history. Return 'true' if the user is being erratic, going on a tangent, being abusive, or clearly refusing to cooperate with the consultation process. Return 'false' otherwise. Only return 'true' or 'false'."
    });

    const conversationContext = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
    const evaluationPrompt = `CONVERSATION HISTORY:\n${conversationContext}\n\nUSER LATEST MESSAGE: ${userInput}\n\nIs the user behaving erratically or being uncooperative? (true/false)`;

    try {
      const result = await evaluationModel.generateContent(evaluationPrompt);
      const response = await result.response;
      return response.text().toLowerCase().includes("true");
    } catch (error) {
      console.error("Error checking erratic behavior:", error);
      return false;
    }
  }
}
