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
  // Track navigation stack for each top-level tab
  const [navStacks, setNavStacks] = useState<Record<number, NavItem[]>>({});

  // Initialize stacks when navigationData is available
  useEffect(() => {
    const initialStacks: Record<number, NavItem[]> = {};
    navigationData.forEach((item, index) => {
      initialStacks[index] = [item];
    });
    setNavStacks(initialStacks);
  }, []);

  const currentStack = navStacks[activeTab] || (navigationData[activeTab] ? [navigationData[activeTab]] : []);
  const currentItem = currentStack[currentStack.length - 1];
  const isAtRoot = currentStack.length <= 1;

  const navigateToChild = (child: NavItem, e: React.MouseEvent) => {
    if (child.children && child.children.length > 0) {
      e.preventDefault();
      setNavStacks({
        ...navStacks,
        [activeTab]: [...currentStack, child]
      });
    }
  };

  const goBack = () => {
    if (!isAtRoot) {
      setNavStacks({
        ...navStacks,
        [activeTab]: currentStack.slice(0, -1)
      });
    }
  };

  const jumpTo = (index: number) => {
    setNavStacks({
      ...navStacks,
      [activeTab]: currentStack.slice(0, index + 1)
    });
  };

  return (
    <div className={clsx(styles.modalMenu, isOpen && styles.modalMenuVisible)}>
      <div className={styles.modalContent}>
        <div className={styles.modalGrid}>
          <div className={styles.modalNavSection}>
            <div className={styles.navHeader}>
              <div className={styles.breadcrumbContainerModal}>
                {currentStack.map((step, idx) => (
                  <span key={step.path} className={styles.breadcrumbWrapper}>
                    <button 
                      onClick={() => jumpTo(idx)}
                      className={clsx(
                        styles.breadcrumbLinkModal,
                        idx === currentStack.length - 1 && styles.breadcrumbActive
                      )}
                    >
                      {step.name}
                    </button>
                    {idx < currentStack.length - 1 && (
                      <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                    )}
                  </span>
                ))}
              </div>
              <div className={styles.searchContainer}>
                <input type="text" placeholder="Search..." className={styles.searchInput} />
                <div className={styles.searchIcon}><LayoutGrid size={14} /></div>
              </div>
            </div>

            <div className={styles.ultramodernNav}>
              {/* Horizontal scrollable indicators - Only show at root or allow tab switching? 
                  Usually, tabs are top-level categories. */}
              <div className={styles.navTabs}>
                {navigationData.map((item, index) => (
                  <button
                    key={item.path}
                    className={clsx(styles.navTab, activeTab === index && styles.navTabActive)}
                    onClick={() => setActiveTab(index)}
                  >
                    <span className={styles.tabNumber}>0{index + 1}</span>
                    <span className={styles.tabName}>{item.name}</span>
                  </button>
                ))}
              </div>

              <div className={styles.navContentWrapper}>
                <div className={clsx(styles.navPanel, styles.navPanelActive)}>
                  <div className={styles.panelHeader}>
                    {!isAtRoot && (
                      <button onClick={goBack} className={styles.modalBackButton}>
                        <ChevronLeft size={20} /> Back
                      </button>
                    )}
                    <Link
                      href={currentItem.path}
                      className={styles.panelMainLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      {isAtRoot ? `Explore ${currentItem.name}` : currentItem.name}
                      <ArrowUpRight size={24} />
                    </Link>
                  </div>

                  <div className={styles.panelGrid}>
                    {currentItem.children?.map((child) => (
                      <div key={child.path} className={styles.panelGroup}>
                        <Link
                          href={child.path}
                          className={clsx(
                            styles.panelSubLink, 
                            child.children && child.children.length > 0 && styles.panelSubLinkHasChildren
                          )}
                          onClick={(e) => navigateToChild(child, e)}
                        >
                          <span className={styles.childName}>{child.name}</span>
                          {child.children && child.children.length > 0 ? (
                            <ChevronRight size={18} />
                          ) : (
                            <ArrowUpRight size={18} className={styles.hoverArrow} />
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
              <a href="mailto:hello@roadmap.com" className={styles.modalInfoLink}>hello@roadmap.com</a>
            </div>
            
            <div className={styles.modalInfoBlock}>
              <p className={styles.modalLabel}>OFFICE</p>
              <p className={styles.modalInfoText}>123 Innovation Way<br />Tech Valley, CA 94025</p>
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
          <p className={styles.modalCopyright}>© 2026 ROADMAP. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};
