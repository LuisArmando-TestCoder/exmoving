import { getBaseEmailWrapper } from "./base";

export const getUserSummaryTemplate = (summary: string) => {
  const content = `
    <div style="background: rgba(59, 130, 246, 0.03); border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.1); padding: 32px; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px 0; color: #3B82F6; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
        EXECUTIVE SUMMARY
      </h2>
      <p style="margin: 0; color: #1E293B; font-size: 16px; line-height: 1.8; font-weight: 400;">
        ${summary}
      </p>
    </div>
    <p style="margin: 0; color: #64748B; font-size: 15px; line-height: 1.6; text-align: center;">
      Our engineering team is currently analyzing your specific requirements. You can expect a follow-up from one of our specialists within the next business days.
    </p>
  `;

  const footer = "ΣXECUTIONS INTELLIGENCE UNIT";

  return {
    subject: "✨ Your Automation Consultation Summary",
    text: `Thank you for consulting with AI Executions. Here is a summary of our discussion:\n\n${summary}\n\nOur team is reviewing your requirements and will contact you shortly.`,
    html: getBaseEmailWrapper("Consultation Summary", content, footer, "✨")
  };
};
