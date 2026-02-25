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
              No quotes. Just results. After a consultation, we build your custom demo at no cost. Convert transcripts into self-supervising tools without liquidity race conditions.
            </p>
            
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                placeholder="operator@company.com" 
                className={styles.input}
              />
              <button className="btn btn--primary">
                Request Free Demo
              </button>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
