"use client";

import { motion, MotionValue, useTransform, Variants } from "framer-motion";
import styles from "../Hero.module.scss";

interface SubtitleTextProps {
  isInView: boolean;
  smoothXSubtitle: MotionValue<number>;
  opacityContent: MotionValue<number>;
  blurContent: MotionValue<string | any>;
}

const phrases = [
  "We believe in expansion enhancement",
  "By supercharging everybody",
  "We just happen to automate it"
];

export function SubtitleText({ isInView, smoothXSubtitle, opacityContent, blurContent }: SubtitleTextProps) {
  // Ultra-reactive scroll effects
  const skewX = useTransform(smoothXSubtitle, [-50, 0, 50], [5, 0, -5]);
  const letterSpacing = useTransform(opacityContent, [0, 1], ["0.4em", "0.2em"]);
  
  // Scrolled-linked reveal: words appear based on scroll position
  // We'll map the opacityContent (which comes from scroll) to individual word opacities
  // But for a more "modern" feel, we'll keep the stagger on entry and use scroll for the continuous transition.

  return (
    <motion.div 
      className={styles.titleContent} 
      style={{ 
        x: smoothXSubtitle,
        skewX,
        opacity: opacityContent,
        filter: blurContent
      }}
    >
      <motion.div 
        className={styles.subtitle}
        style={{ letterSpacing }}
        aria-label={phrases.join(". ")}
      >
        {phrases.map((phrase, i) => {
          // Calculate a scroll range for each phrase to appear sequentially as user scrolls
          // Since opacityContent goes from 1 to 0 as we scroll DOWN (leaving the hero)
          // We actually want them to appear based on the initial entry too.
          
          return (
            <span key={i} className={styles.subtitleLine}>
              {phrase.split(" ").map((word, j) => {
                // Determine when this specific word should appear based on scroll
                // We'll create a unique scroll-linked opacity for each word
                const wordIndex = i * 10 + j; // Rough estimate for staggered scroll reveal
                const start = 1 - (wordIndex * 0.02);
                const end = start - 0.1;
                
                // This will make words "fade in" as we scroll down/up if we were tracking entry scroll
                // However, since Hero scroll usually tracks LEAVING, let's use the isInView for entry
                // and use opacityContent for the "disappearing" scroll effect.
                
                return (
                  <Word 
                    key={j} 
                    word={word} 
                    isInView={isInView} 
                    index={wordIndex}
                    opacityContent={opacityContent} 
                  />
                );
              })}
            </span>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function Word({ word, isInView, index, opacityContent }: { word: string; isInView: boolean; index: number; opacityContent: MotionValue<number> }) {
  // Each word has its own reaction to the scroll
  // Use a smaller range for y to minimize vertical jitter
  const scrollY = useTransform(opacityContent, [0, 1], [15, 0]);
  const wordOpacity = useTransform(opacityContent, [0, 0.2, 1], [0, 1, 1]);
  const blur = useTransform(opacityContent, [0, 0.5, 1], ["blur(8px)", "blur(0px)", "blur(0px)"]);

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      filter: "blur(4px)",
      transition: { duration: 0.3 }
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: 0.4 + i * 0.02, // Faster stagger
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  return (
    <motion.span
      className={styles.word}
      variants={variants}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      // Force hardware acceleration and prevent subpixel layout shifts
      transformTemplate={({ y }: any) => `translateY(${y}) translateZ(0)`}
      style={{ 
        y: isInView ? scrollY : 15, 
        opacity: isInView ? wordOpacity : 0,
        filter: isInView ? blur : "blur(4px)"
      }}
    >
      {word}
    </motion.span>
  );
}
