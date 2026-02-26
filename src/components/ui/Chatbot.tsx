"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBrain } from "@/lib/ChatBrain";
import { marked } from "marked";
import gsap from "gsap";
import { clsx } from "clsx";
import { sendEmail } from "@/app/actions";
import { Loader2, Check, AlertCircle } from "lucide-react";
import styles from "./Chatbot.module.scss";

interface Message {
  role: "model" | "user";
  text: string;
  timestamp: string;
}

interface ChatbotProps {
  apiKey: string;
  modelId?: string;
  userContext?: any;
}

export const Chatbot = ({
  apiKey,
  modelId = "gemini-flash-latest",
  userContext = {},
}: ChatbotProps) => {
  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I'm here to help you explore how automation can transform your business. To get started, could you tell me your company name and what industry you're in?",
      timestamp: formatTimestamp(),
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");
  const [showEmailBtn, setShowEmailBtn] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [isErratic, setIsErratic] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Deep male British voice configuration
      utterance.rate = 0.9; // Slightly slower for a more serious/deep tone
      utterance.pitch = 0.8; // Lower pitch for deepness
      
      const voices = window.speechSynthesis.getVoices();
      
      // Search for British voices, preferably male
      const preferredVoice = voices.find(v => 
        (v.lang.includes("en-GB") && (v.name.includes("Male") || v.name.includes("Daniel") || v.name.includes("Oliver"))) ||
        (v.lang.includes("en-GB") && v.name.includes("Google"))
      ) || voices.find(v => v.lang.includes("en-GB"));
      
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const brain = useMemo(() => {
    if (!apiKey) return null;
    return new ChatBrain({
      apiKey,
      modelId,
      systemInstruction: `Act as a concise automation consultant. 
        CONSULTATION FLOW:
        1. GATHER initial info: Company, Industry, Email.
        2. DEFINE OBJECTIVE: Ask what the primary business goal is.
        3. IDENTIFY PROBLEM: Once the objective is set, ask for the main roadblock/problem.
        4. ROOT CAUSE ANALYSIS: Use the "5 Whys" technique to drill down into the stated problem to find its source.
        5. RECOMMENDATION: Briefly state how automation addresses the root cause.
        
        RULES:
        - BE EXTREMELY CONCISE. One sentence max per response.
        - Ask ONLY 1 question at a time.
        - Professional tone.
        - Keep track of the "5 Whys" chain internally.
        - When complete, provide a 3-bullet point summary and tell them to use the Submit Request button.
        
        USER CONTEXT: ${JSON.stringify(userContext)}`
    });
  }, [apiKey, modelId, userContext]);

  // Button refs for GSAP
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const sendGlowRef = useRef<HTMLSpanElement>(null);
  const emailBtnRef = useRef<HTMLButtonElement>(null);
  const emailGlowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const handleButtonMouseMove = (
    e: React.MouseEvent, 
    btnRef: React.RefObject<HTMLButtonElement | null>, 
    glowRef: React.RefObject<HTMLSpanElement | null>
  ) => {
    const btn = btnRef.current;
    const glow = glowRef.current;
    if (!btn || !glow) return;

    const { left, top, width, height } = btn.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const centerX = width / 2;
    const centerY = height / 2;
    const deltaX = (x - centerX) / 8;
    const deltaY = (y - centerY) / 8;

    gsap.to(btn, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(glow, {
      left: x,
      top: y,
      duration: 0.1,
      opacity: 1,
    });
  };

  const handleButtonMouseLeave = (
    btnRef: React.RefObject<HTMLButtonElement | null>, 
    glowRef: React.RefObject<HTMLSpanElement | null>
  ) => {
    const btn = btnRef.current;
    const glow = glowRef.current;
    if (!btn || !glow) return;

    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
    gsap.to(glow, {
      opacity: 0,
      duration: 0.3,
    });
  };

  const handleSendEmail = async () => {
    if (isSendingEmail || emailStatus === "success") return;
    setIsSendingEmail(true);
    try {
      await sendEmail({
        to: "oriens@aiexecutions.com",
        subject: `Chatbot Consultation Summary`,
        text: summaryText,
        html: `
          <h3>Chatbot Consultation Summary</h3>
          <pre style="white-space: pre-wrap; font-family: sans-serif;">${summaryText}</pre>
          <hr />
          <p>This summary was generated by the AI Chatbot and submitted by the user.</p>
        `,
      });
      setEmailStatus("success");
    } catch (error) {
      console.error("Failed to send chatbot summary email:", error);
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 3000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || loading || isErratic) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const userText = userInput;
    setUserInput("");

    const userMsg: Message = {
      role: "user",
      text: userText,
      timestamp: formatTimestamp(),
    };
    
    const updatedMessages: Message[] = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      if (!brain) {
        throw new Error("AI not initialized");
      }

      const [erraticDetected, text] = await Promise.all([
        brain.checkErraticBehavior(userText, messages),
        brain.sendMessage(userText, messages)
      ]);

      if (erraticDetected) {
        setIsErratic(true);
        const erraticText = "This chat has been closed due to user erratic behavior. We only provide consultations to serious inquiries. If you believe this is a mistake, please contact us via email.";
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: erraticText,
            timestamp: formatTimestamp(),
          },
        ]);
        speak(erraticText);
        setLoading(false);
        return;
      }

      if (text) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text,
            timestamp: formatTimestamp(),
          },
        ]);
        speak(text);

        if (text.toLowerCase().includes("summar") || text.toLowerCase().includes("whatsapp") || text.toLowerCase().includes("button below") || text.toLowerCase().includes("request button")) {
          const finalSummary = [...updatedMessages, { role: "model", text, timestamp: formatTimestamp() }]
            .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
            .join("\n\n");
          setSummaryText(finalSummary);
          setShowEmailBtn(true);
        }
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `I'm sorry, I encountered an error: ${error.message || "Unknown error"}`,
          timestamp: formatTimestamp(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles["glass-card"]}>
      <div className={styles["chat-container"]} ref={chatContainerRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(styles.message, styles[msg.role])}
            >
              <div className={styles["message-bubble"]}>
                <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }} />
                {msg.timestamp && <span className={styles.timestamp}>{msg.timestamp}</span>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={clsx(styles.message, styles.model, styles["bot-loading"])}
          >
            <div className={styles["message-bubble"]}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
          </motion.div>
        )}
      </div>

      <div className={styles["input-area"]}>
        {isErratic ? (
          <div className={styles["erratic-notice"]} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem', color: '#dc2626' }}>
            <AlertCircle size={20} />
            <span>Chat Closed</span>
          </div>
        ) : showEmailBtn ? (
          <button
            ref={emailBtnRef}
            className={clsx(
              styles["whatsapp-send-btn"], 
              styles["modern-btn"],
              emailStatus === "success" && styles.success
            )}
            onClick={handleSendEmail}
            onMouseMove={(e) => handleButtonMouseMove(e, emailBtnRef, emailGlowRef)}
            onMouseLeave={() => handleButtonMouseLeave(emailBtnRef, emailGlowRef)}
            disabled={isSendingEmail || emailStatus === "success"}
          >
            <span className={styles.shimmer}></span>
            <span className={styles.content}>
              {isSendingEmail ? (
                <Loader2 className={styles.spinner} size={18} />
              ) : emailStatus === "success" ? (
                <>
                  <Check size={18} style={{ marginRight: "8px" }} />
                  Request Sent
                </>
              ) : (
                "Submit Request to oriens@aiexecutions.com"
              )}
            </span>
            <span ref={emailGlowRef} className={styles.glow}></span>
          </button>
        ) : (
          <>
            <textarea
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeydown}
              disabled={loading}
            ></textarea>
            <button
              ref={sendBtnRef}
              className={clsx(styles["send-btn"], styles["modern-btn"])}
              onClick={() => handleSubmit()}
              onMouseMove={(e) => handleButtonMouseMove(e, sendBtnRef, sendGlowRef)}
              onMouseLeave={() => handleButtonMouseLeave(sendBtnRef, sendGlowRef)}
              disabled={loading || !userInput.trim()}
            >
              <span className={styles.shimmer}></span>
              <span className={styles.content}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                </svg>
              </span>
              <span ref={sendGlowRef} className={styles.glow}></span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
