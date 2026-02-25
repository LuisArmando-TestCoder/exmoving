"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import styles from "../Architecture.module.scss";
import { CircuitEquation } from "./CircuitEquation";
import { PhilosophyText } from "./PhilosophyText";
import { VisionGlow } from "./VisionGlow";

export function Vision() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <motion.div 
      ref={containerRef} 
      className={styles.visionSection}
      style={{
        perspective: 1000
      }}
    >
      <VisionGlow scrollYProgress={scrollYProgress} />
      <PhilosophyText 
        scrollYProgress={scrollYProgress} 
        text="To lead is to make happen, to lead greatly, is about how it happens, but the best leaders are all about why it's happening."
      />
      <CircuitEquation scrollYProgress={scrollYProgress} />
    </motion.div>
  );
}
