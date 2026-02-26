"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react";
import { clsx } from "clsx";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { navigationData, NavItem } from "@/constants/navigation";
import { EmailActionButton } from "../ui/EmailActionButton";
import styles from "./Header.module.scss";

interface ModalMenuProps {
  isOpen: boolean;
  activeTab: number;
  setActiveTab: (index: number) => void;
  setMenuOpen: (open: boolean) => void;
}

export const ModalMenu = ({ isOpen, activeTab, setActiveTab, setMenuOpen }: ModalMenuProps) => {
  const [mounted, setMounted] = useState(false);
  // Global navigation stack instead of per-tab, starts empty (showing root tabs)
  const [navStack, setNavStack] = useState<NavItem[]>([]);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // When menu closes, you might want to reset the stack
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setNavStack([]), 300);
    }
  }, [isOpen]);

  // Derived state
  const isAtRoot = navStack.length === 0;
  const currentItem = isAtRoot ? null : navStack[navStack.length - 1];
  
  // The items to show in the list
  const currentList = isAtRoot ? navigationData : currentItem?.children || [];

  const navigateToChild = (child: NavItem, e: React.MouseEvent) => {
    if (child.children && child.children.length > 0) {
      e.preventDefault();
      setDirection(1);
      setNavStack([...navStack, child]);
    } else {
      // If it's a leaf node, let the Link handle navigation but close the menu
      setMenuOpen(false);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setNavStack(navStack.slice(0, -1));
  };

  const jumpTo = (index: number) => {
    setDirection(-1);
    if (index === -1) {
      setNavStack([]);
    } else {
      setNavStack(navStack.slice(0, index + 1));
    }
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      position: 'absolute',
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative',
      transition: {
        x: { type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      position: 'absolute',
      transition: {
        x: { type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <div 
      className={clsx(styles.modalMenu, isOpen && styles.modalMenuVisible)} 
      aria-hidden={!isOpen}
      style={mounted ? { pointerEvents: isOpen ? 'auto' : 'none' } : {}}
    >
      <div className={styles.modalContent}>
        <button 
          className={styles.modalCloseButton} 
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <LayoutGrid size={24} />
        </button>
        <div className={styles.modalGrid}>
          <div className={styles.modalNavSection}>
            <div className={styles.navHeader}>
              <div className={styles.breadcrumbContainerModal} role="navigation" aria-label="Breadcrumb">
                <span className={styles.breadcrumbWrapper}>
                  <button 
                    onClick={() => jumpTo(-1)}
                    className={clsx(
                      styles.breadcrumbLinkModal,
                      isAtRoot && styles.breadcrumbActive
                    )}
                    aria-current={isAtRoot ? "page" : undefined}
                  >
                    MENU
                  </button>
                  {!isAtRoot && (
                    <ChevronRight size={14} className={styles.breadcrumbSeparator} aria-hidden="true" />
                  )}
                </span>
                
                {navStack.map((step, idx) => (
                  <span key={step.path} className={styles.breadcrumbWrapper}>
                    <button 
                      onClick={() => jumpTo(idx)}
                      className={clsx(
                        styles.breadcrumbLinkModal,
                        idx === navStack.length - 1 && styles.breadcrumbActive
                      )}
                      aria-current={idx === navStack.length - 1 ? "page" : undefined}
                    >
                      {step.name}
                    </button>
                    {idx < navStack.length - 1 && (
                      <ChevronRight size={14} className={styles.breadcrumbSeparator} aria-hidden="true" />
                    )}
                  </span>
                ))}
              </div>
              
              <div className={styles.searchContainer}>
                <input type="text" placeholder="Search..." className={styles.searchInput} aria-label="Search" />
                <div className={styles.searchIcon} aria-hidden="true"><LayoutGrid size={14} /></div>
              </div>
            </div>

            <div className={styles.ultramodernNav}>
              <div className={styles.navContentWrapper}>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={navStack.length}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={clsx(styles.navPanel, styles.navPanelActive)}
                    style={{ width: '100%' }}
                  >
                    <div className={styles.panelHeader}>
                      {!isAtRoot && (
                        <button 
                          onClick={goBack} 
                          className={styles.modalBackButton}
                          aria-label="Go back"
                        >
                          <ChevronLeft size={20} aria-hidden="true" /> Back
                        </button>
                      )}
                      <Link
                        href={isAtRoot ? "/" : currentItem!.path}
                        className={styles.panelMainLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        {isAtRoot ? `Explore Everything` : `Explore ${currentItem!.name}`}
                        <ArrowUpRight size={24} aria-hidden="true" />
                      </Link>
                    </div>

                    <div className={styles.panelGrid}>
                      {currentList.map((child) => (
                        <div key={child.path} className={styles.panelGroup}>
                          <Link
                            href={child.path}
                            className={clsx(
                              styles.panelSubLink, 
                              child.children && child.children.length > 0 && styles.panelSubLinkHasChildren
                            )}
                            onClick={(e) => navigateToChild(child, e)}
                            aria-haspopup={child.children && child.children.length > 0 ? "true" : "false"}
                          >
                            <span className={styles.childName}>{child.name}</span>
                            {child.children && child.children.length > 0 ? (
                              <ChevronRight size={18} aria-hidden="true" />
                            ) : (
                              <ArrowUpRight size={18} className={styles.hoverArrow} aria-hidden="true" />
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className={styles.modalInfoSection}>
            <div className={styles.modalInfoBlock}>
              <p className={styles.modalLabel}>EXPLORE</p>
              <nav className={styles.modalSecondaryNav}>
                <Link href="/about" className={styles.modalInfoLink} onClick={() => setMenuOpen(false)}>About</Link>
                <Link href="/pricing" className={styles.modalInfoLink} onClick={() => setMenuOpen(false)}>Pricing</Link>
                <Link href="/contact" className={styles.modalInfoLink} onClick={() => setMenuOpen(false)}>Contact</Link>
              </nav>
            </div>

            <div className={styles.modalInfoBlock}>
              <p className={styles.modalLabel}>GET IN TOUCH</p>
              <a href="mailto:info@aiexecutions.com" className={styles.modalInfoLink}>info@aiexecutions.com</a>
            </div>

            <div className={styles.modalActions}>
              <EmailActionButton 
                label="REQUEST FREE DEMO" 
                subject="Modal Menu Demo Request"
                className={styles.modalDemoButton}
              />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.modalSocials}>
            <a href="#" className={styles.modalSocialLink}>TWITTER</a>
            <a href="#" className={styles.modalSocialLink}>LINKEDIN</a>
            <a href="#" className={styles.modalSocialLink}>INSTAGRAM</a>
          </div>
          <p className={styles.modalCopyright}>© 2026 Σxecutions. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};
