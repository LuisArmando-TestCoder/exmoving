"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useChatbotStore } from "@/store/useChatbotStore";
import { Chatbot } from "./Chatbot";
import styles from "./ChatbotModal.module.scss";

export const ChatbotModal = () => {
  const { isOpen, closeChatbot, userContext } = useChatbotStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.modalOverlay} 
          onClick={closeChatbot}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.onboardingHeader}>
              <h2>AI Consultation</h2>
              <p>Explore automation opportunities for your business. Provide your details below to get a custom roadmap.</p>
            </div>

            <button className={styles.closeButton} onClick={closeChatbot} aria-label="Close">
              <X size={20} />
            </button>
            
            <Chatbot 
              apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""} 
              userContext={userContext}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
