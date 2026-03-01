import { Provider, QuoteDetail } from "./types.ts";

const db: Record<string, Record<string, any>> = {
  Providers: {},
  emailQuotes: {},
  global: {},
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
  update: { category?: string; sale?: number; spent?: number; saved?: number },
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

  console.log(`LOG: Metrics Updated | ${JSON.stringify(metrics)}`);
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
