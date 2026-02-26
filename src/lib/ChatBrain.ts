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

  async sendMessage(userInput: string, history: ChatMessage[]) {
    // Google Generative AI requires the first message in history to be from the 'user' role.
    const validHistory = history
      .filter((_, index) => index > 0 || history[0].role === "user")
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
}
