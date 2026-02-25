"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import styles from "../Architecture.module.scss";

export function Vision() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Vision Section Background Glow
  const glowScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]),
    springConfig
  );
  
  const glowOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.6, 0.2]),
    springConfig
  );

  // Philosophy Text
  const philosophyY = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [50, 0]),
    springConfig
  );
  
  const philosophyOpacity = useSpring(
    useTransform(scrollYProgress, [0.1, 0.4], [0, 1]),
    springConfig
  );

  // Equation
  const equationScale = useSpring(
    useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1.1]),
    springConfig
  );
  
  const equationRotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [-10, 10]),
    springConfig
  );

  const equationBlur = useTransform(
    scrollYProgress,
    [0.3, 0.5],
    ["blur(10px)", "blur(0px)"]
  );

  return (
    <motion.div 
      ref={containerRef} 
      className={styles.visionSection}
      style={{
        perspective: 1000
      }}
    >
      <motion.div
        className={styles.glowEffect}
        style={{
          scale: glowScale,
          opacity: glowOpacity,
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, var(--color-primary), transparent 70%)",
          filter: "blur(60px)",
          zIndex: -1,
          pointerEvents: "none"
        }}
      />

      <motion.p 
        className={styles.philosophy}
        style={{
          y: philosophyY,
          opacity: philosophyOpacity,
          scale: useTransform(scrollYProgress, [0.2, 0.5], [0.95, 1])
        }}
      >
        "To lead is to make happen, to lead greatly, is about how it happens, but the best leaders are all about why it's happening."
      </motion.p>
      
      <motion.div 
        className={styles.equation}
        style={{
          scale: equationScale,
          rotateX: equationRotate,
          filter: equationBlur,
          opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 1]),
          letterSpacing: useTransform(scrollYProgress, [0.4, 0.7], ["0.5em", "0.1em"])
        }}
      >
        Σx where f(y) = x
      </motion.div>
    </motion.div>
  );
}
