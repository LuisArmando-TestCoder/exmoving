import { StateCreator } from 'zustand';
import { PricingStore } from '../types';

export const createCalculationSlice: StateCreator<
  PricingStore,
  [],
  [],
  { calculateTotal: PricingStore['calculateTotal'] }
> = (set, get) => ({
  calculateTotal: (customValuesOverride?: Record<string, number | string | boolean>) => {
    const { infrastructure, customValues: storeValues } = get();
    const values = customValuesOverride || storeValues;
    let total = 0;

    infrastructure.forEach((cat) => {
      cat.subItems.forEach((item) => {
        const value = values[item.id];

        if (item.pricingType === 'slider' && item.slider && typeof value === 'number') {
          total += (item.slider.basePrice || 0) + value * item.slider.multiplier;
        } else if (item.pricingType === 'tiers' && item.tiers && typeof value === 'string') {
          const tier = item.tiers.find((t) => t.name === value);
          if (tier) total += tier.price;
        } else if (item.pricingType === 'fixed' && item.fixedPrice && value === true) {
          total += item.fixedPrice;
        } else if (item.pricingType === 'mixed' && typeof value === 'string' && item.tiers) {
          const tier = item.tiers.find((t) => t.name === value);
          if (tier) total += tier.price;
        }
      });
    });

    return total;
  },
});
