"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { navigationData, NavItem } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ChevronRight, LayoutGrid, Zap, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import styles from "./ProceduralTemplate.module.scss";

function findNavItemByPath(items: NavItem[], path: string): NavItem | null {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = findNavItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

export default function ProceduralTemplate() {
  const pathname = usePathname();
  const item = findNavItemByPath(navigationData, pathname);
  const slug = pathname.split("/").filter(Boolean);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-400 mb-8">Page not found in the roadmap.</p>
          <Link href="/" className={`${styles.btn} ${styles.btnPrimary}`}>Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.proceduralTemplate} selection:bg-blue-500/30`}>
      <Header />
      
      {/* Background Decor */}
      <div className={styles.bgDecor}>
        <div className={styles.glowTop} />
        <div className={styles.glowBottom} />
        <div className={styles.noise} />
      </div>

      <main className={`${styles.main} container mx-auto px-4`}>
        <Breadcrumbs />

        {/* Header Section */}
        <div className={styles.headerSection}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.badge}
          >
            <Zap size={12} className="mr-2" />
            Roadmap Component
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.title}
          >
            {item.name}<span>.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.description}
          >
            Deploying ROI-driven scaling solutions for {item.name.toLowerCase()} in industries technically left behind. 
            Automating operational friction into measurable returns.
          </motion.p>
        </div>

        {/* Interactive Explorer */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.explorer}
        >
          <div className={styles.explorerGlow} />
          
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder={`Search ${item.name.toLowerCase()} components...`}
              />
            </div>
            <div className={styles.filterActions}>
              <div className={styles.filterButton}>
                <Filter size={16} className="mr-2" />
                Sort: <span>Priority</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.viewToggle}>
                <span>View:</span>
                <button className={styles.active}>Grid</button>
                <button>List</button>
              </div>
            </div>
          </div>

          {item.children && item.children.length > 0 ? (
            <>
              <div className={styles.grid}>
                {item.children.map((child, idx) => (
                  <Link 
                    key={child.path} 
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
                ))}
              </div>
              
              <div className={styles.pagination}>
                <span className={styles.info}>
                  Showing <span>{item.children.length}</span> results
                </span>
                <div className={styles.buttons}>
                  <button className={styles.navButton} disabled>
                    <ArrowLeft size={20} />
                  </button>
                  <div className={styles.pageNumbers}>
                    <button className={styles.pageNumber}>1</button>
                  </div>
                  <button className={styles.navButton}>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
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

        {/* Value Prop Details */}
        <div className={styles.valueProp}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={styles.content}
          >
            <h2>
              Value Proposition for <span>{item.name}</span>
            </h2>
            <p>
              We believe in expanding and enhancing people by supercharging them. Our ROI-driven approach ensures 
              that every tool is customized to the client's needs without liquidity race conditions.
            </p>
            <div className={styles.features}>
              {[
                "Self-supervising ROI systems",
                "Non-agnostic source automation",
                "Zero liquidity compromise",
                "Custom LLM & Server stacking"
              ].map((feature, i) => (
                <div key={i} className={styles.feature}>
                  <div className={styles.icon}>
                    <ChevronRight size={14} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={styles.gridCards}
          >
            <div className={styles.propCard}>
              <div className={`${styles.icon} ${styles.blue}`}>
                <Zap size={24} />
              </div>
              <h4>ROI Efficiency</h4>
              <p>
                Converting operational friction into measurable returns with autonomous metrics.
              </p>
            </div>
            <div className={styles.propCard}>
              <div className={`${styles.icon} ${styles.purple}`}>
                <LayoutGrid size={24} />
              </div>
              <h4>Metric Scaling</h4>
              <p>
                Recording key performance indicators without human supervision.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
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
