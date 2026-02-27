"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import styles from './SliderButton.module.scss';

interface SliderButtonProps {
  onResolve: () => void;
  icon: LucideIcon;
  text?: string;
  successText?: string;
  resetDelay?: number; // if > 0, reset after success
}

export const SliderButton: React.FC<SliderButtonProps> = ({ 
  onResolve, 
  icon: Icon,
  text = "Slide to confirm",
  successText = "Confirmed",
  resetDelay = 0
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Dragging logic
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const progressWidth = useTransform(xSpring, (val) => val + 34);

  const handleResolve = useCallback(() => {
    setIsSuccess(true);
    onResolve();

    if (resetDelay > 0) {
      setTimeout(() => {
        setIsSuccess(false);
        x.set(0);
      }, resetDelay);
    }
  }, [onResolve, resetDelay, x]);

  const onDrag = (_: any, info: any) => {
    if (isSuccess || !trackRef.current) return;
    const trackWidth = trackRef.current.offsetWidth;
    const dragLimit = trackWidth - 66; 
    
    if (info.offset.x >= dragLimit) {
      handleResolve();
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <div ref={trackRef} className={styles.track}>
        <motion.div 
          className={styles.progress} 
          style={{ width: progressWidth }}
        />
        
        <motion.div 
          drag="x"
          dragConstraints={{ left: 0, right: trackRef.current ? trackRef.current.offsetWidth - 76 : 300 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={onDrag}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => !isSuccess && setIsDragging(false)}
          className={`${styles.slider} ${isSuccess ? styles.success : ''}`}
          style={{ x }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isSuccess ? { 
            x: trackRef.current ? trackRef.current.offsetWidth - 76 : 0,
            scale: 1,
            backgroundColor: "#05070a"
          } : {}}
        >
          <div className={styles.iconWrapper}>
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon size={24} strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.svg
                  key="check"
                  viewBox="0 0 50 50"
                  initial="initial"
                  animate="animate"
                  className={styles.modernCheck}
                >
                  <motion.circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="#B153D7"
                    strokeWidth="2"
                    fill="transparent"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M15 24.5l7 7 13-13"
                    fill="transparent"
                    stroke="#B153D7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.span 
          className={styles.trackText}
          animate={{ 
            opacity: isDragging || isSuccess ? 0 : 1,
            x: isDragging ? 20 : 0
          }}
        >
          {isSuccess ? successText : text}
        </motion.span>
      </div>
    </div>
  );
};
