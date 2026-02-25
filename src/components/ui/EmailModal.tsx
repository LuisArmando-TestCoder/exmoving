"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import styles from "./EmailModal.module.scss";
import { GlassCard } from "./Common";
import { sendEmail } from "@/app/actions";
import { useDemoModal } from "@/store/useDemoModal";

export const EmailModal = () => {
  const { isOpen, title, subject, closeModal } = useDemoModal();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setStatus("idle");
    
    try {
      await sendEmail({
        to: "info@aiban.news",
        subject: subject,
        text: `${title} request from: ${email}`,
        html: `<p>${title} request from: <strong>${email}</strong></p>`,
      });
      setStatus("success");
      setTimeout(() => {
        closeModal();
        setStatus("idle");
        setEmail("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={styles.modalContent}
          >
            <GlassCard>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={20} />
              </button>

              {status === "success" ? (
                <div className={styles.successMessage}>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 1.5rem" }} />
                  </motion.div>
                  <h3>Request Sent!</h3>
                  <p>We'll be in touch shortly.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>
                      Enter your email below and we'll reach out to coordinate next steps.
                    </p>
                  </div>

                  <div className={styles.inputGroup}>
                    <input
                      type="email"
                      placeholder="operator@company.com"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      autoFocus
                    />
                    {status === "error" && (
                      <p className={styles.error}>Something went wrong. Please try again.</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading || !email}
                  >
                    {loading ? "Sending..." : "GET YOUR FREE DEMO"}
                  </button>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
