import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackgroundDecor from "@/components/procedural/BackgroundDecor";
import styles from "@/components/ProceduralTemplate.module.scss";

interface SimplePageProps {
  title: string;
}

export default function SimplePage({ title }: SimplePageProps) {
  return (
    <div className={`${styles.proceduralTemplate} selection:bg-blue-500/30`}>
      <Header />
      <BackgroundDecor />

      <main className={`${styles.main} container mx-auto px-4`}>
        <div style={{ paddingTop: '12rem', paddingBottom: '12rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>{title}</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
            This page is currently under development. Please check back soon for updates.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
