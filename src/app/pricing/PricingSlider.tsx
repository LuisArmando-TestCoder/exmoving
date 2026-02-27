"use client";

import { usePricingStore, SliderConfig } from "@/store/usePricingStore";
import { ArrowRight, Sparkles, Activity } from "lucide-react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import styles from "./Pricing.module.scss";
import { Reveal } from "@/components/ui/Reveal";

interface PricingSliderProps {
  itemId: string;
  config: SliderConfig;
}

export const PricingSlider = ({ itemId, config }: PricingSliderProps) => {
  const { customValues, setCustomValue } = usePricingStore();
  const value = customValues[itemId];
  const currentValue = typeof value === "number" ? value : config.min;

  const [isDragging, setIsDragging] = useState(false);
  const percentage =
    ((currentValue - config.min) / (config.max - config.min)) * 100;

  // Spring animation for smooth UI feedback
  const springValue = useSpring(currentValue, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  useEffect(() => {
    springValue.set(currentValue);
  }, [currentValue, springValue]);

  const renderBATranslation = () => {
    if (!config.baTranslation) return null;

    const ba = config.baTranslation;
    const humanValue = (currentValue * ba.multiplier).toLocaleString(
      undefined,
      { maximumFractionDigits: 1 }
    );
    const roiValue = (currentValue * ba.roiMultiplier).toLocaleString(
      undefined,
      { maximumFractionDigits: 0 }
    );

    return (
      <motion.div
        className={styles.baTranslationContainer}
        layout
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.baStep}>
          <motion.div className={styles.baValue} layout="position">
            {humanValue}
          </motion.div>
          <div className={styles.baLabel}>{ba.humanUnit}</div>
        </div>

        <div className={styles.baDivider}>
          <div className={styles.baLine} />
          <motion.div
            animate={{
              x: isDragging ? [0, 5, 0] : 0,
              opacity: isDragging ? 1 : 0.5,
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight size={14} className={styles.baArrow} />
          </motion.div>
          <div className={styles.baLine} />
        </div>

        <div className={styles.baStep}>
          <div className={styles.baValueHighlight}>
            <Sparkles size={14} className={styles.sparkle} />
            <motion.span layout="position">{roiValue}</motion.span>
          </div>
          <div className={styles.baLabel}>{ba.roiUnit}</div>
        </div>
      </motion.div>
    );
  };

  return (
    <Reveal direction="up" delay={0.1}>
      <div
        className={styles.sliderControlWrapper}
        id={`slider-${itemId.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <div className={styles.sliderHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.label}>Computational Load</span>
          </div>
          <motion.div
            className={styles.valueBadge}
            animate={{
              borderColor: isDragging ? "var(--primary)" : "transparent",
              y: isDragging ? -2 : 0,
            }}
          >
            {currentValue.toLocaleString()}{" "}
            <span style={{ fontSize: "0.6em", opacity: 0.6 }}>
              {config.unit}
            </span>
          </motion.div>
        </div>

        <div className={styles.interactiveTrack}>
          <motion.div
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
            style={{
              left: `${percentage}%`,
            }}
            animate={{
              scale: isDragging ? 1.5 : 1,
              rotate: isDragging ? 225 : 45,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </div>

        <div className={styles.sliderScale}>
          <span className={styles.scalePoint}>
            Baseline: {config.min.toLocaleString()}
          </span>
          <span className={styles.scalePoint}>
            Peak: {config.max.toLocaleString()}+
          </span>
        </div>

        {renderBATranslation()}
      </div>
    </Reveal>
  );
};
