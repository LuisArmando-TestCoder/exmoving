import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  role: "model" | "user";
  text: string;
  timestamp: string;
}

interface InteractionRecord {
  date: string;
  status: 'success' | 'erratic';
}

interface ChatbotState {
  isOpen: boolean;
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  userContext: any;
  messages: Message[];
  isErratic: boolean;
  behaviorNotes: string;
  interactionHistory: InteractionRecord[];
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
  addInteractionRecord: (record: InteractionRecord) => void;
  setShowEmailBtn: (showEmailBtn: boolean) => void;
  setSummaryText: (summaryText: string) => void;
  resetChat: () => void;
}

const getInitialMessages = (context: any): Message[] => {
  const emailMsg = context?.email ? ` I see your email is ${context.email}.` : "";
  return [
    {
      role: "model",
      text: `Hello!${emailMsg} I'm here to help you explore how automation can transform your business. To get started, could you tell me your company name and what industry you're in?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ];
};

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      isOpen: false,
      userEmail: null,
      setUserEmail: (email) => set((state) => {
        const newContext = { ...state.userContext, email };
        return { 
          userEmail: email,
          userContext: newContext
        };
      }),
      userContext: {},
      messages: getInitialMessages({}),
      isErratic: false,
      behaviorNotes: "",
      interactionHistory: [],
      showEmailBtn: false,
      summaryText: "",
      isNewsletterOpen: false,
      openChatbot: (context = {}) => {
        set((state) => {
          const mergedContext = { ...state.userContext, ...context };
          // Reset chat when opening if it was closed previously
          return {
            isOpen: true,
            userContext: mergedContext,
            messages: getInitialMessages(mergedContext),
            isErratic: false,
            showEmailBtn: false,
            summaryText: "",
          };
        });
      },
      closeChatbot: () => set({ isOpen: false }),
      openNewsletter: () => set({ isNewsletterOpen: true }),
      closeNewsletter: () => set({ isNewsletterOpen: false }),
      setMessages: (messagesOrFn) => 
        set((state) => ({ 
          messages: typeof messagesOrFn === 'function' ? messagesOrFn(state.messages) : messagesOrFn 
        })),
      setIsErratic: (isErratic) => set({ isErratic }),
      setBehaviorNotes: (notes) => set((state) => ({ behaviorNotes: state.behaviorNotes + (state.behaviorNotes ? "\n" : "") + notes })),
      addInteractionRecord: (record) => set((state) => ({ interactionHistory: [...state.interactionHistory, record] })),
      setShowEmailBtn: (showEmailBtn) => set({ showEmailBtn }),
      setSummaryText: (summaryText) => set({ summaryText }),
      resetChat: () => set((state) => ({
        messages: getInitialMessages(state.userContext),
        isErratic: false,
        showEmailBtn: false,
        summaryText: "",
      })),
    }),
    {
      name: "chatbot-storage",
      partialize: (state) => ({ 
        behaviorNotes: state.behaviorNotes, 
        interactionHistory: state.interactionHistory,
        userEmail: state.userEmail,
        userContext: state.userContext
      }),
    }
  )
);
