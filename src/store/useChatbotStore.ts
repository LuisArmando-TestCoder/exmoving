import { create } from "zustand";

interface ChatbotState {
  isOpen: boolean;
  userContext: any;
  openChatbot: (context?: any) => void;
  closeChatbot: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  isOpen: false,
  userContext: {},
  openChatbot: (context = {}) => set({ isOpen: true, userContext: context }),
  closeChatbot: () => set({ isOpen: false }),
}));
