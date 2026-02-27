import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbotStore } from "@/store/useChatbotStore";
import { X, Send, CheckCircle2, Sparkles, Zap, ShieldCheck, Send as SendIcon } from "lucide-react";
import styles from "./NewsletterModal.module.scss";
import { SliderButton } from "./SliderButton";

export const NewsletterModal = () => {
  const { isNewsletterOpen, closeNewsletter, userContext, messages } = useChatbotStore();
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    setStatus("success");
    
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, messages, userContext }),
      });
      if (!res.ok) console.error("Failed to subscribe");
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      closeNewsletter();
      setTimeout(() => setStatus("idle"), 500);
      setEmail("");
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isNewsletterOpen && (
        <div className={styles.overlay}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
            onClick={closeNewsletter}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20, rotateX: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={styles.modal}
          >
            <div className={styles.glowOrb} />
            <div className={styles.glowOrbSecondary} />
            
            <button className={styles.closeButton} onClick={closeNewsletter} aria-label="Close">
              <X size={18} />
            </button>

            <div className={styles.content}>
              <div className={styles.header}>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className={styles.iconWrapper}
                >
                  <Sparkles size={24} className={styles.headerIcon} />
                </motion.div>
                <h2 className={styles.title}>Join the Vanguard</h2>
                <p className={styles.subtitle}>
                  Get exclusive insights, AI implementation strategies, and execution playbooks delivered straight to your inbox.
                </p>
              </div>

              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={styles.successState}
                >
                  <div className={styles.successIconWrapper}>
                    <CheckCircle2 size={48} className={styles.successIcon} />
                  </div>
                  <h3>Access Granted</h3>
                  <p>Welcome to the future of execution. Watch your inbox.</p>
                </motion.div>
              ) : (
                <div className={styles.form}>
                  <input
                    type="email"
                    placeholder="Enter your email (optional if provided in chat)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                  <div style={{ marginTop: '1rem' }}>
                    <SliderButton 
                      icon={SendIcon} 
                      onResolve={handleSubscribe} 
                      text="Slide to subscribe" 
                      successText="Subscribed!" 
                    />
                  </div>
                  <div className={styles.benefits}>
                    <div className={styles.benefitItem}>
                      <Zap size={14} className={styles.benefitIcon} />
                      <span>Weekly Alpha</span>
                    </div>
                    <div className={styles.benefitItem}>
                      <ShieldCheck size={14} className={styles.benefitIcon} />
                      <span>Zero Spam</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.borderHighlight} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
