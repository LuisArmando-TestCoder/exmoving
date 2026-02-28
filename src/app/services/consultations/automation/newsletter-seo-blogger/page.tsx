import AutomationServicePage from "@/components/ui/AutomationServicePage";
import styles from "./NewsletterSeoBlogger.module.scss";

export default function NewsletterSeoBloggerPage() {
  return (
    <div className={styles.page}>
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
            description: "Our AI analyzes your website to understand your audience and automatically tailors articles to their interests and language.",
            metric: "Personalized",
            color: "blue"
          },
          {
            iconName: "Zap",
            title: "Automated Content Creation",
            description: "Set your schedule (daily, weekly, or monthly) and let our AI select, write, and translate articles for you automatically.",
            metric: "Hands-free",
            color: "amber"
          },
          {
            iconName: "ShieldCheck",
            title: "Your Brand, Your Voice",
            description: "The AI learns your brand's personality from your website or custom input, ensuring every newsletter sounds like it was written by you.",
            metric: "Brand Aligned",
            color: "emerald"
          }
        ]}
        roiStats={[
          { label: "Creation Time", value: "90%", iconName: "TrendingDown", detail: "Reduction in creation time based on beta feedback" },
          { label: "Engagement", value: "2x", iconName: "TrendingUp", detail: "Increase in engagement observed in A/B tests" },
          { label: "Content Delivery", value: "5x", iconName: "Zap", detail: "Faster content delivery compared to manual creation" }
        ]}
        intelSection={{
          title: "ADVANCED FEATURES FOR MAXIMUM IMPACT",
          subtitle: "Go beyond simple newsletters and create a powerful marketing channel",
          details: [
            { iconName: "Search", label: "Intelligent Selection", description: "AI scans news sources and selects the most relevant articles for your target audience." },
            { iconName: "Languages", label: "Language Translation", description: "Reach a global audience by automatically translating articles into subscribers' native languages." },
            { iconName: "Activity", label: "Lead Tracking & Analytics", description: "Embed a lead tracker in your company link to monitor engagement and campaign success." }
          ]
        }}
        personas={{
          title: "PERFECT FOR YOUR BUSINESS",
          items: [
            {
              title: "Content Creators",
              problem: "Spending hours curating and writing content for your audience.",
              outcome: "Automate your content creation process and focus on growing your community."
            },
            {
              title: "Marketing Teams",
              problem: "Struggling to create personalized content for a global audience.",
              outcome: "Increase engagement and conversions with hyper-personalized newsletters."
            },
            {
              title: "Businesses",
              problem: "Lacking the resources to create a consistent and engaging newsletter.",
              outcome: "Build a powerful marketing channel that drives traffic with minimal effort."
            }
          ]
        }}
        testimonials={{
          title: "WHAT OUR CUSTOMERS SAY",
          items: [
            {
              quote: "The AI Newsletter Generator has been a game-changer. We're now able to reach our global audience with content that resonates.",
              author: "Alex Chen",
              role: "Head of Growth, Global Tech Inc."
            },
            {
              quote: "I was skeptical at first, but the AI-generated content is incredibly well-written. Our subscribers love it!",
              author: "Samantha Jones",
              role: "Founder, The Content Corner"
            }
          ]
        }}
        faqs={{
          title: "FREQUENTLY ASKED QUESTIONS",
          items: [
            {
              question: "Is there a free trial?",
              answer: "Yes, you can get started for free with our Free plan which includes 1 news source and up to 100 users."
            },
            {
              question: "Can I cancel at any time?",
              answer: "Absolutely. Our plans are flexible and you can cancel your subscription at any time without any hidden fees."
            }
          ]
        }}
        economicsSection={{
          title: "FLEXIBLE PLANS",
          description: "35% savings apply to annual billing only. From startups to enterprises, our tool is designed to help you grow.",
          modelName: "AIBAN Stack",
          reportTitle: "Pricing Models",
          reportSubtitle: "Select the plan that fits your scale",
          metrics: [
            { iconName: "Zap", label: "Starter", value: "$17", detail: "5 sources, 100k users, basic translation" },
            { iconName: "TrendingUp", label: "Growth", value: "$35", detail: "17 sources, 250k users, custom branding" },
            { iconName: "Target", label: "Pro", value: "$80", detail: "25 sources, 500k users, API Access" },
            { iconName: "Globe", label: "Master", value: "$150", detail: "50 sources, Unlimited users, Custom webhooks" }
          ],
          bottomLeftCard: { title: "Get Started for Free", description: "Test the technology with 1 news source and up to 100 users at no cost.", roi: "$0/mo" },
          bottomRightCard: { title: "Ready to Revolutionize?", description: "Start your free trial today and transform your newsletter strategy.", buttonText: "GET STARTED FOR FREE" }
        }}
      />
    </div>
  );
}
