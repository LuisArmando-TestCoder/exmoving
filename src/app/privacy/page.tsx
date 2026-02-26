import ModernPage from "@/components/ModernPage";
import styles from "@/components/ModernPage.module.scss";

export default function PrivacyPage() {
  return (
    <ModernPage 
      title="Privacy" 
      subtitle="Protocol for data protection and systemic integrity."
      visualText="TRUST"
    >
      <div className={styles.legalContent}>
        <h2>Data Collection</h2>
        <p>We only collect telemetry necessary for the optimization of our automated agents. This includes operational throughput and system performance metrics.</p>
        
        <h2>System Security</h2>
        <p>Our architecture utilizes end-to-end encryption for all inter-service communications. We maintain strict isolation between different client ecosystems.</p>
        
        <h2>Information Use</h2>
        <p>Data is used exclusively to refine the recursive algorithms that power your specific instance of the Σxecutions engine.</p>
      </div>
    </ModernPage>
  );
}
