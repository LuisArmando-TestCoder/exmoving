"use client";

import { usePricingStore } from "@/store/usePricingStore";
import { Reveal, GlassCard } from "@/components/ui/Common";
import { Calculator, Share2, Check } from "lucide-react";
import { useState } from "react";
import styles from "./Pricing.module.scss";

export const CostCalculator = () => {
  const calculateTotal = usePricingStore((state) => state.calculateTotal);
  const customValues = usePricingStore((state) => state.customValues);
  const [copied, setCopied] = useState(false);
  
  // By passing customValues to calculateTotal, we ensure it's calculated using the latest state
  const total = calculateTotal(customValues);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.search = ""; // Clear existing params
    
    Object.entries(customValues).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.calculatorSection} id="cost-calculator-root">
      <Reveal id="cost-calculator-reveal">
        <GlassCard className={styles.calculatorCard} id="cost-calculator-card">
          <div className={styles.calculatorHeader}>
            <div className={styles.titleWrapper}>
              <Calculator size={32} className="text-gradient" />
              <div>
                <h3>Estimated Monthly Infrastructure</h3>
                <p>Based on your selected configuration</p>
              </div>
            </div>
            
            <div className={styles.totalWrapper}>
              <button 
                className={`${styles.shareButton} ${copied ? styles.copied : ""}`}
                onClick={handleShare}
                title="Share this configuration"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
              </button>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{total.toFixed(2)}</span>
              <span className={styles.period}>/mo</span>
            </div>
          </div>
          
          <div className={styles.calculatorFooter}>
            <p>
              * This is a raw infrastructure estimate. It does not include standard setup fees or our autonomous agent management markup.
            </p>
          </div>
        </GlassCard>
      </Reveal>
    </div>
  );
};
