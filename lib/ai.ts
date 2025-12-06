import OpenAI from "openai";

export type NormalizedProduct = {
  title: string;
  brand?: string;
  category?: string;
  model?: string;
  upc?: string;
  attributes?: Record<string, string>;
};

let openaiClient: OpenAI | null = null;

function getOpenAiClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not set");
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function normalizeProductQuery(
  query: string
): Promise<NormalizedProduct> {
  if (!process.env.OPENAI_API_KEY) {
    return { title: query.trim(), attributes: {} };
  }

  const client = getOpenAiClient();

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You normalize messy shopping queries into a single specific product. Respond with strict JSON."
      },
      {
        role: "user",
        content: `Normalize this shopping query into a specific product with fields: title, brand, category, model, upc, attributes.\n\nQuery: "${query}"`
      }
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  let parsed: any = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const normalized: NormalizedProduct = {
    title: parsed.title || query.trim(),
    brand: parsed.brand,
    category: parsed.category,
    model: parsed.model,
    upc: parsed.upc,
    attributes: parsed.attributes || {}
  };

  return normalized;
}
