"use client";

import styles from "./CopySection.module.scss";
import { Reveal, GlassCard } from "../ui/Common";

export default function CopySection() {
  return (
    <section id="contact" className={`${styles.copySection} section`}>
      <div className="container">
        <Reveal direction="up" distance={30}>
          <GlassCard className={styles.card}>
            <h2 className={styles.title}>
              Deploy <span className="text-gradient">Automation.</span>
            </h2>
            <p className={styles.description}>
              Convert transcripts into self-supervising tools. Start with pricing automations that return direct ROI.
            </p>
            
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                placeholder="operator@company.com" 
                className={styles.input}
              />
              <button className="btn btn--primary">
                Deploy System
              </button>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
