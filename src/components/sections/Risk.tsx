"use client";

import { ShieldAlert, Lock, Eye, AlertCircle } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Risk.module.scss";
import { SectionHeader, StaggerContainer, Reveal, GlassCard } from "../ui/Common";

const risks = [
  {
    icon: <ShieldAlert size={32} />,
    title: "Capitalization Failure",
    description: "Solving the three killers: under capitalization, wrong people, and bad markets."
  },
  {
    icon: <Lock size={32} />,
    title: "Liquidity Guardrails",
    description: "Tailored costs that scale with your budget, preventing financial race conditions."
  },
  {
    icon: <Eye size={32} />,
    title: "Direct ROI Visibility",
    description: "Metric-driven selling points for small businesses that need tools that perform without supervision."
  },
  {
    icon: <AlertCircle size={32} />,
    title: "Market Erosion",
    description: "Protecting value propositions from buzzword deterioration through ROI-focused scaling."
  }
];

export default function Risk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "200px" });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y = shouldReduceMotion ? yRaw : useSpring(yRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section id="risk" ref={containerRef} className={`${styles.risk} section`}>
      <motion.div 
        className="container"
        style={{ y: isInView ? y : 0, scale: isInView ? scale : 1, willChange: "transform" }}
      >
        <SectionHeader 
          title="Problems to Solve."
          subtitle="Building systems that don't break under pressure."
        />

        <StaggerContainer className={styles.grid}>
          {risks.map((risk, index) => (
            <Reveal key={index} direction="up" distance={20}>
              <GlassCard className={styles.card}>
                <div className={styles.icon}>{risk.icon}</div>
                <h3 className={styles.cardTitle}>{risk.title}</h3>
                <p className={styles.cardDescription}>{risk.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </StaggerContainer>
      </motion.div>
    </section>
  );
}
