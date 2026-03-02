import { getBaseEmailWrapper } from "./base";

export const getNewsletterTemplate = (email: string, extractedInfo?: any) => {
  const name = extractedInfo?.name || 'Vanguard Member';
  const bio = extractedInfo?.bio || 'No business details provided.';
  const language = extractedInfo?.language || 'en';

  const content = `
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
  `;

  const footer = `AI Executions Engine &bull; ${new Date().toUTCString()}`;

  return {
    subject: `✨ New Member Joined: ${email}`,
    text: `New newsletter subscription from: ${email}\n\nExtracted Info:\nName: ${name}\nBio: ${bio}\nLanguage: ${language}`,
    html: getBaseEmailWrapper("New Vanguard Member", content, footer, "✨")
  };
};
