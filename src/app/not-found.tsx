import NotFound from "@/components/procedural/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackgroundDecor from "@/components/procedural/BackgroundDecor";
import styles from "@/components/ProceduralTemplate.module.scss";

export default function GlobalNotFound() {
  return (
    <div className={styles.proceduralTemplate}>
      <Header />
      <BackgroundDecor />
      <main className={styles.main}>
        <NotFound />
      </main>
      <Footer />
    </div>
  );
}
