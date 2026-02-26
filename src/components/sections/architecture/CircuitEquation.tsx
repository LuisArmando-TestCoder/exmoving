"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, useSpring, MotionValue, useInView } from "framer-motion";
import styles from "../Architecture.module.scss";

interface CircuitEquationProps {
  scrollYProgress: MotionValue<number>;
}

// Particle system for data flow effect
const DataParticles = ({ progress, reverse = false, delay = 0 }: { progress: MotionValue<number>, reverse?: boolean, delay?: number }) => {
  const [particles, setParticles] = useState<{ id: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 1.5,
    }));
    setParticles(newParticles);
  }, []);

  const pathLength = useTransform(progress, [0.3 + delay, 0.6 + delay], [0, 1]);
  const opacity = useTransform(pathLength, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "200px" });

  return (
    <motion.div ref={ref} style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            top: "50%",
            left: reverse ? "100%" : "0%",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "var(--color-primary)",
            boxShadow: "0 0 8px 2px var(--color-primary)",
            marginTop: "-2px",
            marginLeft: "-2px",
          }}
          animate={isInView ? {
            left: reverse ? ["100%", "0%"] : ["0%", "100%"],
            scale: [0, 1, 1, 0],
          } : { left: reverse ? "100%" : "0%", scale: 0 }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  );
};

const CircuitPath = ({ progress, delay = 0, reverse = false }: { progress: MotionValue<number>, delay?: number, reverse?: boolean }) => {
  const rawPathLength = useTransform(progress, [0.3 + delay, 0.6 + delay], [0, 1]);
  const pathLength = useSpring(rawPathLength, { stiffness: 60, damping: 20 });
  const opacity = useTransform(progress, [0.3 + delay, 0.4 + delay], [0, 1]);

  return (
    <div style={{ position: "relative", width: "60px", height: "20px", display: "flex", alignItems: "center" }}>
      <motion.svg 
        className={styles.circuitPath} 
        width="60" 
        height="20" 
        viewBox="0 0 60 20"
        style={{ opacity, position: "absolute", left: 0, top: 0 }}
      >
        <defs>
          <linearGradient id={`glowGradient-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="glowBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background track */}
        <path 
          d={reverse ? "M 60 10 L 0 10" : "M 0 10 L 60 10"} 
          stroke="rgba(var(--color-primary-rgb), 0.15)" 
          strokeWidth="2" 
          strokeDasharray="4 4"
          fill="none" 
        />
        
        {/* Glowing core signal */}
        <motion.path 
          d={reverse ? "M 60 10 L 0 10" : "M 0 10 L 60 10"}
          stroke={`url(#glowGradient-${delay})`} 
          strokeWidth="3" 
          fill="none"
          filter="url(#glowBlur)"
          style={{ pathLength }}
        />
        
        {/* Crisp highlight signal */}
        <motion.path 
          d={reverse ? "M 60 10 L 0 10" : "M 0 10 L 60 10"}
          stroke="var(--text)" 
          strokeWidth="1" 
          fill="none"
          style={{ pathLength, opacity: 0.8 }}
        />
        
        {/* Animated nodes */}
        <motion.circle 
          cx={reverse ? "60" : "0"} 
          cy="10" 
          r="3" 
          fill="var(--text)"
          style={{ scale: useTransform(pathLength, [0, 0.1], [0, 1]), boxShadow: "0 0 10px var(--color-primary)" }}
        />
        <motion.circle 
          cx={reverse ? "0" : "60"} 
          cy="10" 
          r="4" 
          fill="var(--color-bg)"
          stroke="var(--color-primary)"
          strokeWidth="2"
          style={{ scale: useTransform(pathLength, [0.9, 1], [0, 1]) }}
        />
      </motion.svg>
      <DataParticles progress={progress} reverse={reverse} delay={delay} />
    </div>
  );
};

// Custom Hook for mouse tracking on equation container
function useMouseGlow(ref: React.RefObject<HTMLDivElement | null>) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseenter", () => setIsHovered(true));
      element.addEventListener("mouseleave", () => setIsHovered(false));
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseenter", () => setIsHovered(true));
        element.removeEventListener("mouseleave", () => setIsHovered(false));
      }
    };
  }, [ref]);

  return { mousePosition, isHovered };
}

export function CircuitEquation({ scrollYProgress }: CircuitEquationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "200px" });
  const { mousePosition, isHovered } = useMouseGlow(containerRef);

  const springConfig = { stiffness: 80, damping: 25, restDelta: 0.001 };

  // Advanced 3D Transforms
  const rawScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.85, 1.05, 0.95]);
  const equationScale = useSpring(rawScale, springConfig);
  
  const rawRotateX = useTransform(scrollYProgress, [0.2, 0.8], [5, -5]);
  const equationRotateX = useSpring(rawRotateX, springConfig);

  const rawRotateY = useTransform(scrollYProgress, [0.2, 0.8], [-2, 2]);
  const equationRotateY = useSpring(rawRotateY, springConfig);

  const equationOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

  // Staggered reveals for blocks with overshoot
  const sumY = useSpring(useTransform(scrollYProgress, [0.25, 0.45], [40, 0]), springConfig);
  const funcY = useSpring(useTransform(scrollYProgress, [0.35, 0.55], [40, 0]), springConfig);
  const resultY = useSpring(useTransform(scrollYProgress, [0.45, 0.65], [40, 0]), springConfig);
  
  const sumScale = useSpring(useTransform(scrollYProgress, [0.25, 0.45], [0.8, 1]), springConfig);
  const funcScale = useSpring(useTransform(scrollYProgress, [0.35, 0.55], [0.8, 1]), springConfig);
  const resultScale = useSpring(useTransform(scrollYProgress, [0.45, 0.65], [0.8, 1]), springConfig);

  const sumOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const funcOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const resultOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);

  return (
    <motion.div 
      ref={containerRef}
      className={styles.equation}
      style={{
        scale: equationScale,
        rotateX: equationRotateX,
        rotateY: equationRotateY,
        opacity: equationOpacity,
        transformStyle: "preserve-3d",
        position: "relative",
        willChange: "transform, opacity",
      }}
    >
      {/* Interactive Glow Background */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--color-primary-rgb), 0.08), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
          zIndex: -1,
          borderRadius: "20px",
        }}
      />

      <motion.div 
        className={styles.sumBlock}
        style={{ 
          y: sumY, 
          scale: sumScale,
          opacity: sumOpacity,
          boxShadow: "0 10px 30px -10px rgba(var(--color-primary-rgb), 0.2)",
          border: "1px solid rgba(var(--color-primary-rgb), 0.3)",
          background: "linear-gradient(145deg, rgba(var(--color-bg-rgb), 0.9) 0%, rgba(var(--color-bg-rgb), 0.4) 100%)",
          willChange: "transform, opacity",
        }}
        whileHover={{ scale: 1.05, y: -5, boxShadow: "0 15px 40px -10px rgba(var(--color-primary-rgb), 0.4)" }}
      >
        <span className={styles.symbol} style={{ color: "var(--text)", textShadow: "0 0 10px var(--color-primary)", display: "inline-block", position: "relative", zIndex: 2 }}>Σx</span>
        {/* Scanline effect */}
        <motion.div 
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", background: "linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.1), transparent)", zIndex: 1 }}
          animate={isInView ? { y: ["-100%", "100%"] } : { y: "-100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <div className={styles.connectionWrapper}>
        <CircuitPath progress={scrollYProgress} delay={0} />
        <motion.span 
          className={styles.operator}
          style={{ 
            opacity: useTransform(scrollYProgress, [0.35, 0.45], [0, 1]),
            scale: useSpring(useTransform(scrollYProgress, [0.35, 0.45], [0.5, 1]), springConfig),
            textShadow: "0 0 10px rgba(var(--color-primary-rgb), 0.5)",
            background: "rgba(var(--color-bg-rgb), 0.8)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.4)",
          }}
        >
          where
        </motion.span>
        <CircuitPath progress={scrollYProgress} delay={0.05} reverse />
      </div>

      <motion.div 
        className={styles.funcBlock}
        style={{ 
          y: funcY, 
          scale: funcScale,
          opacity: funcOpacity,
          boxShadow: "0 10px 30px -10px rgba(var(--color-primary-rgb), 0.1)",
          background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.05) 0%, rgba(var(--color-bg-rgb), 0.6) 100%)",
          border: "1px dashed rgba(var(--color-primary-rgb), 0.4)",
          willChange: "transform, opacity",
        }}
        whileHover={{ scale: 1.05, y: -5, borderColor: "rgba(var(--color-primary-rgb), 0.8)" }}
      >
        <div className={styles.dataNodeLeft} />
        <span className={styles.funcText} style={{ color: "var(--color-text)", fontWeight: 500 }}>f(y)</span>
        <div className={styles.dataNodeRight} />
      </motion.div>

      <div className={styles.connectionWrapper}>
        <CircuitPath progress={scrollYProgress} delay={0.1} />
        <motion.span 
          className={styles.operator}
          style={{ 
            opacity: useTransform(scrollYProgress, [0.45, 0.55], [0, 1]),
            scale: useSpring(useTransform(scrollYProgress, [0.45, 0.55], [0.5, 1]), springConfig),
            textShadow: "0 0 10px rgba(var(--color-primary-rgb), 0.5)",
            background: "rgba(var(--color-bg-rgb), 0.8)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.4)",
          }}
        >
          =
        </motion.span>
        <CircuitPath progress={scrollYProgress} delay={0.15} reverse />
      </div>

      <motion.div 
        className={styles.resultBlock}
        style={{ 
          y: resultY, 
          scale: resultScale,
          opacity: resultOpacity,
          boxShadow: "0 15px 40px -5px rgba(var(--color-primary-rgb), 0.4)",
          background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.2) 0%, rgba(var(--color-primary-rgb), 0.05) 100%)",
          border: "1px solid rgba(var(--color-primary-rgb), 0.8)",
          willChange: "transform, opacity",
        }}
        whileHover={{ scale: 1.08, y: -8, boxShadow: "0 20px 50px 0px rgba(var(--color-primary-rgb), 0.6)" }}
      >
        <motion.div 
          style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(var(--overlay-rgb),0.1), transparent)", pointerEvents: "none" }}
          animate={isInView ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className={styles.dataNodeLeft} style={{ background: "var(--text)", boxShadow: "0 0 10px var(--text)" }} />
        <span className={styles.resultText} style={{ fontSize: "1.4em", textShadow: "0 0 20px rgba(var(--overlay-rgb),0.8)" }}>x</span>
      </motion.div>
    </motion.div>
  );
}
