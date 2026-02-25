"use client";

import { motion } from "framer-motion";
import { Reveal } from "../../ui/Common";
import styles from "../Architecture.module.scss";
import { JourneyStepData } from "./constants";

interface JourneyStepProps {
  step: JourneyStepData;
  index: number;
}

export function JourneyStep({ step, index }: JourneyStepProps) {
  return (
    <div className={styles.journeyStep}>
      <motion.div 
        className={styles.stepNode}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2 }}
      />
      
      <div className={styles.stepContent}>
        <Reveal direction={index % 2 === 0 ? "right" : "left"} delay={0.1}>
          <span className={styles.stepLabel}>{step.label}</span>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepDescription}>{step.description}</p>
          <div className={styles.stepTags}>
            {step.tags.map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
