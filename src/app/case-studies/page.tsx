import ModernPage from "@/components/ModernPage";
import styles from "@/components/ModernPage.module.scss";
import { BarChart3, Globe, Shield } from "lucide-react";

export default function CaseStudiesPage() {
  return (
    <ModernPage 
      title="Impact at Scale" 
      subtitle="Real-world results of our automated ecosystems."
      visualText="IMPACT"
    >
      <div className={styles.grid}>
        <div className={styles.card}>
          <BarChart3 className="mb-4" size={32} />
          <h3 className={styles.cardTitle}>Global Logistics</h3>
          <p className={styles.cardText}>40% reduction in route friction through real-time pricing agents.</p>
        </div>
        <div className={styles.card}>
          <Globe className="mb-4" size={32} />
          <h3 className={styles.cardTitle}>Digital Commerce</h3>
          <p className={styles.cardText}>Autonomous inventory scaling across 12 geographic regions.</p>
        </div>
        <div className={styles.card}>
          <Shield className="mb-4" size={32} />
          <h3 className={styles.cardTitle}>Risk Management</h3>
          <p className={styles.cardText}>Self-correcting compliance systems for cross-border operations.</p>
        </div>
      </div>
    </ModernPage>
  );
}
