"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, MessageSquare, AlertCircle, Send, AtSign } from "lucide-react";
import { clsx } from "clsx";
import { useChatbotStore } from "@/store/useChatbotStore";
import styles from "./EmailActionButton.module.scss";
import { sendEmail } from "@/app/actions";
import { getRequestTemplate } from "@/utils/emailTemplates";

interface EmailActionButtonProps {
  label: string;
  id: string;
  subject?: string;
  className?: string;
  onSuccess?: () => void;
}

export const EmailActionButton = ({
  label,
  id = "",
  subject = "Contact Request",
  className,
  onSuccess,
}: EmailActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [hasSent, setHasSent] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { openChatbot, setUserEmail, openNewsletter, interactionHistory } = useChatbotStore();

  const isBlocked = interactionHistory.length >= 3 && 
                    interactionHistory.slice(-3).every(record => record.status === 'erratic');

  const handleOpenInteraction = (context?: any) => {
    if (isBlocked) {
      openNewsletter();
    } else {
      openChatbot(context);
    }
  };

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

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmitInternal = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) {
      setErrorMsg("Email is required");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg("Invalid email format");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // Gather exhaustive browser metadata
    const metadata = {
      path: pathname,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: (navigator as any).platform,
      vendor: navigator.vendor,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints,
 screenResolution: `${window.screen.width}x${window.screen.height}`,
      availableScreenResolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      referrer: document.referrer || "Direct",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt,
        saveData: (navigator as any).connection.saveData
      } : "Unknown",
      timestamp: new Date().toISOString(),
    };

    try {
      await sendEmail({
        to: "oriens@aiexecutions.com",
        ...getRequestTemplate(label, email, metadata)
      });
      setStatus("success");
      setHasSent(true);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        setStatus("idle");
        setIsExpanded(false);
        setUserEmail(email);
        setEmail("");
        if (!onSuccess) {
          handleOpenInteraction({ email, ...metadata });
        }
      }, 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message || "Something went wrong");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const renderButtonContent = () => {
    if (status === "loading") {
      return (
        <motion.div
          key="loader"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <Loader2 className={styles.loader} />
        </motion.div>
      );
    }

    if (status === "success") {
      return (
        <motion.div
          key="check"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <Check size={18} />
        </motion.div>
      );
    }

    if (hasSent) {
      return (
        <motion.div
          key="chat-icon"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <MessageSquare size={18} />
        </motion.div>
      );
    }

    const trimmedEmail = email.trim();
    if (isExpanded && trimmedEmail.length > 0 && !validateEmail(trimmedEmail)) {
      return (
        <motion.div
          key="at-icon"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          style={{ opacity: trimmedEmail.includes("@") ? 0.4 : 1 }}
        >
          <AtSign size={18} />
        </motion.div>
      );
    }

    return (
      <motion.div
        key="send"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        <Send size={18} />
      </motion.div>
    );
  };

  return (
    <div id={id} style={{ display: "inline-block" }}>
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
            handleOpenInteraction();
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
              className={clsx(styles.inputWrapper, status === "success" && styles.fadeOut)}
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
              const trimmedEmail = email.trim();
              if (trimmedEmail && !trimmedEmail.includes("@")) {
                setEmail(prev => prev + "@");
                // Focus and move cursor to end
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                    const length = inputRef.current.value.length;
                    inputRef.current.setSelectionRange(length, length);
                  }
                }, 0);
              } else {
                handleSubmitInternal();
              }
            } else if (hasSent) {
              e.stopPropagation();
              handleOpenInteraction();
            }
          }}
          disabled={status === "loading" || (isExpanded && email.trim().includes("@") && !validateEmail(email.trim()))}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35
          }}
        >
          <AnimatePresence mode="wait">
            {renderButtonContent()}
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
        <AnimatePresence>
          {status === "error" && errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={styles.errorBanner}
            >
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
