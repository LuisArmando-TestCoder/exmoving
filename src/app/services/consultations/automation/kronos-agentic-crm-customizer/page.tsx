import AutomationServicePage from "@/components/ui/AutomationServicePage";
import styles from "./KronosAgenticCrmCustomizer.module.scss";

export default function KronosAgenticCrmCustomizerPage() {
  return (
    <AutomationServicePage
      header={{
        badgeText: "New Automation Service",
        titleLine1: "KRONOS / AGENTIC CRM CUSTOMIZER",
        titleGradient: "SOLUTIONS",
        subtitle: "A flexible and powerful solution tailored for your specific needs."
      }}
      features={[
        {
          iconName: "Brain",
          title: "Intelligent Core",
          description: "Smart processing customized for your domain.",
          metric: "High Efficiency",
          color: "blue"
        },
        {
          iconName: "Zap",
          title: "Rapid Deployment",
          description: "Get up and running in record time.",
          metric: "Fast",
          color: "amber"
        }
      ]}
      roiStats={[
        { label: "Cost Reduction", value: "30%", iconName: "TrendingDown", detail: "Average savings" },
        { label: "Time Saved", value: "10h+", iconName: "Clock", detail: "Per week" }
      ]}
      intelSection={{
        title: "HOW IT WORKS",
        subtitle: "The architecture behind the solution",
        details: [
          { iconName: "Activity", label: "Streamlined Workflow", description: "Efficient data processing." }
        ]
      }}
      economicsSection={{
        title: "ECONOMICS",
        description: "Transparent, performance-driven pricing based on real value.",
        modelName: "Optimized Engine",
        reportTitle: "Performance Metrics",
        reportSubtitle: "Real-time analysis",
        metrics: [
          { iconName: "BarChart3", label: "Efficiency", value: "99%", detail: "Resource utilization" }
        ],
        bottomLeftCard: { title: "Cost-Effective", description: "Maximize your ROI with intelligent automation.", roi: "20x" },
        bottomRightCard: { title: "Ready to Scale?", description: "Let's build your custom solution.", buttonText: "GET STARTED" }
      }}
    />
  );
}
