"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { useChatbotStore } from "@/store/useChatbotStore";
import styles from "./EmailActionButton.module.scss";
import { sendEmail } from "@/app/actions";

interface EmailActionButtonProps {
  label: string;
  subject?: string;
  className?: string;
}

export const EmailActionButton = ({
  label,
  subject = "Contact Request",
  className,
}: EmailActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasSent, setHasSent] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { openChatbot } = useChatbotStore();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (status !== "loading") {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [status]);

  const handleSubmitInternal = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");
>>>>>>> SEARCH
      setStatus("success");
      setHasSent(true);
      setTimeout(() => {
        setStatus("idle");
        setIsExpanded(false);
        setEmail("");
        // Open chatbot after success with user context
        openChatbot({ email, ...metadata });
      }, 3000);
"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { useChatbotStore } from "@/store/useChatbotStore";
import styles from "./EmailActionButton.module.scss";
import { sendEmail } from "@/app/actions";

interface EmailActionButtonProps {
  label: string;
  subject?: string;
  className?: string;
}

export const EmailActionButton = ({
  label,
  subject = "Contact Request",
  className,
}: EmailActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasSent, setHasSent] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { openChatbot } = useChatbotStore();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (status !== "loading") {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [status]);

      setStatus("success");
      setHasSent(true);
      setTimeout(() => {
        setStatus("idle");
        setIsExpanded(false);
        setEmail("");
        // Open chatbot after success with user context
        openChatbot({ email, ...metadata });
      }, 3000);
  };

  return (
    <motion.div 
      ref={containerRef}
      layout
      className={clsx(
        styles.demoContainer, 
        isExpanded && styles.expanded,
        status === "success" && styles.success,
        hasSent && styles.hasSent,
        className
      )}
      onClick={() => {
        if (hasSent && !isExpanded) {
          openChatbot();
        } else if (!isExpanded) {
          setIsExpanded(true);
        }
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 1
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {!isExpanded ? (
          <motion.div
            key="label"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={styles.label}
          >
            {hasSent ? "Open Consultation" : label}
          </motion.div>
        ) : (
          <form 
            key="form"
            className={styles.inputWrapper}
            onSubmit={handleSubmitInternal}
          >
            <input
              ref={inputRef}
              type="email"
              placeholder="Enter your email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
          </form>
        )}
      </AnimatePresence>

      <motion.button 
        layout
        className={styles.submitButton}
        onClick={(e) => {
          if (isExpanded) {
            e.stopPropagation();
            handleSubmitInternal();
          } else if (hasSent) {
            e.stopPropagation();
            openChatbot();
          }
        }}
        disabled={status === "loading" || (isExpanded && !email)}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35
        }}
      >
        <AnimatePresence mode="wait">
          {status === "loading" ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Loader2 className={styles.loader} />
            </motion.div>
          ) : status === "success" ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Check size={18} />
            </motion.div>
          ) : hasSent ? (
            <motion.div
              key="chat-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <MessageSquare size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="arrow"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={styles.successOverlay}
          >
            <Check size={18} />
            <span>Request Sent</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
