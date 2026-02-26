"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import styles from './Captcha.module.scss';

interface CaptchaProps {
  onResolve: () => void;
  id?: string;
}

const STORAGE_KEY = 'exmoving_captcha_resolved_permanent';

export const Captcha: React.FC<CaptchaProps> = ({ onResolve, id = 'default' }) => {
  const [isResolved, setIsResolved] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Mouse reactive values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Rotate transforms
  const rotateX = useTransform(springY, [0, 400], [5, -5]);
  const rotateY = useTransform(springX, [0, 400], [-5, 5]);

  // Dragging logic with Framer Motion
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const progressWidth = useTransform(xSpring, (val) => val + 34);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${id}`);
    if (stored) {
      setIsResolved(true);
      onResolve();
    }
    setIsChecking(false);
  }, [id, onResolve]);

  const handleResolve = useCallback(() => {
    setIsSuccess(true);
    localStorage.setItem(`${STORAGE_KEY}_${id}`, 'true');
    
    setTimeout(() => {
      setIsResolved(true);
      onResolve();
    }, 1500);
  }, [id, onResolve]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    mouseX.set(xPos);
    mouseY.set(yPos);
    
    // Update CSS variables for SCSS hover effect
    containerRef.current.style.setProperty('--mouse-x', `${(xPos / rect.width) * 100}%`);
    containerRef.current.style.setProperty('--mouse-y', `${(yPos / rect.height) * 100}%`);
  };

  const onDrag = (_: any, info: any) => {
    if (isSuccess || !trackRef.current) return;
    const trackWidth = trackRef.current.offsetWidth;
    const dragLimit = trackWidth - 66; 
    
    if (info.offset.x >= dragLimit) {
      handleResolve();
    }
  };

  if (isChecking || isResolved) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.captchaContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          ref={containerRef}
          className={styles.captchaBox}
          onMouseMove={handleMouseMove}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          whileInView={{ scale: 1, y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          <div className={styles.header}>
            <motion.span 
              className={styles.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Security Protocol
            </motion.span>
            <motion.span 
              className={styles.subtitle}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Please verify your session to proceed with the request.
            </motion.span>
          </div>
          
          <div 
            ref={trackRef}
            className={styles.track}
          >
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
              <div className={styles.arrow}>
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.div
                      key="arrow"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={32} strokeWidth={2.5} />
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
              {isSuccess ? 'Authorized' : 'Slide to authenticate'}
            </motion.span>
          </div>

          <motion.div 
            className={styles.glow}
            style={{
              left: springX,
              top: springY,
              x: "-50%",
              y: "-50%"
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
