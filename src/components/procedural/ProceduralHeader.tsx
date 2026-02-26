import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap } from "lucide-react";
import styles from "./ProceduralHeader.module.scss";

interface ProceduralHeaderProps {
  title: string;
}

export default function ProceduralHeader({ title }: ProceduralHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // These transforms map scroll position to animation values
  // Since useScroll target is containerRef, it effectively happens "in view"
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [100, 0, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);

  return (
    <section ref={containerRef} className={styles.headerSection}>
      <motion.div style={{ opacity, y, scale }} className={styles.stickyContent}>
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: false, margin: "-100px" }}
          className={styles.badge}
        >
          <Zap size={12} className={styles.zapIcon} />
          <span>Next-Gen Systems</span>
        </motion.div>

        <motion.h1 className={styles.title}>
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                delay: i * 0.02,
                type: "spring",
                stiffness: 100,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 }}
          className={styles.descriptionWrapper}
        >
          <p className={styles.description}>
            Deploying ROI-driven scaling solutions for <strong>{title.toLowerCase()}</strong> in industries
            technically left behind. Automating operational friction into measurable returns.
          </p>
          <div className={styles.glowLine} />
        </motion.div>
      </motion.div>
    </section>
  );
}
