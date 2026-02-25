"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import styles from "./Hero.module.scss";
import { Reveal, StaggerContainer } from "../ui/Common";
import { EmailActionButton } from "../ui/EmailActionButton";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <StaggerContainer className={styles.content} delayChildren={0.2}>
          <Reveal className={styles.badge}>
            <Zap size={14} />
            <span>Roadmap To Exit</span>
          </Reveal>
          
          <Reveal>
            <h1 className={styles.title}>
              ROI Driven <br />
              <span className="text-gradient">Scaling.</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.1}>
            <p className={styles.subtitle}>
              We automate to industries that were left behind. We turn status quo upside down, expanding and enhancing people by supercharging them with self-supervising systems that convert operational friction into measurable returns.
            </p>
          </Reveal>
          
          <Reveal delay={0.2} className={styles.actions}>
            <div className={styles.demoGroup}>
              <EmailActionButton 
                label="REQUEST FREE DEMO" 
                subject="Hero Demo Request"
              />
              <p className={styles.demoHint}>Takes less than 30 seconds</p>
            </div>
          </Reveal>
          
          <Reveal delay={0.3} className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statItem__value}>$0.50</span>
              <span className={styles.statItem__label}>per 1M tokens</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statItem__value}>$200</span>
              <span className={styles.statItem__label}>Support Fee</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statItem__value}>10x</span>
              <span className={styles.statItem__label}>Valuation Target</span>
            </div>
          </Reveal>
        </StaggerContainer>
      </div>
      
      {/* Decorative Elements */}
      <div className="bg-glow" />
    </section>
  );
}
