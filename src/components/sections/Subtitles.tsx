"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./Subtitles.module.scss";

const phrases = [
  "We believe in expansion / enhancement",
  "By supercharging everybody",
  "We just happen to automate it"
];

export default function Subtitles() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springConfig = { stiffness: 50, damping: 20, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  return (
    <section ref={containerRef} className={styles.subtitlesWrapper}>
      <div className={styles.stickyContainer}>
        <div className={styles.content}>
          {phrases.map((phrase, i) => (
            <Line 
              key={i} 
              phrase={phrase} 
              index={i} 
              total={phrases.length}
              progress={shouldReduceMotion ? scrollYProgress : smoothProgress} 
            />
          ))}
        </div>
        
        <div className={styles.progressContainer}>
          <motion.div 
            className={styles.progressBar}
            style={{ scaleY: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
}

function Line({ 
  phrase, 
  index, 
  total, 
  progress 
}: { 
  phrase: string; 
  index: number; 
  total: number;
  progress: any 
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const center = (start + end) / 2;

  // Each line moves through the viewport
  // -100% (below) -> 0% (center) -> 100% (above)
  const y = useTransform(
    progress,
    [start, center, end],
    ["150%", "0%", "-150%"]
  );

  const opacity = useTransform(
    progress,
    [start, center - segment * 0.15, center, center + segment * 0.15, end],
    [0, 0, 1, 0, 0]
  );

  const scale = useTransform(
    progress,
    [start, center, end],
    [0.8, 1.2, 0.8]
  );

  const filter = useTransform(
    progress,
    [start, center, end],
    ["blur(10px) brightness(0.5)", "blur(0px) brightness(1.2)", "blur(10px) brightness(0.5)"]
  );

  const letterSpacing = useTransform(
    progress,
    [start, center, end],
    ["0.5em", "-0.02em", "0.5em"]
  );

  return (
    <motion.div
      className={styles.line}
      style={{
        y,
        opacity,
        scale,
        filter,
        letterSpacing,
      }}
    >
      <span className={styles.lineText}>{phrase}</span>
      <motion.div 
        className={styles.lineGlow}
        style={{
          opacity: useTransform(progress, [center - 0.05, center, center + 0.05], [0, 1, 0])
        }}
      />
    </motion.div>
  );
}
