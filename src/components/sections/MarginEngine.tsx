"use client";

import { CheckCircle2, TrendingUp, BarChart, Settings } from "lucide-react";
import styles from "./MarginEngine.module.scss";
import { Reveal } from "../ui/Common";

export default function MarginEngine() {
  return (
    <section id="margin-engine" className={`${styles.marginEngine} section`}>
      <div className="container">
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

            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn--primary">
                See Pricing Model
              </button>
            </div>
          </Reveal>

          <Reveal direction="right" className={styles.visual}>
            <div className={styles.chartPlaceholder}>
              <BarChart size={120} strokeWidth={1} style={{ opacity: 0.2 }} />
              <div style={{ position: 'absolute', top: '20%', right: '20%' }}>
                <TrendingUp size={48} color="#10b981" />
              </div>
              <div style={{ position: 'absolute', bottom: '20%', left: '20%' }}>
                <Settings size={32} style={{ animation: 'spin 10s linear infinite' }} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
