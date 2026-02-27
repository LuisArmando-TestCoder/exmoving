"use client";

import { usePricingStore } from "@/store/usePricingStore";
import { Reveal, GlassCard } from "@/components/ui/Common";
import { Calculator } from "lucide-react";
import styles from "./Pricing.module.scss";

export const CostCalculator = () => {
  const calculateTotal = usePricingStore((state) => state.calculateTotal);
  const customValues = usePricingStore((state) => state.customValues);
  
  // By passing customValues to calculateTotal, we ensure it's calculated using the latest state
  const total = calculateTotal(customValues);

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
