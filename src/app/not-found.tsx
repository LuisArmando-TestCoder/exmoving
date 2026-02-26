"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackgroundDecor from "@/components/procedural/BackgroundDecor";
import styles from "@/components/ModernPage.module.scss";
import Link from "next/link";

export default function GlobalNotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div className="selection:bg-red-500/30">
      <Header />
      <BackgroundDecor />
      
      <main ref={containerRef} className={styles.modernSection}>
        <motion.div 
          className={styles.content}
          style={{ opacity, y }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1 
            className={styles.title}
            style={{ color: 'transparent', WebkitTextStroke: '2px var(--foreground)' }}
          >
            404
          </motion.h1>
          
          <motion.p 
            className={styles.subtitle}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            System breach: requested coordinates do not exist in the Σxecutions ecosystem.
          </motion.p>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Link href="/" className={styles.submitBtn}>
              Return to Core
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.visual}
          style={{ x: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
        >
          VOID
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
