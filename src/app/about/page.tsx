"use client";

import { Shield, Cpu, Globe } from "lucide-react";
import { HeroSection, LeaderCard, ValuesSection } from "./AboutSections";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CopySection from "@/components/sections/CopySection";
import styles from "./AboutSections.module.scss";

const LEADERS = [
  {
    name: "Szilvia Galambosi",
    role: "Chief Executive Officer",
    icon: Shield,
    description: "Strategic Thinking Partner for International Leaders and Expat Relocation Coach. Szilvia brings a profound sense of empowerment and self-awareness to leadership, enabling navigation of complexities with resilience and authenticity.",
    experience: [
      "Founder & Strategic Thinking Partner (2015 - Present)",
      "2nd Line Operations Manager at IBM (2009 - 2012)",
      "Global experience across 3 continents",
      "Specialized in process optimization & HR systems"
    ],
    education: "Master's in Management & Consulting (University of Pécs), Post-Grad in Psychology (Pázmány Péter Katolikus Egyetem). Certified in Six Sigma and DISC analysis."
  },
  {
    name: "Pablo E Arias",
    role: "Chief Operations Officer",
    icon: Globe,
    description: "Managing Director of International Relocation Partner® with 16+ years of experience connecting people to new destinations. Pablo operates at the intersection of international relocation and market expansion.",
    experience: [
      "Regional Alliances Manager at IRP® (2020 - Present)",
      "Head of Operations at Grupo Relocations Arivi (2018 - 2025)",
      "Account Manager at Crown Worldwide Group (2017 - 2018)",
      "Specialist in expat client psychology & global mobility"
    ],
    education: "Estrategia Empresarial (Growth Institute), Administration (ULACIT). Certified in Small Business Marketing and Storytelling."
  },
  {
    name: "Luis Armando Murillo",
    role: "Chief Technology Officer",
    icon: Cpu,
    description: "Automation Architect and Founder of Σx with 13+ years of multi-disciplinary experience. Luis is a pioneer in neural networks, XR technology, and full-stack architecture, focusing on the elimination of operational friction.",
    experience: [
      "Founder of Σxecutions & AIExecutions (2025 - Present)",
      "Software Architect at Babaluum (2024 - Present)",
      "Senior Creative Engineer at Publicis Groupe (2022 - 2024)",
      "Open Source Developer (Canvas Preset, Scene Preset, VFX Trigger)"
    ],
    education: "Web Design & Development (CETAV), Technician in System & Network Management (Universidad Fidélitas)."
  }
];

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <Header />
      <main className={styles.mainContent}>
        <HeroSection />
        
        <div className={styles.contentWrapper}>
          <ValuesSection />
          
          <section>
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <span className={styles.vanguardTag}>THE VANGUARD</span>
                <h3 className={styles.vanguardTitle}>
                  EXECUTIVE<br />ARCHITECTURE
                </h3>
              </div>
              <p className={styles.headerDescription}>
                A multi-disciplinary collective engineered to solve the most complex operational challenges.
              </p>
            </div>

            <div className={styles.leadersGrid}>
              {LEADERS.map((leader, index) => (
                <LeaderCard key={leader.name} {...leader} index={index} />
              ))}
            </div>
          </section>
        </div>

        <div className={styles.deploySectionWrapper}>
          <CopySection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
