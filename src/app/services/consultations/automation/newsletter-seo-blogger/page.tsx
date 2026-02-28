import AutomationServicePage from "@/components/ui/AutomationServicePage";
import styles from "./NewsletterSeoBlogger.module.scss";

export default function NewsletterSeoBloggerPage() {
  return (
    <AutomationServicePage
      header={{
        badgeText: "Beta Launch: 35% off on yearly plans!",
        titleLine1: "AI-POWERED NEWSLETTERS,",
        titleGradient: "EFFORTLESSLY",
        subtitle: "Transform any news source into personalized articles for your subscribers, in their language, and in your brand's voice."
      }}
      features={[
        {
          iconName: "UserCheck",
          title: "Hyper-Personalization",
          description: "AI analyzes your website to understand your audience and tailors articles to their interests.",
          metric: "Personalized",
          color: "blue"
        },
        {
          iconName: "Zap",
          title: "Automated Creation",
          description: "Set your schedule and let AI select, write, and translate articles for you automatically.",
          metric: "Hands-free",
          color: "amber"
        },
        {
          iconName: "Languages",
          title: "Global Reach",
          description: "Seamlessly translate articles into your subscribers' native languages to reach a global audience.",
          metric: "Multilingual",
          color: "emerald"
        }
      ]}
      roiStats={[
        { label: "Creation Time", value: "90%", iconName: "TrendingDown", detail: "Reduction in effort" },
        { label: "Engagement", value: "2x", iconName: "TrendingUp", detail: "Increase observed" },
        { label: "Content Delivery", value: "5x", iconName: "Zap", detail: "Faster delivery" }
      ]}
      intelSection={{
        title: "GET STARTED IN 3 SIMPLE STEPS",
        subtitle: "The future of newsletters is here",
        details: [
          { iconName: "Link", label: "1. Connect", description: "Link any news source for AI analysis." },
          { iconName: "Mic", label: "2. Define Voice", description: "AI learns your brand's personality." },
          { iconName: "Send", label: "3. Launch", description: "Personalized newsletters on your schedule." }
        ]
      }}
      economicsSection={{
        title: "PERFECT FOR YOUR BUSINESS",
        description: "From startups to enterprises, our tool is designed to help you grow.",
        modelName: "Flexible Plans",
        reportTitle: "Pricing Overview",
        reportSubtitle: "Save 35% on yearly plans",
        metrics: [
          { iconName: "Free", label: "Free Plan", value: "$0", detail: "1 source, 100 users" },
          { iconName: "Zap", label: "Starter", value: "$17", detail: "5 sources, 100k users" },
          { iconName: "TrendingUp", label: "Growth", value: "$35", detail: "17 sources, 250k users" }
        ],
        bottomLeftCard: { title: "Content Creators", description: "Automate your process and focus on growing your community.", roi: "100% Auto" },
        bottomRightCard: { title: "Ready to Revolutionize?", description: "Start your free trial today and experience the future of news.", buttonText: "GET STARTED FOR FREE" }
      }}
    />
  );
}
