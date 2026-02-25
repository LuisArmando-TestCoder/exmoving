import { motion } from "framer-motion";
import { ChevronRight, Zap, LayoutGrid } from "lucide-react";
import styles from "./ValueProposition.module.scss";

interface ValuePropositionProps {
  itemName: string;
}

export default function ValueProposition({ itemName }: ValuePropositionProps) {
  return (
    <div className={styles.valueProp}>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={styles.content}
      >
        <h2>
          Value Proposition for <span>{itemName}</span>
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
  );
}
