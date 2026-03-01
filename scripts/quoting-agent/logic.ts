import { CONFIG } from "./config.ts";
import { Provider, QuoteDetail } from "./types.ts";
import {
  getFromFirestore,
  getQuote,
  saveProvider,
  saveQuote,
  saveToFirestore,
  updateMetrics,
} from "./persistence.ts";
import { extractFieldsWithLLM } from "./ai.ts";
import { sendEmail } from "./email.ts";
import { scrapeMoversPOE } from "./scraper.ts";

/**
 * Step 1: Handle Incoming User Submission
 */
export async function onUserSubmission(
  emailContent: string,
  senderEmail: string,
) {
  console.log("LOG: Processing new user submission...");
  await updateMetrics({ category: "userSubmissions" });

  const jobDetails = await extractFieldsWithLLM(emailContent);
  const id = crypto.randomUUID();

  const quoteDoc: QuoteDetail = {
    id,
    senderEmail,
    jobDetails,
    quotes: [],
    marginContribution: jobDetails.marginContribution || 20,
    language: jobDetails.language || "en",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
  };

  await saveQuote(quoteDoc);

  const providers = await scrapeMoversPOE(jobDetails);

  for (const provider of providers) {
    const existing = await getFromFirestore("Providers", provider.email);
    if (!existing) {
      provider.pricing = CONFIG.products;
      await saveProvider(provider);
    }

    const subject =
      `Quote Request: ${jobDetails.origin} to ${jobDetails.destination} ---${id}---`;
    const body = `
      Hello ${provider.name},
      We need a quote for ID ---${id}---:
      - Origin: ${jobDetails.origin}
      - Destination: ${jobDetails.destination}
      - Volume: ${jobDetails.volumeCbm} CBM
      - Method: ${jobDetails.method}
    `;

    await sendEmail(provider.email, subject, body);
  }
}

/**
 * Step 2: gotEmail() - Triggered on Provider Response
 */
export async function gotEmail(emailText: string, senderEmail: string) {
  await updateMetrics({ category: "providerResponses" });

  const idMatch = emailText.match(/---(.*?)---/);
  if (!idMatch) return;
  const id = idMatch[1];

  const existingQuote = await getQuote(id);
  if (!existingQuote) return;

  const updatedDetails = await extractFieldsWithLLM(
    emailText,
    existingQuote.jobDetails,
  );

  existingQuote.jobDetails = updatedDetails;
  existingQuote.quotes.push({
    senderEmail,
    quoteData: updatedDetails,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  existingQuote.updatedAt = new Date().toISOString();

  await saveQuote(existingQuote);

  const createdAt = new Date(existingQuote.createdAt).getTime();
  const now = new Date().getTime();
  if (
    now - createdAt > (CONFIG.comparisonWindowMinutes * 60 * 1000) &&
    existingQuote.status === "pending"
  ) {
    await compareProviders(id);
  }
}

/**
 * Step 3: Provider Comparison & Selection
 */
export async function compareProviders(quoteId: string) {
  const doc = await getQuote(quoteId);
  if (!doc || doc.quotes.length === 0) return;

  doc.status = "comparing";

  const scored = await Promise.all(doc.quotes.map(async (q) => {
    const p = await getFromFirestore("Providers", q.senderEmail) as Provider;
    const rate = q.quoteData.baseRate || 999999;
    const score = (10000 / rate) * (p?.points || 50);
    return { ...q, score, rate };
  }));

  scored.sort((a, b) => b.score - a.score);
  const winner = scored[0];

  const dice = Math.floor(Math.random() * 6) + 1;
  let finalPrice = winner.rate;
  let saved = 0;
  if (dice === 1) {
    saved = finalPrice * 0.1;
    finalPrice *= 0.9;
    console.log("LOG: Lowball hit! Negotiating...");
  }

  // Update Sales Metrics
  await updateMetrics({
    sale: 1,
    spent: finalPrice,
    saved: saved,
  });

  await sendEmail(
    winner.senderEmail,
    `CONFIRM PRICE: ID ${quoteId}`,
    `Confirm price $${finalPrice} for ID ${quoteId}.`,
  );

  for (const email of CONFIG.stakeholders) {
    await sendEmail(
      email,
      `Proposal for ${quoteId}`,
      "Attached is the generated proposal PDF.",
    );
  }

  const global = await getFromFirestore("global", "averages") || { prices: {} };
  await saveToFirestore("global", "averages", global);
  for (const email of CONFIG.stakeholders) {
    await sendEmail(email, "Global Update", "Global averages updated.");
  }

  doc.status = "completed";
  await saveQuote(doc);
}
