"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LayoutGrid, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { navigationData, NavItem } from "@/constants/navigation";
import styles from "./Breadcrumbs.module.scss";

function getNavItemByPath(items: NavItem[], path: string): NavItem | null {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = getNavItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.nav
      className={styles.breadcrumbsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      ref={dropdownRef}
    >
      <motion.div className={styles.breadcrumbItem} variants={itemVariants}>
        <Link href="/" className={styles.link}>
          <div className={styles.homeIcon}>
            <LayoutGrid size={12} />
          </div>
          Home
        </Link>
      </motion.div>

      {slug.map((segment, index) => {
        const currentPath = "/" + slug.slice(0, index + 1).join("/");
        const isLast = index === slug.length - 1;
        const navItem = getNavItemByPath(navigationData, currentPath);
        const displayName = navItem ? navItem.name : segment.charAt(0).toUpperCase() + segment.slice(1);
        const hasChildren = navItem?.children && navItem.children.length > 0;

        return (
          <motion.div key={currentPath} className={styles.breadcrumbItem} variants={itemVariants}>
            <span className={styles.separator}>
              <ChevronRight size={12} />
            </span>
            <Link
              href={currentPath}
              className={`${styles.link} ${isLast ? styles.active : ""}`}
            >
              {displayName}
            </Link>
            
            {hasChildren && (
              <>
                <button 
                  className={`${styles.dropdownTrigger} ${openDropdown === currentPath ? styles.active : ""}`}
                  onClick={() => setOpenDropdown(openDropdown === currentPath ? null : currentPath)}
                >
                  <ChevronDown size={12} style={{ transform: openDropdown === currentPath ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
                </button>

                <AnimatePresence>
                  {openDropdown === currentPath && (
                    <motion.div 
                      className={styles.dropdown}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {navItem.children?.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={`${styles.dropdownItem} ${pathname === child.path ? styles.active : ""}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.name}
                          <ArrowRight size={12} className={styles.itemArrow} />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
