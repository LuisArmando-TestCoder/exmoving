export const getBaseEmailWrapper = (title: string, content: string, footer: string, headerEmoji: string = "🚀", headerGradient: string = "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)") => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
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
      .header { padding: 32px 16px !important; }
      .content { padding: 32px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; -webkit-font-smoothing: antialiased;">
  <div role="article" aria-roledescription="email" aria-label="${title}" lang="en">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 0;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            
            <!-- Header -->
            <tr>
              <td class="header" style="background: ${headerGradient}; padding: 48px 32px; text-align: center; border-bottom: 1px solid #E2E8F0;">
                <div style="display: inline-block; padding: 12px; background: rgba(59, 130, 246, 0.05); border-radius: 16px; margin-bottom: 20px;">
                  <span style="font-size: 40px;">${headerEmoji}</span>
                </div>
                <h1 style="margin: 0; color: #0F172A; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">
                  ${title}
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="content" style="padding: 40px 32px; color: #334155;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #F1F5F9; padding: 32px; text-align: center; border-top: 1px solid #E2E8F0;">
                <p style="margin: 0; color: #64748B; font-size: 12px; font-weight: 600; letter-spacing: 0.05em;">
                  ${footer}
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
  `;
};
