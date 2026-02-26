"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  modelId = "gemini-1.5-flash",
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
  const aiRef = useRef<GoogleGenerativeAI | null>(null);

  // Button refs for GSAP
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const sendGlowRef = useRef<HTMLSpanElement>(null);
  const waBtnRef = useRef<HTMLButtonElement>(null);
  const waGlowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (apiKey) {
      try {
        aiRef.current = new GoogleGenerativeAI(apiKey);
      } catch (e) {
        console.error("Failed to initialize GoogleGenerativeAI:", e);
      }
    }
  }, [apiKey]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleButtonMouseMove = (e: React.MouseEvent, btnRef: React.RefObject<HTMLButtonElement>, glowRef: React.RefObject<HTMLSpanElement>) => {
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

  const handleButtonMouseLeave = (btnRef: React.RefObject<HTMLButtonElement>, glowRef: React.RefObject<HTMLSpanElement>) => {
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

    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        text: userText,
        timestamp: formatTimestamp(),
      },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      if (!aiRef.current) {
        throw new Error("AI not initialized");
      }

      const model = aiRef.current.getGenerativeModel({ 
        model: modelId,
        systemInstruction: `You are an AI assistant for a business automation consultancy. Your goal is to gather information from the user to provide a consultation. You need to collect: Company Name, Industry, Contact Email, Team Size, Tech Stack, Manual Pain Points, and Desired Automations. Be professional, friendly, and concise. Only ask one or two questions at a time. Once you have all the information, summarize it in a clear format and tell the user that they can now send this information to our team via WhatsApp using the button below.

User Context for this session:
${JSON.stringify(userContext, null, 2)}`
      });

      const chat = model.startChat({
        history: messages.map((m) => ({
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: m.text }],
        })),
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

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
          const finalSummary = [...newMessages, { role: "model", text, timestamp: formatTimestamp() }]
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
