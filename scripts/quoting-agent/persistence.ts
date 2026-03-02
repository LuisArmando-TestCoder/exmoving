import { Provider, QuoteDetail } from "./types.ts";

/**
 * Note: For production, this should integrate with Firebase/Firestore SDK.
 * Currently, it simulates Firestore collections using a local in-memory object
 * structure that matches Firestore's document-based approach.
 */

const db: Record<string, Record<string, any>> = {
  Providers: {},
  emailQuotes: {},
  global: {
    averages: {
      products: {},
      lastUpdated: new Date().toISOString()
    }
  },
  metrics: {
    dashboard: {
      categories: {
        userSubmissions: 0,
        providerResponses: 0,
        ignored: 0,
      },
      salesMade: 0,
      moneySpent: 0,
      moneySaved: 0,
      totalDistillationCost: 0,
    },
  },
};

export async function saveToFirestore(col: string, id: string, data: any) {
  if (!db[col]) db[col] = {};
  db[col][id] = data;
}

export async function getFromFirestore(col: string, id: string) {
  return db[col]?.[id];
}

export async function updateMetrics(
  update: { category?: string; sale?: number; spent?: number; saved?: number; distillationCost?: number },
) {
  const metrics = db.metrics.dashboard;
  if (update.category) {
    if (!metrics.categories[update.category]) {
      metrics.categories[update.category] = 0;
    }
    metrics.categories[update.category]++;
  }
  if (update.sale) metrics.salesMade += update.sale;
  if (update.spent) metrics.moneySpent += update.spent;
  if (update.saved) metrics.moneySaved += update.saved;
  if (update.distillationCost) metrics.totalDistillationCost += update.distillationCost;

  console.log(`LOG: Metrics Updated | Categories: ${JSON.stringify(metrics.categories)} | Distillation Cost: $${metrics.totalDistillationCost.toFixed(4)}`);
}

export async function saveProvider(p: Provider) {
  await saveToFirestore("Providers", p.email, p);
}

export async function saveQuote(q: QuoteDetail) {
  await saveToFirestore("emailQuotes", q.id, q);
}

export async function getQuote(id: string): Promise<QuoteDetail | undefined> {
  return await getFromFirestore("emailQuotes", id);
}

export async function getProvider(
  email: string,
): Promise<Provider | undefined> {
  return await getFromFirestore("Providers", email);
}

export async function updateGlobalAverages(newRate: number, productType: string) {
  const global = db.global.averages;
  
  if (!global.products[productType]) {
    global.products[productType] = { average: newRate, count: 1 };
  } else {
    const current = global.products[productType];
    const newAverage = ((current.average * current.count) + newRate) / (current.count + 1);
    global.products[productType] = { average: newAverage, count: current.count + 1 };
  }
  
  global.lastUpdated = new Date().toISOString();
  await saveToFirestore("global", "averages", global);
  console.log(`LOG: Global Average Updated for ${productType}: $${global.products[productType].average.toFixed(2)}`);
}
