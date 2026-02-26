"use client";

import { motion } from "framer-motion";
import styles from "./Subtitles.module.scss";

const phrases = [
  "We believe in expansion / enhancement",
  "By supercharging everybody",
  "We just happen to automate it"
];

export default function Subtitles() {
  return (
    <section className={styles.subtitlesWrapper}>
      {phrases.map((phrase, i) => (
        <Line key={i} phrase={phrase} />
      ))}
    </section>
  );
}

function Line({ phrase }: { phrase: string }) {
  return (
    <motion.div
      className={styles.line}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        transition: {
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for a premium feel
        }
      }}
      viewport={{ once: false, amount: 0.5, margin: "-10% 0px -10% 0px" }}
    >
      <span className={styles.lineText}>{phrase}</span>
    </motion.div>
  );
}
