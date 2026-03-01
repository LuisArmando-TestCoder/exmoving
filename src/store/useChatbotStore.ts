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
  isSuccess: boolean;
  setIsSuccess: (isSuccess: boolean) => void;
  summaryText: string;
  isNewsletterOpen: boolean;
  isListening: boolean;
  // Resource Intelligence
  totalTokensIn: number;
  totalTokensOut: number;
  totalCost: number;
  modelsUsed: string[];
  addUsage: (metrics: { inputTokens: number; outputTokens: number; cost: number; modelId: string }) => void;
  
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
  setIsListening: (isListening: boolean) => void;
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return state;
        
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
      isSuccess: false,
      setIsSuccess: (isSuccess) => set({ isSuccess }),
      summaryText: "",
      isNewsletterOpen: false,
      isListening: true,
      // Resource Intelligence
      totalTokensIn: 0,
      totalTokensOut: 0,
      totalCost: 0,
      modelsUsed: [],
      addUsage: (metrics) => set((state) => ({
        totalTokensIn: state.totalTokensIn + metrics.inputTokens,
        totalTokensOut: state.totalTokensOut + metrics.outputTokens,
        totalCost: state.totalCost + metrics.cost,
        modelsUsed: state.modelsUsed.includes(metrics.modelId) 
          ? state.modelsUsed 
          : [...state.modelsUsed, metrics.modelId]
      })),

      openChatbot: (context = {}) => {
        set((state) => {
          const mergedContext = { ...state.userContext, ...context };
          // Reset chat when opening if it was closed previously
          return {
            isOpen: true,
            userContext: mergedContext,
            messages: getInitialMessages(mergedContext),
            isErratic: false,
            isSuccess: false,
            showEmailBtn: false,
            summaryText: "",
            isListening: true,
            // Reset session telemetry
            totalTokensIn: 0,
            totalTokensOut: 0,
            totalCost: 0,
            modelsUsed: [],
          };
        });
      },
      closeChatbot: () => set({ isOpen: false, isListening: false }),
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
      setIsListening: (isListening) => set({ isListening }),
      resetChat: () => set((state) => ({
        messages: getInitialMessages(state.userContext),
        isErratic: false,
        isSuccess: false,
        showEmailBtn: false,
        summaryText: "",
        isListening: true,
      })),
    }),
    {
      name: "chatbot-storage",
      partialize: (state) => ({ 
        behaviorNotes: state.behaviorNotes, 
        interactionHistory: state.interactionHistory,
        userEmail: state.userEmail,
        userContext: state.userContext,
        messages: state.messages,
        isErratic: state.isErratic,
        isSuccess: state.isSuccess,
        summaryText: state.summaryText,
        showEmailBtn: state.showEmailBtn,
        totalTokensIn: state.totalTokensIn,
        totalTokensOut: state.totalTokensOut,
        totalCost: state.totalCost,
        modelsUsed: state.modelsUsed
      }),
    }
  )
);
