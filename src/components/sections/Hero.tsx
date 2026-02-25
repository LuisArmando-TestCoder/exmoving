"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Zap } from "lucide-react";
import styles from "./Hero.module.scss";
import { Reveal, StaggerContainer } from "../ui/Common";
import { EmailActionButton } from "../ui/EmailActionButton";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y = shouldReduceMotion ? yRaw : useSpring(yRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const opacityRaw = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const opacity = shouldReduceMotion ? opacityRaw : useSpring(opacityRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section ref={containerRef} className={styles.hero}>
      <motion.div 
        className="container"
        style={{ y, opacity, willChange: "transform, opacity" }}
      >
        <StaggerContainer className={styles.content} delayChildren={0.2}>
          <Reveal className={styles.badge}>
            <Zap size={14} />
            <span>Roadmap To Exit</span>
          </Reveal>
          
          <Reveal>
            <h1 className={styles.title}>
              ROI Driven <br />
              <span className="text-gradient">Scaling.</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.1}>
            <p className={styles.subtitle}>
              We automate to industries that were left behind. We turn status quo upside down, expanding and enhancing people by supercharging them with self-supervising systems that convert operational friction into measurable returns.
            </p>
          </Reveal>
          
          <Reveal delay={0.2} className={styles.actions}>
            <div className={styles.demoGroup}>
              <EmailActionButton 
                label="REQUEST FREE DEMO" 
                subject="Hero Demo Request"
              />
              <p className={styles.demoHint}>Takes less than 30 seconds</p>
            </div>
          </Reveal>
        </StaggerContainer>
      </motion.div>
      
      {/* Decorative Elements */}
      <div className="bg-glow" />
    </section>
  );
}
