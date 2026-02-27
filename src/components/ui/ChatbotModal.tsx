"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check } from "lucide-react";
import { useChatbotStore } from "@/store/useChatbotStore";
import { Chatbot } from "./Chatbot";
import { ChatBrain } from "@/lib/ChatBrain";
import { sendEmail } from "@/app/actions";
import { getEmailTemplate } from "@/utils/emailTemplates";
import styles from "./ChatbotModal.module.scss";

export const ChatbotModal = () => {
  const { 
    isOpen, 
    closeChatbot, 
    userContext, 
    interactionHistory, 
    messages, 
    behaviorNotes,
    isErratic 
  } = useChatbotStore();

  const handleClose = async () => {
    const currentState = useChatbotStore.getState();
    // If there are messages and the chat wasn't already marked as success or erratic
    // then it's an abandonment.
    const lastRecord = interactionHistory[interactionHistory.length - 1];
    const isSuccess = messages.some(m => m.role === 'model' && (
      m.text.toLowerCase().includes("summar") || 
      m.text.toLowerCase().includes("research team")
    ));

    if (messages.length > 1 && !isSuccess && !isErratic) {
      const chatHistoryText = messages
        .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
        .join("\n\n");
      
      const finalSummaryText = `CHAT HISTORY:\n${chatHistoryText}\n\nBEHAVIORAL OBSERVATIONS:\n${behaviorNotes}`;
      
      try {
        const brain = new ChatBrain({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });
        const patternSummary = await brain.getBehaviorPatternSummary(currentState.behaviorNotes);

        await sendEmail({
          to: "oriens@aiexecutions.com",
          ...getEmailTemplate(finalSummaryText, false, true, interactionHistory, currentState.userContext, currentState.behaviorNotes, patternSummary)
        });
      } catch (error) {
        console.error("Failed to send abandonment report:", error);
      }
    }
    
    closeChatbot();
  };

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
          onClick={handleClose}
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
              {(userContext?.email || useChatbotStore.getState().userEmail) && (
                <div className={styles.emailBadge} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginTop: '8px',
                  letterSpacing: '0.02em',
                  backdropFilter: 'blur(4px)'
                }}>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#10b981',
                    marginRight: '6px',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
                  }} />
                  {userContext?.email || useChatbotStore.getState().userEmail}
                </div>
              )}
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

            <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
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
