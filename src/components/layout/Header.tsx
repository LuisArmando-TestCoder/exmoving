"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import styles from "./Header.module.scss";
import { clsx } from "clsx";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={clsx(styles.header, scrolled && styles["header--scrolled"])}>
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <LayoutGrid size={24} />
            ROADMAP<span>.</span>
          </Link>

          <div className={styles.links}>
            <Link href="#architecture" className={styles.link}>Cycle</Link>
            <Link href="#margin-engine" className={styles.link}>Pricing</Link>
            <Link href="#risk" className={styles.link}>Problem</Link>
            <Link href="#contact" className={styles.link}>Demo</Link>
          </div>

          <div className={styles.actions}>
            <button className="btn btn--outline">Login</button>
            <button className="btn btn--primary">
              Deploy <ChevronRight size={16} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
