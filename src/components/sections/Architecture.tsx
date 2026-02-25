"use client";

import { Server, Shield, Workflow, ArrowUpRight } from "lucide-react";
import styles from "./Architecture.module.scss";
import { SectionHeader, StaggerContainer, Reveal, GlassCard } from "../ui/Common";

const cards = [
  {
    icon: <Workflow size={24} />,
    title: "Pricing Automation",
    description: "Reads emails, extracts quotes, and organizes data for sales teams. Operates on self-hosted GPUs for 0.02x cost reduction.",
    footer: "Active Deployment"
  },
  {
    icon: <Server size={24} />,
    title: "Metric-Driven Scaling",
    description: "Automated indicators record ROI performance. Tools that do not compromise liquidity during financial race conditions.",
    footer: "Numeric Selling Point"
  },
  {
    icon: <Shield size={24} />,
    title: "No supervision",
    description: "A machine that performs automations based on call transcripts. System generates tools automatically from transcripts.",
    footer: "Auto-Automation"
  }
];

export default function Architecture() {
  return (
    <section id="architecture" className={`${styles.architecture} section`}>
      <div className="container">
        <SectionHeader 
          title="The Roadmap To Exit."
          subtitle="A system that brings ROI without supervision, converting transcripts into tailored automation tools."
        />

        <StaggerContainer className={styles.grid} staggerDelay={0.2}>
          {cards.map((card, index) => (
            <Reveal key={index} direction="up" distance={30}>
              <GlassCard className={styles.card}>
                <div className={styles.iconWrapper}>
                  {card.icon}
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
                <div className={styles.cardFooter}>
                  {card.footer} <ArrowUpRight size={14} />
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
