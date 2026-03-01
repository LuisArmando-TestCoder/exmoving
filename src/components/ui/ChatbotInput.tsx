import React, { useRef } from "react";
import { clsx } from "clsx";
import { AlertCircle, CheckCircle2, Mic, MicOff, MailWarning } from "lucide-react";
import gsap from "gsap";
import styles from "./Chatbot.module.scss";

interface ChatbotInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  loading: boolean;
  isErratic: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  isEmailInvalid?: boolean;
  showEmailBtn: boolean;
  isListening: boolean;
  toggleListening: () => void;
  handleSubmit: () => void;
  handleKeydown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const ChatbotInput = ({
  userInput,
  setUserInput,
  loading,
  isErratic,
  isSuccess,
  isError,
  isEmailInvalid,
  showEmailBtn,
  isListening,
  toggleListening,
  handleSubmit,
  handleKeydown,
  textareaRef,
}: ChatbotInputProps) => {
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const sendGlowRef = useRef<HTMLSpanElement>(null);

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

  return (
    <div className={styles["input-area"]}>
      {isEmailInvalid ? (
        <div
          className={styles["email-invalid-notice"]}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "8px",
            padding: "1rem",
            color: "#ef4444",
            fontWeight: 600,
          }}
        >
          <MailWarning size={20} />
          <span>Please fix your email address to continue</span>
        </div>
      ) : isSuccess || isError ? (
        <div
          className={clsx(styles["success-notice"], isError && styles["error-fallback"])}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "8px",
            padding: "1rem",
            color: isError ? "#facc15" : "#10b981",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={20} />
          <span>{isError ? "Details sent to team" : "Consultation Complete"}</span>
        </div>
      ) : isErratic ? (
        <div
          className={styles["erratic-notice"]}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "8px",
            padding: "1rem",
            color: "#dc2626",
            fontWeight: 600,
          }}
        >
          <AlertCircle size={20} />
          <span>Chat Closed</span>
        </div>
      ) : (
        <div
          className={styles["controls-wrapper"]}
          style={{
            display: "flex",
            width: "100%",
            gap: "0.75rem",
            alignItems: "flex-end",
          }}
        >
          {!showEmailBtn && (
            <button
              className={clsx(styles["mic-btn"], isListening && styles.listening)}
              onClick={toggleListening}
              disabled={loading}
              title="Speak directly"
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}

          {!showEmailBtn && (
            <>
              <textarea
                ref={textareaRef}
                placeholder="Type or speak your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeydown}
                disabled={loading}
              ></textarea>

              <button
                ref={sendBtnRef}
                className={clsx(styles["send-btn"], styles["modern-btn"])}
                onClick={handleSubmit}
                onMouseMove={(e) => handleButtonMouseMove(e, sendBtnRef, sendGlowRef)}
                onMouseLeave={() => handleButtonMouseLeave(sendBtnRef, sendGlowRef)}
                disabled={loading || !userInput.trim()}
              >
                <span className={styles.shimmer}></span>
                <span className={styles.content}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span ref={sendGlowRef} className={styles.glow}></span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
