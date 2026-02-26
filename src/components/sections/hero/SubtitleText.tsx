"use client";

import { motion, MotionValue } from "framer-motion";
import styles from "../Hero.module.scss";

interface SubtitleTextProps {
  isInView: boolean;
  smoothXSubtitle: MotionValue<number>;
  opacityContent: MotionValue<number>;
  blurContent: MotionValue<string | any>;
}

export function SubtitleText({ isInView, smoothXSubtitle, opacityContent, blurContent }: SubtitleTextProps) {
  return (
    <motion.div 
      className={styles.titleContent} 
      style={{ 
        x: smoothXSubtitle,
        opacity: opacityContent,
        filter: blurContent
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className={styles.subtitle}>
        <span>We believe in expansion and enhancement</span>
      </p>
      <p className={styles.subtitle}>
        <span>By supercharging human beings</span>
      </p>
      <p className={styles.subtitle}>
        <span>We just happen to automate you</span>
      </p>
    </motion.div>
  );
}
