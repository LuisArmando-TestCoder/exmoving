import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { 
  Zap, 
  LayoutGrid, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  Layers 
} from "lucide-react";
import styles from "./ValueProposition.module.scss";

interface ValuePropositionProps {
  itemName: string;
}

export default function ValueProposition({ itemName }: ValuePropositionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // These transforms map scroll position to animation values
  // By using the containerRef as target, they only change when the section is in/moving through the viewport
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0.95, 1, 0.95]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const shouldReduceMotion = useReducedMotion();

  const features = [
    { text: "Self-supervising ROI systems", icon: <Cpu size={16} /> },
    { text: "Non-agnostic source automation", icon: <Layers size={16} /> },
    { text: "Zero liquidity compromise", icon: <ShieldCheck size={16} /> },
    { text: "Custom LLM & Server stacking", icon: <BarChart3 size={16} /> }
  ];

  return (
    <section ref={containerRef} className={styles.valuePropWrapper}>
      <motion.div 
        style={{ scale: springScale, rotateX: rotate }}
        className={styles.valueProp}
      >
        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={styles.textBlock}
          >
            <h2 className={styles.title}>
              Architecting Value for <br />
              <span className={styles.gradientText}>{itemName}</span>
            </h2>
            <p className={styles.description}>
              We believe in expanding and enhancing people by supercharging them. Our ROI-driven approach ensures 
              that every tool is customized to the client's needs without liquidity race conditions.
            </p>
            
            <div className={styles.featuresList}>
              {features.map((feature, i) => (
                <div 
                  key={i} 
                  className={styles.featureItem}
                >
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.1 * i }}
                  >
                    <div className={styles.featureIcon}>
                      {feature.icon}
                    </div>
                    <span>{feature.text}</span>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <div className={styles.visuals}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "circOut" }}
            className={styles.gridCards}
          >
            <div className={styles.glassCard}>
              <div className={`${styles.cardIcon} ${styles.blue}`}>
                <Zap size={28} />
              </div>
              <h4>ROI Efficiency</h4>
              <p>
                Converting operational friction into measurable returns with autonomous metrics.
              </p>
              <div className={styles.cardGlow} />
            </div>

            <div className={styles.glassCard}>
              <div className={`${styles.cardIcon} ${styles.purple}`}>
                <LayoutGrid size={28} />
              </div>
              <h4>Metric Scaling</h4>
              <p>
                Recording key performance indicators without human supervision.
              </p>
              <div className={styles.cardGlow} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
