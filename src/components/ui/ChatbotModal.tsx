"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, ArrowRight, Edit2 } from "lucide-react";
import { useChatbotStore } from "@/store/useChatbotStore";
import { Chatbot } from "./Chatbot";
import { ChatBrain } from "@/lib/ChatBrain";
import { IntelligenceUnit } from "@/lib/IntelligenceUnit";
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
    isErratic,
    isSuccess,
    openNewsletter,
    resetChat,
    userEmail,
    setUserEmail
  } = useChatbotStore();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail || "");
  const [emailError, setEmailError] = useState("");

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
        
        const totals = {
          totalInputTokens: currentState.totalTokensIn,
          totalOutputTokens: currentState.totalTokensOut,
          totalCost: currentState.totalCost,
          modelsUsed: new Set(currentState.modelsUsed)
        };

        const resourceDossier = IntelligenceUnit.generateResourceDossierHTML(totals);
        IntelligenceUnit.logSessionSummary(totals);

        await sendEmail({
          to: "oriens@aiexecutions.com",
          ...getEmailTemplate(finalSummaryText, false, true, interactionHistory, currentState.userContext, currentState.behaviorNotes, patternSummary, resourceDossier)
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
              {(userEmail || isEditingEmail) && (
                <div className={styles.emailContainer}>
                  {isEditingEmail ? (
                    <div className={styles.emailInputWrapper}>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setEmailError("");
                        }}
                        onBlur={() => {
                          if (!emailInput) setIsEditingEmail(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(emailInput)) {
                              setEmailError("Invalid email format");
                            } else {
                              setUserEmail(emailInput);
                              setIsEditingEmail(false);
                              setEmailError("");
                            }
                          } else if (e.key === "Escape") {
                            setIsEditingEmail(false);
                            setEmailInput(userEmail || "");
                            setEmailError("");
                          }
                        }}
                        placeholder="your@email.com"
                        autoFocus
                        className={clsx(styles.minimalEmailInput, emailError && styles.error)}
                      />
                      <AnimatePresence>
                        {emailError && (
                          <motion.span
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={styles.errorText}
                          >
                            {emailError}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div 
                      className={styles.emailBadge}
                      onClick={() => setIsEditingEmail(true)}
                    >
                      <div className={styles.activeDot} />
                      <span>{userEmail}</span>
                      <Edit2 size={10} className={styles.editIcon} />
                    </div>
                  )}
                </div>
              )}
              <div className={styles.titleWrapper}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2>Consultation</h2>
                  <div className={styles.statusDot} />
                </div>
                
                <AnimatePresence>
                  {isSuccess && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={styles.proceedButton}
                      onClick={() => {
                        closeChatbot();
                        openNewsletter();
                      }}
                    >
                      <span>Proceed</span>
                      <ArrowRight size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
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

            <div className={styles.topRightActions}>
              <button 
                className={styles.resetLink} 
                onClick={(e) => {
                  e.stopPropagation();
                  resetChat();
                }}
              >
                Reset Conversation
              </button>
              <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            
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
