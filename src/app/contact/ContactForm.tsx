'use client';

import styles from "@/components/ModernPage.module.scss";

export default function ContactForm() {
  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Full Name</label>
        <input type="text" className={styles.input} placeholder="John Doe" />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Corporate Email</label>
        <input type="email" className={styles.input} placeholder="john@company.com" />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>System Focus</label>
        <input type="text" className={styles.input} placeholder="e.g. Logistics, Margin Optimization" />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Message</label>
        <textarea className={styles.textarea} placeholder="Describe your operational friction..."></textarea>
      </div>
      <button type="submit" className={styles.submitBtn}>Initialize Connection</button>
    </form>
  );
}
