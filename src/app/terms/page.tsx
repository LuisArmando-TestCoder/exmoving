import ModernPage from "@/components/ModernPage";
import styles from "@/components/ModernPage.module.scss";

export default function TermsPage() {
  return (
    <ModernPage 
      title="Terms" 
      subtitle="Operational framework for Σxecutions services."
      visualText="RULES"
    >
      <div className={styles.legalContent}>
        <h2>Agreement</h2>
        <p>By initializing a connection with our services, you agree to the deployment of autonomous agents within your specified operational boundaries.</p>
        
        <h2>Usage</h2>
        <p>Our systems are designed for high-throughput environments. Misuse of the Σxecutions API to create artificial operational friction is strictly prohibited.</p>
        
        <h2>Liability</h2>
        <p>While our agents are self-supervising, final strategic decisions remain the responsibility of the client's executive architecture.</p>
      </div>
    </ModernPage>
  );
}
