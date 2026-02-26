"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.scss";
import { EmailActionButton } from "../ui/EmailActionButton";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();
  
  // High-performance scroll tracking relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax and scale effects
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scaleVideo = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacityVideo = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blurVideo = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(10px)"]);
  
  // Horizontal parallax for extra depth
  const xTitle = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const xSubtitle = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Smoothen the movement if motion is not reduced
  const springConfig = { stiffness: 60, damping: 20, restDelta: 0.001 };
  const smoothYTitle = shouldReduceMotion ? yTitle : useSpring(yTitle, springConfig);
  const smoothYSubtitle = shouldReduceMotion ? ySubtitle : useSpring(ySubtitle, springConfig);
  const smoothXTitle = shouldReduceMotion ? xTitle : useSpring(xTitle, springConfig);
  const smoothXSubtitle = shouldReduceMotion ? xSubtitle : useSpring(xSubtitle, springConfig);

  const videoURL = "https://videos.pexels.com/video-files/31196472/13325298_2560_1440_25fps.mp4";

  return (
    <section 
      ref={containerRef} 
      className={styles.heroWrapper}
      aria-labelledby="hero-title"
    >
      <div className={styles.soft}>
        {/* Background Layer: Affected by invert filter, scale, blur, opacity */}
        <motion.div 
          className={styles.videoContainer}
          style={{ 
            scale: scaleVideo,
            opacity: opacityVideo,
            filter: blurVideo
          }}
        >
          <video 
            playsInline 
            muted 
            autoPlay 
            loop 
            className={styles.video} 
            src={videoURL}
            aria-hidden="true"
          />
        </motion.div>
        
        {/* Middle Layer: Clipped Text with Mix Blend Mode */}
        <div className={styles.titleContainer}>
          <motion.div 
            className={styles.titleContent} 
            style={{ 
              x: smoothXTitle,
              opacity: isInView ? 1 : 0 
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 id="hero-title" className={styles.mainTitle}>
              Σxecutions
            </h1>
          </motion.div>

          <motion.div 
            className={styles.titleContent} 
            style={{ 
              x: smoothXSubtitle,
              opacity: isInView ? 1 : 0 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.subtitle}>
              Automating Industries. Turning Status Quo Upside Down.
            </p>
          </motion.div>
        </div>

      </div>
      {/* Top Layer: UI Controls, unaffected by Title's mix-blend-mode container */}
      <div className={styles.uiOverlay}>
        <div className={styles.actionsContainer}>
          <motion.div 
            className={styles.titleContent}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className={styles.actions}>
              <EmailActionButton 
                label="SCHEDULE CONSULT" 
                subject="Consultation Request"
              />
              <p className={styles.demoHint}>Takes less than 30 seconds</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
