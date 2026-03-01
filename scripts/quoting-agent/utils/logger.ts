export function logPerformance(operation: string, duration: number) {
  console.log(`[PERFORMANCE] ${operation}: ${duration}ms`);
}

export function logPipeline(
  step: string,
  status: "START" | "SUCCESS" | "ERROR",
  details?: any,
) {
  const timestamp = new Date().toISOString();
  console.log(
    `[PIPELINE][${timestamp}] ${step} | ${status} ${
      details ? "| " + JSON.stringify(details) : ""
    }`,
  );
}

export function logSpending(
  item: string,
  amount: number,
  currency: string = "USD",
) {
  console.log(`[SPENDING] ${item}: ${amount} ${currency}`);
}

export function verbose(module: string, message: string) {
  console.log(`[VERBOSE][${module}] ${message}`);
}
