"use client";

import { usePricingStore, SliderConfig } from "@/store/usePricingStore";
import { ArrowRight, Sparkles, MoveRight } from "lucide-react";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Pricing.module.scss";
import { Reveal } from "@/components/ui/Reveal";

interface PricingSliderProps {
  itemId: string;
  config: SliderConfig;
}

export const PricingSlider = ({ itemId, config }: PricingSliderProps) => {
  const { customValues, setCustomValue } = usePricingStore();
  
  // Local state for immediate responsiveness
  const storeValue = customValues[itemId];
  const initialValue = typeof storeValue === "number" ? storeValue : config.min;
  const [localValue, setLocalValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Sync local state if store changes externally
  useEffect(() => {
    if (!isDragging && typeof storeValue === "number") {
      setLocalValue(storeValue);
    }
  }, [storeValue, isDragging]);

  // Debounced store update to prevent heavy re-renders during sliding
  useEffect(() => {
    if (localValue === initialValue) return;
    
    const handler = setTimeout(() => {
      setCustomValue(itemId, localValue);
    }, 16); // ~60fps debounce for smooth but performant updates

    return () => clearTimeout(handler);
  }, [localValue, itemId, setCustomValue, initialValue]);

  // Motion values for hardware-accelerated visual updates
  const motionValue = useMotionValue(initialValue);
  useEffect(() => {
    motionValue.set(localValue);
  }, [localValue, motionValue]);

  const percentage = useTransform(
    motionValue,
    [config.min, config.max],
    [0, 100]
  );

  // Spring animation for smooth numeric rolling
  const springDisplayValue = useSpring(localValue, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  useEffect(() => {
    springDisplayValue.set(localValue);
  }, [localValue, springDisplayValue]);

  const renderBATranslation = () => {
    if (!config.baTranslation) return null;

    const ba = config.baTranslation;
    const humanValue = (localValue * ba.multiplier).toLocaleString(undefined, {
      maximumFractionDigits: 1,
    });
    const roiValue = (localValue * ba.roiMultiplier).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });

    return (
      <motion.div
        className={styles.baTranslationContainer}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.baStep}>
          <motion.div className={styles.baValue}>
            {humanValue}
          </motion.div>
          <div className={styles.baLabel}>{ba.humanUnit}</div>
        </div>

        <div className={styles.baDivider}>
          <div className={styles.baLine} />
          <motion.div
            animate={{
              x: isDragging ? [0, 5, 0] : 0,
              opacity: isDragging ? 1 : 0.4,
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
            <motion.span>{roiValue}</motion.span>
          </div>
          <div className={styles.baLabel}>{ba.roiUnit}</div>
        </div>
      </motion.div>
    );
  };

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsDragging(true);
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
              backgroundColor: isDragging ? "rgba(var(--primary-rgb), 0.1)" : "rgba(var(--overlay-rgb), 0.05)",
              borderColor: isDragging ? "var(--primary)" : "transparent",
              y: isDragging ? -2 : 0,
            }}
          >
            {localValue.toLocaleString()}{" "}
            <span style={{ fontSize: "0.6em", opacity: 0.6 }}>
              {config.unit}
            </span>
          </motion.div>
        </div>

        {renderBATranslation()}

        <div className={styles.interactiveTrack}>
          <AnimatePresence>
            {!hasInteracted && (
              <motion.div 
                className={styles.sliderHint}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 20 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.3 },
                  x: { repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }
                }}
              >
                <MoveRight size={16} />
                <span>Swipe</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={styles.trackProgress}
            style={{ width: percentage }}
          />
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={localValue}
            onMouseDown={handleInteraction}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={handleInteraction}
            onTouchEnd={() => setIsDragging(false)}
            onChange={(e) => {
              const val = Number(e.target.value);
              setLocalValue(val);
              if (!hasInteracted) setHasInteracted(true);
            }}
            className={styles.ultraRangeInput}
          />
          <motion.div
            className={styles.customThumb}
            style={{
              left: percentage,
            }}
            animate={{
              scale: isDragging ? 1.3 : 1,
              rotate: isDragging ? 225 : 45,
              boxShadow: isDragging 
                ? "0 0 25px rgba(var(--primary-rgb), 0.6)" 
                : "0 4px 15px rgba(0, 0, 0, 0.5)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
      </div>
    </Reveal>
  );
};
