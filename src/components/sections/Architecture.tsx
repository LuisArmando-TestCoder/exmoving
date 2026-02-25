"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import styles from "./Architecture.module.scss";
import { SectionHeader } from "../ui/Common";
import { journeySteps } from "./architecture/constants";
import { JourneyStep } from "./architecture/JourneyStep";
import { Vision } from "./architecture/Vision";

export default function Architecture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="architecture" className={styles.architecture}>
      <div className="container">
        <SectionHeader 
          title="Roadmap To Exit."
          subtitle="For a greater tomorrow, turn status quo upside down. We believe in expanding and enhancing people by supercharging them."
        />

        <div className={styles.journeyContainer} ref={containerRef}>
          <div className={styles.timelineLine}>
            <motion.div 
              className={styles.timelineProgress} 
              style={{ scaleY, originY: 0 }}
            />
          </div>

          {journeySteps.map((step, index) => (
            <JourneyStep key={index} step={step} index={index} />
          ))}
        </div>

        <Vision />
      </div>
    </section>
  );
}
