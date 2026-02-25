"use client";

import styles from "./CopySection.module.scss";
import { Reveal, GlassCard } from "../ui/Common";
import { EmailActionButton } from "../ui/EmailActionButton";

export default function CopySection() {
  return (
    <section id="contact" className={styles.copySection}>
      <div className="container">
        <Reveal direction="up" distance={40}>
          <GlassCard className={styles.card}>
            <h2 className={styles.title}>
              Deploy <span className="text-gradient">Automation.</span>
            </h2>
            <p className={styles.description}>
              No quotes. Just results. After a consultation, we build your custom demo at no cost. Convert transcripts into self-supervising tools.
            </p>
            
            <div className={styles.inputGroup}>
              <EmailActionButton 
                label="REQUEST FREE DEMO" 
                subject="Contact Section Demo Request"
                className={styles.submitButton}
              />
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
