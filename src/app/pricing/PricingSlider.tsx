"use client";

import { usePricingStore, SliderConfig } from "@/store/usePricingStore";
import { ArrowRight, Sparkles, MoveRight, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence, useVelocity } from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Pricing.module.scss";
import { Reveal } from "@/components/ui/Reveal";
import { UltraSlider } from "@/components/ui/UltraSlider";

interface PricingSliderProps {
  itemId: string;
  config: SliderConfig;
}

const RollingNumber = ({ value, unit }: { value: number, unit?: string }) => {
  const springValue = useSpring(value, {
    stiffness: 80,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return (
    <motion.div className={styles.valueBadge}>
      <motion.span>
        {displayValue.toLocaleString()}
      </motion.span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </motion.div>
  );
};

export const PricingSlider = ({ itemId, config }: PricingSliderProps) => {
  const storeValue = usePricingStore((state) => state.customValues[itemId]);
  const setCustomValue = usePricingStore((state) => state.setCustomValue);
  
  // Local state for immediate responsiveness
  const initialValue = typeof storeValue === "number" ? storeValue : config.min;
  const [localValue, setLocalValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Sync local state if store changes externally (e.g. initial URL load or RESET)
  useEffect(() => {
    if (typeof storeValue === "number") {
      setLocalValue(storeValue);
    }
  }, [storeValue]);

  // Debounced store update
  // A slightly higher debounce (50ms) ensures the global cost calculator and other subscribers 
  // don't bog down the main thread while the local slider stays buttery smooth at 60fps
  useEffect(() => {
    const handler = setTimeout(() => {
      setCustomValue(itemId, localValue);
    }, 50);

    return () => clearTimeout(handler);
  }, [localValue, itemId, setCustomValue]);

  // Motion values for hardware-accelerated visual updates
  const motionValue = useMotionValue(initialValue);
  const velocity = useVelocity(motionValue);
  
  useEffect(() => {
    motionValue.set(localValue);
  }, [localValue, motionValue]);

  const percentage = useTransform(
    motionValue,
    [config.min, config.max],
    ["0%", "100%"]
  );

  // Spring animation for smooth numeric rolling in BA section
  const springDisplayValue = useSpring(localValue, {
    stiffness: 100,
    damping: 30,
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
            {Math.round(+humanValue)}
          </motion.div>
          <div className={styles.baLabel}>{ba.humanUnit}</div>
        </div>

        <div className={styles.baDivider}>
          <motion.div
            animate={{
              y: isDragging ? [0, 5, 0] : 0,
              opacity: isDragging ? 1 : 0.4,
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight size={14} className={styles.baArrow} />
          </motion.div>
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
            <span className={styles.label}>{itemId} Intensity</span>
          </div>
          <RollingNumber value={localValue} unit={config.unit} />
        </div>

        {renderBATranslation()}

        <div className={styles.interactiveTrackCustom} style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <AnimatePresence>
            {!hasInteracted && localValue === config.min && (
              <motion.div 
                className={styles.sliderHint}
                style={{ pointerEvents: "none", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}
                initial={{ opacity: 0, y: "-30%", x: "-50%" }}
                animate={{ opacity: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.8, x: "-50%" }}
              >
                <ChevronLeft size={14} />
                <span>Swipe</span>
                <ChevronRight size={14} />
              </motion.div>
            )}
          </AnimatePresence>

          <UltraSlider 
            min={config.min}
            max={config.max}
            step={config.step}
            value={localValue}
            onChange={(val) => {
              setLocalValue(val);
              if (!hasInteracted) setHasInteracted(true);
            }}
            onInteractionStart={handleInteraction}
            onInteractionEnd={() => setIsDragging(false)}
          />
        </div>

        <div className={styles.sliderScale}>
          <span className={`${styles.scalePoint} ${localValue === config.min ? styles.active : ""}`}>
            Min: {config.min.toLocaleString()}
          </span>
          <span className={`${styles.scalePoint} ${localValue === config.max ? styles.active : ""}`}>
            Max: {config.max.toLocaleString()}
          </span>
        </div>
      </div>
    </Reveal>
  );
};
