"use client";

import { CheckCircle2, TrendingUp, BarChart, Settings } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./MarginEngine.module.scss";
import { Reveal } from "../ui/Common";
import Link from "next/link";

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
            <div className={styles.chartPlaceholder}>
              <BarChart size={120} strokeWidth={1} style={{ opacity: 0.2 }} />
              <div style={{ position: 'absolute', top: '20%', right: '20%' }}>
                <TrendingUp size={48} color="#10b981" />
              </div>
              <div style={{ position: 'absolute', bottom: '20%', left: '20%' }}>
                <Settings size={32} style={{ animation: isInView ? 'spin 10s linear infinite' : 'none' }} />
              </div>
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
