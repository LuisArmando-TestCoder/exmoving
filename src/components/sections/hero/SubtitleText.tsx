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
  // Total scroll is 0 to 1.
  // 0.0 to 0.15: Main title is visible and then fades.
  // 0.15 to 0.35: Line 1
  // 0.40 to 0.60: Line 2
  // 0.65 to 0.85: Line 3
  
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
    [20, 0, -20]
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

  return (
    <motion.div
      className={styles.subtitleLine}
      style={{
        opacity,
        y,
        filter,
        scale,
      }}
    >
      {phrase}
    </motion.div>
  );
}
