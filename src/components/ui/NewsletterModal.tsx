import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbotStore } from "@/store/useChatbotStore";
import { X, Send, CheckCircle2 } from "lucide-react";
import styles from "./NewsletterModal.module.scss";

export const NewsletterModal = () => {
  const { isNewsletterOpen, closeNewsletter } = useChatbotStore();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        closeNewsletter();
        setStatus("idle");
        setEmail("");
      }, 3000);
    }, 1500);
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={styles.modal}
          >
            <button className={styles.closeButton} onClick={closeNewsletter}>
              <X size={20} />
            </button>

            <div className={styles.content}>
              <div className={styles.header}>
                <h2 className={styles.title}>Consultation Complete</h2>
                <p className={styles.subtitle}>
                  Thank you for your time. Your details have been securely transmitted to our AI specialists.
                </p>
              </div>

              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.successState}
                >
                  <CheckCircle2 size={48} className={styles.successIcon} />
                  <h3>You're on the list!</h3>
                  <p>Welcome to the future of execution.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="newsletter-email">
                      Join our newsletter for weekly AI implementation strategies.
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        disabled={status === "loading"}
                      />
                      <button 
                        type="submit" 
                        disabled={status === "loading" || !email}
                        className={styles.submitBtn}
                      >
                        {status === "loading" ? (
                          <span className={styles.loader} />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            <div className={styles.decorativeGlow} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
