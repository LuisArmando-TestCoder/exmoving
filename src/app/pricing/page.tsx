"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Reveal, GlassCard, StaggerContainer } from "@/components/ui/Common";
import { Zap, Cloud, ShieldCheck, Info } from "lucide-react";
import styles from "./Pricing.module.scss";
import { EmailActionButton } from "@/components/ui/EmailActionButton";
import { IntelligenceAPI } from "./IntelligenceAPI";
import { usePricingStore } from "@/store/usePricingStore";
import { InfrastructureExplorer } from "./InfrastructureExplorer";
import { CostCalculator } from "./CostCalculator";

export default function PricingPage() {
  const { apiPrices } = usePricingStore();

  return (
    <>
      <Header />
      <main className={styles.pricingPage} id="pricing-page-root">
        <section className={styles.hero} id="pricing-hero">
          <div className="container">
            <Reveal className={styles.badge} id="pricing-badge-roi">
              <Zap size={14} />
              <span>ROI Driven Scaling</span>
            </Reveal>
            <Reveal id="pricing-title-reveal">
              <h1 className={styles.title} id="pricing-main-title">
                Pricing <span className="text-gradient">Model.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1} id="pricing-subtitle-reveal">
              <p className={styles.subtitle} id="pricing-subtitle-text">
                We don't assume API costs. All costs are tailored per client need, ensuring no liquidity race conditions while maximizing ROI through automation.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section" id="pricing-core-section">
          <div className="container">
            <StaggerContainer className={styles.grid} id="pricing-grid-main">
              {/* Core Costs */}
              <Reveal id="pricing-card-hosting-reveal">
                <GlassCard className={styles.card} id="pricing-card-hosting">
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

              {/* Generative APIs - Modularized */}
              {apiPrices.filter(api => api.isGenerative).map((api) => (
                <IntelligenceAPI key={api.id} id={api.id} />
              ))}

              {/* Implementation */}
              <Reveal delay={0.2} id="pricing-card-setup-reveal">
                <GlassCard className={styles.card} id="pricing-card-setup">
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

            <Reveal className={styles.comparisonSection} id="pricing-token-efficiency-reveal">
              <div style={{ marginBottom: '2rem', textAlign: 'center' }} id="pricing-table-header">
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }} id="pricing-table-title">Token <span className="text-gradient">Efficiency.</span></h2>
                <p style={{ color: 'var(--text-dim)' }} id="pricing-table-desc">Comparative summary of what a $300 budget yields across models (500-word emails)</p>
              </div>
              <div className={styles.tableContainer} id="pricing-table-container">
                <table id="pricing-comparison-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Intelligence Level</th>
                      <th>Email Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiPrices.map((api) => (
                      <tr key={api.id} id={`pricing-row-${api.id}`}>
                        <td className={api.id === 'gemini-flash' ? styles.highlight : ''}>{api.name}</td>
                        <td>{api.intelligence}</td>
                        <td>{api.emailCapacity.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-dim)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} id="pricing-table-footer">
                <Info size={14} /> 1 Million Tokens represent ~1.5k emails (500 words each)
              </p>
            </Reveal>

            <InfrastructureExplorer />
            <CostCalculator />

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
