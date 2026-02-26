"use client";

import { ShieldAlert, Lock, Eye, AlertCircle } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import styles from "./Risk.module.scss";
import { SectionHeader } from "../ui/Common";

const risks = [
  {
    icon: <ShieldAlert size={40} />,
    title: "Capitalization Failure",
    description: "Solving the three killers: under capitalization, wrong people, and bad markets.",
    color: "#ff4d4d"
  },
  {
    icon: <Lock size={40} />,
    title: "Liquidity Guardrails",
    description: "Tailored costs that scale with your budget, preventing financial race conditions.",
    color: "#10b981"
  },
  {
    icon: <Eye size={40} />,
    title: "Direct ROI Visibility",
    description: "Metric-driven selling points for businesses that need tools that perform without supervision.",
    color: "#3b82f6"
  },
  {
    icon: <AlertCircle size={40} />,
    title: "Market Erosion",
    description: "Protecting value propositions from buzzword deterioration through ROI-focused scaling.",
    color: "#f59e0b"
  }
];

export default function Risk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section id="risk" ref={containerRef} className={styles.risk}>
      {/* Scroll Progress Indicator for Desktop */}
      <div className={styles.progressTrack}>
        <motion.div 
          className={styles.progressBar} 
          style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      <div className="container">
        <div className={styles.stickyHeader}>
          <SectionHeader 
            title="Strategic Resilience."
            subtitle="Systems engineered to survive and thrive in volatile markets."
          />
        </div>

        <div className={styles.cardsContainer}>
          {risks.map((risk, index) => (
            <RiskCard 
              key={index} 
              risk={risk} 
              index={index} 
              totalRisks={risks.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RiskCard({ risk, index, totalRisks }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: "-10% 0px -10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center", "end start"]
  });

  // Entrance and Exit animations based on card scroll progress
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);
  
  const springY = useSpring(y, { stiffness: 50, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 50, damping: 20 });
  const springRotateX = useSpring(rotateX, { stiffness: 50, damping: 20 });

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className={styles.cardWrapper} ref={cardRef}>
      <motion.div
        className={styles.card}
        onMouseMove={handleMouseMove}
        animate={{
          filter: isInView ? "blur(0px)" : "blur(10px)",
          transition: { duration: 0.5 }
        }}
        style={{
          y: isInView ? (shouldReduceMotion ? 0 : springY) : 50,
          opacity: isInView ? opacity : 0,
          scale: isInView ? (shouldReduceMotion ? 1 : springScale) : 0.95,
          rotateX: isInView ? (shouldReduceMotion ? 0 : springRotateX) : 0,
          "--mouse-x": `${mousePos.x}%`,
          "--mouse-y": `${mousePos.y}%`,
          "--accent-color": risk.color,
        } as any}
      >
        <div className={styles.iconContainer} style={{ color: risk.color }}>
          {risk.icon}
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.cardTitle}>{risk.title}</h3>
          <p className={styles.cardDescription}>{risk.description}</p>
        </div>

        <div className={styles.backgroundGlow} />
      </motion.div>
    </div>
  );
}
