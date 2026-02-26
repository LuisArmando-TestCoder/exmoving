"use client";

import ModernPage from "@/components/ModernPage";
import styles from "@/components/ModernPage.module.scss";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Zap, Target, Cpu, Users, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <ModernPage 
      title="Architecture of Execution" 
      subtitle="We build self-supervising systems that eliminate operational friction and convert manual overhead into autonomous growth cycles."
      visualText="AGENCY"
    >
      <section className="mt-24 space-y-32">
        {/* Leadership Section */}
        <div>
          <h2 className="text-4xl font-bold mb-12 tracking-tight">Executive Architecture</h2>
          <div className={styles.grid}>
            {/* CEO */}
            <TeamMember 
              name="Szilvia Galambosi"
              role="Chief Executive Officer"
              bio="Strategic Thinking Partner for International Leaders. With over 20 years of experience at IBM and as an independent consultant, Szilvia specializes in leadership coaching, organizational development, and human resources. She has lived across 3 continents and brings a global perspective to systemic optimization."
              icon={<Shield size={32} />}
            />
            {/* CTO */}
            <TeamMember 
              name="Luis Armando Murillo"
              role="Chief Technology Officer"
              bio="Automation Architect and Founder of Σx with 13+ years of experience in automation, neural networks, XR tech, and full-stack software architecture. Expert in DevOps, mathematics for computing, cybersecurity (CCNA 5), and design thinking. Previously Senior Motion Engineer at Publicis Groupe."
              icon={<Cpu size={32} />}
            />
            {/* CMO / COO / IRP Connection */}
            <TeamMember 
              name="Pablo E Arias"
              role="Chief Operations Officer"
              bio="16+ years of experience in global logistics and international relocation. Managing Director of International Relocation Partner®. Specialized in expat investment psychology, cross-border regulations, and regional market expansion across Latin America."
              icon={<Globe size={32} />}
            />
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className={styles.card}>
            <Zap className="mb-4 text-blue-400" size={32} />
            <h3 className={styles.cardTitle}>Recursive Optimization</h3>
            <p className={styles.cardText}>Our systems don't just execute; they learn from every cycle. We utilize pattern recognition and automated feedback loops to continuously reduce friction.</p>
          </div>
          <div className={styles.card}>
            <Target className="mb-4 text-blue-400" size={32} />
            <h3 className={styles.cardTitle}>Atomic Design Strategy</h3>
            <p className={styles.cardText}>Built on modular, scalable principles that allow for seamless integration into existing corporate structures while maintaining the agility of a startup.</p>
          </div>
        </div>
      </section>
    </ModernPage>
  );
}

function TeamMember({ name, role, bio, icon }: { name: string; role: string; bio: string; icon: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className={styles.card}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6 opacity-80">{icon}</div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-blue-400 text-sm uppercase tracking-widest mb-4 font-medium">{role}</p>
      <p className={styles.cardText}>{bio}</p>
    </motion.div>
  );
}
