"use client";

import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
}

export const Reveal = ({ 
  children, 
  delay = 0, 
  direction = "up", 
  distance = 20, 
  duration = 0.6,
  className,
  ...props 
}: RevealProps) => {
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      x: direction === "left" ? distance : direction === "right" ? -distance : 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { 
        duration, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
}

export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  className,
  ...props
}: StaggerContainerProps) => {
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: boolean;
}

export const GlassCard = ({ children, className, hoverScale = true }: GlassCardProps) => {
  return (
    <div className={clsx("glass-card", className)}>
      {children}
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
  className?: string;
}

export const SectionHeader = ({ title, subtitle, alignment = "center", className }: SectionHeaderProps) => {
  return (
    <div className={clsx(
      "section-header", 
      alignment === "center" && "text-center", 
      "mb-20",
      className
    )}
    style={{ textAlign: alignment, marginBottom: '5rem' }}
    >
      <Reveal>
        <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          {title.split(' ').map((word, i) => (
            word.endsWith('.') ? (
              <span key={i} className="text-gradient">{word}</span>
            ) : (
              <span key={i}>{word} </span>
            )
          ))}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.125rem' }}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
};
