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

export const getEmailTemplate = (text: string, isAuto: boolean = false) => {
  // Parse out sections if they exist
  const historyMatch = text.match(/CHAT HISTORY:\n([\s\S]*?)(?=\n\nBEHAVIORAL OBSERVATIONS:|$)/);
  const behaviorMatch = text.match(/BEHAVIORAL OBSERVATIONS:\n([\s\S]*)$/);
  const erraticMatch = text.match(/\[ERRATIC BEHAVIOR DETECTED\]/);

  const history = historyMatch ? historyMatch[1].trim() : text;
  const behavior = behaviorMatch ? behaviorMatch[1].trim() : "";
  const isErratic = !!erraticMatch;

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
    subject: isErratic 
      ? `⚠️ Action Required: Erratic Consultation Detected` 
      : `✨ New Consultation Summary`,
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
              <td class="header" style="background-color: ${isErratic ? '#FEF2F2' : '#F8FAFC'}; padding: 32px; text-align: center; border-bottom: 1px solid ${isErratic ? '#FEE2E2' : '#E2E8F0'};">
                <h1 style="margin: 0; color: ${isErratic ? '#DC2626' : '#0F172A'}; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">
                  ${isErratic ? '⚠️ Erratic Behavior Flagged' : '✨ Consultation Complete'}
                </h1>
                <p style="margin: 8px 0 0 0; color: ${isErratic ? '#991B1B' : '#64748B'}; font-size: 15px;">
                  ${isAuto ? 'Automatically generated system report' : 'User-submitted consultation report'}
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="content" style="padding: 40px 32px;">
                
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
