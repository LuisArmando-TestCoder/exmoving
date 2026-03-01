"use client";

import React, { useRef } from "react";
import { 
  MessageSquare, Brain, Sparkles, ShieldCheck, 
  Activity, Eye, Search, UserCheck,
  BarChart3, TrendingDown, Layers, Zap,
  Cpu, Rocket, Target, PieChart, Clock, Globe, ArrowRight
} from "lucide-react";
import ProceduralTemplate from "@/components/ProceduralTemplate";
import { Reveal, StaggerContainer } from "@/components/ui/Common";
import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./AutomationServicePage.module.scss";
import { EmailActionButton } from "@/components/ui/EmailActionButton";
import { usePathname } from "next/navigation";

// Mapping of string icons to lucide-react icons for JSON-based config
export const iconMap: Record<string, React.ElementType> = {
  MessageSquare, Brain, Sparkles, ShieldCheck, 
  Activity, Eye, Search, UserCheck,
  BarChart3, TrendingDown, Layers, Zap,
  Cpu, Rocket, Target, PieChart, Clock, Globe, Languages, Link, Mic, Send
};

import { Languages, Link, Mic, Send } from "lucide-react";

export interface Feature {
  iconName: string;
  title: string;
  description: string;
  metric: string;
  color: "blue" | "purple" | "amber" | "emerald" | "red" | "cyan";
}

export interface RoiStat {
  label: string;
  value: string;
  iconName: string;
  detail: string;
}

export interface EngineDetail {
  iconName: string;
  label: string;
  description: string;
}

export interface PricingMetric {
  iconName: string;
  label: string;
  value: string;
  detail: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PersonaItem {
  title: string;
  problem: string;
  outcome: string;
}

export interface CustomInfoBlock {
  title: string;
  subtitle?: string;
  content: React.ReactNode | string;
}

export interface ArchitectureComponent {
  name: string;
  role: string;
  details: string[];
}

export interface AutomationServicePageProps {
  /**
   * Header section configuration
   */
  header?: {
    badgeText?: string;
    titleLine1: string;
    titleGradient: string;
    subtitle: string;
  };
  
  /**
   * ROI Stats shown near the top (optional)
   */
  roiStats?: RoiStat[];

  /**
   * Main Features grid (optional)
   */
  features?: Feature[];

  /**
   * "Inside the Brain" / Deep Intel Section (optional)
   */
  intelSection?: {
    title: string;
    subtitle: string;
    details: EngineDetail[];
  };

  /**
   * Intelligence Economics / Pricing/Performance Section (optional)
   */
  economicsSection?: {
    title: string;
    description: string;
    modelName: string;
    reportTitle: string;
    reportSubtitle: string;
    metrics: PricingMetric[];
    bottomLeftCard: {
      title: string;
      description: React.ReactNode | string;
      roi: string;
    };
    bottomRightCard: {
      title: string;
      description: string;
      buttonText: string;
    };
  };

  /**
   * New modular sections
   */
  personas?: {
    title: string;
    items: PersonaItem[];
  };

  faqs?: {
    title: string;
    items: FAQItem[];
  };

  testimonials?: {
    title: string;
    items: {
      quote: string;
      author: string;
      role: string;
    }[];
  };

  /**
   * Advanced Generative Sections
   */
  architecture?: {
    title: string;
    overview: string;
    components: ArchitectureComponent[];
  };

  apiReference?: {
    title: string;
    endpoints: {
      method: "GET" | "POST" | "PATCH" | "DELETE";
      path: string;
      description: string;
      params?: { name: string; type: string; desc: string }[];
    }[];
  };

  customBlocks?: CustomInfoBlock[];
}

/**
 * An ultra-flexible, robust procedural template for Automation Service Pages.
 * 
 * DESIGN PHILOSOPHY:
 * This component acts as a factory for niche-specific landing pages. 
 * By simply omitting a prop block (like `roiStats` or `economicsSection`), 
 * the corresponding UI section will vanish without breaking layout.
 * 
 * HOW TO USE:
 * Pass the highly robust configuration object. Define icons using their string
 * names (e.g., "Brain", "Cpu").
 */
export default function AutomationServicePage({
  header,
  roiStats,
  features,
  intelSection,
  economicsSection,
  personas,
  faqs,
  testimonials,
  architecture,
  apiReference,
  customBlocks
}: AutomationServicePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const baseId = pathname.replace(/\//g, "-").replace(/^-/, "") || "automation-service";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <ProceduralTemplate>
      <div ref={containerRef} className={styles.pageContainer} id={baseId}>
        {/* Scroll Progress Indicator */}
        <motion.div 
          className={styles.scrollProgress} 
          style={{ scaleX }} 
          id={`${baseId}-scroll-progress`}
        />

        {/* Intelligence Economics Section */}
        {economicsSection && (
          <div className={styles.economics} id={`${baseId}-economics`}>
            <Reveal id={`${baseId}-economics-header`}>
              <div className={styles.ecoHeader}>
                <div className={styles.ecoTitle}>
                  <h2>{economicsSection.title}</h2>
                  <p>{economicsSection.description}</p>
                </div>
                <div className={styles.modelStack}>
                  <div className={styles.stackText}>
                    <span>Model Stack</span>
                    <strong>{economicsSection.modelName}</strong>
                  </div>
                  <Rocket className={styles.rocket} />
                </div>
              </div>
            </Reveal>

            {economicsSection.metrics && economicsSection.metrics.length > 0 && (
              <Reveal id={`${baseId}-economics-report`}>
                <div className={styles.reportCard}>
                  <div className={styles.reportHeader}>
                    <h2>
                      <PieChart className={styles.pie} size={24} />
                      {economicsSection.reportTitle}
                    </h2>
                    <p className={styles.mono}>{economicsSection.reportSubtitle}</p>
                  </div>

                  <div className={styles.reportGrid}>
                    {economicsSection.metrics.map((metric, index) => {
                      const IconComponent = iconMap[metric.iconName] || BarChart3;
                      return (
                        <div 
                          key={index} 
                          className={styles.reportMetric}
                          id={`${baseId}-metric-${index}`}
                        >
                          <IconComponent className={styles.mIcon} size={20} />
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
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            )}

            <div className={styles.bottomCards} id={`${baseId}-economics-footer`}>
              {economicsSection.bottomLeftCard && (
                <Reveal direction="left" id={`${baseId}-bottom-left-card`}>
                  <div className={styles.infoCard}>
                    <h3>{economicsSection.bottomLeftCard.title}</h3>
                    <p>{economicsSection.bottomLeftCard.description}</p>
                    <div className={styles.footer}>
                      <span className={styles.roi}>{economicsSection.bottomLeftCard.roi}</span>
                      <Zap size={16} className={styles.zap} />
                    </div>
                  </div>
                </Reveal>
              )}

              {economicsSection.bottomRightCard && (
                <Reveal direction="right" id={`${baseId}-bottom-right-card`}>
                  <div className={styles.ctaCard}>
                    <div className={styles.ctaBg}>
                      <Rocket size={100} />
                    </div>
                    <div className={styles.content}>
                      <h3>{economicsSection.bottomRightCard.title}</h3>
                      <p>{economicsSection.bottomRightCard.description}</p>
                      <EmailActionButton 
                        label={economicsSection.bottomRightCard.buttonText} 
                        className={styles.auditButton}
                        id={`${baseId}-cta-button`}
                      />
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        )}

        {/* Personas Section */}
        {personas && (
          <section className={styles.personasSection} id={`${baseId}-personas`}>
            <Reveal id={`${baseId}-personas-header`}>
              <h2 className={styles.sectionTitle}>{personas.title}</h2>
            </Reveal>
            <StaggerContainer className={styles.personaGrid}>
              {personas.items.map((persona, index) => (
                <Reveal key={index} direction="up" id={`${baseId}-persona-${index}`}>
                  <div className={styles.personaCard}>
                    <h3>{persona.title}</h3>
                    <div className={styles.personaContent}>
                      <div className={styles.pBox}>
                        <span className={styles.pLabel}>Problem:</span>
                        <p>{persona.problem}</p>
                      </div>
                      <div className={styles.pBox}>
                        <span className={styles.pLabel}>Outcome:</span>
                        <p>{persona.outcome}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </StaggerContainer>
          </section>
        )}

        {/* Pricing/ROI Cards */}
        {roiStats && roiStats.length > 0 && (
          <StaggerContainer 
            className={styles.pricingGrid} 
            id={`${baseId}-roi-grid`}
          >
            {roiStats.map((stat, index) => {
              const IconComponent = iconMap[stat.iconName] || Target;
              const cardId = `${baseId}-roi-card-${index}`;
              return (
                <Reveal key={index} direction="up" id={cardId}>
                  <div className={styles.pricingCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.iconWrapper}>
                        <IconComponent size={20} />
                      </div>
                      <span className={styles.value}>{stat.value}</span>
                    </div>
                    <h3 className={styles.label}>{stat.label}</h3>
                    <p className={styles.detail}>{stat.detail}</p>
                  </div>
                </Reveal>
              );
            })}
          </StaggerContainer>
        )}

        {/* Features Grid */}
        {features && features.length > 0 && (
          <div className={styles.mainFeatures} id={`${baseId}-features`}>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.iconName] || Brain;
              const cardId = `${baseId}-feature-${index}`;
              return (
                <Reveal 
                  key={index} 
                  direction={index % 2 === 0 ? "left" : "right"}
                  id={cardId}
                >
                  <div className={styles.featureCard}>
                    <div className={styles.bgIcon}>
                      <IconComponent size={120} />
                    </div>
                    <div className={`${styles.iconBox} ${styles[feature.color] || styles.blue}`}>
                      <IconComponent size={32} />
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
              );
            })}
          </div>
        )}

        {/* Deep Intel Section */}
        {intelSection && (
          <div className={styles.intelSection} id={`${baseId}-intel`}>
            <Reveal id={`${baseId}-intel-header`}>
              <div className={styles.sectionHeader}>
                <h2>{intelSection.title}</h2>
                <p className={styles.mono}>{intelSection.subtitle}</p>
              </div>
            </Reveal>
            
            {intelSection.details && intelSection.details.length > 0 && (
              <StaggerContainer 
                className={styles.intelGrid}
                id={`${baseId}-intel-grid`}
              >
                {intelSection.details.map((detail, index) => {
                  const IconComponent = iconMap[detail.iconName] || Activity;
                  const cardId = `${baseId}-intel-card-${index}`;
                  return (
                    <Reveal key={index} distance={20} id={cardId}>
                      <div className={styles.intelCard}>
                        <IconComponent className={styles.icon} size={28} />
                        <h4>{detail.label}</h4>
                        <p>{detail.description}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </StaggerContainer>
            )}
          </div>
        )}

        {/* Testimonials Section */}
        {testimonials && (
          <section className={styles.testimonialsSection} id={`${baseId}-testimonials`}>
            <Reveal id={`${baseId}-testimonials-header`}>
              <h2 className={styles.sectionTitle}>{testimonials.title}</h2>
            </Reveal>
            <StaggerContainer className={styles.testimonialGrid}>
              {testimonials.items.map((testimonial, index) => (
                <Reveal key={index} direction="up" id={`${baseId}-testimonial-${index}`}>
                  <div className={styles.testimonialCard}>
                    <MessageSquare className={styles.quoteIcon} size={32} />
                    <blockquote className={styles.quote}>"{testimonial.quote}"</blockquote>
                    <div className={styles.author}>
                      <strong>{testimonial.author}</strong>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </StaggerContainer>
          </section>
        )}

        {/* FAQs Section */}
        {faqs && (
          <section className={styles.faqsSection} id={`${baseId}-faqs`}>
            <Reveal id={`${baseId}-faqs-header`}>
              <h2 className={styles.sectionTitle}>{faqs.title}</h2>
            </Reveal>
            <div className={styles.faqList}>
              {faqs.items.map((faq, index) => (
                <Reveal key={index} direction="up" id={`${baseId}-faq-${index}`}>
                  <div className={styles.faqItem}>
                    <h4>{faq.question}</h4>
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Architecture Section */}
        {architecture && (
          <div className={styles.architectureSection} id={`${baseId}-architecture`}>
            <Reveal id={`${baseId}-arch-header`}>
              <h2 className={styles.sectionTitle}>{architecture.title}</h2>
              <p className={styles.sectionOverview}>{architecture.overview}</p>
            </Reveal>
            <div className={styles.archGrid}>
              {architecture.components.map((comp, index) => (
                <Reveal key={index} direction="up" id={`${baseId}-arch-comp-${index}`}>
                  <div className={styles.archCard}>
                    <div className={styles.archBadge}>{comp.role}</div>
                    <h3>{comp.name}</h3>
                    <ul>
                      {comp.details.map((detail, dIndex) => (
                        <li key={dIndex}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* API Reference Section */}
        {apiReference && (
          <div className={styles.apiSection} id={`${baseId}-api`}>
            <Reveal id={`${baseId}-api-header`}>
              <h2 className={styles.sectionTitle}>{apiReference.title}</h2>
            </Reveal>
            <div className={styles.apiList}>
              {apiReference.endpoints.map((endpoint, index) => (
                <Reveal key={index} direction="up" id={`${baseId}-api-endpoint-${index}`}>
                  <div className={styles.apiItem}>
                    <div className={styles.apiHeader}>
                      <span className={`${styles.method} ${styles[endpoint.method.toLowerCase()]}`}>
                        {endpoint.method}
                      </span>
                      <code className={styles.path}>{endpoint.path}</code>
                    </div>
                    <p className={styles.apiDesc}>{endpoint.description}</p>
                    {endpoint.params && endpoint.params.length > 0 && (
                      <table className={styles.paramsTable}>
                        <thead>
                          <tr>
                            <th>Param</th>
                            <th>Type</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.params.map((param, pIndex) => (
                            <tr key={pIndex}>
                              <td><code>{param.name}</code></td>
                              <td><span className={styles.paramType}>{param.type}</span></td>
                              <td>{param.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Custom Info Blocks */}
        {customBlocks && customBlocks.length > 0 && (
          <div className={styles.customBlocks} id={`${baseId}-custom`}>
            {customBlocks.map((block, index) => (
              <Reveal key={index} direction="up" id={`${baseId}-custom-block-${index}`}>
                <div className={styles.customBlock}>
                  <h2>{block.title}</h2>
                  {block.subtitle && <p className={styles.mono}>{block.subtitle}</p>}
                  <div className={styles.customContent}>
                    {block.content}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Hero Section */}
        {header && (
          <div className={styles.hero} id={`${baseId}-hero`}>
            <Reveal>
              {header.badgeText && (
                <div className={styles.badge} id={`${baseId}-hero-badge`}>
                  <Cpu size={14} />
                  <span>{header.badgeText}</span>
                </div>
              )}
              <h1 className={styles.title} id={`${baseId}-hero-title`}>
                {header.titleLine1} <br />
                <span className={styles.gradient}>{header.titleGradient}</span>
              </h1>
              {
                economicsSection && <div className="centeredWrapper">
                <EmailActionButton 
                  label={economicsSection.bottomRightCard.buttonText} 
                  className={styles.auditButton}
                  id={`${baseId}-cta-button`}
                />
              </div>
              }
              <p className={styles.subtitle} id={`${baseId}-hero-subtitle`}>
                {header.subtitle}
              </p>
            </Reveal>
          </div>
        )}
      </div>
    </ProceduralTemplate>
  );
}
