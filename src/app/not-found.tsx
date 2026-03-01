"use client";

import { useScroll, useTransform, useSpring, useReducedMotion, useInView, motion } from "framer-motion";
import { useRef } from "react";
import styles from "@/components/sections/Hero.module.scss";
import { HeroBackground } from "@/components/sections/hero/HeroBackground";
import { SplitText } from "@/components/ui/SplitText";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function GlobalNotFound() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const scaleVideo = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityVideo = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0]);
  const blurVideo = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(5px)"]);
  
  const xTitle = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const blurContent = useTransform(scrollYProgress, [0, 0.15], ["blur(0px)", "blur(20px)"]);
  
  const springConfig = { stiffness: 60, damping: 20, restDelta: 0.001 };
  const smoothXTitle = shouldReduceMotion ? xTitle : useSpring(xTitle, springConfig);

  return (
    <div className="selection:bg-red-500/30">
      <Header />
      <section 
        ref={containerRef} 
        className={`${styles.heroWrapper}`}
        aria-labelledby="hero-title"
        style={{ height: '100vh', minHeight: '600px' }}
      >
        <div className={styles.soft}>
          {isInView && (
            <HeroBackground 
              scaleVideo={scaleVideo}
              opacityVideo={opacityVideo}
              blurVideo={blurVideo}
            />
          )}
          
          <div className={styles.titleContainer} style={{ perspective: "1000px" }}>
            {isInView && (
              <motion.div 
                className={styles.titleContent} 
                style={{ 
                  x: smoothXTitle,
                  opacity: opacityContent,
                  filter: blurContent
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 id="hero-title" className={styles.mainTitle}>
                  <SplitText id="hero-split-title">404</SplitText>
                </h1>
              </motion.div>
            )}
          </div>

          <div className={styles.centeredWrapper}>
             <Link href="/" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 text-sm font-medium tracking-widest text-white">
                RETURN TO CORE
             </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
