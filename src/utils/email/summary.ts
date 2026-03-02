import { getBaseEmailWrapper } from "./base";

export const getEmailTemplate = (text: string, isAuto: boolean = false, isAbandoned: boolean = false, historyRecords: any[] = [], metadata: any = {}, behaviorNotes: string = "", patternSummary: string = "", resourceDossier: string = "", isError: boolean = false) => {
  // Parse out sections if they exist
  const historyMatch = text.match(/CHAT HISTORY:\n([\s\S]*?)(?=\n\nBEHAVIORAL OBSERVATIONS:|$)/);
  const behaviorMatch = text.match(/BEHAVIORAL OBSERVATIONS:\n([\s\S]*)$/);
  const erraticMatch = text.match(/\[ERRATIC BEHAVIOR DETECTED\]/);

  const history = historyMatch ? historyMatch[1].trim() : text;
  const behavior = behaviorMatch ? behaviorMatch[1].trim() : "";
  const isErratic = !!erraticMatch;

  let statusEmoji = isError ? '🚨' : (isErratic ? '❌' : (isAbandoned ? '⚠️' : '✅'));
  let statusText = isError ? 'System Error' : (isErratic ? 'Erratic Behavior' : (isAbandoned ? 'Abandoned Chat' : 'Success'));

  const headerGradient = isError ? 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' : 
                        (isErratic ? 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)' : 
                        (isAbandoned ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' : 
                        'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'));

  const metadataGrid = metadata && Object.keys(metadata).length > 0 ? `
    <div style="margin-top: 32px; background: #F8FAFC; border-radius: 24px; border: 1px solid #E2E8F0; padding: 28px; position: relative; overflow: hidden;">
      <div style="display: flex; align-items: center; margin-bottom: 24px; gap: 8px;">
        <div style="width: 4px; height: 16px; background: #3B82F6; border-radius: 2px;"></div>
        <h3 style="margin: 0; color: #0F172A; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em;">Forensic System Data</h3>
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding-bottom: 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td width="50%" style="padding-right: 12px;">
                  <p style="margin: 0 0 6px 0; color: #64748B; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Entry Path</p>
                  <p style="margin: 0; color: #0F172A; font-size: 14px; font-weight: 600; font-family: monospace;">${metadata.path || '—'}</p>
                </td>
                <td width="50%">
                  <p style="margin: 0 0 6px 0; color: #64748B; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Platform</p>
                  <p style="margin: 0; color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.platform || '—'}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 20px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td width="50%" style="padding-right: 12px;">
                  <p style="margin: 0 0 6px 0; color: #64748B; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Display Architecture</p>
                  <p style="margin: 0; color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.screenResolution || '—'}</p>
                </td>
                <td width="50%">
                  <p style="margin: 0 0 6px 0; color: #64748B; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Hardware Tier</p>
                  <p style="margin: 0; color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.hardwareConcurrency || '?'} Core / ${metadata.deviceMemory || '?'}GB RAM</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="border-top: 1px solid #E2E8F0; padding-top: 20px;">
            <p style="margin: 0 0 6px 0; color: #64748B; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Geolocation / Timezone</p>
            <p style="margin: 0; color: #0F172A; font-size: 14px; font-weight: 600;">${metadata.timezone || '—'}</p>
          </td>
        </tr>
      </table>
    </div>
  ` : '';
  
  const historySummary = historyRecords.length > 0 
    ? `
      <div style="margin-top: 24px; padding: 20px; background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
        <h3 style="margin: 0 0 12px 0; color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Interaction History</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${historyRecords.map(r => `
            <span style="padding: 4px 10px; border-radius: 20px; font-size: 12px; background-color: ${r.status === 'success' ? '#ECFDF5' : '#FEF2F2'}; color: ${r.status === 'success' ? '#059669' : '#DC2626'}; border: 1px solid ${r.status === 'success' ? '#10B98133' : '#EF444433'};">
              ${r.status === 'success' ? '✅' : '❌'} ${r.date}
            </span>
          `).join('')}
        </div>
      </div>
    ` : '';

  const formattedHistory = history.split('\n\n').map(message => {
    const isModel = message.startsWith('MODEL:');
    const isUser = message.startsWith('USER:');
    
    if (isModel || isUser) {
      const content = message.replace(/^(MODEL|USER):\s/, '');
      return `
        <div style="margin-bottom: 16px; padding: 16px; border-radius: 12px; background-color: ${isModel ? '#F8FAFC' : '#EFF6FF'}; border-left: 4px solid ${isModel ? '#94A3B8' : '#3B82F6'};">
          <p style="margin: 0; font-size: 11px; font-weight: 700; color: ${isModel ? '#64748B' : '#1D4ED8'}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
            ${isModel ? 'AI Assistant' : 'User'}
          </p>
          <p style="margin: 0; color: #1E293B; line-height: 1.6; font-size: 15px;">
            ${content}
          </p>
        </div>
      `;
    }
    return `<p style="margin: 0 0 12px 0; color: #64748B; line-height: 1.6; font-size: 14px;">${message}</p>`;
  }).join('');

  const content = `
    ${historySummary}

    ${patternSummary ? `
    <!-- Pattern Summary -->
    <div style="margin-top: 32px; padding: 24px; background: ${isErratic ? '#FEF2F2' : '#F0FDF4'}; border-radius: 20px; border: 1px solid ${isErratic ? '#FEE2E2' : '#DCFCE7'};">
      <h2 style="margin: 0 0 12px 0; color: ${isErratic ? '#991B1B' : '#166534'}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 800;">
        Behavioral Pattern Recognition
      </h2>
      <p style="margin: 0; color: #111827; font-size: 16px; line-height: 1.6; font-weight: 600; font-style: italic;">
        &ldquo;${patternSummary}&rdquo;
      </p>
    </div>
    ` : ''}

    ${behavior || behaviorNotes ? `
    <!-- Behavior Section -->
    <div style="margin-top: 32px; padding: 24px; background: #F8FAFC; border-radius: 20px; border: 1px solid #E2E8F0;">
      <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
        Behavioral Intelligence & Notes
      </h2>
      ${behavior ? `
        <p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          <strong>Current Analysis:</strong><br/>
          ${behavior.replace(/\n/g, '<br />')}
        </p>
      ` : ''}
      ${behaviorNotes ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
          <p style="margin: 0 0 8px 0; color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Interaction Log / Behavior Notes</p>
          <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5; font-family: monospace;">
            ${behaviorNotes.replace(/\n/g, '<br />')}
          </p>
        </div>
      ` : ''}
    </div>
    ` : ''}

    <!-- Metadata Section -->
    ${metadataGrid}

    <!-- Resource Dossier -->
    ${resourceDossier}

    <!-- Chat History Section -->
    <h2 style="margin: 32px 0 20px 0; color: #0F172A; font-size: 18px; font-weight: 700;">
      Conversation Transcript
    </h2>
    
    <div style="margin-bottom: 32px;">
      ${formattedHistory}
    </div>
  `;

  const footer = `<strong>ΣXECUTIONS INTELLIGENCE UNIT</strong> &bull; ${new Date().toUTCString()}`;

  return {
    subject: `${statusEmoji} ${statusText}: ${isAuto ? 'Auto' : 'User'} Report`,
    text,
    html: getBaseEmailWrapper(statusText, content, footer, statusEmoji, headerGradient)
  };
};
