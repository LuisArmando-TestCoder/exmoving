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
    // 1. Detalles de Origen y Destino
    origin: string; // Ciudad, Estado, País y Código Postal
    destination: string; // Puerto, ciudad o ubicación final

    // 2. Detalles del Equipo y Volumen
    equipmentType: string; // Household goods / Vehículos
    method: string; // FCL 20ft / FCL 40ft / LCL / RoRo
    volumeCbm: number; // Medida en m3
    description: string; // Detalles de la carga

    // 3. Alcance del Servicio y Manipulación
    serviceTerms: string; // Door to Port, Puerto a Puerto, etc.
    packingConditions: string; // Self pack / Movers load
    loadingConditions: string; // Asistencia de carga / Carga por cliente
    customsHandling: boolean; // Trámites aduanales en destino

    // 4. Detalles del Flete Marítimo
    carrierName?: string;
    transitTime?: string;
    restrictions?: string; // Navieras a evitar

    // 5. Desglose de Costos
    baseRate?: number;
    surcharges?: Record<string, number>; // BAF, CAF, ISPS, etc.
    validityDate?: string;

    // 6. Rentabilidad y Generación
    marginContribution: number; // 15% - 25%
    language: "en" | "es";
  };
  quotes: Array<{
    senderEmail: string;
    quoteData: any;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "comparing" | "completed";
}
