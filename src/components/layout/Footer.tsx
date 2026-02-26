import Link from "next/link";
import { LayoutGrid, Twitter, Linkedin, Github } from "lucide-react";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.info}>
            <Link href="/" className={styles.logo}>
              <LayoutGrid size={24} />
              Σxecutions
            </Link>
            <p className={styles.description}>
              Expand and enhance through self-supervising systems. Converting operational friction into measurable returns.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>System</h4>
            <div className={styles.links}>
              <Link href="/#architecture" className={styles.link}>Automation Cycle</Link>
              <Link href="/#margin-engine" className={styles.link}>Pricing Agent</Link>
              <Link href="/#risk" className={styles.link}>Problem Solver</Link>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Agency</h4>
            <div className={styles.links}>
              <Link href="/about" className={styles.link}>About</Link>
              <Link href="/case-studies" className={styles.link}>Case Studies</Link>
              <Link href="/contact" className={styles.link}>Contact</Link>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Legal</h4>
            <div className={styles.links}>
              <Link href="/privacy" className={styles.link}>Privacy</Link>
              <Link href="/terms" className={styles.link}>Terms</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} LOGOS Automation. All rights reserved.</p>
          <div className={styles.socials}>
            <Link href="#" className={styles.link}><Twitter size={18} /></Link>
            <Link href="#" className={styles.link}><Linkedin size={18} /></Link>
            <Link href="#" className={styles.link}><Github size={18} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
