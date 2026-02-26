"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./CopySection.module.scss";
import { Reveal, GlassCard } from "../ui/Common";
import { EmailActionButton } from "../ui/EmailActionButton";

export default function CopySection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "200px" });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  // Effect logic: "Enlightened floor" that reacts as CopySection enters view
  // This simulates the ball's dawn light hitting the "top" of the next section
  const dawnOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const dawnGlow = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["rgba(var(--primary-rgb),0)", "rgba(245,158,11,0.5)"]
  );

  const yRaw = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y = shouldReduceMotion ? yRaw : useSpring(yRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section 
      id="contact" 
      ref={containerRef} 
      className={styles.copySection}
    >
      <motion.div 
        className={styles.dawnFloorGlow} 
        style={{
          "--dawn-opacity": dawnOpacity,
          "--dawn-glow": dawnGlow
        } as any}
      />
      
      <motion.div 
        className="container"
        style={{ 
          y: isInView ? y : 0, 
          scale: isInView ? scale : 1, 
          willChange: "transform",
          position: 'relative',
          zIndex: 1
        }}
      >
        <Reveal direction="up" distance={40}>
          <GlassCard className={styles.card}>
            <h2 className={styles.title}>
              Deploy <span className="text-gradient">Automation.</span>
            </h2>
            <p className={styles.description}>
              No quotes. Just results. After a consultation, we build your custom demo at no cost. Convert transcripts into self-supervising tools.
            </p>
            
            <div className={styles.inputGroup}>
              <EmailActionButton 
                label="REQUEST FREE DEMO" 
                subject="Contact Section Demo Request"
                className={styles.submitButton}
              />
            </div>
          </GlassCard>
        </Reveal>
      </motion.div>
    </section>
  );
}
