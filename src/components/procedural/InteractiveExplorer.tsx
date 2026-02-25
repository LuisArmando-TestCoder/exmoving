"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, List, Grid, SlidersHorizontal, ChevronRight, Zap, ArrowLeft, ArrowRight } from "lucide-react";
import { NavItem } from "@/constants/navigation";
import styles from "./InteractiveExplorer.module.scss";

interface InteractiveExplorerProps {
  itemName: string;
  childrenNodes: NavItem[];
}

export default function InteractiveExplorer({ itemName, childrenNodes }: InteractiveExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredChildren = useMemo(() => {
    return childrenNodes.filter(child => {
      return child.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [childrenNodes, searchQuery]);

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);
  
  // Reset to page 1 when searching
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedChildren = useMemo(() => {
    return filteredChildren.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredChildren, currentPage]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={styles.explorer}
    >
      <div className={styles.explorerGlow} />
      
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIconWrapper}>
            <Search className={styles.searchIcon} size={18} />
          </div>
          <input 
            type="text" 
            placeholder={`Search ${itemName.toLowerCase()}...`}
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.searchShortcut}>
            <kbd>⌘</kbd> <kbd>K</kbd>
          </div>
        </div>
        
        <div className={styles.filterActions}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={styles.filterButton}
          >
            <SlidersHorizontal size={16} className="mr-2" />
            <span>Filters</span>
            <div className={styles.filterCount}>0</div>
          </motion.button>
          
          <div className={styles.divider} />
          
          <div className={styles.viewToggle}>
            <motion.div 
              className={styles.viewToggleBg}
              animate={{ 
                x: viewMode === "grid" ? "100%" : "0%",
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                x: { type: "spring", stiffness: 350, damping: 35 },
                scale: { duration: 0.3 }
              }}
            />
            <button 
              className={`${styles.viewBtn} ${viewMode === "list" ? styles.active : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
            <button 
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.active : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>


      {filteredChildren.length > 0 ? (
        <>
          <div className={viewMode === "grid" ? styles.grid : styles.listView}>
            <AnimatePresence mode="popLayout">
              {paginatedChildren.map((child) => (
                <motion.div
                  key={child.path}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={child.path}
                    className={styles.card}
                  >
                    <div className={styles.cardArrow}>
                      <ArrowUpRight size={20} />
                    </div>
                    <div className={styles.cardIcon}>
                      <Zap size={24} />
                    </div>
                    <h3 className={styles.cardTitle}>
                      {child.name}
                    </h3>
                    <p className={styles.cardDescription}>
                      Custom automation for {child.name.toLowerCase()} designed to expand and enhance human capacity.
                    </p>
                    <div className={styles.cardAction}>
                      Access Node <ChevronRight size={14} className="ml-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredChildren.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={styles.pagination}
            >
              <div className={styles.paginationInfo}>
                <div className={styles.pulse} />
                <span>
                  SYSTEM_NODE: <b>{filteredChildren.length}</b> {filteredChildren.length === 1 ? 'UNIT' : 'UNITS'} 
                  {totalPages > 1 && <> // PAGE <b>{currentPage}</b> OF <b>{totalPages}</b></>}
                </span>
              </div>
              
              {totalPages > 1 && (
                <div className={styles.paginationControls}>
                  <motion.button 
                    whileHover={{ scale: 1.05, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.navButton} 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft size={18} />
                  </motion.button>
                  
                  <div className={styles.pageNumbers}>
                    {getPageNumbers().map((page, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={page !== "..." ? { scale: 1.1, y: -2 } : {}}
                        whileTap={page !== "..." ? { scale: 0.9 } : {}}
                        className={`${styles.pageBtn} ${currentPage === page ? styles.active : ""} ${page === "..." ? styles.ellipsis : ""}`}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        disabled={page === "..."}
                      >
                        <span className={styles.btnText}>
                          {typeof page === 'number' ? page.toString().padStart(2, '0') : page}
                        </span>
                        {currentPage === page && (
                          <motion.div 
                            layoutId="activePage"
                            className={styles.activeIndicator}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.navButton}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Zap size={40} />
          </div>
          <h3>Terminal Scaling Node</h3>
          <p>
            This process has reached its final form. No further children nodes required for deployment.
          </p>
        </div>
      )}
    </motion.div>
  );
}

function ArrowUpRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
