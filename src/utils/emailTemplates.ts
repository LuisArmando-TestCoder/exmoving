export const getNewsletterTemplate = (email: string, extractedInfo?: any) => {
  const name = extractedInfo?.name || 'Vanguard Member';
  const bio = extractedInfo?.bio || 'No business details provided.';
  const language = extractedInfo?.language || 'en';

  return {
    subject: `✨ New Member Joined: ${email}`,
    text: `New newsletter subscription from: ${email}\n\nExtracted Info:\nName: ${name}\nBio: ${bio}\nLanguage: ${language}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Member Joined</title>
  <style>
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 16px !important; }
      .header { padding: 24px 16px !important; }
      .content { padding: 24px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div role="article" aria-roledescription="email" aria-label="New Member" lang="en">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <tr>
              <td class="header" style="background-color: #F8FAFC; padding: 32px; text-align: center; border-bottom: 1px solid #E2E8F0;">
                <h1 style="margin: 0; color: #0F172A; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">
                  ✨ New Vanguard Member
                </h1>
                <p style="margin: 8px 0 0 0; color: #64748B; font-size: 15px;">
                  Access Granted to the Execution Network
                </p>
              </td>
            </tr>
            <tr>
              <td class="content" style="padding: 40px 32px;">
                <div style="margin-bottom: 32px; padding: 20px; background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                  <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
                    Subscriber Details
                  </h2>
                  <p style="margin: 0 0 8px 0; color: #334155; font-size: 15px;">
                    <strong>Email:</strong> ${email}
                  </p>
                  <p style="margin: 0 0 8px 0; color: #334155; font-size: 15px;">
                    <strong>Name:</strong> ${name}
                  </p>
                  <p style="margin: 0 0 8px 0; color: #334155; font-size: 15px;">
                    <strong>Language:</strong> ${language.toUpperCase()}
                  </p>
                </div>

                <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
                  Business Context (AI Extracted)
                </h2>
                <div style="padding: 20px; background-color: #EFF6FF; border-radius: 12px; border: 1px solid #DBEafe;">
                  <p style="margin: 0; color: #1E40AF; font-size: 15px; line-height: 1.6;">
                    ${bio}
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #F8FAFC; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
                <p style="margin: 0; color: #64748B; font-size: 13px;">
                  <strong>AI Executions Engine</strong><br/>
                  ${new Date().toUTCString()}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `
  };
};

export const getRequestTemplate = (label: string, email: string, metadata: any) => {
  return {
    subject: `🚀 New ${label}: ${email}`,
    text: `${label} from ${email}\n\nMetadata:\n${JSON.stringify(metadata, null, 2)}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${label}</title>
  <style>
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 16px !important; }
      .header { padding: 24px 16px !important; }
      .content { padding: 24px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0F172A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div role="article" aria-roledescription="email" aria-label="${label}" lang="en">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F172A; padding: 40px 0;">
      <tr>
        <td align="center">
          <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1E293B; border-radius: 24px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            <!-- Header with Gradient-like feel -->
            <tr>
              <td class="header" style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 48px 32px; text-align: center; border-bottom: 1px solid #334155;">
                <div style="display: inline-block; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 16px; margin-bottom: 20px;">
                  <span style="font-size: 32px;">🚀</span>
                </div>
                <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">
                  ${label}
                </h1>
                <p style="margin: 12px 0 0 0; color: #94A3B8; font-size: 16px; font-weight: 500;">
                  Incoming priority engagement from the edge
                </p>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td class="content" style="padding: 40px 32px;">
                <!-- User Identity Card -->
                <div style="background: rgba(255, 255, 255, 0.03); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 24px; margin-bottom: 32px;">
                  <p style="margin: 0 0 8px 0; color: #64748B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
                    IDENTIFIED USER
                  </p>
                  <p style="margin: 0; color: #3B82F6; font-size: 20px; font-weight: 700; word-break: break-all;">
                    ${email}
                  </p>
                </div>

                <!-- Metadata Grid -->
                <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
                  System Intelligence
                </h2>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <div style="background: rgba(255, 255, 255, 0.02); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="color: #94A3B8; font-size: 13px; padding-bottom: 4px;">Entry Point</td>
                            <td style="color: #94A3B8; font-size: 13px; padding-bottom: 4px;">Platform</td>
                          </tr>
                          <tr>
                            <td style="color: #E2E8F0; font-size: 14px; font-weight: 600;">${metadata.path}</td>
                            <td style="color: #E2E8F0; font-size: 14px; font-weight: 600;">${metadata.platform}</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <div style="background: rgba(255, 255, 255, 0.02); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="color: #94A3B8; font-size: 13px; padding-bottom: 4px;">Resolution</td>
                            <td style="color: #94A3B8; font-size: 13px; padding-bottom: 4px;">Cores / Memory</td>
                          </tr>
                          <tr>
                            <td style="color: #E2E8F0; font-size: 14px; font-weight: 600;">${metadata.screenResolution}</td>
                            <td style="color: #E2E8F0; font-size: 14px; font-weight: 600;">${metadata.hardwareConcurrency} / ${metadata.deviceMemory}GB</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style="background: rgba(255, 255, 255, 0.02); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <p style="margin: 0 0 4px 0; color: #94A3B8; font-size: 13px;">Timezone / Location</p>
                        <p style="margin: 0; color: #E2E8F0; font-size: 14px; font-weight: 600;">${metadata.timezone}</p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- UA String -->
                <div style="margin-top: 32px;">
                  <p style="margin: 0 0 8px 0; color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
                    User Agent String
                  </p>
                  <p style="margin: 0; color: #64748B; font-size: 12px; font-family: monospace; line-height: 1.5; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
                    ${metadata.userAgent}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #0F172A; padding: 32px; text-align: center; border-top: 1px solid #334155;">
                <p style="margin: 0; color: #475569; font-size: 12px; font-weight: 600; letter-spacing: 0.05em;">
                  ΣXECUTIONS INTELLIGENCE UNIT &bull; ${new Date().toISOString()}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `
  };
};

export const getEmailTemplate = (text: string, isAuto: boolean = false, isAbandoned: boolean = false, historyRecords: any[] = []) => {
  // Parse out sections if they exist
  const historyMatch = text.match(/CHAT HISTORY:\n([\s\S]*?)(?=\n\nBEHAVIORAL OBSERVATIONS:|$)/);
  const behaviorMatch = text.match(/BEHAVIORAL OBSERVATIONS:\n([\s\S]*)$/);
  const erraticMatch = text.match(/\[ERRATIC BEHAVIOR DETECTED\]/);

  const history = historyMatch ? historyMatch[1].trim() : text;
  const behavior = behaviorMatch ? behaviorMatch[1].trim() : "";
  const isErratic = !!erraticMatch;

  let statusEmoji = isErratic ? '❌' : (isAbandoned ? '⚠️' : '✅');
  let statusText = isErratic ? 'Erratic Behavior' : (isAbandoned ? 'Abandoned Chat' : 'Success');
  
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

  // Format chat history into a cleaner readable list
  const formattedHistory = history.split('\n\n').map(message => {
    const isModel = message.startsWith('MODEL:');
    const isUser = message.startsWith('USER:');
    
    if (isModel || isUser) {
      const content = message.replace(/^(MODEL|USER):\s/, '');
      return `
        <div style="margin-bottom: 16px; padding: 16px; border-radius: 12px; background-color: ${isModel ? '#F8FAFC' : '#EFF6FF'}; border-left: 4px solid ${isModel ? '#94A3B8' : '#3B82F6'};">
          <p style="margin: 0; font-size: 12px; font-weight: 600; color: ${isModel ? '#475569' : '#1D4ED8'}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
            ${isModel ? 'AI Assistant' : 'User'}
          </p>
          <p style="margin: 0; color: #1E293B; line-height: 1.6; font-size: 15px;">
            ${content}
          </p>
        </div>
      `;
    }
    // Fallback for unparsed lines
    return `<p style="margin: 0 0 12px 0; color: #334155; line-height: 1.6;">${message}</p>`;
  }).join('');

  return {
    subject: `${statusEmoji} ${statusText}: ${isAuto ? 'Auto' : 'User'} Report`,
    text,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Summary</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 16px !important; }
      .header { padding: 24px 16px !important; }
      .content { padding: 24px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; -webkit-font-smoothing: antialiased;">
  
  <div role="article" aria-roledescription="email" aria-label="Consultation Summary" lang="en">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 40px 0;">
      <tr>
        <td align="center">
          
          <!-- Main Container -->
          <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            
            <!-- Header -->
            <tr>
              <td class="header" style="background-color: ${isErratic ? '#FEF2F2' : (isAbandoned ? '#FFFBEB' : '#F8FAFC')}; padding: 32px; text-align: center; border-bottom: 1px solid ${isErratic ? '#FEE2E2' : (isAbandoned ? '#FEF3C7' : '#E2E8F0')};">
                <div style="margin-bottom: 12px;">
                  <span style="font-size: 40px;">${statusEmoji}</span>
                </div>
                <h1 style="margin: 0; color: ${isErratic ? '#DC2626' : (isAbandoned ? '#92400E' : '#0F172A')}; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">
                  ${statusText}
                </h1>
                <p style="margin: 8px 0 0 0; color: #64748B; font-size: 15px;">
                  ${isAuto ? 'Automated System Report' : 'Manual Submission'}
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="content" style="padding: 40px 32px;">
                
                ${historySummary}

                ${behavior ? `
                <!-- Behavior Section -->
                <div style="margin-bottom: 32px; padding: 20px; background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                  <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
                    AI Behavioral Analysis
                  </h2>
                  <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6;">
                    ${behavior.replace(/\n/g, '<br />')}
                  </p>
                </div>
                ` : ''}

                <!-- Chat History Section -->
                <h2 style="margin: 0 0 20px 0; color: #0F172A; font-size: 18px; font-weight: 600;">
                  Conversation Transcript
                </h2>
                
                <div style="margin-bottom: 32px;">
                  ${formattedHistory}
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #F8FAFC; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
                <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">
                  <strong>AI Executions Engine</strong><br/>
                  This is an automated communication.<br/>
                  ${new Date().toUTCString()}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `,
  };
};
