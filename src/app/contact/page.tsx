import ModernPage from "@/components/ModernPage";
import styles from "@/components/ModernPage.module.scss";

export default function ContactPage() {
  return (
    <ModernPage 
      title="Connect" 
      subtitle="Ready to eliminate operational friction? Let's talk."
      visualText="REACH"
    >
      <div className={styles.contactGrid}>
        <div>
          <h3 className="text-2xl font-semibold mb-6">General Inquiries</h3>
          <p className="opacity-60 mb-8 max-w-sm">For partnerships, system demos, or architectural consultations.</p>
          
          <div className="space-y-6">
            <div>
              <span className={styles.label}>Email</span>
              <p className="text-xl">systems@executions.com</p>
            </div>
            <div>
              <span className={styles.label}>Location</span>
              <p className="text-xl">Distributed / Global</p>
            </div>
          </div>
        </div>
        
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
      </div>
    </ModernPage>
  );
}
