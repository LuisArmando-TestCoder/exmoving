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

    const logData: any[] = [];

    infrastructure.forEach((cat) => {
      cat.subItems.forEach((item) => {
        const value = values[item.id];
        let itemCost = 0;

        if (item.pricingType === 'slider' && item.slider) {
          const numValue = typeof value === 'number' ? value : parseFloat(String(value || 0));
          if (!isNaN(numValue) && numValue > 0) {
            itemCost = (item.slider.basePrice || 0) + numValue * item.slider.multiplier;
          }
        } else if ((item.pricingType === 'tiers' || item.pricingType === 'mixed') && item.tiers) {
          if (value !== 'none' && value !== '') {
            const tier = item.tiers.find((t) => t.name === value);
            if (tier && !tier.isFree) {
              itemCost = tier.price;
            }
          }
        } else if (item.pricingType === 'fixed' && item.fixedPrice && value === true) {
          itemCost = item.fixedPrice;
        }

        if (itemCost > 0 || value === 0 || value === 'none') {
          logData.push({
            Item: item.name,
            Type: item.pricingType,
            Value: value,
            Cost: itemCost.toFixed(2)
          });
        }
        total += itemCost;
      });
    });

    if (process.env.NODE_ENV === 'development' && logData.length > 0) {
      console.group('Infrastructure Cost Breakdown');
      console.table(logData);
      console.log('Total:', total.toFixed(2));
      console.groupEnd();
    }

    return total;
  },
});
