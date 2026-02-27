import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";
import styles from "./Chatbot.module.scss";

interface Message {
  role: "model" | "user";
  text: string;
  timestamp: string;
}

interface ChatbotMessagesProps {
  messages: Message[];
  loading: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatbotMessages = ({ messages, loading, chatContainerRef }: ChatbotMessagesProps) => {
  return (
    <div className={styles["chat-container"]} ref={chatContainerRef}>
      <AnimatePresence initial={false}>
        {messages.map((msg: Message, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(styles.message, styles[msg.role])}
          >
            <div className={styles["message-bubble"]}>
              {msg.role === "model" && msg.text === "" && loading ? (
                <div className={styles["loading-dots"]}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }} />
              )}
              {msg.timestamp && <span className={styles.timestamp}>{msg.timestamp}</span>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
