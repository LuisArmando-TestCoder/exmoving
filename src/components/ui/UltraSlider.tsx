"use client";

import { motion, useMotionValue, useTransform, useMotionValueEvent, animate } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./UltraSlider.module.scss";

interface UltraSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export const UltraSlider = ({
  min,
  max,
  step,
  value,
  onChange,
  onInteractionStart,
  onInteractionEnd,
}: UltraSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  
  const x = useMotionValue(0);

  const getPercentage = useCallback((val: number) => {
    return Math.max(0, Math.min(((val - min) / (max - min)) * 100, 100));
  }, [min, max]);

  const getValue = useCallback((pct: number) => {
    const rawValue = min + (pct / 100) * (max - min);
    const clampedValue = Math.max(min, Math.min(rawValue, max));
    return Math.round(clampedValue / step) * step;
  }, [min, max, step]);

  // Set drag constraints and handle resize seamlessly
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      setConstraints({ left: 0, right: width });
      
      // Keep position stable if window is resized while not dragging
      if (!isDraggingRef.current) {
        const pct = getPercentage(value);
        x.set((pct / 100) * width);
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [value, getPercentage, x]);

  // Sync visual position when external value changes smoothly
  useEffect(() => {
    if (!isDraggingRef.current && containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const pct = getPercentage(value);
      const targetX = (pct / 100) * width;
      animate(x, targetX, { type: "spring", stiffness: 400, damping: 40 });
    }
  }, [value, getPercentage, x]);

  // Handle native dragging event correctly by reporting stepped values back
  useMotionValueEvent(x, "change", (latestX) => {
    if (isDraggingRef.current && containerRef.current) {
      const width = containerRef.current.offsetWidth;
      if (width === 0) return;
      
      const clampedX = Math.max(0, Math.min(latestX, width));
      const pct = (clampedX / width) * 100;
      const newValue = getValue(pct);
      
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent triggering background jump when interacting specifically with the drag handle
    if ((e.target as HTMLElement).closest(`.${styles.thumb}`)) return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    if (width === 0) return;
    
    const clickX = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(clickX, width));
    const pct = (clampedX / width) * 100;
    const newValue = getValue(pct);
    
    onChange(newValue);
    onInteractionStart?.();
    
    // Jump exactly to the stepped magnetic position
    const targetPct = getPercentage(newValue);
    const targetX = (targetPct / 100) * width;
    
    animate(x, targetX, { type: "spring", stiffness: 500, damping: 30 });
    
    setTimeout(() => onInteractionEnd?.(), 100);
  };

  const progressWidth = useTransform(x, (latestX) => {
    if (!containerRef.current) return "0%";
    const width = containerRef.current.offsetWidth;
    if (width === 0) return "0%";
    const pct = Math.max(0, Math.min((latestX / width) * 100, 100));
    return `${pct}%`;
  });

  return (
    <div 
      className={styles.ultraSlider}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none" }}
    >
      <div className={styles.track}>
        <div className={styles.tickMarks}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className={styles.tick} />
          ))}
        </div>
        <motion.div 
          className={styles.progress} 
          style={{ width: progressWidth, willChange: "width" }}
        />
      </div>

      <motion.div
        className={styles.thumb}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
          setIsDragging(true);
          onInteractionStart?.();
        }}
        onDragEnd={() => {
          isDraggingRef.current = false;
          setIsDragging(false);
          onInteractionEnd?.();
          
          // Force a magnetic snap to exact step on drag release
          if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            const pct = getPercentage(value);
            const targetX = (pct / 100) * width;
            animate(x, targetX, { type: "spring", stiffness: 400, damping: 40 });
          }
        }}
        style={{ x, willChange: "transform" }}
        animate={{
          scale: isDragging ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className={styles.glow} />
      </motion.div>
    </div>
  );
};
