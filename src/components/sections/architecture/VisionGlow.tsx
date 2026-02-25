"use client";

import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import styles from "../Architecture.module.scss";

interface VisionGlowProps {
  scrollYProgress: MotionValue<number>;
}

export function VisionGlow({ scrollYProgress }: VisionGlowProps) {
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const glowScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]),
    springConfig
  );
  
  const glowOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.6, 0.2]),
    springConfig
  );

  return (
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
  );
}
