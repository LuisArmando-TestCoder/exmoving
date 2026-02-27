import { create } from 'zustand';

export interface APIPrice {
  id: string;
  name: string;
  provider: string;
  intelligence: string;
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  emailCapacity: number; // based on $300 budget, 500 word emails
  isGenerative: boolean;
  category: 'llm' | 'hosting' | 'setup';
}

interface PricingStore {
  apiPrices: APIPrice[];
}

export const usePricingStore = create<PricingStore>((set) => ({
  apiPrices: [
    {
      id: 'gemini-flash',
      name: 'Gemini Flash Latest',
      provider: 'Google',
      intelligence: 'Fast / Basic',
      inputPrice: 0.50,
      outputPrice: 3.00,
      emailCapacity: 6000000,
      isGenerative: true,
      category: 'llm',
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o mini',
      provider: 'OpenAI',
      intelligence: 'Fast / Efficient',
      inputPrice: 0.15,
      outputPrice: 0.60,
      emailCapacity: 4500000,
      isGenerative: true,
      category: 'llm',
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      intelligence: 'High / Creative',
      inputPrice: 3.00,
      outputPrice: 15.00,
      emailCapacity: 150000,
      isGenerative: true,
      category: 'llm',
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      intelligence: 'High / Versatile',
      inputPrice: 5.00,
      outputPrice: 15.00,
      emailCapacity: 180000,
      isGenerative: true,
      category: 'llm',
    },
    {
      id: 'openai-o1',
      name: 'OpenAI o1',
      provider: 'OpenAI',
      intelligence: 'Complex Reasoning',
      inputPrice: 15.00,
      outputPrice: 60.00,
      emailCapacity: 30000,
      isGenerative: true,
      category: 'llm',
    },
  ],
}));
