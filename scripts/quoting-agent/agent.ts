/**
 * QUOTING AGENT ARCHITECTURE - MODULARIZED
 * Entry point with IMAP Listener (IDLE)
 */

import { ImapFlow } from "npm:imapflow";
import { simpleParser } from "npm:mailparser";
import { CONFIG, ENV } from "./config.ts";
import { gotEmail, onUserSubmission } from "./logic.ts";
import { updateMetrics } from "./persistence.ts";

const client = new ImapFlow({
  host: "imap.gmail.com",
  port: 993,
  secure: true,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.APP_PASSWORD,
  },
  logger: false,
});

const startEmailBot = async () => {
  try {
    await client.connect();
    console.log("🚀 Quoting Agent connected and waiting for emails...");

    // Selection of INBOX with Lock
    let lock = await client.getMailboxLock("INBOX");

    try {
      // Listener for real-time updates (IDLE)
      client.on("exists", async (data) => {
        console.log(`📩 New message detected! Count: ${data.count}`);

        const message = await client.fetchOne(data.count, { source: true });
        const parsed = await simpleParser(message.source);

        const subject = (parsed.subject || "").toLowerCase();
        const body = parsed.text || "";
        const from = parsed.from?.value[0]?.address || "";

        /**
         * Rerouting logic with centralized identification patterns
         */
        const isUserSubmission = CONFIG.emailIdentification
          .userSubmissionPatterns.some(
            (pattern) =>
              subject.includes(pattern) || body.toLowerCase().includes(pattern),
          );

        const isProviderResponse = CONFIG.emailIdentification
          .providerResponsePatterns.some(
            (pattern) =>
              subject.includes(pattern) || body.toLowerCase().includes(pattern),
          );

        if (isUserSubmission) {
          console.log("🛠️ Trigger: New User Quoting Request detected.");
          await onUserSubmission(body, from);
        } else if (isProviderResponse) {
          console.log(
            `🤖 Trigger: Provider Quote Response detected from ${from}.`,
          );
          await gotEmail(body, from);
        } else {
          console.log(
            `LOG: Ignoring irrelevant email from ${from} | Subject: ${subject}`,
          );
          await updateMetrics({ category: "ignored" });
        }
      });
    } finally {
      lock.release();
    }
  } catch (err) {
    console.error("❌ IMAP Connection Error:", err);
  }
};

client.on("close", () => {
  console.log("⚠️ IMAP Connection closed. Reconnecting in 10 seconds...");
  setTimeout(startEmailBot, 10000);
});

startEmailBot().catch(console.error);

export { gotEmail, onUserSubmission };
