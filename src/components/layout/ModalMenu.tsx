"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react";
import { clsx } from "clsx";
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
      setNavStack([...navStack, child]);
    } else {
      // If it's a leaf node, let the Link handle navigation but close the menu
      setMenuOpen(false);
    }
  };

  const goBack = () => {
    setNavStack(navStack.slice(0, -1));
  };

  const jumpTo = (index: number) => {
    if (index === -1) {
      setNavStack([]);
    } else {
      setNavStack(navStack.slice(0, index + 1));
    }
  };

  return (
    <div 
      className={clsx(styles.modalMenu, isOpen && styles.modalMenuVisible)} 
      aria-hidden={!isOpen}
      style={mounted ? { pointerEvents: isOpen ? 'auto' : 'none' } : {}}
    >
      <div className={styles.modalContent}>
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
                <div className={clsx(styles.navPanel, styles.navPanelActive)}>
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
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalInfoSection}>
            <div className={styles.modalInfoBlock}>
              <p className={styles.modalLabel}>CONTACT</p>
              <a href="mailto:hello@roadmap.com" className={styles.modalInfoLink}>info@aiexecutions.com</a>
            </div>
            
            {/* <div className={styles.modalInfoBlock}>
              <p className={styles.modalLabel}>OFFICE</p>
              <p className={styles.modalInfoText}>123 Innovation Way<br />Tech Valley, CA 94025</p>
            </div> */}

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
          <p className={styles.modalCopyright}>© 2026 ROADMAP. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};
