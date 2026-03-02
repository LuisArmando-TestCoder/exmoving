import { getBaseEmailWrapper } from "./base";

export const getRequestTemplate = (label: string, email: string, metadata: any) => {
  const content = `
    <!-- User Identity Card -->
    <div style="background: rgba(59, 130, 246, 0.05); border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.1); padding: 24px; margin-bottom: 32px;">
      <p style="margin: 0 0 8px 0; color: #64748B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
        IDENTIFIED USER
      </p>
      <p style="margin: 0; color: #3B82F6; font-size: 20px; font-weight: 700; word-break: break-all;">
        ${email}
      </p>
    </div>

    <!-- Metadata Grid -->
    <h2 style="margin: 0 0 20px 0; color: #0F172A; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
      System Intelligence
    </h2>
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding-bottom: 12px;">
          <div style="background: #F8FAFC; border-radius: 12px; padding: 16px; border: 1px solid #E2E8F0;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="color: #64748B; font-size: 13px; padding-bottom: 4px;">Entry Point</td>
                <td style="color: #64748B; font-size: 13px; padding-bottom: 4px;">Platform</td>
              </tr>
              <tr>
                <td style="color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.path}</td>
                <td style="color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.platform}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px;">
          <div style="background: #F8FAFC; border-radius: 12px; padding: 16px; border: 1px solid #E2E8F0;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="color: #64748B; font-size: 13px; padding-bottom: 4px;">Resolution</td>
                <td style="color: #64748B; font-size: 13px; padding-bottom: 4px;">Cores / Memory</td>
              </tr>
              <tr>
                <td style="color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.screenResolution}</td>
                <td style="color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.hardwareConcurrency} / ${metadata.deviceMemory}GB</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="background: #F8FAFC; border-radius: 12px; padding: 16px; border: 1px solid #E2E8F0;">
            <p style="margin: 0 0 4px 0; color: #64748B; font-size: 13px;">Timezone / Location</p>
            <p style="margin: 0; color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.timezone}</p>
          </div>
        </td>
      </tr>
    </table>

    <!-- UA String -->
    <div style="margin-top: 32px;">
      <p style="margin: 0 0 8px 0; color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
        User Agent String
      </p>
      <p style="margin: 0; color: #475569; font-size: 12px; font-family: monospace; line-height: 1.5; background: #F1F5F9; padding: 12px; border-radius: 8px;">
        ${metadata.userAgent}
      </p>
    </div>
  `;

  const footer = `ΣXECUTIONS INTELLIGENCE UNIT &bull; ${new Date().toISOString()}`;

  return {
    subject: `🚀 New ${label}: ${email}`,
    text: `${label} from ${email}\n\nMetadata:\n${JSON.stringify(metadata, null, 2)}`,
    html: getBaseEmailWrapper(label, content, footer, "🚀")
  };
};
