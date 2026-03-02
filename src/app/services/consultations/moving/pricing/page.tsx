"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { 
  Calculator, Brain, Layers, Globe, Shield, 
  TrendingUp, Activity, Zap, Server, FileText, Anchor, Code
} from "lucide-react";
import ProceduralTemplate from "@/components/ProceduralTemplate";
import { Reveal } from "@/components/ui/Reveal";
import { EmailActionButton } from "@/components/ui/EmailActionButton";
import styles from "./MovingPricing.module.scss";

// --- CUSTOM HOOK FOR REACTIVE MATH ---
function useProjection(leads: number, complexity: number) {
  const [metrics, setMetrics] = useState({
    costPerQuote: 0,
    totalMonthlyCost: 0,
    tokensUsed: 0,
    hoursSaved: 0
  });

  useEffect(() => {
    // Complexity 1 = Best Case (Deterministic, $0.002)
    // Complexity 100 = Worst Case (High Entropy, $0.10)
    
    // Non-linear mapping for the cost curve (exponential growth towards worst case)
    const normalizedComplexity = complexity / 100;
    const baseCost = 0.002;
    const maxCost = 0.10;
    
    // Calculate current cost per quote
    const currentCost = baseCost + (maxCost - baseCost) * Math.pow(normalizedComplexity, 2);
    
    // Calculate total tokens (assuming $0.15/1M input, $0.38/1M output -> blended ~$0.25/1M)
    const costPerMillionTokens = 0.25;
    const currentTokens = (currentCost / costPerMillionTokens) * 1000000;
    
    // Humans take roughly 30 mins (0.5 hrs) to do a full negotiation cycle
    const hoursDisplaced = leads * 0.5;

    setMetrics({
      costPerQuote: currentCost,
      totalMonthlyCost: currentCost * leads,
      tokensUsed: currentTokens * leads,
      hoursSaved: hoursDisplaced
    });
  }, [leads, complexity]);

  return metrics;
}

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
  const springValue = useSpring(value, {
    stiffness: 80,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
  }, [springValue]);

  return (
    <motion.span>
      {prefix}
      {displayValue.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}
      {suffix}
    </motion.span>
  );
};

export default function MovingPricingPage() {
  const [leads, setLeads] = useState(1000);
  const [complexity, setComplexity] = useState(10); // 1-100 scale

  const metrics = useProjection(leads, complexity);

  const dataFields = [
    {
      title: "1. Routing & Logistics",
      icon: Globe,
      items: [
        "Origin: City, State, ZIP, Country",
        "Destination: Port, Final Drop-off"
      ]
    },
    {
      title: "2. Equipment & Volume",
      icon: Layers,
      items: [
        "Service Type: Household / Vehicles",
        "Method: FCL (20/40ft), LCL, RoRo",
        "Estimated Volume: CBM / m³",
        "Goods Description & Conditions"
      ]
    },
    {
      title: "3. Scope & Handling",
      icon: Activity,
      items: [
        "Terms: Door-to-Port, Port-to-Port",
        "Packing: Self-pack vs Professional",
        "Loading: Assistance required?",
        "Customs: Destination handling"
      ]
    },
    {
      title: "4. Carrier Details",
      icon: Anchor,
      items: [
        "Carrier Name & Service Class",
        "Estimated Transit Time",
        "Restrictions (e.g., Avoid MSC)"
      ]
    },
    {
      title: "5. Financial Breakdown",
      icon: Calculator,
      items: [
        "Base Rate ($)",
        "Surcharges: BAF, CAF, ISPS",
        "Local Charges",
        "Rate Validity Expiration"
      ]
    },
    {
      title: "6. Profitability Engine",
      icon: TrendingUp,
      items: [
        "Dynamic Margin (15% - 25%)",
        "Global Average Comparison",
        "Proposal Language Generation"
      ]
    }
  ];

  return (
    <ProceduralTemplate>
      <div className={styles.pageContainer}>
        
        {/* HERO SECTION */}
        <Reveal direction="down">
          <div className={styles.heroSection}>
            <h1>Intelligence Economics</h1>
            <p>
              The Quoting Agent distills multi-threaded logistics negotiations into a flat $0.01 computational overhead. Explore the multidimensional ROI below.
            </p>
          </div>
        </Reveal>

        {/* INTERACTIVE SIMULATOR */}
        <Reveal delay={0.1}>
          <div className={styles.simulatorSection}>
            <div className={styles.simulatorHeader}>
              <h2>Computational ROI Simulator</h2>
              <p>Slide to simulate the Cost Distillation (CoD) vs. Gross Volume (GV) projection.</p>
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderControl}>
                <div className={styles.sliderHeader}>
                  <span className={styles.label}>
                    <Server size={18} /> Monthly Lead Volume (X)
                  </span>
                  <span className={styles.value}>{leads.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100" 
                  value={leads} 
                  onChange={(e) => setLeads(Number(e.target.value))} 
                />
                <div className={styles.sliderScale}>
                  <span>100 (Boutique)</span>
                  <span>10,000 (Enterprise)</span>
                </div>
              </div>

              <div className={styles.sliderControl}>
                <div className={styles.sliderHeader}>
                  <span className={styles.label}>
                    <Brain size={18} /> Complexity / Negotiation Entropy (A/B Loops)
                  </span>
                  <span className={styles.value}>{complexity}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={complexity} 
                  onChange={(e) => setComplexity(Number(e.target.value))} 
                />
                <div className={styles.sliderScale}>
                  <span>1% (Best Case: Deterministic)</span>
                  <span>100% (Worst Case: High Entropy)</span>
                </div>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <Zap className={styles.metricIcon} size={24} />
                <span className={styles.metricLabel}>Total LLM OpEx</span>
                <div className={styles.metricValue}>
                  <AnimatedCounter value={metrics.totalMonthlyCost} prefix="$" decimals={2} />
                  <span className={styles.unit}>/mo</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <Code className={styles.metricIcon} size={24} />
                <span className={styles.metricLabel}>Avg. Cost per Quote</span>
                <div className={styles.metricValue}>
                  <AnimatedCounter value={metrics.costPerQuote} prefix="$" decimals={3} />
                  <span className={styles.unit}>/ea</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <Shield className={styles.metricIcon} size={24} />
                <span className={styles.metricLabel}>Human Hours Displaced</span>
                <div className={styles.metricValue}>
                  <AnimatedCounter value={metrics.hoursSaved} />
                  <span className={styles.unit}>hrs</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 20-FIELD MATRIX */}
        <Reveal delay={0.2}>
          <div className={styles.matrixSection}>
            <h2>The 20-Field Intelligence Matrix</h2>
            <p>Every IMAP ingestion event distills unstructured email chaos into these deterministic data points for precision margin calculation.</p>
            
            <div className={styles.matrixGrid}>
              {dataFields.map((field, idx) => (
                <div key={idx} className={styles.matrixCard}>
                  <div className={styles.matrixHeader}>
                    <div className={styles.iconWrapper}>
                      <field.icon size={20} />
                    </div>
                    <h3>{field.title}</h3>
                  </div>
                  <ul>
                    {field.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ITERATION A/B LOGIC */}
        <Reveal delay={0.3}>
          <div className={styles.processSection}>
            <div className={styles.processCol}>
              <h3><span>Loop A</span> The Negotiation Protocol</h3>
              <p>The system utilizes a mathematically capped state machine to avoid runaway LLM hallucinations, securing the lowest possible quote deterministically.</p>
              <div className={styles.processSteps}>
                <div className={styles.step}>
                  <Activity className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Analyze returned Provider pricing arrays.</span>
                </div>
                <div className={styles.step}>
                  <TrendingUp className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Score via (Efficiency_Weight / Price) * Traits.</span>
                </div>
                <div className={styles.step}>
                  <Shield className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Apply d6 Random Lowball Trigger (1-in-6 chance).</span>
                </div>
                <div className={styles.step}>
                  <FileText className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Inject into Deterministic Template.</span>
                </div>
              </div>
            </div>

            <div className={styles.processCol}>
              <h3><span>Loop B</span> Market Sourcing Fallback</h3>
              <p>If all "Loop A" providers stall or refuse the target margins, the system re-triggers the external ingestion engine without manual intervention.</p>
              <div className={styles.processSteps}>
                <div className={styles.step}>
                  <Server className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Detect Exhaustion of current Provider Array.</span>
                </div>
                <div className={styles.step}>
                  <Globe className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Trigger Selenium Scraper on target POE.</span>
                </div>
                <div className={styles.step}>
                  <Code className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Discover & Parse N new Providers.</span>
                </div>
                <div className={styles.step}>
                  <Zap className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Restart Loop A with new batch context.</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className={styles.ctaSection}>
            <EmailActionButton 
              label="Distill My Logistics Overhead"
              id="moving-pricing-cta"
            />
          </div>
        </Reveal>

      </div>
    </ProceduralTemplate>
  );
}
