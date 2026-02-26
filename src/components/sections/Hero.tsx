"use client";

import { useScroll, useTransform, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.scss";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroTitle } from "./hero/HeroTitle";
import { ScrollIndicator } from "./hero/ScrollIndicator";

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
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 0]); // Keep centered in sticky
  const scaleVideo = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityVideo = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0]);
  const blurVideo = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(5px)"]);
  
  // Horizontal parallax for extra depth
  const xTitle = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const xSubtitle = useTransform(scrollYProgress, [0, 1], [0, 0]); // Handled individually now

  // Opacity and blur for main title specifically
  const opacityContent = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const blurContent = useTransform(scrollYProgress, [0, 0.15], ["blur(0px)", "blur(20px)"]);
  
  // Smoothen the movement if motion is not reduced
  const springConfig = { stiffness: 60, damping: 20, restDelta: 0.001 };
  const smoothXTitle = shouldReduceMotion ? xTitle : useSpring(xTitle, springConfig);
  const smoothXSubtitle = shouldReduceMotion ? xSubtitle : useSpring(xSubtitle, springConfig);

  return (
    <section 
      ref={containerRef} 
      className={styles.heroWrapper}
      aria-labelledby="hero-title"
    >
      <div className={styles.soft}>
        {isInView && (
          <HeroBackground 
            scaleVideo={scaleVideo}
            opacityVideo={opacityVideo}
            blurVideo={blurVideo}
          />
        )}
        
        <HeroTitle 
          isInView={isInView}
          smoothXTitle={smoothXTitle}
          smoothXSubtitle={smoothXSubtitle}
          opacityContent={opacityContent}
          blurContent={blurContent}
          scrollYProgress={scrollYProgress}
        />

        {isInView && <ScrollIndicator opacityContent={opacityContent} />}
      </div>
    </section>
  );
}
