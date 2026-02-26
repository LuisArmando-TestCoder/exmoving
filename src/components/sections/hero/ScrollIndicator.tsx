"use client";

import { motion, MotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "../Hero.module.scss";

interface ScrollIndicatorProps {
  opacityContent: MotionValue<number>;
}

export function ScrollIndicator({ opacityContent }: ScrollIndicatorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      className={styles.scrollIndicator}
      style={{ opacity: opacityContent }}
    >
      <span className={styles.scrollText}>SCROLL</span>
      <div className={styles.scrollLine} />
    </motion.div>
  );
}
