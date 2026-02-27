import { StateCreator } from 'zustand';
import { PricingStore, PricingState } from '../types';
import { INITIAL_API_PRICES, INITIAL_INFRASTRUCTURE } from '../data';

export const createConfigSlice: StateCreator<
  PricingStore,
  [],
  [],
  PricingState & { 
    setCustomValue: PricingStore['setCustomValue'],
    setBulkValues: PricingStore['setBulkValues']
  }
> = (set) => ({
  apiPrices: INITIAL_API_PRICES,
  infrastructure: INITIAL_INFRASTRUCTURE,
  customValues: {},
  setCustomValue: (id, value) =>
    set((state) => ({
      customValues: { ...state.customValues, [id]: value },
    })),
  setBulkValues: (values) =>
    set((state) => ({
      customValues: { ...state.customValues, ...values },
    })),
});
