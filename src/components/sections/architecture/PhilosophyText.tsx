"use client";

import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import styles from "../Architecture.module.scss";

interface PhilosophyTextProps {
  scrollYProgress: MotionValue<number>;
  text: string;
}

export function PhilosophyText({ scrollYProgress, text }: PhilosophyTextProps) {
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const philosophyY = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [50, 0]),
    springConfig
  );
  
  const philosophyOpacity = useSpring(
    useTransform(scrollYProgress, [0.1, 0.4], [0, 1]),
    springConfig
  );

  return (
    <motion.p 
      className={styles.philosophy}
      style={{
        y: philosophyY,
        opacity: philosophyOpacity,
        scale: useTransform(scrollYProgress, [0.2, 0.5], [0.95, 1])
      }}
    >
      "{text}"
    </motion.p>
  );
}
