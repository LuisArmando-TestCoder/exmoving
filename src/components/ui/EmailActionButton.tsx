"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { useChatbotStore } from "@/store/useChatbotStore";
import styles from "./EmailActionButton.module.scss";
import { sendEmail } from "@/app/actions";

interface EmailActionButtonProps {
  label: string;
  subject?: string;
  className?: string;
  onSuccess?: () => void;
}

export const EmailActionButton = ({
  label,
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
  const { openChatbot, setUserEmail } = useChatbotStore();

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
        subject: `${subject} - ${email}`,
        text: `${label} request from: ${email}\n\nMetadata:\n${JSON.stringify(metadata, null, 2)}`,
        html: `
          <h3>${label} request</h3>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <h4>Metadata</h4>
          <ul>
            <li><strong>Path:</strong> ${metadata.path}</li>
            <li><strong>User Agent:</strong> ${metadata.userAgent}</li>
            <li><strong>Language:</strong> ${metadata.language}</li>
            <li><strong>Platform:</strong> ${metadata.platform}</li>
            <li><strong>Hardware Concurrency:</strong> ${metadata.hardwareConcurrency} cores</li>
            <li><strong>Device Memory:</strong> ~${metadata.deviceMemory} GB</li>
            <li><strong>Screen Resolution:</strong> ${metadata.screenResolution}</li>
            <li><strong>Window Size:</strong> ${metadata.windowSize}</li>
            <li><strong>Referrer:</strong> ${metadata.referrer}</li>
            <li><strong>Timezone:</strong> ${metadata.timezone}</li>
            <li><strong>Connection:</strong> ${typeof metadata.connection === 'object' ? metadata.connection.effectiveType : metadata.connection}</li>
            <li><strong>Timestamp:</strong> ${metadata.timestamp}</li>
          </ul>
        `,
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
          openChatbot({ email, ...metadata });
        }
      }, 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message || "Something went wrong");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
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
  );
};
