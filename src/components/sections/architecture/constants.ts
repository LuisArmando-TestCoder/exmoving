export interface JourneyStepData {
  label: string;
  title: string;
  description: string;
  tags: string[];
}

export const journeySteps: JourneyStepData[] = [
  {
    label: "PHASE I: THE FRICTION",
    title: "Breaking Company Chains",
    description: "Under-capitalized, wrong people, bad markets. We identify the operational friction that breaks companies and transform it into measurable returns.",
    tags: ["Market Habituation", "Value Erosion", "ROI Analysis"]
  },
  {
    label: "PHASE II: THE CATALYST",
    title: "ROI Without Supervision",
    description: "Pricing agents that read emails, organize quotes, and take action. A system that brings passive income from non-agnostic sources using Gemini Flash efficiency.",
    tags: ["Gemini Flash Latest", "Pricing Agents", "TypeSense Indexing"]
  },
  {
    label: "PHASE III: THE ACCELERATION",
    title: "Auto-Automation CRM",
    description: "From call transcripts to functional tools. Our auto-customizable platform generates agents on their own, allowing individuals to manage businesses with least friction.",
    tags: ["Transcript-to-Tool", "Generative AI", "Self-Supervising"]
  },
  {
    label: "PHASE IV: THE EXIT",
    title: "The Public Evolution",
    description: "Turning internal processes into a global platform. Buying GPU racks, hosting generative AIs locally, and increasing valuation 10x before the grand transition.",
    tags: ["GPU Infrastructure", "Platform Expansion", "10x Valuation"]
  },
  {
    label: "PHASE V: BEYOND",
    title: "Expanding & Enhancing",
    description: "Reconfigurable cities underwater and in space. Using the exit to help more people, because knowing something deeply is to love it deeply.",
    tags: ["Space Mining", "Dyson Spheres", "Interstellar Travel"]
  }
];
