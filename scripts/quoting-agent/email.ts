import nodemailer from "npm:nodemailer";
import { ENV } from "./config.ts";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  attachments: any[] = [],
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: ENV.EMAIL_USER, pass: ENV.APP_PASSWORD },
  });

  await transporter.sendMail({
    from: ENV.EMAIL_USER,
    to,
    subject,
    text,
    attachments,
  });
  console.log(`LOG: Email sent to ${to} | Subject: ${subject}`);
}
