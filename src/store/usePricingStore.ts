import { create } from 'zustand';
import { PricingStore } from './pricing/types';
import { createConfigSlice } from './pricing/slices/configSlice';
import { createCalculationSlice } from './pricing/slices/calculationSlice';

export * from './pricing/types';

export const usePricingStore = create<PricingStore>()((...a) => ({
  ...createConfigSlice(...a),
  ...createCalculationSlice(...a),
}));
