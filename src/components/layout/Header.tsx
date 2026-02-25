"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import styles from "./Header.module.scss";
import { clsx } from "clsx";
import { ModalMenu } from "./ModalMenu";
import { NavDropdown } from "./NavDropdown";
import { navigationData } from "@/constants/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  return (
    <header className={clsx(styles.header, scrolled && styles["header--scrolled"], menuOpen && styles["header--open"])}>
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <LayoutGrid size={24} />
            ROADMAP<span>.</span>
          </Link>

          {/* Unified Navigation Pill */}
          <div className={styles.navControls}>
            <div className={styles.navPill}>
              <div className={styles.desktopNav}>
                {navigationData.map((item) => (
                  <NavDropdown key={item.path} item={item} />
                ))}
              </div>
              <div className={styles.pillDivider} />
              <Link 
                href="/pricing" 
                className={clsx(styles.pricingLink, menuOpen && styles.pricingLinkActive)}
                onClick={() => setMenuOpen(false)}
              >
                PRICING
              </Link>
              <div className={styles.pillDivider} />
              <button 
                className={clsx(styles.menuToggle, menuOpen && styles.menuToggleActive)}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <div className={styles.hamburger}>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.toggleText}>{menuOpen ? "CLOSE" : "MENU"}</span>
              </button>
            </div>
          </div>

          <ModalMenu 
            isOpen={menuOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setMenuOpen={setMenuOpen}
          />
        </nav>
      </div>
    </header>
  );
}
