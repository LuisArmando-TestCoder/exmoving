"use client";

import { useState } from "react";
import { usePricingStore, InfrastructureItem } from "@/store/usePricingStore";
import { Reveal, GlassCard, StaggerContainer } from "@/components/ui/Common";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Pricing.module.scss";
import { Box, Layers, Zap } from "lucide-react";
import { CustomPricingCard } from "./CustomPricingCard";

export const InfrastructureExplorer = () => {
  const { infrastructure } = usePricingStore();
  const [activeTab, setActiveTab] = useState(infrastructure[0].id);

  const activeItem = infrastructure.find((item) => item.id === activeTab);

  return (
    <div className={styles.infraExplorer} id="infra-explorer-root">
      <Reveal id="infra-explorer-header">
        <div className={styles.infraHeader}>
          <h2 className="text-gradient">Infrastructure <span style={{ color: 'var(--text)' }}>Stack.</span></h2>
          <p>Recursive discovery of our vetted API ecosystem.</p>
        </div>
      </Reveal>

      <div className={styles.tabContainer} id="infra-tab-container">
        <div className={styles.tabs} id="infra-tabs">
          {infrastructure.map((item) => (
            <button
              key={item.id}
              className={`${styles.tabButton} ${activeTab === item.id ? styles.active : ""}`}
              onClick={() => setActiveTab(item.id)}
              id={`infra-tab-btn-${item.id}`}
            >
              {item.category}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className={styles.activeIndicator}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={styles.contentArea}
            id={`infra-content-${activeItem.id}`}
          >
            <div className={styles.activeInfo}>
              <div className={styles.infoText}>
                <h3>{activeItem.name}</h3>
                <p>{activeItem.description}</p>
              </div>
            </div>

            <StaggerContainer className={styles.subGrid} id={`infra-subgrid-${activeItem.id}`}>
              {activeItem.subItems.map((subItem, idx) => (
                <Reveal key={subItem.id} delay={idx * 0.05} id={`infra-reveal-${activeItem.id}-${idx}`}>
                  <CustomPricingCard item={subItem} />
                </Reveal>
              ))}
            </StaggerContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
