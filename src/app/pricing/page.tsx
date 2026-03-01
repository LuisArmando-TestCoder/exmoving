"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Common";
import { Zap } from "lucide-react";
import styles from "./Pricing.module.scss";
import { EmailActionButton } from "@/components/ui/EmailActionButton";
import { InfrastructureExplorer } from "./InfrastructureExplorer";
import { CostCalculator } from "./CostCalculator";
import { ConversationJourney } from "./ConversationJourney";
import { PricingSyncParams } from "./PricingSyncParams";

export default function PricingPage() {
  return (
    <>
      <Header />
      <PricingSyncParams />
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
          <div className="container" style={{ position: 'relative' }}>
            <div className={styles.stickyCalculatorWrapper}>
              <InfrastructureExplorer />
              <CostCalculator />
            </div>

            <Reveal className={styles.visionSection}>
              <div className={styles.visionContent}>
                <blockquote className={styles.quote}>
                  The real product is a self-supervising system that converts operational friction into measurable returns.
                </blockquote>
                <div className={styles.centeredWrapper}>
                  <EmailActionButton
                    id="pricing-vision-cta"
                    label="Schedule Consultation Call"
                    subject="Pricing Consultation Request"
                  />
                </div>
                <p style={{ color: 'var(--text-dim)', maxWidth: '700px', margin: '3rem auto' }}>
                  Our Goal is to Expand and Enhance People. We build systems that bring ROI without supervision, automating passive income and recording key performance indicators.
                </p>
              </div>
            </Reveal>

            <div style={{ marginTop: '8rem', textAlign: 'center' }}>
              <Reveal>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>
                  The <span className="text-gradient">Cost of Inefficiency.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                  Real-world insights on LLM burn rates and the hidden tax of unoptimized workflows.
                </p>
              </Reveal>
            </div>

            <ConversationJourney />
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <Reveal>
              <div className={styles.centeredWrapper}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'grid', placeItems: 'center' }}>Ready to <span className="text-gradient">Scale?</span></h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                  Instead of quoting, we make a demo. We use your transcripts to generate the tool. Only when it performs successfully do we move forward.
                </p>
                <EmailActionButton
                  id="pricing-footer-cta"
                  label="Schedule Consultation Call"
                  subject="Pricing Consultation Request"
                />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
