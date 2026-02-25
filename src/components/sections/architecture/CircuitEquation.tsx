"use client";

import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import styles from "../Architecture.module.scss";

interface CircuitEquationProps {
  scrollYProgress: MotionValue<number>;
}

const CircuitPath = ({ progress, delay = 0, reverse = false }: { progress: MotionValue<number>, delay?: number, reverse?: boolean }) => {
  const pathLength = useSpring(
    useTransform(progress, [0.3 + delay, 0.6 + delay], [0, 1]),
    { stiffness: 50, damping: 20 }
  );
  
  const opacity = useTransform(progress, [0.3 + delay, 0.4 + delay], [0, 1]);

  return (
    <motion.svg 
      className={styles.circuitPath} 
      width="40" 
      height="20" 
      viewBox="0 0 40 20"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      
      {/* Background track */}
      <path 
        d={reverse ? "M 40 10 L 0 10" : "M 0 10 L 40 10"} 
        stroke="rgba(var(--color-primary-rgb), 0.1)" 
        strokeWidth="1" 
        fill="none" 
      />
      
      {/* Animated signal */}
      <motion.path 
        d={reverse ? "M 40 10 L 0 10" : "M 0 10 L 40 10"}
        stroke="url(#glowGradient)" 
        strokeWidth="2" 
        fill="none"
        style={{ pathLength }}
      />
      
      {/* Animated nodes */}
      <motion.circle 
        cx={reverse ? "40" : "0"} 
        cy="10" 
        r="2" 
        fill="var(--color-primary)"
        style={{ scale: useTransform(pathLength, [0, 0.1], [0, 1]) }}
      />
      <motion.circle 
        cx={reverse ? "0" : "40"} 
        cy="10" 
        r="3" 
        fill="var(--color-bg)"
        stroke="var(--color-primary)"
        strokeWidth="1"
        style={{ scale: useTransform(pathLength, [0.9, 1], [0, 1]) }}
      />
    </motion.svg>
  );
};

export function CircuitEquation({ scrollYProgress }: CircuitEquationProps) {
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const equationScale = useSpring(
    useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1.1]),
    springConfig
  );
  
  const equationRotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [-5, 5]),
    springConfig
  );

  const equationBlur = useTransform(
    scrollYProgress,
    [0.3, 0.5],
    ["blur(10px)", "blur(0px)"]
  );

  // Staggered reveals for blocks
  const sumY = useSpring(useTransform(scrollYProgress, [0.3, 0.5], [20, 0]), springConfig);
  const funcY = useSpring(useTransform(scrollYProgress, [0.4, 0.6], [20, 0]), springConfig);
  const resultY = useSpring(useTransform(scrollYProgress, [0.5, 0.7], [20, 0]), springConfig);
  
  const sumOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const funcOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const resultOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  return (
    <motion.div 
      className={styles.equation}
      style={{
        scale: equationScale,
        rotateX: equationRotate,
        filter: equationBlur,
      }}
    >
      <motion.div 
        className={styles.sumBlock}
        style={{ y: sumY, opacity: sumOpacity }}
      >
        <span className={styles.symbol}>Σx</span>
        <div className={styles.dataNode} />
      </motion.div>

      <div className={styles.connectionWrapper}>
        <CircuitPath progress={scrollYProgress} delay={0} />
        <motion.span 
          className={styles.operator}
          style={{ opacity: useTransform(scrollYProgress, [0.35, 0.45], [0, 1]) }}
        >
          where
        </motion.span>
        <CircuitPath progress={scrollYProgress} delay={0.05} reverse />
      </div>

      <motion.div 
        className={styles.funcBlock}
        style={{ y: funcY, opacity: funcOpacity }}
      >
        <div className={styles.dataNodeLeft} />
        <span className={styles.funcText}>f(y)</span>
        <div className={styles.dataNodeRight} />
      </motion.div>

      <div className={styles.connectionWrapper}>
        <CircuitPath progress={scrollYProgress} delay={0.1} />
        <motion.span 
          className={styles.operator}
          style={{ opacity: useTransform(scrollYProgress, [0.45, 0.55], [0, 1]) }}
        >
          =
        </motion.span>
        <CircuitPath progress={scrollYProgress} delay={0.15} reverse />
      </div>

      <motion.div 
        className={styles.resultBlock}
        style={{ y: resultY, opacity: resultOpacity }}
      >
        <div className={styles.dataNodeLeft} />
        <span className={styles.resultText}>x</span>
      </motion.div>
    </motion.div>
  );
}
