"use client";

import { usePricingStore, SliderConfig } from "@/store/usePricingStore";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import styles from "./Pricing.module.scss";

interface PricingSliderProps {
  itemId: string;
  config: SliderConfig;
}

export const PricingSlider = ({ itemId, config }: PricingSliderProps) => {
  const { customValues, setCustomValue } = usePricingStore();
  const value = customValues[itemId];
  const currentValue = typeof value === 'number' ? value : config.min;
  
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((currentValue - config.min) / (config.max - config.min)) * 100;

  const renderBATranslation = () => {
    if (!config.baTranslation) return null;

    const ba = config.baTranslation;
    const humanValue = (currentValue * ba.multiplier).toLocaleString(undefined, { maximumFractionDigits: 1 });
    const roiValue = (currentValue * ba.roiMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 });

    return (
      <motion.div 
        className={styles.baTranslationContainer}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.baStep}>
          <div className={styles.baValue}>{humanValue}</div>
          <div className={styles.baLabel}>{ba.humanUnit}</div>
        </div>
        
        <div className={styles.baDivider}>
          <motion.div 
            className={styles.baLine}
            animate={{ scaleX: isDragging ? 1.2 : 1 }}
          />
          <ArrowRight size={14} className={styles.baArrow} />
        </div>

        <div className={styles.baStep}>
          <div className={styles.baValueHighlight}>
            <Sparkles size={12} className={styles.sparkle} />
            {roiValue}
          </div>
          <div className={styles.baLabel}>{ba.roiUnit}</div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={styles.sliderControlWrapper} id={`slider-${itemId}`}>
      <div className={styles.sliderHeader}>
        <span className={styles.label}>Computational Load</span>
        <motion.span 
          className={styles.valueBadge}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          {currentValue.toLocaleString()} {config.unit}
        </motion.span>
      </div>

      <div className={styles.interactiveTrack}>
        <div 
          className={styles.trackProgress} 
          style={{ width: `${percentage}%` }} 
        />
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={currentValue}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={(e) => setCustomValue(itemId, Number(e.target.value))}
          className={styles.ultraRangeInput}
        />
        <motion.div 
          className={styles.customThumb}
          style={{ left: `${percentage}%` }}
          animate={{ 
            scale: isDragging ? 1.5 : 1,
            boxShadow: isDragging ? "0 0 20px rgba(var(--primary-rgb), 0.5)" : "0 0 0px rgba(var(--primary-rgb), 0)"
          }}
        />
      </div>

      <div className={styles.sliderScale}>
        <span className={styles.scalePoint}>Min: {config.min}</span>
        <span className={styles.scalePoint}>Max: {config.max}+</span>
      </div>
      
      {renderBATranslation()}
    </div>
  );
};
