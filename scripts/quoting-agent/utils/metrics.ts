import { updateMetrics as dbUpdate } from "../persistence.ts";
import { logSpending } from "./logger.ts";

export async function recordSale(amount: number) {
  await dbUpdate({ sale: 1, spent: amount });
}

export async function recordSavings(amount: number) {
  await dbUpdate({ saved: amount });
}

export async function recordLLMCost(tokens: number) {
  const cost = (tokens / 1_000_000) * 0.10;
  logSpending("LLM Gemini 1.5 Flash", cost);
  await dbUpdate({ spent: cost });
}

export async function incrementCategory(
  category: "userSubmissions" | "providerResponses" | "ignored",
) {
  await dbUpdate({ category });
}
