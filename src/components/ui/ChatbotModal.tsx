"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useChatbotStore } from "@/store/useChatbotStore";
import { Chatbot } from "./Chatbot";
import styles from "./EmailModal.module.scss"; // Reuse modal styles or adapt them

export const ChatbotModal = () => {
  const { isOpen, closeChatbot, userContext } = useChatbotStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={closeChatbot}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px", padding: 0, overflow: "hidden" }}
          >
            <button className={styles.closeButton} onClick={closeChatbot}>
              <X size={24} />
            </button>
            <Chatbot 
              apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""} 
              userContext={userContext}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
