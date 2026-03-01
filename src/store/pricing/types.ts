export interface APIPrice {
  id: string;
  name: string;
  provider: string;
  intelligence: string;
  inputPrice: number;
  outputPrice: number;
  emailCapacity: number;
  isGenerative: boolean;
  category: 'llm' | 'hosting' | 'setup';
}

export type PricingType = 'slider' | 'tiers' | 'fixed' | 'mixed';

export interface Tier {
  name: string;
  price: number;
  features: string[];
  limits?: string;
  isFree?: boolean;
}

export interface BATranslation {
  metric: string;    // e.g., "1M Tokens"
  human: string;     // e.g., "~1.5k Emails"
  roi: string;       // e.g., "Saves 40h of writing"
}

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  unit: string;
  multiplier: number;
  basePrice?: number;
  freeLimit?: string;
  baTranslation?: {
    multiplier: number; // e.g., 1M Tokens = 1.5 (k emails)
    humanUnit: string;  // e.g., "k Emails Generated"
    roiUnit: string;    // e.g., "Hours Saved"
    roiMultiplier: number; // e.g., 1M Tokens = 40 (hours saved)
  };
}

export interface SubItemConfig {
  id: string;
  name: string;
  pricingType: PricingType;
  tiers?: Tier[];
  slider?: SliderConfig;
  fixedPrice?: number;
  description: string;
  hasFreeTier: boolean;
  freeTierDetails?: string;
  payAsYouGoDetails?: string;
  customComponent?: boolean;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  description: string;
  category: string;
  subItems: SubItemConfig[];
}

export interface PricingState {
  apiPrices: APIPrice[];
  infrastructure: InfrastructureItem[];
  customValues: Record<string, number | string | boolean>;
}

export interface PricingActions {
  setCustomValue: (id: string, value: number | string | boolean) => void;
  setBulkValues: (values: Record<string, number | string | boolean>) => void;
  resetToZero: () => void;
  calculateTotal: (customValuesOverride?: Record<string, number | string | boolean>) => number;
}

export type PricingStore = PricingState & PricingActions;
