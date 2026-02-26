"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBrain } from "@/lib/ChatBrain";
import { marked } from "marked";
import gsap from "gsap";
import { clsx } from "clsx";
import styles from "./Chatbot.module.scss";

interface Message {
  role: "model" | "user";
  text: string;
  timestamp: string;
}

interface ChatbotProps {
  apiKey: string;
  modelId?: string;
  whatsappNumber?: string;
  userContext?: any;
}

export const Chatbot = ({
  apiKey,
  modelId = "gemini-flash-latest",
  whatsappNumber = "50689662552",
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
  const [showWhatsAppBtn, setShowWhatsAppBtn] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const brain = useMemo(() => {
    if (!apiKey) return null;
    return new ChatBrain({
      apiKey,
      modelId,
      systemInstruction: `Act as a concise automation consultant. GATHER: Company, Industry, Email, Team Size, Tech Stack, Pain Points, Desired Automations. 
        RULES:
        - BE EXTREMELY CONCISE. One sentence max per response.
        - Ask ONLY 1 question at a time.
        - Professional tone.
        - When complete, provide a 3-bullet point summary and tell them to use the WhatsApp button.
        
        USER CONTEXT: ${JSON.stringify(userContext)}`
    });
  }, [apiKey, modelId, userContext]);

  // Button refs for GSAP
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const sendGlowRef = useRef<HTMLSpanElement>(null);
  const waBtnRef = useRef<HTMLButtonElement>(null);
  const waGlowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

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

    // Magnetic effect
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

    // Glow effect
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

  const sendToWhatsApp = () => {
    const encodedText = encodeURIComponent("Consult Info from Website:\n\n" + summaryText);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    window.open(url, "_blank");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || loading) return;

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

      const text = await brain.sendMessage(userText, messages);

      if (text) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text,
            timestamp: formatTimestamp(),
          },
        ]);

        if (text.toLowerCase().includes("summar") || text.toLowerCase().includes("whatsapp") || text.toLowerCase().includes("button below")) {
          const finalSummary = [...updatedMessages, { role: "model", text, timestamp: formatTimestamp() }]
            .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
            .join("\n\n");
          setSummaryText(finalSummary);
          setShowWhatsAppBtn(true);
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
        {showWhatsAppBtn ? (
          <button
            ref={waBtnRef}
            className={clsx(styles["whatsapp-send-btn"], styles["modern-btn"])}
            onClick={sendToWhatsApp}
            onMouseMove={(e) => handleButtonMouseMove(e, waBtnRef, waGlowRef)}
            onMouseLeave={() => handleButtonMouseLeave(waBtnRef, waGlowRef)}
          >
            <span className={styles.shimmer}></span>
            <span className={styles.content}>Send to WhatsApp (+{whatsappNumber})</span>
            <span ref={waGlowRef} className={styles.glow}></span>
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
