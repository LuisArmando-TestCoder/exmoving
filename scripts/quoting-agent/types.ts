export interface Provider {
  email: string;
  name: string;
  traits: string[];
  points: number;
  pricing: Array<{
    productName: string;
    pricePerUnit: number;
    bundlePrices: Array<{ amountTreshold: number; price: number }>;
  }>;
}

export interface QuoteDetail {
  id: string;
  senderEmail: string;
  jobDetails: {
    // 1. Route Details
    origin: string; // City, State, Country, ZIP
    destination: string; // Port, City, or Final Location

    // 2. Equipment & Volume
    equipmentType: string; // Household goods / Vehicles
    method: string; // FCL 20ft / FCL 40ft / LCL / RoRo
    volumeCbm: number; // Volume in m3
    description: string; // Cargo details

    // 3. Service Scope & Handling
    serviceTerms: string; // Door to Port, Port to Port, etc.
    packingConditions: string; // Self pack / Movers load
    loadingConditions: string; // Origin assistance / Client load
    customsHandling: boolean; // Destination customs handling

    // 4. Carrier Details
    carrierName?: string;
    transitTime?: string;
    restrictions?: string; // Carriers to avoid

    // 5. Cost Breakdown
    baseRate?: number;
    surcharges?: Record<string, number>; // BAF, CAF, ISPS, local charges, etc.
    validityDate?: string;

    // 6. Profitability & Generation
    marginContribution: number; // 15% - 25%
    language: "en" | "es";
  };
  quotes: Array<{
    senderEmail: string;
    quoteData: any; // Merged fields based on provider reply
    costDistillation: number; // The LLM token cost for processing this quote ($0.15-$0.38/1M tokens)
    createdAt: string;
    updatedAt: string;
    status: "received" | "negotiating" | "accepted" | "rejected";
    negotiatedValue?: number; // Last value during Iteration A
  }>;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "comparing" | "negotiating" | "completed" | "failed";
  
  // Negotiation State Machine (Iterations A & B)
  currentBatch: number;
  exhaustedProviders: string[];
  totalDistillationCost: number; // Track ROI dynamically
}
