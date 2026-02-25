"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Reveal, GlassCard, StaggerContainer } from "@/components/ui/Common";
import { Zap, Cpu, Mail, Cloud, ShieldCheck, BarChart3, TrendingUp, Info } from "lucide-react";
import styles from "./Pricing.module.scss";
import { EmailActionButton } from "@/components/ui/EmailActionButton";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className={styles.pricingPage}>
        <section className={styles.hero}>
          <div className="container">
            <Reveal className={styles.badge}>
              <Zap size={14} />
              <span>ROI Driven Scaling</span>
            </Reveal>
            <Reveal>
              <h1 className={styles.title}>
                Pricing <span className="text-gradient">Model.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={styles.subtitle}>
                We don't assume API costs. All costs are tailored per client need, ensuring no liquidity race conditions while maximizing ROI through automation.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <StaggerContainer className={styles.grid}>
              {/* Core Costs */}
              <Reveal>
                <GlassCard className={styles.card}>
                  <div className={styles.cardTitle}>
                    <Cloud size={24} className="text-gradient" />
                    Server & Hosting
                  </div>
                  <p className={styles.cardDesc}>
                    Render Hosting infrastructure scaled to your specific request volume and security needs.
                  </p>
                  <div className={styles.priceList}>
                    <div className={styles.priceItem}>
                      <span className={styles.label}>Base (512MB RAM)</span>
                      <span className={styles.value}>$7/mo</span>
                    </div>
                    <div className={styles.priceItem}>
                      <span className={styles.label}>Extreme (32GB RAM)</span>
                      <span className={styles.value}>$450/mo</span>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>

              {/* LLM Costs */}
              <Reveal delay={0.1}>
                <GlassCard className={styles.card}>
                  <div className={styles.cardTitle}>
                    <Cpu size={24} className="text-gradient" />
                    Intelligence (Gemini)
                  </div>
                  <p className={styles.cardDesc}>
                    Leveraging Google's $300 credit for Gemini Flash. Costs are based on actual token usage.
                  </p>
                  <div className={styles.priceList}>
                    <div className={styles.priceItem}>
                      <span className={styles.label}>Input (per 1M tokens)</span>
                      <span className={styles.value}>$0.50</span>
                    </div>
                    <div className={styles.priceItem}>
                      <span className={styles.label}>Output (per 1M tokens)</span>
                      <span className={styles.value}>$3.00</span>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>

              {/* Implementation */}
              <Reveal delay={0.2}>
                <GlassCard className={styles.card}>
                  <div className={styles.cardTitle}>
                    <ShieldCheck size={24} className="text-gradient" />
                    Automation Setup
                  </div>
                  <p className={styles.cardDesc}>
                    One-time implementation fee for quality clients. Includes custom tool generation and initial deployment.
                  </p>
                  <div className={styles.priceList}>
                    <div className={styles.priceItem}>
                      <span className={styles.label}>Standard Setup</span>
                      <span className={styles.value}>$10k</span>
                    </div>
                    <div className={styles.priceItem}>
                      <span className={styles.label}>Support (Monthly)</span>
                      <span className={styles.value}>$200</span>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </StaggerContainer>

            <Reveal className={styles.comparisonSection}>
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Token <span className="text-gradient">Efficiency.</span></h2>
                <p style={{ color: 'var(--text-dim)' }}>Comparative summary of what a $300 budget yields across models (500-word emails)</p>
              </div>
              <div className={styles.tableContainer}>
                <table>
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Intelligence Level</th>
                      <th>Email Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.highlight}>Gemini 1.5 Flash</td>
                      <td>Fast / Basic</td>
                      <td>6,000,000</td>
                    </tr>
                    <tr>
                      <td>GPT-4o mini</td>
                      <td>Fast / Efficient</td>
                      <td>4,500,000</td>
                    </tr>
                    <tr>
                      <td>Claude 3.5 Sonnet</td>
                      <td>High / Creative</td>
                      <td>150,000</td>
                    </tr>
                    <tr>
                      <td>GPT-4o</td>
                      <td>High / Versatile</td>
                      <td>180,000</td>
                    </tr>
                    <tr>
                      <td>OpenAI o1</td>
                      <td>Complex Reasoning</td>
                      <td>30,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-dim)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Info size={14} /> 1 Million Tokens represent ~1.5k emails (500 words each)
              </p>
            </Reveal>

            <Reveal className={styles.visionSection}>
              <div className={styles.visionContent}>
                <blockquote className={styles.quote}>
                  The real product is a self-supervising system that converts operational friction into measurable returns.
                </blockquote>
                <p style={{ color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto' }}>
                  Our Goal is to Expand and Enhance People. We build systems that bring ROI without supervision, automating passive income and recording key performance indicators.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <Reveal>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to <span className="text-gradient">Scale?</span></h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Instead of quoting, we make a demo. We use your transcripts to generate the tool. Only when it performs successfully do we move forward.
              </p>
              <EmailActionButton 
                label="Schedule Consultation Call" 
                subject="Pricing Consultation Request"
              />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
