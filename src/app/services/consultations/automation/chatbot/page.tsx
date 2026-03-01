"use client";

import { 
  MessageSquare, Brain, Sparkles, ShieldCheck, 
  Activity, Eye, Search, UserCheck,
  BarChart3, TrendingDown, Layers, Zap,
  Cpu, Rocket, Target, PieChart, Clock, Globe, ArrowRight
} from "lucide-react";
import ProceduralTemplate from "@/components/ProceduralTemplate";
import { Reveal } from "@/components/ui/Reveal";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import styles from "./ChatbotPage.module.scss";
import { EmailActionButton } from "@/components/ui/EmailActionButton";

const chatbotFeatures = [
  {
    icon: MessageSquare,
    title: "Conversational Core",
    description: "Deep natural language understanding for human-like interactions that build trust.",
    metric: "98% accuracy",
    color: "blue"
  },
  {
    icon: Brain,
    title: "Gemini Intelligence",
    description: "Powered by Gemini 1.5 Flash for lightning-fast, high-context business logic.",
    metric: "< 1s latency",
    color: "purple"
  },
  {
    icon: Sparkles,
    title: "Behavior Observation",
    description: "Silent background analysis to adapt to user needs and intent in real-time.",
    metric: "Context-aware",
    color: "amber"
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "Encrypted data handling ensuring compliance and absolute privacy for your clients.",
    metric: "SOC2 Ready",
    color: "emerald"
  }
];

const roiStats = [
  { label: "Operating Costs", value: "-85%", icon: TrendingDown, detail: "Reduction in tier-1 support spend" },
  { label: "Response Time", value: "Instant", icon: Clock, detail: "Eliminate customer wait times forever" },
  { label: "Lead Conversion", value: "+40%", icon: Target, detail: "Higher engagement via proactive AI" },
  { label: "Availability", value: "24/7/365", icon: Globe, detail: "Global coverage without extra headcount" }
];

const engineDetails = [
  {
    icon: Activity,
    label: "Stream Core",
    description: "Real-time token processing with primary dialogue stream telemetry."
  },
  {
    icon: Eye,
    label: "Observer Logic",
    description: "Background intent analysis providing 5-word real-time behavioral summaries."
  },
  {
    icon: Search,
    label: "Pattern Analysis",
    description: "Detection of erratic or uncooperative user behavior through recurring logs."
  },
  {
    icon: UserCheck,
    label: "Psychological Profiling",
    description: "High-level summary of interaction patterns and user psychological state."
  }
];

const pricingMetrics = [
  {
    icon: BarChart3,
    label: "Avg. Inbound Context",
    value: "3,800 tokens",
    detail: "Rich semantic input processing"
  },
  {
    icon: Zap,
    label: "Avg. Outbound Response",
    value: "420 tokens",
    detail: "Precise, actionable generation"
  },
  {
    icon: TrendingDown,
    label: "Computational Overhead",
    value: "$0.00055 USD",
    detail: "Per-session average cost"
  },
  {
    icon: Layers,
    label: "Model Efficiency",
    value: "Gemini Flash 1.5",
    detail: "State-of-the-art cost/performance"
  }
];

export default function ChatbotPage() {
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
      <div ref={containerRef} className={styles.chatbotPage}>
        {/* Scroll Progress Indicator */}
        <motion.div className={styles.scrollProgress} style={{ scaleX }} />

        {/* Hero-like Introduction */}
        <div className={styles.hero}>
          <Reveal>
            <div className={styles.badge}>
              <Cpu size={14} />
              <span>Next-Gen Automations</span>
            </div>
            <h1 className={styles.title}>
              REDEFINE THE <br />
              <span className={styles.gradient}>CUSTOMER JOURNEY.</span>
            </h1>
            <p className={styles.subtitle}>
              We build intelligent agents that don't just "chat"—they observe, think, and execute. 
              Deploy enterprise-grade Gemini intelligence to handle the heavy lifting while you focus on growth.
            </p>
          </Reveal>
        </div>

        {/* Pricing/ROI Cards */}
        <div className={styles.pricingGrid}>
          {roiStats.map((stat, index) => (
            <Reveal key={index} delay={index * 0.1} direction="up">
              <div className={styles.pricingCard}>
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

        {/* Features Grid with SCSS Module Classes */}
        <div className={styles.mainFeatures}>
          {chatbotFeatures.map((feature, index) => (
            <Reveal key={index} delay={index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
              <div className={styles.featureCard}>
                <div className={styles.bgIcon}>
                  <feature.icon size={120} />
                </div>
                <div className={`${styles.iconBox} ${styles[feature.color]}`}>
                  <feature.icon size={32} />
                </div>
                <div className={styles.featureHeader}>
                  <h3>{feature.title}</h3>
                  <span className={styles.tag}>{feature.metric}</span>
                </div>
                <p className={styles.description}>{feature.description}</p>
                <div className={styles.arrowLink}>
                  EXPLORE ARCHITECTURE <ArrowRight size={16} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Deep Intel Section (Scroll Reactive) */}
        <div className={styles.intelSection}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <h2>INSIDE THE CHATBRAIN</h2>
              <p className={styles.mono}>Real-time cognitive processing engine</p>
            </div>
          </Reveal>
          
          <div className={styles.intelGrid}>
            {engineDetails.map((detail, index) => (
              <Reveal key={index} delay={index * 0.1} distance={20}>
                <div className={styles.intelCard}>
                  <detail.icon className={styles.icon} size={28} />
                  <h4>{detail.label}</h4>
                  <p>{detail.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Intelligence Economics Section */}
        <div className={styles.economics}>
          <Reveal>
            <div className={styles.ecoHeader}>
              <div className={styles.ecoTitle}>
                <h2>INTELLIGENCE ECONOMICS</h2>
                <p>
                  Transparent, performance-driven pricing based on real computational expenditure. 
                  We don't charge for "bot seats"—we charge for value delivered.
                </p>
              </div>
              <div className={styles.modelStack}>
                <div className={styles.stackText}>
                  <span>Model Stack</span>
                  <strong>Gemini 1.5 Flash</strong>
                </div>
                <Rocket className={styles.rocket} />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <h2>
                  <PieChart className={styles.pie} size={24} />
                  Session Resource Report
                </h2>
                <p className={styles.mono}>ΣXECUTIONS INTEL stream analysis (REAL-TIME)</p>
              </div>

              <div className={styles.reportGrid}>
                {pricingMetrics.map((metric, index) => (
                  <div key={index} className={styles.reportMetric}>
                    <metric.icon className={styles.mIcon} size={20} />
                    <span className={styles.mLabel}>{metric.label}</span>
                    <span className={styles.mValue}>{metric.value}</span>
                    <div className={styles.progressBar}>
                      <div className={styles.track}>
                        <motion.div 
                          className={styles.fill}
                          initial={{ width: 0 }}
                          whileInView={{ width: "60%" }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                      <p className={styles.mDetail}>{metric.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className={styles.bottomCards}>
            <Reveal direction="left">
              <div className={styles.infoCard}>
                <h3>Cost-Effective Reasoning</h3>
                <p>
                  By leveraging <span className={styles.white}>models/gemini-flash-latest</span>, we achieve an average cost of <span className={styles.blue}>$0.0006 per interaction</span>. 
                  This provides a 10,000x cost advantage over manual tier-1 support with zero performance degradation.
                </p>
                <div className={styles.footer}>
                  <span className={styles.roi}>EST. ROI: 42.5x</span>
                  <Zap size={16} className={styles.zap} />
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className={styles.ctaCard}>
                <div className={styles.ctaBg}>
                  <Rocket size={100} />
                </div>
                <div className={styles.content}>
                  <h3>Scale with Efficiency</h3>
                  <p>
                    Our architecture minimizes inbound/outbound overhead, allowing for massive scaling. 
                    Each session is logged with full telemetry to ensure stakeholders see value.
                  </p>
                  <EmailActionButton 
                    id="chatbot-audit-cta"
                    label="REQUEST ARCHITECTURE AUDIT" 
                    className={styles.auditButton}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </ProceduralTemplate>
  );
}
