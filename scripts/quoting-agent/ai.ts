import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { ENV } from "./config.ts";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Gemini 1.5 Flash API Pricing (per 1M tokens)
const COST_PER_1M_INPUT = 0.15;
const COST_PER_1M_OUTPUT = 0.38;

interface PromptOptions {
  role: string;
  objective: string;
  format: string;
  example: string;
  input: string;
}

/**
 * Enforces a standardized prompt structure:
 * role, objective, format, example, input.
 */
function createStandardPrompt(options: PromptOptions): string {
  return `
ROLE:
${options.role}

OBJECTIVE:
${options.objective}

FORMAT:
${options.format}

EXAMPLE:
${options.example}

INPUT DATA:
${options.input}
  `.trim();
}

/**
 * Calculate the exact cost of the LLM execution based on input and output tokens.
 */
export function calculateLLMCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * COST_PER_1M_INPUT;
  const outputCost = (outputTokens / 1_000_000) * COST_PER_1M_OUTPUT;
  return inputCost + outputCost;
}

export function logLLMUsage(inputTokens: number, outputTokens: number, operation: string) {
  const cost = calculateLLMCost(inputTokens, outputTokens);
  console.log(
    `ΣXECUTIONS INTEL: ${operation} | In: ${inputTokens} Out: ${outputTokens} | Estimated Cost: $${cost.toFixed(6)}`
  );
}

export async function extractFieldsWithLLM(
  text: string,
  currentFields: any = {},
): Promise<{ extractedData: any; distillationCost: number }> {
  const prompt = createStandardPrompt({
    role:
      "You are an expert Moving & Logistics Pricing Analyst. Your specialty is extracting technical data from emails and meeting notes to generate precise job costs. You must map all findings to a strict 20-field JSON model.",
    objective:
      "Extract and update moving service fields from the provided Email/Text. Analyze the input against existing data and provide the most accurate, up-to-date values for the quote. If a field is not mentioned, use the value from Current Fields. If it's completely missing, omit it.",
    format: `Return ONLY a valid JSON object following this exact schema:
{
  "origin": "City, State, Country, ZIP",
  "destination": "Port, City, or Final Location",
  "equipmentType": "Household goods / Vehicles",
  "method": "FCL 20ft / FCL 40ft / LCL / RoRo",
  "volumeCbm": number,
  "description": "Details of the cargo",
  "serviceTerms": "Door to Port / Port to Port / etc.",
  "packingConditions": "Self pack / Movers load",
  "loadingConditions": "Origin assistance / Client load",
  "customsHandling": boolean,
  "carrierName": "string",
  "transitTime": "string",
  "baseRate": number,
  "surcharges": { "key": number },
  "validityDate": "YYYY-MM-DD",
  "marginContribution": number (15-25),
  "language": "en / es"
}`,
    example:
      `Input: "We need to move a 20ft container from FL 33912 to Moin, CR. Customer will pack themselves."
Output: {"origin": "Fort Myers, FL, USA, 33912", "destination": "Puerto Moin, Costa Rica", "method": "FCL 20ft", "packingConditions": "Self pack"}`,
    input: `- Email Text: "${text}"\n- Current Fields: ${
      JSON.stringify(currentFields)
    }`,
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    
    const inputTokens = response.usageMetadata?.promptTokenCount || 0;
    const outputTokens = response.usageMetadata?.candidatesTokenCount || 0;
    
    logLLMUsage(inputTokens, outputTokens, "Field Extraction");
    
    const distillationCost = calculateLLMCost(inputTokens, outputTokens);

    return { 
      extractedData: JSON.parse(jsonText), 
      distillationCost 
    };
  } catch (error) {
    console.error("LLM Extraction Error:", error);
    return { extractedData: currentFields, distillationCost: 0 };
  }
}
