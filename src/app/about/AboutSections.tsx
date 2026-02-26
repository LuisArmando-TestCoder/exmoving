"use client";

import styles from './AboutSections.module.scss';
import { motion, useScroll, useTransform, useInView, useSpring, useReducedMotion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Shield, Cpu, Globe, Zap, Target, Layers } from 'lucide-react';
import { ShaderCanvas } from '@/components/sections/ShaderCanvas';

export const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothY = useSpring(y, springConfig);

  const heroShader = `
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
      vec2 uv = fragCoord/iResolution.xy;
      float time = iTime * 0.1;
      
      vec2 p = uv * 2.0 - 1.0;
      p.x *= iResolution.x/iResolution.y;
      
      float d = length(p);
      float a = atan(p.y, p.x);
      
      float s = 0.5 + 0.5 * sin(d * 10.0 - time * 5.0 + a * 3.0);
      vec3 col = mix(vec3(0.02, 0.05, 0.2), vec3(0.1, 0.4, 1.0), s * exp(-d));
      
      fragColor = vec4(col * (1.0 - d * 0.5), 1.0);
    }
  `;

  return (
    <section ref={containerRef} className={styles.hero}>
      <div className={styles.shaderWrapper}>
        <ShaderCanvas shader={heroShader} />
      </div>
      
      <motion.div style={{ y: smoothY, opacity, scale }} className={styles.heroContent}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={styles.taglineWrapper}
        >
          <span className={styles.heroTag}>ENGINEERING THE FUTURE • EST. 2025</span>
        </motion.div>
        
        <h1 className={styles.title}>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            ARCHITECTS OF
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={styles.gradientText}
          >
            AUTONOMY
          </motion.span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className={styles.subtitle}
        >
          We engineer self-evolving operational ecosystems that transform legacy friction into kinetic growth.
        </motion.p>
      </motion.div>

      <div className={styles.scrollIndicator}>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={styles.mouse}
        >
          <div className={styles.wheel} />
        </motion.div>
      </div>
    </section>
  );
};

export const LeaderCard = ({ name, role, icon: Icon, description, experience, education, index }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacityRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const opacity = shouldReduceMotion ? opacityRaw : useSpring(opacityRaw, springConfig);
  
  const scaleRaw = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.9, 1, 1.02, 1, 0.9]);
  const scale = shouldReduceMotion ? scaleRaw : useSpring(scaleRaw, springConfig);

  const rotateRaw = useTransform(scrollYProgress, [0, 1], [2, -2]);
  const rotate = shouldReduceMotion ? rotateRaw : useSpring(rotateRaw, springConfig);

  return (
    <motion.div
      ref={containerRef}
      style={{
        opacity,
        scale,
        rotateZ: rotate,
        perspective: 1000,
        willChange: "transform, opacity"
      }}
      className={styles.leaderCard}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <Icon size={40} strokeWidth={1.5} />
          </div>
          <div className={styles.titleWrapper}>
            <span className={styles.leaderRole}>{role}</span>
            <h3 className={styles.leaderName}>{name}</h3>
          </div>
          <p className={styles.leaderDescription}>{description}</p>
        </div>
        
        <div className={styles.detailsSection}>
          <div className={styles.experienceGrid}>
            <h4 className={styles.sectionLabel}>THE JOURNEY</h4>
            <div className={styles.timeline}>
              {experience.map((item: string, i: number) => (
                <JourneyPoint key={i} text={item} index={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>

          <div className={styles.educationSection}>
            <h4 className={styles.sectionLabel}>ACADEMIC FOUNDATION</h4>
            <p>{education}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const JourneyPoint = ({ text, index, scrollYProgress }: { text: string, index: number, scrollYProgress: any }) => {
  const shouldReduceMotion = useReducedMotion();
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const pointScaleRaw = useTransform(
    scrollYProgress, 
    [0.1 + (index * 0.05), 0.2 + (index * 0.05)], 
    [0, 1]
  );
  const pointScale = shouldReduceMotion ? pointScaleRaw : useSpring(pointScaleRaw, springConfig);

  const xRaw = useTransform(
    scrollYProgress,
    [0.1 + (index * 0.05), 0.2 + (index * 0.05)],
    [20, 0]
  );
  const x = shouldReduceMotion ? xRaw : useSpring(xRaw, springConfig);

  return (
    <motion.div 
      style={{ x, opacity: pointScale }}
      className={styles.experienceItem}
    >
      <motion.div 
        style={{ scale: pointScale }}
        className={styles.dot} 
      />
      <p>{text}</p>
    </motion.div>
  );
};

export const ValuesSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [-500, 500]);
  const x2 = useTransform(scrollYProgress, [0, 1], [500, -500]);

  return (
    <section ref={containerRef} className={styles.values}>
      <div className={styles.scrollingTextContainer}>
        <motion.h2 style={{ x: x1 }} className={styles.scrollingText}>
          RECURSIVE OPTIMIZATION • ATOMIC DESIGN • SCALABLE ARCHITECTURE • 
        </motion.h2>
        <motion.h2 style={{ x: x2 }} className={styles.scrollingText}>
          NEURAL WORKFLOWS • FRICTIONLESS EXECUTION • COGNITIVE AUTOMATION • 
        </motion.h2>
      </div>

      <div className={styles.cardsGrid}>
        <ValueCard 
          icon={Zap}
          title="Kinetic Efficiency"
          text="Our systems turn operational drag into momentum. Every automated cycle builds intelligence for the next."
          delay={0.1}
        />
        <ValueCard 
          icon={Target}
          title="Precision Agency"
          text="We define clear vectors of success. Autonomous systems with human-centric governance."
          delay={0.2}
        />
        <ValueCard 
          icon={Layers}
          title="Modular Scalability"
          text="Architectures that grow without breaking. Micro-services for macro-level impact."
          delay={0.3}
        />
      </div>
    </section>
  );
};

const ValueCard = ({ icon: Icon, title, text, delay }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10 }}
      className={styles.valueCard}
    >
      <div className={styles.iconCircle}>
        <Icon className={styles.valueIcon} size={32} strokeWidth={1.5} />
      </div>
      <h3 className={styles.valueTitle}>{title}</h3>
      <p className={styles.valueText}>{text}</p>
    </motion.div>
  );
};
