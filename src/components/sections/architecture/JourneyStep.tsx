"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef, memo } from "react";
import styles from "../Architecture.module.scss";
import { JourneyStepData } from "./constants";

interface JourneyStepProps {
  step: JourneyStepData;
  index: number;
}

export const JourneyStep = memo(function JourneyStep({ step, index }: JourneyStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 !== 0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  // Transform values for ultra-reactive feel
  const opacityRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const opacity = shouldReduceMotion ? opacityRaw : useSpring(opacityRaw, springConfig);
  
  const scaleRaw = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1, 1.05, 1, 0.8]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, springConfig);

  const xOffset = isEven ? 100 : -100;
  const xRaw = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [xOffset, 0, 0, -xOffset]);
  const x = shouldReduceMotion ? xRaw : useSpring(xRaw, springConfig);

  const rotateRaw = useTransform(scrollYProgress, [0, 1], [isEven ? 5 : -5, isEven ? -5 : 5]);
  const rotate = shouldReduceMotion ? rotateRaw : useSpring(rotateRaw, springConfig);

  const nodeScaleRaw = useTransform(scrollYProgress, [0.1, 0.2], [0, 1.5]);
  const nodeScale = shouldReduceMotion ? nodeScaleRaw : useSpring(nodeScaleRaw, springConfig);

  return (
    <div ref={containerRef} className={styles.journeyStep}>
      <motion.div 
        className={styles.stepNode}
        style={{
          scale: nodeScale,
          backgroundColor: useTransform(
            scrollYProgress,
            [0.1, 0.2],
            ["var(--color-bg)", "var(--color-primary)"]
          ),
          boxShadow: useTransform(
            scrollYProgress,
            [0.1, 0.2],
            ["0 0 0px rgba(0,0,0,0)", "0 0 20px var(--color-primary)"]
          ),
          willChange: "transform, background-color, box-shadow"
        }}
      />
      
      <motion.div 
        className={styles.stepContent}
        style={{
          opacity,
          scale,
          x,
          rotateZ: rotate,
          perspective: 1000,
          willChange: "transform, opacity"
        }}
      >
        <motion.span 
          className={styles.stepLabel}
          style={{
            letterSpacing: useTransform(scrollYProgress, [0, 0.3], ["0.5em", "0.2em"]),
            opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]),
            willChange: "letter-spacing, opacity"
          }}
        >
          {step.label}
        </motion.span>
        
        <motion.h3 
          className={styles.stepTitle}
          style={{
            y: useTransform(scrollYProgress, [0, 0.3], [20, 0]),
            filter: useTransform(scrollYProgress, [0, 0.2], ["blur(10px)", "blur(0px)"]),
            willChange: "transform, filter"
          }}
        >
          {step.title}
        </motion.h3>
        
        <motion.p 
          className={styles.stepDescription}
          style={{
            y: useTransform(scrollYProgress, [0.1, 0.4], [20, 0]),
            opacity: useTransform(scrollYProgress, [0.2, 0.4], [0, 1]),
            willChange: "transform, opacity"
          }}
        >
          {step.description}
        </motion.p>
        
        <div className={styles.stepTags}>
          {step.tags.map((tag, i) => (
            <JourneyStepTag key={i} tag={tag} index={i} scrollYProgress={scrollYProgress} springConfig={springConfig} shouldReduceMotion={shouldReduceMotion} />
          ))}
        </div>
      </motion.div>
    </div>
  );
});

function JourneyStepTag({ tag, index, scrollYProgress, springConfig, shouldReduceMotion }: { tag: string, index: number, scrollYProgress: any, springConfig: any, shouldReduceMotion: boolean | null }) {
  const scaleRaw = useTransform(scrollYProgress, [0.3 + (index * 0.05), 0.5 + (index * 0.05)], [0, 1]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, springConfig);
  
  return (
    <motion.span 
      className={styles.tag}
      style={{
        scale,
        willChange: "transform"
      }}
    >
      {tag}
    </motion.span>
  );
}
