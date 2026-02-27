import ModernPage from "@/components/ModernPage";
import styles from "@/components/ModernPage.module.scss";
import ContactForm from "./ContactForm";

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
            <br />
            <div>
              <span className={styles.label}>Email</span>
              <p className="text-xl">info@executions.com</p>
            </div>
            <br />
            <div>
              <span className={styles.label}>Location</span>
              <p className="text-xl">Distributed / Global</p>
            </div>
          </div>
        </div>
        
        <ContactForm />
      </div>
    </ModernPage>
  );
}
