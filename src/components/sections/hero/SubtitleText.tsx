"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import styles from "../Hero.module.scss";

interface SubtitleTextProps {
  isInView: boolean;
  smoothXSubtitle: MotionValue<number>;
  opacityContent: MotionValue<number>;
  blurContent: MotionValue<string | any>;
  scrollYProgress: MotionValue<number>;
}

const phrases = [
  "We believe in expansion / enhancement",
  "By supercharging everybody",
  "We just happen to automate it"
];

export function SubtitleText({ scrollYProgress }: SubtitleTextProps) {
  return (
    <div className={styles.subtitle}>
      {phrases.map((phrase, i) => (
        <Line 
          key={i} 
          phrase={phrase} 
          index={i} 
          scrollYProgress={scrollYProgress} 
        />
      ))}
    </div>
  );
}

function Line({ phrase, index, scrollYProgress }: { phrase: string; index: number; scrollYProgress: MotionValue<number> }) {
  // Define scroll ranges for each line
  const start = 0.15 + index * 0.25;
  const end = start + 0.20;
  const peak = (start + end) / 2;

  // Each line fades in, stays solid, then fades out
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [start, peak, end],
    [0, 0, 0] // Keep it centered while active
  );

  const filter = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
  );

  const scale = useTransform(
    scrollYProgress,
    [start, peak, end],
    [0.9, 1, 1.1]
  );

  // Background opacity for each individual line sequence
  const bgOpacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );

  return (
    <>
      <motion.div 
        className={styles.subtitleLineBg} 
        style={{ opacity: bgOpacity }} 
      />
      <motion.div
        className={styles.subtitleLine}
        style={{
          opacity,
          y,
          filter,
          scale,
          color: "black" // Explicitly black for these lines
        }}
      >
        {phrase}
      </motion.div>
    </>
  );
}
