"use server";

import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from "next/headers";

/**
 * Centralized function to send emails
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  // Capture requester IP
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "Direct/Local";

  // Append IP to HTML if provided, otherwise to text
  let finalHtml = html;
  if (html && html.includes("ΣXECUTIONS INTELLIGENCE UNIT")) {
    finalHtml = html.replace(
      "ΣXECUTIONS INTELLIGENCE UNIT",
      `ΣXECUTIONS INTELLIGENCE UNIT &bull; IP: ${ip}`
    );
  }

  // Explicitly inject into System Intelligence if it's an erratic/consultation report
  if (finalHtml && finalHtml.includes("System Intelligence")) {
    // Inject header cell
    finalHtml = finalHtml.replace(
      "Platform</td>",
      "Platform</td><td style=\"color: #94A3B8; font-size: 13px; padding-bottom: 4px; padding-left: 12px;\">IP Address</td>"
    );
    
    // Inject value cell
    finalHtml = finalHtml.replace(
      /(<td style="color: #E2E8F0; font-size: 14px; font-weight: 600;">[^<]*<\/td>)(?=\s*<\/tr>)/,
      `$1<td style="color: #3B82F6; font-size: 14px; font-weight: 700; padding-left: 12px;">${ip}</td>`
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text: text + `\n\nRequester IP: ${ip}`,
    html: finalHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message || error}`);
  }
}

/**
 * Server function for LLM prompts using Gemini
 */
export async function generateLLMResponse({
  prompt,
  systemInstruction,
}: {
  prompt: string;
  systemInstruction?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    systemInstruction: systemInstruction,
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating LLM response:", error);
    throw new Error("Failed to generate LLM response");
  }
}
