"use client";

import { motion } from "framer-motion";
import { DollarSign, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import ProceduralTemplate from "@/components/ProceduralTemplate";
import { Reveal } from "@/components/ui/Reveal";

const pricingFeatures = [
  {
    icon: DollarSign,
    title: "Flat Rate Consultations",
    description: "Transparent, one-time fees for moving logistics planning and strategy."
  },
  {
    icon: Zap,
    title: "Efficiency Gains",
    description: "Maximize your moving operations ROI through streamlined procedural optimization."
  },
  {
    icon: ShieldCheck,
    title: "Risk Mitigation",
    description: "Expert analysis to minimize operational hazards and unforeseen costs."
  },
  {
    icon: TrendingUp,
    title: "Scale Optimization",
    description: "Pricing tiers designed to grow alongside your moving business volume."
  }
];

export default function MovingPricingPage() {
  return (
    <ProceduralTemplate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-24">
        {pricingFeatures.map((feature, index) => (
          <Reveal key={index} delay={index * 0.1}>
            <div className="glass-card flex flex-col items-start gap-4 h-full">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-dim">{feature.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </ProceduralTemplate>
  );
}
