import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  behaviorNotes: string;
  showEmailBtn: boolean;
  summaryText: string;
  isNewsletterOpen: boolean;
  openChatbot: (context?: any) => void;
  closeChatbot: () => void;
  openNewsletter: () => void;
  closeNewsletter: () => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setIsErratic: (isErratic: boolean) => void;
  setBehaviorNotes: (notes: string) => void;
  setShowEmailBtn: (showEmailBtn: boolean) => void;
  setSummaryText: (summaryText: string) => void;
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
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
      behaviorNotes: "",
      showEmailBtn: false,
      summaryText: "",
      isNewsletterOpen: false,
      openChatbot: (context = {}) => set({ isOpen: true, userContext: context }),
      closeChatbot: () => set({ isOpen: false }),
      openNewsletter: () => set({ isNewsletterOpen: true }),
      closeNewsletter: () => set({ isNewsletterOpen: false }),
      setMessages: (messagesOrFn) => 
        set((state) => ({ 
          messages: typeof messagesOrFn === 'function' ? messagesOrFn(state.messages) : messagesOrFn 
        })),
      setIsErratic: (isErratic) => set({ isErratic }),
      setBehaviorNotes: (notes) => set((state) => ({ behaviorNotes: state.behaviorNotes + (state.behaviorNotes ? "\n" : "") + notes })),
      setShowEmailBtn: (showEmailBtn) => set({ showEmailBtn }),
      setSummaryText: (summaryText) => set({ summaryText }),
    }),
    {
      name: "chatbot-storage",
      partialize: (state) => ({ behaviorNotes: state.behaviorNotes, isErratic: state.isErratic }),
    }
  )
);
