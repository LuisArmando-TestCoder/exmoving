import { CONFIG } from "./config.ts";
import { Provider, QuoteDetail } from "./types.ts";
import {
  getFromFirestore,
  getQuote,
  saveProvider,
  saveQuote,
  updateGlobalAverages,
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

  const { extractedData, distillationCost } = await extractFieldsWithLLM(emailContent);
  const id = crypto.randomUUID();

  const quoteDoc: QuoteDetail = {
    id,
    senderEmail,
    jobDetails: {
      origin: extractedData.origin || "",
      destination: extractedData.destination || "",
      equipmentType: extractedData.equipmentType || "",
      method: extractedData.method || "",
      volumeCbm: extractedData.volumeCbm || 0,
      description: extractedData.description || "",
      serviceTerms: extractedData.serviceTerms || "",
      packingConditions: extractedData.packingConditions || "",
      loadingConditions: extractedData.loadingConditions || "",
      customsHandling: extractedData.customsHandling || false,
      marginContribution: extractedData.marginContribution || 20,
      language: extractedData.language || "en",
    },
    quotes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    currentBatch: 1,
    exhaustedProviders: [],
    totalDistillationCost: distillationCost,
  };

  await saveQuote(quoteDoc);
  await updateMetrics({ distillationCost });

  // Iteration B: Sourcing
  const providers = await scrapeMoversPOE(quoteDoc.jobDetails);

  for (const provider of providers) {
    const existing = await getFromFirestore("Providers", provider.email);
    if (!existing) {
      provider.pricing = CONFIG.products;
      await saveProvider(provider);
    }

    const subject =
      `Quote Request: ${quoteDoc.jobDetails.origin} to ${quoteDoc.jobDetails.destination} ---${id}---`;
    const body = `
      Hello ${provider.name},
      We need a quote for ID ---${id}---:
      - Origin: ${quoteDoc.jobDetails.origin}
      - Destination: ${quoteDoc.jobDetails.destination}
      - Volume: ${quoteDoc.jobDetails.volumeCbm} CBM
      - Method: ${quoteDoc.jobDetails.method}
    `;

    await sendEmail(provider.email, subject, body);
  }
}

/**
 * Step 2: gotEmail() - Triggered on Provider Response
 */
export async function gotEmail(emailText: string, senderEmail: string) {
  await updateMetrics({ category: "providerResponses" });

  // Deterministic ID extraction ($0 cost)
  const idMatch = emailText.match(/---(.*?)---/);
  if (!idMatch) {
    console.log("LOG: No ID found in provider response, ignoring.");
    return;
  }
  const id = idMatch[1];

  const existingQuote = await getQuote(id);
  if (!existingQuote) return;

  // Distillation: Extract fields from this specific reply, merging with current state
  const { extractedData, distillationCost } = await extractFieldsWithLLM(
    emailText,
    existingQuote.jobDetails,
  );

  // Update existing job details with any newly discovered info from provider (e.g. carrier used)
  existingQuote.jobDetails = { ...existingQuote.jobDetails, ...extractedData };
  existingQuote.totalDistillationCost += distillationCost;
  
  await updateMetrics({ distillationCost });

  existingQuote.quotes.push({
    senderEmail,
    quoteData: extractedData,
    costDistillation: distillationCost,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "received"
  });
  existingQuote.updatedAt = new Date().toISOString();

  await saveQuote(existingQuote);

  // Check if we should trigger comparison
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
 * Step 3: Provider Comparison & Selection (Iteration A start)
 */
export async function compareProviders(quoteId: string) {
  const doc = await getQuote(quoteId);
  if (!doc || doc.quotes.length === 0) return;

  doc.status = "comparing";

  // Score providers based on Price and Traits
  const scored = await Promise.all(doc.quotes.map(async (q) => {
    const p = await getFromFirestore("Providers", q.senderEmail) as Provider;
    const rate = q.quoteData.baseRate || 999999;
    
    // Scoring logic: Lower rate = better score, scaled by provider points
    const efficiencyWeight = 10000;
    const score = (efficiencyWeight / rate) * (p?.points || 50);
    return { ...q, score, rate };
  }));

  // Sort by highest score
  scored.sort((a, b) => b.score - a.score);
  
  // Find the highest scoring provider that hasn't been exhausted in previous negotiations
  const availableWinners = scored.filter(q => !doc.exhaustedProviders.includes(q.senderEmail));
  
  if (availableWinners.length === 0) {
      console.log(`LOG: All providers exhausted for ID ${quoteId}. Restarting Iteration B or Escalating.`);
      doc.status = "failed";
      await saveQuote(doc);
      // Trigger new scrape or notify Pablo here.
      for (const email of CONFIG.stakeholders) {
        await sendEmail(email, `Failed Quote ${quoteId}`, "All providers exhausted. Needs manual review.");
      }
      return;
  }

  const winner = availableWinners[0];
  doc.status = "negotiating";

  // Lowball Logic: 1 in 6 chance to request a 10% reduction
  const dice = Math.floor(Math.random() * 6) + 1;
  let finalPrice = winner.rate;
  let saved = 0;
  
  if (dice === 1) {
    saved = finalPrice * 0.1;
    finalPrice *= 0.9;
    console.log(`LOG: Lowball hit! Negotiating ${winner.senderEmail} down to ${finalPrice}`);
  }

  // Update State
  const quoteIndex = doc.quotes.findIndex(q => q.senderEmail === winner.senderEmail);
  if (quoteIndex !== -1) {
      doc.quotes[quoteIndex].status = "negotiating";
      doc.quotes[quoteIndex].negotiatedValue = finalPrice;
  }
  
  await saveQuote(doc);

  // Send deterministic template email (No LLM Cost)
  await sendEmail(
    winner.senderEmail,
    `CONFIRM PRICE: ID ---${quoteId}---`,
    `Hello, please confirm your final price of $${finalPrice.toFixed(2)} for ID ---${quoteId}--- so we can proceed with the booking.`,
  );
  
  // Note: in a fully async system, we would wait for their reply to gotEmail()
  // and check if they accepted `negotiatedValue`. For this logic file, we simulate
  // the acceptance phase below.
}

/**
 * Step 4: Finalize and Notify (Called after provider confirms negotiation)
 */
export async function finalizeQuote(quoteId: string, acceptedEmail: string, finalPrice: number, productType: string) {
    const doc = await getQuote(quoteId);
    if (!doc) return;
    
    doc.status = "completed";
    await saveQuote(doc);
    
    await updateMetrics({
      sale: 1,
      spent: finalPrice,
    });
    
    // Update Global Collection
    await updateGlobalAverages(finalPrice, productType);
    
    // Notify Stakeholders
    for (const email of CONFIG.stakeholders) {
      await sendEmail(
        email,
        `Proposal Ready for ${quoteId}`,
        `The quoting process is complete. Winning provider: ${acceptedEmail} at $${finalPrice}. Total LLM Cost: $${doc.totalDistillationCost.toFixed(4)}. Attached is the generated proposal PDF.`
      );
    }
}
