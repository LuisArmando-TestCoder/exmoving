"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef, memo } from "react";
import { MessageSquare, AlertTriangle, Zap, Terminal, Search, ShieldAlert, Cpu, Layers } from "lucide-react";
import styles from "./ConversationJourney.module.scss";

interface Message {
  id: string;
  user: string;
  text: string;
  role: "user" | "expert" | "bot";
  icon: any;
  label: string;
}

const MESSAGES: Message[] = [
  {
    id: "1",
    user: "u/CuriousBuilder",
    text: "How much $ are you guys actually burning on LLMs every month? I see a lot of talk about crazy agentic workflows, but I'm curious about the bill at the end of the month.",
    role: "user",
    icon: MessageSquare,
    label: "THE QUESTION"
  },
  {
    id: "2",
    user: "u/Reasonable-Egg6527",
    text: "For us it was less about raw token spend and more about waste. The bill looked scary because agents were retrying, looping, and reprocessing the same context over and over.",
    role: "expert",
    icon: AlertTriangle,
    label: "THE WASTE"
  },
  {
    id: "3",
    user: "u/Reasonable-Egg6527",
    text: "One thing that surprised me is how much execution inefficiency inflates LLM spend. Flaky tools cause retries, which cause more tokens. Stabilizing the infra layer reduced cost without touching the model.",
    role: "expert",
    icon: Zap,
    label: "INFRA IMPACT"
  },
  {
    id: "4",
    user: "u/Used-Knowledge-4421",
    text: "We reproduced a multi-agent loop: two agents ping-ponging requests for 60 rounds, $0.16 in 3.6 minutes, zero useful output. Execution inefficiency is the key insight most people miss.",
    role: "bot",
    icon: Terminal,
    label: "MEASURED LOSS"
  },
  {
    id: "5",
    user: "u/Used-Knowledge-4421",
    text: "The fix: 1. Hash tool name + args to kill ping-pong loops. 2. Per-tool call cap to catch retry storms. 3. Budget cap in dollars, not tokens.",
    role: "bot",
    icon: Search,
    label: "THE PROTOCOL"
  },
  {
    id: "6",
    user: "u/Alpertayfur",
    text: "The pattern I notice: most folks burn cash early experimenting, then narrow down hard once they see what actually delivers value. Scary bills come from leaving things running 'just in case'.",
    role: "expert",
    icon: ShieldAlert,
    label: "THE PATTERN"
  },
  {
    id: "7",
    user: "u/Used-Knowledge-4421",
    text: "A stuck agent loop on Haiku (cheapest) is $0.045/min. Overnight that's $21. Weekend $130. At GPT-4o pricing, multiply by 8x. Catching patterns before they accumulate is vital.",
    role: "bot",
    icon: Cpu,
    label: "BURN RATE"
  },
  {
    id: "8",
    user: "u/Jolly-Gazelle-6060",
    text: "We were burning north of $40k/month. We distilled SLMs and managed to reduce costs by 50-60%. Go small!",
    role: "expert",
    icon: Layers,
    label: "THE SOLUTION"
  }
];

export const ConversationJourney = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className={styles.journeyContainer}>
      <div className={styles.timelineLine}>
        <motion.div 
          className={styles.timelineProgress} 
          style={{ 
            scaleY: springScroll, 
            originY: 0,
            willChange: "transform"
          }}
        />
      </div>

      <div className={styles.stickyHeader}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.journeyTitle}
        >
          The <span className="text-gradient">Cost of Inefficiency.</span>
        </motion.h2>
        <p className={styles.journeySubtitle}>
          Real-world insights on LLM burn rates and the hidden tax of unoptimized workflows.
        </p>
      </div>

      <div className={styles.messagesWrapper}>
        {MESSAGES.map((msg, index) => (
          <MessageCard key={msg.id} msg={msg} index={index} />
        ))}
      </div>
    </div>
  );
};

const MessageCard = memo(({ msg, index }: { msg: Message, index: number }) => {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 !== 0;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const opacityRaw = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const opacity = shouldReduceMotion ? opacityRaw : useSpring(opacityRaw, springConfig);
  
  const scaleRaw = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.7, 0.9], [0.8, 1, 1.05, 1, 0.8]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, springConfig);

  const xOffset = isEven ? 100 : -100;
  const xRaw = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [xOffset, 0, 0, -xOffset]);
  const x = shouldReduceMotion ? xRaw : useSpring(xRaw, springConfig);

  const rotateRaw = useTransform(scrollYProgress, [0.1, 0.9], [isEven ? 5 : -5, isEven ? -5 : 5]);
  const rotate = shouldReduceMotion ? rotateRaw : useSpring(rotateRaw, springConfig);

  const nodeScaleRaw = useTransform(scrollYProgress, [0.2, 0.3], [0, 1.5]);
  const nodeScale = shouldReduceMotion ? nodeScaleRaw : useSpring(nodeScaleRaw, springConfig);

  const isInView = useInView(cardRef, { margin: "-10% 0px -10% 0px" });

  const Icon = msg.icon;

  return (
    <div ref={cardRef} className={styles.journeyStep}>
      <motion.div 
        className={styles.stepNode}
        style={{
          scale: nodeScale,
          backgroundColor: useTransform(
            scrollYProgress,
            [0.2, 0.3],
            ["rgba(255,255,255,0.1)", "var(--color-primary, #0070f3)"]
          ),
          boxShadow: useTransform(
            scrollYProgress,
            [0.2, 0.3],
            ["0 0 0px rgba(0,0,0,0)", "0 0 20px var(--color-primary, #0070f3)"]
          ),
          willChange: "transform, background-color, box-shadow"
        }}
      />

      <motion.div
        style={{ 
          opacity: isInView ? opacity : 0, 
          scale, 
          x,
          rotateZ: rotate,
          willChange: "transform, opacity"
        }}
        className={`${styles.messageCard} ${styles[msg.role]} ${isEven ? styles.even : styles.odd}`}
      >
        <div className={styles.cardHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Icon size={16} />
            </div>
            <div>
              <motion.span 
                className={styles.stepLabel}
                style={{
                  letterSpacing: useTransform(scrollYProgress, [0.2, 0.4], ["0.5em", "0.2em"]),
                  willChange: "letter-spacing"
                }}
              >
                {msg.label}
              </motion.span>
              <div className={styles.username}>{msg.user}</div>
            </div>
          </div>
          <div className={styles.roleBadge}>{msg.role}</div>
        </div>
        <p className={styles.messageText}>{msg.text}</p>
      </motion.div>
    </div>
  );
});
