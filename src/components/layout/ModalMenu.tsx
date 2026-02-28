"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  LayoutGrid, 
  ArrowUpRight, 
  ChevronRight, 
  ChevronLeft, 
  Search 
} from "lucide-react";
import { clsx } from "clsx";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { navigationData, NavItem } from "@/constants/navigation";
import { EmailActionButton } from "../ui/EmailActionButton";
import { ExploreSection } from "./ExploreSection";
import styles from "./ModalMenu.module.scss";

interface FlattenedNavItem extends NavItem {
  parentName?: string;
}

interface ModalMenuProps {
  isOpen: boolean;
  activeTab: number;
  setActiveTab: (index: number) => void;
  setMenuOpen: (open: boolean) => void;
}

export const ModalMenu = ({ isOpen, activeTab, setActiveTab, setMenuOpen }: ModalMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Global navigation stack instead of per-tab, starts empty (showing root tabs)
  const [navStack, setNavStack] = useState<NavItem[]>([]);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Flattened navigation for searching
  const flattenedNav = useMemo(() => {
    const items: FlattenedNavItem[] = [];
    const flatten = (navItems: NavItem[], parentName?: string) => {
      navItems.forEach(item => {
        items.push({ ...item, parentName });
        if (item.children) {
          flatten(item.children, item.name);
        }
      });
    };
    flatten(navigationData);
    return items;
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return flattenedNav.filter(item => 
      item.name.toLowerCase().includes(query) || 
      (item.parentName && item.parentName.toLowerCase().includes(query))
    );
  }, [searchQuery, flattenedNav]);

  // When menu closes, you might want to reset the stack
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setNavStack([]);
        setSearchQuery("");
      }, 300);
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
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className={styles.searchInput} 
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className={styles.searchIcon} aria-hidden="true">
                  {searchQuery ? <Search size={14} /> : <LayoutGrid size={14} />}
                </div>
              </div>
            </div>

            <div className={styles.ultramodernNav}>
              <div className={styles.navContentWrapper}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {searchQuery ? (
                    <motion.div
                      key="search-results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={styles.searchResultsPanel}
                    >
                      <div className={styles.resultsHeader}>
                        <p className={styles.modalLabel}>
                          {searchResults.length} {searchResults.length === 1 ? 'RESULT' : 'RESULTS'} FOUND
                        </p>
                      </div>
                      <div className={styles.resultsGrid}>
                        {searchResults.length > 0 ? (
                          searchResults.map((result, idx) => (
                            <motion.div
                              key={result.path}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ 
                                opacity: 1, 
                                x: 0,
                                transition: { 
                                  delay: idx * 0.05,
                                  duration: 0.4,
                                  ease: [0.16, 1, 0.3, 1]
                                }
                              }}
                              viewport={{ once: true }}
                            >
                              <Link
                                href={result.path}
                                className={styles.searchResultItem}
                                onClick={() => setMenuOpen(false)}
                              >
                                <div className={styles.resultInfo}>
                                  <span className={styles.resultName}>{result.name}</span>
                                  {result.parentName && (
                                    <span className={styles.resultParent}>{result.parentName}</span>
                                  )}
                                </div>
                                <ArrowUpRight size={18} />
                              </Link>
                            </motion.div>
                          ))
                        ) : (
                          <p className={styles.noResults}>No matches found for "{searchQuery}"</p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
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
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className={styles.modalInfoSection}>
            <ExploreSection onItemClick={() => setMenuOpen(false)} />

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
            <a href="https://x.com/LuisArmand82485" className={styles.modalSocialLink}>TWITTER</a>
            <a href="https://www.linkedin.com/in/luis-armando-murillo-4434a3173/" className={styles.modalSocialLink}>LINKEDIN</a>
            <a href="https://www.instagram.com/aiexecutions" className={styles.modalSocialLink}>INSTAGRAM</a>
          </div>
          <p className={styles.modalCopyright}>© 2026 Σxecutions. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};
