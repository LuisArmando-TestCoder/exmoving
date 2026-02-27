import { StateCreator } from 'zustand';
import { PricingStore, PricingState } from '../types';
import { INITIAL_API_PRICES, INITIAL_INFRASTRUCTURE } from '../data';

const getInitialCustomValues = () => {
  const values: Record<string, string | number | boolean> = {};
  INITIAL_INFRASTRUCTURE.forEach((cat) => {
    cat.subItems.forEach((item) => {
      if (item.pricingType === 'slider' && item.slider) {
        values[item.id] = item.slider.min;
      } else if ((item.pricingType === 'tiers' || item.pricingType === 'mixed') && item.tiers) {
        values[item.id] = item.tiers[0].name;
      } else if (item.pricingType === 'fixed') {
        values[item.id] = false;
      }
    });
  });
  return values;
};

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
  customValues: getInitialCustomValues(),
  setCustomValue: (id, value) =>
    set((state) => ({
      customValues: { ...state.customValues, [id]: value },
    })),
  setBulkValues: (values) =>
    set((state) => ({
      customValues: { ...state.customValues, ...values },
    })),
});
