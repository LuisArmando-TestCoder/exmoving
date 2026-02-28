import Link from "next/link";
import { LayoutGrid, Twitter, Linkedin, Github, ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer} id="layout-footer">
      <div className={styles.glow} />
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.branding}>
            <Link href="/" className={styles.logo}>
              <LayoutGrid size={28} className={styles.logoIcon} />
              <span>ΣXECUTIONS</span>
            </Link>
            <p className={styles.manifesto}>
              Systematic operational expansion. High-velocity problem solving. 
              Converting friction into computational returns.
            </p>
          </div>
          <div className={styles.metrics}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>SYSTEM STATUS</span>
              <span className={styles.metricValue}>ONLINE</span>
              <div className={styles.pulse} />
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Infrastructure</h4>
            <div className={styles.links}>
              <Link href="/#architecture" className={styles.link}>
                Automation Cycle <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
              <Link href="/#margin-engine" className={styles.link}>
                Pricing Agent <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
              <Link href="/#risk" className={styles.link}>
                Problem Solver <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Operations</h4>
            <div className={styles.links}>
              <Link href="/about" className={styles.link}>
                About <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
              <Link href="/case-studies" className={styles.link}>
                Case Studies <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
              <Link href="/contact" className={styles.link}>
                Contact <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Compliance</h4>
            <div className={styles.links}>
              <Link href="/privacy" className={styles.link}>
                Privacy <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
              <Link href="/terms" className={styles.link}>
                Terms <ArrowUpRight size={14} className={styles.arrow} />
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            <span className={styles.version}>v.2.0.26</span>
            <p>© {new Date().getFullYear()} ΣXECUTIONS. ALL RIGHTS RESERVED.</p>
          </div>
          <div className={styles.socials}>
            <Link href="https://x.com/LuisArmand82485" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
              <Twitter size={18} />
            </Link>
            <Link href="https://www.linkedin.com/in/luis-armando-murillo-4434a3173/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <Linkedin size={18} />
            </Link>
            <Link href="https://github.com/LuisArmando-TestCoder" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
              <Github size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
