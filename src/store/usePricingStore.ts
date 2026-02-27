import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PricingStore } from './pricing/types';
import { createConfigSlice } from './pricing/slices/configSlice';
import { createCalculationSlice } from './pricing/slices/calculationSlice';

export * from './pricing/types';

export const usePricingStore = create<PricingStore>()(
  persist(
    (...a) => ({
      ...createConfigSlice(...a),
      ...createCalculationSlice(...a),
    }),
    {
      name: 'pricing-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customValues: state.customValues }),
    }
  )
);
