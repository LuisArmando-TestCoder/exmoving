"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePricingStore } from "@/store/usePricingStore";

function SyncParamsContent() {
  const searchParams = useSearchParams();
  const setBulkValues = usePricingStore((state) => state.setBulkValues);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      const newValues: Record<string, number | string | boolean> = {};
      
      Object.entries(params).forEach(([key, value]) => {
        // Try to parse as number or boolean
        if (value === "true") {
          newValues[key] = true;
        } else if (value === "false") {
          newValues[key] = false;
        } else if (!isNaN(Number(value))) {
          newValues[key] = Number(value);
        } else {
          newValues[key] = value;
        }
      });
      
      setBulkValues(newValues);
    }
  }, [searchParams, setBulkValues]);

  return null;
}

export const PricingSyncParams = () => {
  return (
    <Suspense fallback={null}>
      <SyncParamsContent />
    </Suspense>
  );
};
