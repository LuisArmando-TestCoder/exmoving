"use client";

import { ShieldAlert, Lock, Eye, AlertCircle } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Risk.module.scss";
import { SectionHeader, GlassCard } from "../ui/Common";

const risks = [
  {
    icon: <ShieldAlert size={32} />,
    title: "Capitalization Failure",
    description: "Solving the three killers: under capitalization, wrong people, and bad markets.",
    color: "#ff4d4d"
  },
  {
    icon: <Lock size={32} />,
    title: "Liquidity Guardrails",
    description: "Tailored costs that scale with your budget, preventing financial race conditions.",
    color: "#10b981"
  },
  {
    icon: <Eye size={32} />,
    title: "Direct ROI Visibility",
    description: "Metric-driven selling points for small businesses that need tools that perform without supervision.",
    color: "#3b82f6"
  },
  {
    icon: <AlertCircle size={32} />,
    title: "Market Erosion",
    description: "Protecting value propositions from buzzword deterioration through ROI-focused scaling.",
    color: "#f59e0b"
  }
];

export default function Risk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const sectionYRaw = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const sectionY = shouldReduceMotion ? sectionYRaw : useSpring(sectionYRaw, { stiffness: 50, damping: 20 });

  return (
    <section id="risk" ref={containerRef} className={`${styles.risk} section`}>
      <motion.div 
        className="container"
        style={{ 
          y: isInView ? sectionY : 0,
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          willChange: "transform, opacity" 
        }}
      >
        <SectionHeader 
          title="Problems to Solve."
          subtitle="Building systems that don't break under pressure."
        />

        <div className={styles.grid}>
          {risks.map((risk, index) => (
            <RiskCard 
              key={index} 
              risk={risk} 
              index={index} 
              scrollYProgress={scrollYProgress}
              shouldReduceMotion={shouldReduceMotion}
              isInView={isInView}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function RiskCard({ risk, index, scrollYProgress, shouldReduceMotion, isInView }: any) {
  const staggerOffset = index * 0.1;
  const yRaw = useTransform(scrollYProgress, [0.1 + staggerOffset, 0.4 + staggerOffset], [100, 0]);
  const y = shouldReduceMotion ? yRaw : useSpring(yRaw, { stiffness: 100, damping: 30 });
  
  const rotateXRaw = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const rotateX = shouldReduceMotion ? 0 : useSpring(rotateXRaw, { stiffness: 60, damping: 20 });
  
  const opacity = useTransform(scrollYProgress, [0.1 + staggerOffset, 0.3 + staggerOffset], [0, 1]);
  const scaleRaw = useTransform(scrollYProgress, [0.1 + staggerOffset, 0.3 + staggerOffset], [0.8, 1]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, { stiffness: 100, damping: 25 });

  const iconScaleRaw = useTransform(scrollYProgress, [0.2 + staggerOffset, 0.4 + staggerOffset], [0.5, 1]);
  const iconScale = useSpring(iconScaleRaw, { stiffness: 200, damping: 10 });

  return (
    <motion.div
      style={{
        y: isInView ? y : 100,
        opacity: isInView ? opacity : 0,
        scale: isInView ? scale : 0.8,
        rotateX: isInView ? rotateX : 0,
        perspective: 1000,
        willChange: "transform, opacity"
      }}
    >
      <GlassCard className={styles.card}>
        <motion.div 
          className={styles.icon}
          style={{ 
            color: risk.color,
            scale: iconScale
          }}
        >
          {risk.icon}
        </motion.div>
        <h3 className={styles.cardTitle}>{risk.title}</h3>
        <p className={styles.cardDescription}>{risk.description}</p>
        
        {/* Modern Accent Glow */}
        <div 
          className={styles.cardGlow} 
          style={{ 
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            background: `radial-gradient(circle at center, ${risk.color}15 0%, transparent 70%)`,
            pointerEvents: 'none'
          }} 
        />
      </GlassCard>
    </motion.div>
  );
}
