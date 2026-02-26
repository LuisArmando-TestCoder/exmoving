import React, { useState, useEffect, useCallback } from 'react';
import styles from './Captcha.module.scss';

interface CaptchaProps {
  onResolve: () => void;
  id?: string;
}

const STORAGE_KEY = 'exmoving_captcha_resolved';
const EXPIRY_TIME = 1000 * 60 * 60; // 1 hour

export const Captcha: React.FC<CaptchaProps> = ({ onResolve, id = 'default' }) => {
  const [isResolved, setIsResolved] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check local storage for existing resolution
    const stored = localStorage.getItem(`${STORAGE_KEY}_${id}`);
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      if (Date.now() - timestamp < EXPIRY_TIME) {
        setIsResolved(true);
        onResolve();
      }
    }
    setIsChecking(false);
  }, [id, onResolve]);

  const handleResolve = useCallback(() => {
    setIsSuccess(true);
    const resolutionData = {
      resolved: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${STORAGE_KEY}_${id}`, JSON.stringify(resolutionData));
    
    setTimeout(() => {
      setIsResolved(true);
      onResolve();
    }, 600);
  }, [id, onResolve]);

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSuccess) return;
    setIsDragging(true);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || isSuccess) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const track = document.getElementById(`captcha-track-${id}`);
      if (track) {
        const rect = track.getBoundingClientRect();
        const pos = Math.max(0, Math.min(clientX - rect.left - 30, rect.width - 60));
        setDragPosition(pos);
        
        if (pos >= rect.width - 65) {
          setIsDragging(false);
          handleResolve();
        }
      }
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (!isSuccess) {
        setDragPosition(0);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onMouseMove);
      window.addEventListener('touchend', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, isSuccess, id, handleResolve]);

  if (isChecking || isResolved) return null;

  return (
    <div className={styles.captchaContainer}>
      <div className={styles.captchaBox}>
        <div className={styles.header}>
          <span className={styles.title}>Security Verification</span>
          <span className={styles.subtitle}>Slide to confirm you are human</span>
        </div>
        
        <div id={`captcha-track-${id}`} className={styles.track}>
          <div 
            className={styles.progress} 
            style={{ width: `${dragPosition + 30}px` }}
          />
          <div 
            className={`${styles.slider} ${isDragging ? styles.dragging : ''} ${isSuccess ? styles.success : ''}`}
            style={{ transform: `translateX(${dragPosition}px)` }}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
          >
            <div className={styles.arrow}>
              {isSuccess ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          <span className={`${styles.trackText} ${dragPosition > 100 ? styles.fade : ''}`}>
            {isSuccess ? 'Verified' : 'Slide to verify'}
          </span>
        </div>
      </div>
    </div>
  );
};
