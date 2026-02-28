"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Info, 
  CircleDollarSign, 
  BookOpen, 
  Mail, 
  ShieldCheck, 
  FileText,
  ArrowUpRight 
} from "lucide-react";
import { exploreData } from "@/constants/navigation";
import styles from "./ExploreSection.module.scss";

const iconMap = {
  about: Info,
  pricing: CircleDollarSign,
  "case-studies": BookOpen,
  contact: Mail,
  privacy: ShieldCheck,
  terms: FileText,
};

interface ExploreSectionProps {
  onItemClick?: () => void;
}

export const ExploreSection = ({ onItemClick }: ExploreSectionProps) => {
  return (
    <section 
      className={styles.exploreSection} 
      id="layout-explore-section"
      aria-labelledby="layout-explore-section-title"
    >
      <header className={styles.header}>
        <p className={styles.label} id="layout-explore-section-title">EXPLORE</p>
        <div className={styles.scrollIndicator} aria-hidden="true" />
      </header>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {exploreData.map((item, idx) => {
            const Icon = iconMap[item.id as keyof typeof iconMap] || Info;
            const itemId = `layout-explore-section-card-${item.id}`;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: idx * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }}
                viewport={{ once: true, margin: "-50px" }}
                className={styles.cardWrapper}
              >
                <Link
                  href={item.path}
                  id={itemId}
                  className={styles.card}
                  onClick={onItemClick}
                  aria-label={`Explore ${item.name}`}
                >
                  <div className={styles.iconBox} id={`${itemId}-icon`}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  
                  <div className={styles.content}>
                    <span className={styles.name} id={`${itemId}-name`}>
                      {item.name}
                    </span>
                    <p className={styles.description} id={`${itemId}-desc`}>
                      Deep dive into our {item.name.toLowerCase()}
                    </p>
                  </div>

                  <div className={styles.arrowBox} id={`${itemId}-arrow`}>
                    <ArrowUpRight size={16} />
                  </div>

                  {/* Aesthetic decorative element */}
                  <div className={styles.cardBg} aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
