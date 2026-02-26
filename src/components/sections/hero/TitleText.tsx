"use client";

import { motion, MotionValue } from "framer-motion";
import styles from "../Hero.module.scss";
import { SplitText } from "../../ui/SplitText";

interface TitleTextProps {
  isInView: boolean;
  smoothXTitle: MotionValue<number>;
  opacityContent: MotionValue<number>;
  blurContent: MotionValue<string | any>;
}

export function TitleText({ isInView, smoothXTitle, opacityContent, blurContent }: TitleTextProps) {
  return (
    <motion.div 
      className={styles.titleContent} 
      style={{ 
        x: smoothXTitle,
        opacity: opacityContent,
        filter: blurContent
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 id="hero-title" className={styles.mainTitle}>
        <SplitText id="hero-split-title">Σxecutions</SplitText>
      </h1>
    </motion.div>
  );
}
