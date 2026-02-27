"use client";

import { usePricingStore, InfrastructureItem } from "@/store/usePricingStore";
import { GlassCard } from "@/components/ui/Common";
import { useEffect } from "react";
import { Check, Info, Zap } from "lucide-react";
import styles from "./Pricing.module.scss";
import { PricingSlider } from "./PricingSlider";

interface CustomPricingCardProps {
  item: InfrastructureItem['subItems'][0];
}

export const CustomPricingCard = ({ item }: CustomPricingCardProps) => {
  const { customValues, setCustomValue } = usePricingStore();
  
  // Initialize default values
  useEffect(() => {
    if (customValues[item.id] === undefined) {
      if (item.pricingType === 'slider' && item.slider) {
        setCustomValue(item.id, item.slider.min);
      } else if (item.pricingType === 'tiers' && item.tiers) {
        setCustomValue(item.id, item.tiers[0].name);
      } else if (item.pricingType === 'mixed' && item.tiers) {
        setCustomValue(item.id, item.tiers[0].name);
      } else if (item.pricingType === 'fixed') {
        setCustomValue(item.id, false);
      }
    }
  }, [item, customValues, setCustomValue]);

  const value = customValues[item.id];

  const calculateItemCost = () => {
    if (item.pricingType === 'slider' && item.slider && typeof value === 'number') {
      return (item.slider.basePrice || 0) + (value * item.slider.multiplier);
    }
    if ((item.pricingType === 'tiers' || item.pricingType === 'mixed') && item.tiers && typeof value === 'string') {
      return item.tiers.find(t => t.name === value)?.price || 0;
    }
    if (item.pricingType === 'fixed' && item.fixedPrice && value === true) {
      return item.fixedPrice;
    }
    return 0;
  };

  return (
    <GlassCard className={styles.customPricingCard}>
      <div className={styles.cardHeader}>
        <div className={styles.titleArea}>
          <h4 className={styles.itemName}>{item.name}</h4>
          {item.hasFreeTier && (
            <span className={styles.freeBadge}>Free Tier</span>
          )}
        </div>
        <div className={styles.itemCost}>
          <span className="text-gradient">${calculateItemCost().toFixed(2)}</span>
          <span className={styles.period}>/mo</span>
        </div>
      </div>
      
      <p className={styles.itemDesc}>{item.description}</p>

      <div className={styles.detailsArea}>
        {item.hasFreeTier && item.freeTierDetails && (
          <div className={styles.detailRow}>
            <Info size={14} className="text-gradient" />
            <span><strong>Free Limits:</strong> {item.freeTierDetails}</span>
          </div>
        )}
        {item.payAsYouGoDetails && (
          <div className={styles.detailRow}>
            <Zap size={14} style={{ color: 'var(--text-dim)' }} />
            <span><strong>PAYG Rates:</strong> {item.payAsYouGoDetails}</span>
          </div>
        )}
      </div>

      <div className={styles.controlArea}>
        {item.pricingType === 'slider' && item.slider && (
          <PricingSlider itemId={item.id} config={item.slider} />
        )}

        {(item.pricingType === 'tiers' || item.pricingType === 'mixed') && item.tiers && (
          <div className={styles.tierControlList}>
            {item.tiers.map((tier) => (
              <button
                key={tier.name}
                className={`${styles.tierButtonCard} ${value === tier.name ? styles.active : ''}`}
                onClick={() => setCustomValue(item.id, tier.name)}
              >
                <div className={styles.tierHeader}>
                  <div className={styles.tierTitleGroup}>
                    <div className={styles.tierName}>{tier.name}</div>
                    {tier.isFree && <span className={styles.miniBadge}>Free</span>}
                  </div>
                  <div className={styles.tierPrice}>${tier.price}</div>
                </div>
                
                {tier.limits && (
                  <div className={styles.tierLimits}>{tier.limits}</div>
                )}

                <ul className={styles.tierFeatures}>
                  {tier.features.map((feature, idx) => (
                    <li key={idx}>
                      <Check size={12} className="text-gradient" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        )}

        {item.pricingType === 'fixed' && item.fixedPrice && (
          <div className={styles.toggleControl}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) => setCustomValue(item.id, e.target.checked)}
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider}></span>
              <span className={styles.toggleText}>Include this add-on (+${item.fixedPrice})</span>
            </label>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
