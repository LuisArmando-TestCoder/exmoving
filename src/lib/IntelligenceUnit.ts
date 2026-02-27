/**
 * ΣXECUTIONS INTELLIGENCE UNIT (EIU)
 * Centralized module for LLM telemetry, cost analysis, and forensic logging.
 */

export interface UsageMetrics {
  inputTokens: number;
  outputTokens: number;
  modelId: string;
  operation: string;
}

export interface SessionTotals {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  modelsUsed: Set<string>;
}

// Pricing per 1M tokens (Feb 2026 Family)
// Logic: Version agnostic. Uses highest Flash price for "latest" to be conservative.
const PRICING_MAP: Record<string, { in: number; out: number }> = {
  "gemini-3-flash": { in: 0.50, out: 3.00 },
  "gemini-2.5-flash": { in: 0.30, out: 2.50 },
  "gemini-2.5-flash-lite": { in: 0.10, out: 0.40 },
  "gemini-2.0-flash": { in: 0.10, out: 0.40 },
  "gemini-2.0-flash-lite": { in: 0.075, out: 0.30 },
  "gemini-1.5-flash": { in: 0.075, out: 0.30 },
  "flash": { in: 0.50, out: 3.00 }, // Default Flash catch-all (Highest Flash price)
  "default": { in: 0.10, out: 0.40 },
};

export class IntelligenceUnit {
  private static getPricing(modelId: string) {
    const modelLower = modelId.toLowerCase();
    
    // Exact versions first
    const specificVersion = Object.keys(PRICING_MAP).find(k => modelLower.includes(k) && k !== "flash" && k !== "default");
    if (specificVersion) return PRICING_MAP[specificVersion];

    // Catch-all for "flash" or "latest" logic
    if (modelLower.includes("flash")) return PRICING_MAP["flash"];

    return PRICING_MAP["default"];
  }

  /**
   * Estimates tokens based on character count (approx 4 chars per token for EN)
   */
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculates USD cost for a specific usage burst
   */
  static calculateCost(metrics: UsageMetrics): number {
    const pricing = this.getPricing(metrics.modelId);
    const inCost = (metrics.inputTokens / 1_000_000) * pricing.in;
    const outCost = (metrics.outputTokens / 1_000_000) * pricing.out;
    return inCost + outCost;
  }

  /**
   * Outputs an ultra-modern, stylized forensic log to the console
   */
  static logTelemetry(metrics: UsageMetrics, cost: number, context: string = "") {
    const labelStyle = "color: #3B82F6; font-weight: 800; font-family: monospace;";
    const valueStyle = "color: #E2E8F0; font-weight: 600; font-family: monospace;";
    const costStyle = "color: #10B981; font-weight: 800; font-family: monospace;";
    const headerStyle = "background: #1E293B; color: #FFFFFF; padding: 4px 8px; border-radius: 4px; font-weight: 900; font-family: sans-serif; border: 1px solid #334155;";
    const subStyle = "color: #64748B; font-style: italic; font-size: 11px;";

    console.groupCollapsed(`%cΣXECUTIONS INTEL%c ${metrics.operation.toUpperCase()}`, headerStyle, "color: #94A3B8; font-weight: 400; margin-left: 8px;");
    
    console.log(`%c⎿ Model identified  :%c ${metrics.modelId}`, labelStyle, valueStyle);
    console.log(`%c⎿ Input Context    :%c ${metrics.inputTokens} tokens`, labelStyle, valueStyle);
    console.log(`%c⎿ Model Generation :%c ${metrics.outputTokens} tokens`, labelStyle, valueStyle);
    console.log(`%c⎿ Computed Cost     :%c $${cost.toFixed(6)} USD`, labelStyle, costStyle);
    
    if (context) {
      console.log(`%c⎿ Intelligence Context:`, labelStyle);
      console.log(`%c${context}`, subStyle);
    }
    
    console.groupEnd();
  }

  /**
   * Forensic summary of the entire session expenditure
   */
  static logSessionSummary(totals: SessionTotals) {
    const headerStyle = "background: #0F172A; color: #10B981; padding: 6px 12px; border-radius: 8px; font-weight: 900; font-family: sans-serif; border: 1px solid #10B981; font-size: 14px;";
    const labelStyle = "color: #94A3B8; font-weight: 800; font-family: monospace;";
    const valueStyle = "color: #FFFFFF; font-weight: 600; font-family: monospace;";
    const totalStyle = "color: #10B981; font-weight: 900; font-family: monospace; font-size: 14px;";

    console.log("%c📊 SESSION RESOURCE EXPENDITURE REPORT", headerStyle);
    console.log(`%c⎿ Aggregated Inbound  :%c ${totals.totalInputTokens.toLocaleString()} tokens`, labelStyle, valueStyle);
    console.log(`%c⎿ Aggregated Outbound :%c ${totals.totalOutputTokens.toLocaleString()} tokens`, labelStyle, valueStyle);
    console.log(`%c⎿ Models Engaged      :%c ${Array.from(totals.modelsUsed).join(', ')}`, labelStyle, valueStyle);
    console.log(`%c⎿ TOTAL COMPUTATIONAL OVERHEAD :%c $${totals.totalCost.toFixed(6)} USD`, labelStyle, totalStyle);
    console.log("%c------------------------------------------------------------------", "color: #1E293B;");
  }

  /**
   * Generates the ultra-modern HTML block for email reports
   */
  static generateResourceDossierHTML(totals: SessionTotals): string {
    return `
      <div style="margin-top: 32px; background: linear-gradient(180deg, rgba(16, 185, 129, 0.03) 0%, rgba(15, 23, 42, 0.01) 100%); border-radius: 24px; border: 1px solid rgba(16, 185, 129, 0.1); padding: 28px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; width: 120px; height: 120px; background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%);"></div>
        
        <div style="display: flex; align-items: center; margin-bottom: 24px;">
          <div style="width: 4px; height: 16px; background: #10B981; border-radius: 2px; margin-right: 8px;"></div>
          <h3 style="margin: 0; color: #FFFFFF; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em;">Resource Intelligence Dossier</h3>
        </div>

        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="33%" style="padding-right: 12px;">
              <p style="margin: 0 0 6px 0; color: #475569; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Context Inbound</p>
              <p style="margin: 0; color: #E2E8F0; font-size: 16px; font-weight: 700;">${totals.totalInputTokens.toLocaleString()} <span style="font-size: 10px; color: #64748B;">tokens</span></p>
            </td>
            <td width="33%" style="padding-right: 12px;">
              <p style="margin: 0 0 6px 0; color: #475569; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Generation Outbound</p>
              <p style="margin: 0; color: #E2E8F0; font-size: 16px; font-weight: 700;">${totals.totalOutputTokens.toLocaleString()} <span style="font-size: 10px; color: #64748B;">tokens</span></p>
            </td>
            <td width="33%">
              <p style="margin: 0 0 6px 0; color: #475569; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Session Overhead</p>
              <p style="margin: 0; color: #10B981; font-size: 16px; font-weight: 800;">$${totals.totalCost.toFixed(5)} <span style="font-size: 10px; color: #64748B;">USD</span></p>
            </td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04);">
          <p style="margin: 0; color: #64748B; font-size: 11px; font-weight: 600;">
            <span style="color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 8px;">Models Engaged:</span> 
            ${Array.from(totals.modelsUsed).join(', ')}
          </p>
        </div>
      </div>
    `;
  }
}
