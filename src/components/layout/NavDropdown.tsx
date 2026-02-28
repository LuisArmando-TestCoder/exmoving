"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { clsx } from "clsx";
import { NavItem } from "@/constants/navigation";
import styles from "./Header.module.scss";

export const NavDropdown = ({ item }: { item: NavItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [navigationStack, setNavigationStack] = useState<NavItem[]>([item]);

  const currentItem = navigationStack[navigationStack.length - 1];
  const isAtRoot = navigationStack.length === 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setNavigationStack([item]); // Reset on close
    }
  };

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => {
    setIsOpen(false);
    // Optionally reset stack after animation
    setTimeout(() => {
      if (!isOpen) setNavigationStack([item]);
    }, 300);
  };

  const navigateToChild = (child: NavItem, e: React.MouseEvent) => {
    if (child.children && child.children.length > 0) {
      e.preventDefault();
      setNavigationStack([...navigationStack, child]);
    }
  };

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAtRoot) {
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  const jumpTo = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setNavigationStack(navigationStack.slice(0, index + 1));
  };

  return (
    <div 
      className={styles.dropdown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={clsx(styles.link, styles.dropdownToggle)}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.dropdownMainLink}>
          {item.name}
        </span>
        {item.children && (
          <ChevronDown 
            size={14} 
            className={clsx(styles.chevron, isOpen && styles.chevronRotate)} 
            aria-hidden="true"
          />
        )}
      </div>
      
      {item.children ? (
        <div className={clsx(styles.dropdownMenu, isOpen && styles.dropdownMenuVisible)}>
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbContainer}>
            {navigationStack.map((step, idx) => (
              <span key={step.path} className={styles.breadcrumbWrapper}>
                <button 
                  onClick={(e) => jumpTo(idx, e)}
                  className={clsx(
                    styles.breadcrumbLink,
                    idx === navigationStack.length - 1 && styles.breadcrumbActive
                  )}
                >
                  {step.name}
                </button>
                {idx < navigationStack.length - 1 && (
                  <ChevronRight size={10} className={styles.breadcrumbSeparator} />
                )}
              </span>
            ))}
          </div>

          <div className={styles.dropdownContentRelative}>
            {/* Back button if not at root */}
            {!isAtRoot && (
              <button onClick={goBack} className={styles.backButton}>
                <ChevronLeft size={14} /> Back
              </button>
            )}

            <div className={styles.navItemsList}>
              {currentItem.children?.map((child) => (
                <div key={child.path} className={styles.dropdownItemWrapper}>
                  <Link 
                    href={child.path} 
                    className={styles.dropdownItem}
                    onClick={(e) => navigateToChild(child, e)}
                  >
                    {child.name}
                    {child.children && child.children.length > 0 && (
                      <ChevronRight size={14} aria-hidden="true" />
                    )}
                  </Link>
                </div>
              ))}
              
              {/* Option to view the current section page if it's not the root item */}
              {!isAtRoot && (
                <div className={styles.dropdownItemWrapper}>
                  <Link href={currentItem.path} className={clsx(styles.dropdownItem, styles.viewAllLink)}>
                    View all in {currentItem.name}
                    <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={clsx(styles.dropdownMenu, isOpen && styles.dropdownMenuVisible, styles.dropdownMenuSimple)}>
          <Link href={item.path} className={styles.dropdownItem}>
            {item.name}
          </Link>
        </div>
      )}
    </div>
  );
};
