"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackgroundDecor from "@/components/procedural/BackgroundDecor";
import styles from "./ModernPage.module.scss";

interface ModernPageProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  visualText?: string;
}

export default function ModernPage({ title, subtitle, children, visualText }: ModernPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <div className="selection:bg-blue-500/30">
      <Header />
      <BackgroundDecor />
      
      <main ref={containerRef} className={styles.modernSection}>
        <motion.div 
          className={styles.content}
          style={{ opacity, scale, y }}
        >
          <motion.h1 
            className={styles.title}
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className={styles.subtitle}
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {subtitle}
            </motion.p>
          )}

          {children}
        </motion.div>

        {visualText && (
          <motion.div 
            className={styles.visual}
            style={{ x: useTransform(scrollYProgress, [0, 1], [100, -100]) }}
          >
            {visualText}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
