"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import styles from "../Architecture.module.scss";
import { JourneyStepData } from "./constants";

interface JourneyStepProps {
  step: JourneyStepData;
  index: number;
}

export function JourneyStep({ step, index }: JourneyStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 !== 0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  // Transform values for ultra-reactive feel
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
    springConfig
  );
  
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1, 1.05, 1, 0.8]),
    springConfig
  );

  const xOffset = isEven ? 100 : -100;
  const x = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [xOffset, 0, 0, -xOffset]),
    springConfig
  );

  const rotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [isEven ? 5 : -5, isEven ? -5 : 5]),
    springConfig
  );

  return (
    <div ref={containerRef} className={styles.journeyStep}>
      <motion.div 
        className={styles.stepNode}
        style={{
          scale: useSpring(useTransform(scrollYProgress, [0.1, 0.2], [0, 1.5]), springConfig),
          backgroundColor: useTransform(
            scrollYProgress,
            [0.1, 0.2],
            ["var(--color-bg)", "var(--color-primary)"]
          ),
          boxShadow: useTransform(
            scrollYProgress,
            [0.1, 0.2],
            ["0 0 0px rgba(0,0,0,0)", "0 0 20px var(--color-primary)"]
          )
        }}
      />
      
      <motion.div 
        className={styles.stepContent}
        style={{
          opacity,
          scale,
          x,
          rotateZ: rotate,
          perspective: 1000
        }}
      >
        <motion.span 
          className={styles.stepLabel}
          style={{
            letterSpacing: useTransform(scrollYProgress, [0, 0.3], ["0.5em", "0.2em"]),
            opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
          }}
        >
          {step.label}
        </motion.span>
        
        <motion.h3 
          className={styles.stepTitle}
          style={{
            y: useTransform(scrollYProgress, [0, 0.3], [20, 0]),
            filter: useTransform(scrollYProgress, [0, 0.2], ["blur(10px)", "blur(0px)"])
          }}
        >
          {step.title}
        </motion.h3>
        
        <motion.p 
          className={styles.stepDescription}
          style={{
            y: useTransform(scrollYProgress, [0.1, 0.4], [20, 0]),
            opacity: useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
          }}
        >
          {step.description}
        </motion.p>
        
        <div className={styles.stepTags}>
          {step.tags.map((tag, i) => (
            <motion.span 
              key={i} 
              className={styles.tag}
              style={{
                scale: useSpring(
                  useTransform(scrollYProgress, [0.3 + (i * 0.05), 0.5 + (i * 0.05)], [0, 1]),
                  springConfig
                )
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
