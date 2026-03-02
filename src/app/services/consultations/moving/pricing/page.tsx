"use client";

import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { 
  Calculator, Brain, Layers, Globe, Shield, 
  TrendingUp, Activity, Zap, Server, FileText, Anchor, Code, Database
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
    // Technical Projection based on Iteration A/B State Machine
    // Complexity 1% = Golden Path (Lowest Computation: $0.002)
    // Complexity 100% = Maximum Friction (All Providers Exhausted: $0.10)
    
    const normalizedComplexity = complexity / 100;
    const minCost = 0.002;
    const maxCost = 0.10;
    
    // Linear interpolation based on Iteration B exhaustion probability
    const currentCost = minCost + (maxCost - minCost) * normalizedComplexity;
    
    // Gemini 1.5 Flash blended rate ~$0.25/1M tokens
    const costPerMillionTokens = 0.25;
    const currentTokens = (currentCost / costPerMillionTokens) * 1000000;
    
    // Humans take roughly 45 mins to manage a multi-batch provider sourcing + negotiation
    const hoursDisplaced = leads * 0.75;

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
        "Destination: Port, City, or Final Location"
      ]
    },
    {
      title: "2. Equipment & Volume",
      icon: Layers,
      items: [
        "Service Type: Household / Vehicles",
        "Method: FCL (20/40ft), LCL, RoRo",
        "Estimated Volume: CBM / m³",
        "Goods Description: New/Used mix"
      ]
    },
    {
      title: "3. Scope & Handling",
      icon: Activity,
      items: [
        "Terms: Door-to-Port, Port-to-Port",
        "Packing: Self-pack vs Professional load",
        "Loading: Origin assistance required?",
        "Customs: Destination handling status"
      ]
    },
    {
      title: "4. Carrier Details",
      icon: Anchor,
      items: [
        "Carrier Name & Service Details",
        "Estimated Port-to-Port Transit Time",
        "Restrictions: Carriers to avoid (e.g. MSC)"
      ]
    },
    {
      title: "5. Financial Breakdown",
      icon: Calculator,
      items: [
        "Base Rate ($) & Currency Adjustment",
        "Surcharges: BAF, CAF, ISPS, Local",
        "Rate Validity: Expiration tracking",
        "Job Cost distillation logic"
      ]
    },
    {
      title: "6. Profitability Engine",
      icon: TrendingUp,
      items: [
        "Dynamic Margin: 15% - 25% (Manual/Auto)",
        "Global Average Price Matrix",
        "Document Language: Spanish/English"
      ]
    }
  ];

  return (
    <ProceduralTemplate>
      <div className={styles.pageContainer}>
        
        {/* HERO SECTION */}
        <Reveal direction="down">
          <div className={styles.heroSection}>
            <h1>Autonomous Pricing Architecture</h1>
            <p>
              The Quoting Agent utilizes a nested state machine (Iterations A & B) to distill multi-provider email chaos into a deterministic $0.01 computational unit.
            </p>
          </div>
        </Reveal>

        {/* INTERACTIVE SIMULATOR */}
        <Reveal delay={0.1}>
          <div className={styles.simulatorSection}>
            <div className={styles.simulatorHeader}>
              <h2>Computational ROI Projection</h2>
              <p>Simulate Cost Distillation (CoD) across varying lead volumes and negotiation friction.</p>
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
                    <Brain size={18} /> Provider Friction / Iteration Depth
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
                  <span>1% (Best Case: Golden Path)</span>
                  <span>100% (Worst Case: Provider Exhaustion)</span>
                </div>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <Zap className={styles.metricIcon} size={24} />
                <span className={styles.metricLabel}>Operational LLM OpEx</span>
                <div className={styles.metricValue}>
                  <AnimatedCounter value={metrics.totalMonthlyCost} prefix="$" decimals={2} />
                  <span className={styles.unit}>/mo</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <Code className={styles.metricIcon} size={24} />
                <span className={styles.metricLabel}>Cost per Realized Quote</span>
                <div className={styles.metricValue}>
                  <AnimatedCounter value={metrics.costPerQuote} prefix="$" decimals={3} />
                  <span className={styles.unit}>/ea</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <Database className={styles.metricIcon} size={24} />
                <span className={styles.metricLabel}>Firestore Ops Displaced</span>
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
            <h2>The 20-Field Job Cost Matrix</h2>
            <p>Every IMAP ingestion event distills unstructured relocation requests into these deterministic fields, synchronized directly to the Firestore "emailQuotes" collection.</p>
            
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
              <h3><span>Loop A</span> Iterative Negotiation</h3>
              <p>The arbiter analyzes provider traits and pricing matrices to select winners and trigger the lowball negotiation logic.</p>
              <div className={styles.processSteps}>
                <div className={styles.step}>
                  <Activity className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Score via (10000 / Rate) * ProviderTraits.</span>
                </div>
                <div className={styles.step}>
                  <Shield className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Trigger d6 lowball (-10% random reduction).</span>
                </div>
                <div className={styles.step}>
                  <FileText className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Await handshake or fallback to next row.</span>
                </div>
                <div className={styles.step}>
                  <TrendingUp className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Update Global Averages on acceptance.</span>
                </div>
              </div>
            </div>

            <div className={styles.processCol}>
              <h3><span>Loop B</span> Autonomous Batching</h3>
              <p>When the current provider array is exhausted or fails handshake, Loop B re-activates the sourcing engine.</p>
              <div className={styles.processSteps}>
                <div className={styles.step}>
                  <Server className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Detect loop-stall in Iteration A.</span>
                </div>
                <div className={styles.step}>
                  <Globe className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Re-trigger Movers POE Selenium discovery.</span>
                </div>
                <div className={styles.step}>
                  <Zap className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Seed Firestore with N new Provider docs.</span>
                </div>
                <div className={styles.step}>
                  <Code className={styles.stepIcon} size={20} />
                  <span className={styles.stepText}>Notify fallback providers & restart Loop A.</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className={styles.ctaSection}>
            <EmailActionButton 
              label="Distill My Quoting Complexity"
              id="moving-pricing-cta"
            />
          </div>
        </Reveal>

      </div>
    </ProceduralTemplate>
  );
}
