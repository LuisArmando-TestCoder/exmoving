"use client";

import { CheckCircle2, TrendingUp, BarChart, Settings, Database, Cloud, Zap, Globe } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./MarginEngine.module.scss";
import { Reveal } from "../ui/Common";
import Link from "next/link";

const CostRow = ({ icon: Icon, label, value, scrollYProgress, index, shouldReduceMotion }: any) => {
  const yRaw = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);
  const y = shouldReduceMotion ? yRaw : useSpring(yRaw, { stiffness: 100, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0.3 + (index * 0.05), 0.5 + (index * 0.05)], [0, 1]);
  const widthRaw = useTransform(scrollYProgress, [0.4 + (index * 0.05), 0.7], ["0%", "100%"]);
  const width = shouldReduceMotion ? widthRaw : useSpring(widthRaw, { stiffness: 60, damping: 15 });

  return (
    <motion.div 
      className={styles.costRow} 
      style={{ y, opacity, willChange: "transform, opacity" }}
    >
      <div className={styles.costInfo}>
        <div className={styles.costIcon}><Icon size={16} /></div>
        <span className={styles.costLabel}>{label}</span>
      </div>
      <div className={styles.costTrack}>
        <motion.div className={styles.costFill} style={{ width, willChange: "width" }} />
      </div>
      <span className={styles.costValue}>{value}</span>
    </motion.div>
  );
};

export default function MarginEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "200px" });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y = shouldReduceMotion ? yRaw : useSpring(yRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const revenueAmountScaleRaw = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);
  const revenueAmountScale = useSpring(revenueAmountScaleRaw, { stiffness: 200, damping: 15 });

  const marginResultOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const marginResultYRaw = useTransform(scrollYProgress, [0.6, 0.8], [20, 0]);
  const marginResultY = useSpring(marginResultYRaw, { stiffness: 100, damping: 20 });

  return (
    <section id="margin-engine" ref={containerRef} className={`${styles.marginEngine} section`}>
      <motion.div 
        className="container"
        style={{ y: isInView ? y : 0, scale: isInView ? scale : 1, willChange: "transform" }}
      >
        <div className={styles.grid}>
          <Reveal direction="left" className={styles.content}>
            <span className={styles.label}>Pricing Agent Deployment</span>
            <h2 className={styles.title}>
              Recover <span className="text-gradient">Lost Liquidity</span> in Real-Time.
            </h2>
            <p className={styles.description}>
              Avoid value proposition erosion with ROI-driven scaling terms. Our agent handles thousands of requests without compromising your liquidity.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <CheckCircle2 size={20} />
                <span>Self-hosted GPUs (0.02x cost)</span>
              </div>
              <div className={styles.feature}>
                <CheckCircle2 size={20} />
                <span>Gemini Flash Implementation</span>
              </div>
              <div className={styles.feature}>
                <CheckCircle2 size={20} />
                <span>Zero Supervision Required</span>
              </div>
            </div>

            <div className={styles.cta}>
              <Link href="/pricing" className={styles.pricingButton}>
                <span className={styles.pricingText}>See Pricing Model</span>
                <div className={styles.pricingIcon}>
                  <TrendingUp size={16} />
                </div>
              </Link>
            </div>
          </Reveal>

          <Reveal direction="right" className={styles.visual}>
            <div className={styles.marginVisualizer}>
              <div className={styles.revenueHeader}>
                <span className={styles.revenueTitle}>Automation Sale</span>
                <motion.span 
                  className={styles.revenueAmount}
                  style={{ 
                    scale: isInView ? revenueAmountScale : 1,
                    color: "var(--color-primary)",
                    willChange: "transform"
                  }}
                >
                  $10,000
                </motion.span>
              </div>

              <div className={styles.costBreakdown}>
                <h4 className={styles.costTitle}>Estimated Monthly Operational Costs</h4>
                
                <CostRow 
                  icon={Cloud} 
                  label="Server (Render)" 
                  value="~$7.00" 
                  index={0} 
                  scrollYProgress={scrollYProgress} 
                  shouldReduceMotion={shouldReduceMotion} 
                />
                <CostRow 
                  icon={Database} 
                  label="Typesense Indexing" 
                  value="~$21.60" 
                  index={1} 
                  scrollYProgress={scrollYProgress} 
                  shouldReduceMotion={shouldReduceMotion} 
                />
                <CostRow 
                  icon={Zap} 
                  label="LLM API (Gemini Flash)" 
                  value="Free / < $300" 
                  index={2} 
                  scrollYProgress={scrollYProgress} 
                  shouldReduceMotion={shouldReduceMotion} 
                />
                <CostRow 
                  icon={Globe} 
                  label="Domain Cost (Monthly Avg)" 
                  value="~$1.66" 
                  index={3} 
                  scrollYProgress={scrollYProgress} 
                  shouldReduceMotion={shouldReduceMotion} 
                />
              </div>

              <motion.div 
                className={styles.marginResult}
                style={{
                  opacity: isInView ? marginResultOpacity : 0,
                  y: isInView ? marginResultY : 20,
                  willChange: "transform, opacity"
                }}
              >
                <div className={styles.marginLabel}>Net Profit Margin</div>
                <div className={styles.marginPercentage}>~96.7%</div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </motion.div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
