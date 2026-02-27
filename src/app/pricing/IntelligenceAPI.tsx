"use client";

import { usePricingStore } from "@/store/usePricingStore";
import { Reveal, GlassCard } from "@/components/ui/Common";
import { Cpu } from "lucide-react";
import styles from "@/app/pricing/Pricing.module.scss";

interface IntelligenceAPIProps {
  id: string;
}

export const IntelligenceAPI = ({ id }: IntelligenceAPIProps) => {
  const api = usePricingStore((state) => 
    state.apiPrices.find((p) => p.id === id)
  );

  if (!api) return null;

  return (
    <Reveal>
      <GlassCard className={styles.card} id={`pricing-api-${api.id}`}>
        <div className={styles.cardTitle}>
          <Cpu size={24} className="text-gradient" />
          {api.provider} ({api.name.split(' ')[0]})
        </div>
        <p className={styles.cardDesc}>
          {api.intelligence} intelligence tier. Optimized for {api.isGenerative ? 'generative' : 'processing'} workflows.
        </p>
        <div className={styles.priceList}>
          <div className={styles.priceItem}>
            <span className={styles.label}>Input (per 1M)</span>
            <span className={styles.value}>${api.inputPrice.toFixed(2)}</span>
          </div>
          <div className={styles.priceItem}>
            <span className={styles.label}>Output (per 1M)</span>
            <span className={styles.value}>${api.outputPrice.toFixed(2)}</span>
          </div>
        </div>
      </GlassCard>
    </Reveal>
  );
};
