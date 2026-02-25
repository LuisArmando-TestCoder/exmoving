"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, LayoutGrid, ChevronDown } from "lucide-react";
import styles from "./Header.module.scss";
import { clsx } from "clsx";
import { navigationData, NavItem } from "@/constants/navigation";

const NavDropdown = ({ item }: { item: NavItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={styles.dropdown}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link 
        href={item.path} 
        className={clsx(styles.link, styles.dropdownToggle)}
      >
        {item.name}
        {item.children && <ChevronDown size={14} className={clsx(styles.chevron, isOpen && styles.chevronRotate)} />}
      </Link>
      
      {item.children && isOpen && (
        <div className={styles.dropdownMenu}>
          {item.children.map((child) => (
            <div key={child.path} className={styles.dropdownItemWrapper}>
              <Link href={child.path} className={styles.dropdownItem}>
                {child.name}
                {child.children && <ChevronRight size={14} />}
              </Link>
              {child.children && (
                <div className={styles.dropdownSubmenu}>
                  {child.children.map((subChild) => (
                    <div key={subChild.path} className={styles.dropdownItemWrapper}>
                      <Link href={subChild.path} className={styles.dropdownItem}>
                        {subChild.name}
                        {subChild.children && <ChevronRight size={14} />}
                      </Link>
                      {subChild.children && (
                        <div className={styles.dropdownSubmenu}>
                          {subChild.children.map((leaf) => (
                            <Link key={leaf.path} href={leaf.path} className={styles.dropdownItem}>
                              {leaf.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
            {navigationData.map((item) => (
              <NavDropdown key={item.path} item={item} />
            ))}
          </div>

          <div className={styles.actions}>
            <button className="btn btn--primary">
              Request Free Demo <ChevronRight size={16} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
