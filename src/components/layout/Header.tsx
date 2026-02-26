"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import styles from "./Header.module.scss";
import { clsx } from "clsx";
import { ModalMenu } from "./ModalMenu";
import { NavDropdown } from "./NavDropdown";
import { navigationData } from "@/constants/navigation";
import { useScrollStore } from "@/store/useScrollStore";

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

  const lenis = useScrollStore((state) => state.lenis);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`);
      document.body.classList.add("menu-open");
      lenis?.stop();
    } else {
      document.body.classList.remove("menu-open");
      lenis?.start();
    }
  }, [menuOpen, lenis]);

  return (
    <>
      <header className={clsx(styles.header, scrolled && styles["header--scrolled"], menuOpen && styles["header--open"])}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link 
              href="/" 
              className={styles.logo} 
              onClick={() => setMenuOpen(false)}
              style={!menuOpen ? { mixBlendMode: 'exclusion' } : undefined}
            >
              <LayoutGrid size={24} />
              Σxecutions
            </Link>

            {/* Unified Navigation Pill */}
            <div className={styles.navControls}>
              <div 
                className={styles.navPill}
                style={!menuOpen ? { mixBlendMode: 'exclusion' } : undefined}
              >
                <div className={styles.desktopNav}>
                  {navigationData.map((item) => (
                    <NavDropdown key={item.path} item={item} />
                  ))}
                </div>
                <div className={styles.pillDivider} />
                <button 
                  className={clsx(styles.menuToggle, menuOpen && styles.menuToggleActive)}
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  <div className={styles.hamWrapper}>
                    <svg className={clsx(styles.ham, styles.hamRotate, styles.ham4, menuOpen && styles.active)} viewBox="0 0 100 100" width="22">
                      <path
                        className={clsx(styles.line, styles.top)}
                        d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
                      />
                      <path
                        className={clsx(styles.line, styles.middle)}
                        d="m 70,50 h -40"
                      />
                      <path
                        className={clsx(styles.line, styles.bottom)}
                        d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
                      />
                    </svg>
                  </div>
                  <span className={styles.toggleText}>{menuOpen ? "CLOSE" : "MENU"}</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <ModalMenu 
        isOpen={menuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setMenuOpen={setMenuOpen}
      />
    </>
  );
}
