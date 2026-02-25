"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
import styles from "../Architecture.module.scss";

interface CircuitEquationProps {
  scrollYProgress: MotionValue<number>;
}

export function CircuitEquation({ scrollYProgress }: CircuitEquationProps) {
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

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
      className={styles.equation}
      style={{
        scale: equationScale,
        rotateX: equationRotate,
        filter: equationBlur,
        opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
      }}
    >
      <div className={styles.sumBlock}>
        <span className={styles.symbol}>Σx</span>
      </div>
      <span className={styles.operator}>where</span>
      <div className={styles.funcBlock}>
        <span className={styles.funcText}>f(y)</span>
      </div>
      <span className={styles.operator}>=</span>
      <div className={styles.resultBlock}>
        <span className={styles.resultText}>x</span>
      </div>
    </motion.div>
  );
}
