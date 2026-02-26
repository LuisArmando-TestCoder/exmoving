"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check } from "lucide-react";
import { useChatbotStore } from "@/store/useChatbotStore";
import { Chatbot } from "./Chatbot";
import styles from "./ChatbotModal.module.scss";

export const ChatbotModal = () => {
  const { isOpen, closeChatbot, userContext, interactionHistory } = useChatbotStore();

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
              <div className={styles.headerBadge}>
                <Sparkles size={12} className={styles.sparkleIcon} />
                <span>Proprietary Engine</span>
              </div>
              <div className={styles.titleWrapper}>
                <h2>Consultation</h2>
                <div className={styles.statusDot} />
              </div>
              <p>Explore automation opportunities for your business. Provide your details below to get a custom roadmap.</p>
              
              {interactionHistory.length > 0 && (
                <div className={styles.historyTags} style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {interactionHistory.map((record, index) => (
                    <div 
                      key={index} 
                      title={record.status === 'success' ? 'Successful Consultation' : 'Erratic Behavior Detected'}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        fontSize: '0.75rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        background: record.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${record.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        color: record.status === 'success' ? '#34d399' : '#f87171'
                      }}
                    >
                      {record.status === 'success' ? <Check size={12} /> : <X size={12} />}
                      <span>{record.date}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.headerGlow} />
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
