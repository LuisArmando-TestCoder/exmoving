"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Bot, Zap, Cpu, Search, TrendingDown, Clock, Target, Globe, ArrowRight, ShieldCheck, Rocket } from "lucide-react";
import ProceduralTemplate from "@/components/ProceduralTemplate";
import { Reveal } from "@/components/ui/Reveal";
import { useRef } from "react";
import styles from "./Automation.module.scss";
import { EmailActionButton } from "@/components/ui/EmailActionButton";

const roiStats = [
  { label: "Efficiency Gain", value: "+300%", icon: Zap, detail: "Output increase per employee hour" },
  { label: "Error Rate", value: "-99.9%", icon: ShieldCheck, detail: "Eliminate human data entry errors" },
  { label: "OpEx Savings", value: "65%", icon: TrendingDown, detail: "Average reduction in process costs" },
  { label: "Lead Velocity", value: "Instant", icon: Rocket, detail: "Zero-latency response to new inquiries" }
];

const automationFeatures = [
  {
    icon: Bot,
    title: "AI Agents",
    description: "Autonomous agents that handle complex customer interactions and internal task routing.",
    metrics: { label: "Availability", value: "24/7/365" }
  },
  {
    icon: Zap,
    title: "Workflow Engines",
    description: "Seamless orchestration across your entire software stack with zero-code triggers.",
    metrics: { label: "Throughput", value: "Unlimited" }
  },
  {
    icon: Cpu,
    title: "ERP Integration",
    description: "Deep-level sync between your legacy systems and modern cloud-native tools.",
    metrics: { label: "Sync Speed", value: "Real-time" }
  },
  {
    icon: Search,
    title: "Predictive Intel",
    description: "Automated analysis of process logs to identify and fix bottlenecks before they happen.",
    metrics: { label: "Accuracy", value: "99.2%" }
  }
];

export default function AutomationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <ProceduralTemplate>
      <div ref={containerRef} className={styles.automationPage}>
        {/* Scroll Progress Indicator */}
        <motion.div className={styles.scrollProgress} style={{ scaleX }} />

        {/* Hero Section */}
        <div className={styles.hero}>
          <Reveal>
            <div className={styles.badge}>
              <Bot size={14} />
              <span>Operational Excellence</span>
            </div>
            <h1 className={styles.title}>
              AUTOMATE THE <br />
              <span className={styles.gradient}>UNTHINKABLE.</span>
            </h1>
            <p className={styles.subtitle}>
              We transform manual bottlenecks into frictionless automated workflows. 
              Unlock exponential scale by decoupling your growth from your headcount.
            </p>
          </Reveal>
        </div>

        {/* ROI Grid */}
        <div className={styles.roiGrid}>
          {roiStats.map((stat, index) => (
            <Reveal key={index} delay={index * 0.1} direction="up">
              <div className={styles.roiCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <stat.icon size={20} />
                  </div>
                  <span className={styles.value}>{stat.value}</span>
                </div>
                <h3 className={styles.label}>{stat.label}</h3>
                <p className={styles.detail}>{stat.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Features Grid */}
        <div className={styles.featureGrid}>
          {automationFeatures.map((feature, index) => (
            <Reveal key={index} delay={index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
              <div className={styles.featureCard}>
                <div className={styles.iconBox}>
                  <feature.icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <span className={styles.mValue}>{feature.metrics.value}</span>
                    <span className={styles.mLabel}>{feature.metrics.label}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.mValue}>Active</span>
                    <span className={styles.mLabel}>Status</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Efficiency Section */}
        <div className={styles.efficiencySection}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <h2>EFFICIENCY ECONOMICS</h2>
              <p>Scale your business without scaling your overhead. Our automation models focus on high-impact ROI from day one.</p>
            </div>
          </Reveal>

          <Reveal>
            <div className={styles.pricingAnalysis}>
              <div className={styles.analysisHeader}>
                <h3>SYSTEM PERFORMANCE AUDIT</h3>
                <p>Projected efficiency gains per ΣXECUTION node</p>
              </div>

              <div className={styles.analysisGrid}>
                <div className={styles.analysisItem}>
                  <span className={styles.aLabel}>Process Cost</span>
                  <span className={styles.aValue}>$0.02</span>
                  <p className={styles.aDetail}>Average cost per automated transaction vs $12.50 manual.</p>
                </div>
                <div className={styles.analysisItem}>
                  <span className={styles.aLabel}>Lead Velocity</span>
                  <span className={styles.aValue}>{"<2s"}</span>
                  <p className={styles.aDetail}>Average time from lead capture to CRM distribution.</p>
                </div>
                <div className={styles.analysisItem}>
                  <span className={styles.aLabel}>ROI Period</span>
                  <span className={styles.aValue}>45d</span>
                  <p className={styles.aDetail}>Average timeframe to reach full break-even on implementation.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className={styles.ctaWrapper}>
            <EmailActionButton 
              label="BOOK EFFICIENCY AUDIT" 
              className={styles.auditButton}
            />
            <button className={styles.secondaryBtn}>VIEW CASE STUDIES</button>
          </div>
        </div>
      </div>
    </ProceduralTemplate>
  );
}
