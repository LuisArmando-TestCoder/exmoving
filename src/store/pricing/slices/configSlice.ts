import { StateCreator } from 'zustand';
import { PricingStore, PricingState } from '../types';
import { INITIAL_API_PRICES, INITIAL_INFRASTRUCTURE } from '../data';

export const createConfigSlice: StateCreator<
  PricingStore,
  [],
  [],
  PricingState & { setCustomValue: PricingStore['setCustomValue'] }
> = (set) => ({
  apiPrices: INITIAL_API_PRICES,
  infrastructure: INITIAL_INFRASTRUCTURE,
  customValues: {},
  setCustomValue: (id, value) =>
    set((state) => ({
      customValues: { ...state.customValues, [id]: value },
    })),
});
