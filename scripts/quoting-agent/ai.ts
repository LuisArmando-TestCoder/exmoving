import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { ENV } from "./config.ts";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

export function logLLMUsage(tokens: number, operation: string) {
  const cost = (tokens / 1_000_000) * 0.10;
  console.log(
    `ΣXECUTIONS INTEL: ${operation} | Tokens: ${tokens} | Estimated Cost: $${
      cost.toFixed(6)
    }`,
  );
}

export async function extractFieldsWithLLM(
  text: string,
  currentFields: any = {},
): Promise<any> {
  const prompt = createStandardPrompt({
    role:
      "You are an expert Moving & Logistics Pricing Analyst. Your specialty is extracting technical data from emails and meeting notes to generate precise job costs.",
    objective:
      "Extract and update moving service fields from the provided Email/Text. Analyze the input against existing data and provide the most accurate, up-to-date values for the quote.",
    format: `Return ONLY a valid JSON object following this schema:
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
Output: {"origin": "Fort Myers, FL, USA, 33912", "destination": "Puerto Moin, Costa Rica", "method": "FCL 20ft", "packingConditions": "Self pack", ...}`,
    input: `- Email Text: "${text}"\n- Current Fields: ${
      JSON.stringify(currentFields)
    }`,
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonText = response.text().replace(/```json|```/g, "").trim();

  logLLMUsage(response.usageMetadata?.totalTokenCount || 0, "Field Extraction");

  return JSON.parse(jsonText);
}
