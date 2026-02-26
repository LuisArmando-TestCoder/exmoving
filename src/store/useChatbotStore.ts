import { create } from "zustand";

interface Message {
  role: "model" | "user";
  text: string;
  timestamp: string;
}

interface ChatbotState {
  isOpen: boolean;
  userContext: any;
  messages: Message[];
  isErratic: boolean;
  showEmailBtn: boolean;
  summaryText: string;
  openChatbot: (context?: any) => void;
  closeChatbot: () => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setIsErratic: (isErratic: boolean) => void;
  setShowEmailBtn: (showEmailBtn: boolean) => void;
  setSummaryText: (summaryText: string) => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  isOpen: false,
  userContext: {},
  messages: [
    {
      role: "model",
      text: "Hello! I'm here to help you explore how automation can transform your business. To get started, could you tell me your company name and what industry you're in?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  isErratic: false,
  showEmailBtn: false,
  summaryText: "",
  openChatbot: (context = {}) => set({ isOpen: true, userContext: context }),
  closeChatbot: () => set({ isOpen: false }),
  setMessages: (messagesOrFn) => 
    set((state) => ({ 
      messages: typeof messagesOrFn === 'function' ? messagesOrFn(state.messages) : messagesOrFn 
    })),
  setIsErratic: (isErratic) => set({ isErratic }),
  setShowEmailBtn: (showEmailBtn) => set({ showEmailBtn }),
  setSummaryText: (summaryText) => set({ summaryText }),
}));
