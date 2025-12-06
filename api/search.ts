import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { normalizeProductQuery } from "../lib/ai";
import { ALL_CONNECTORS } from "../lib/connectors";
import type { Location } from "../lib/connectors/types";
import { applyPremiumMask, rankOffers } from "../lib/pricing";
import { getUserFromRequest } from "../lib/auth";
import { getDb } from "../lib/db";
import { searchLogs } from "../schema/searchLog";

const SearchBodySchema = z.object({
  query: z.string().min(1),
  location: z
    .object({
      lat: z.number(),
      lng: z.number()
    })
    .optional()
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let parsed;
  try {
    parsed = SearchBodySchema.parse(req.body);
  } catch (err: any) {
    return res.status(400).json({ error: "Invalid body", details: err.message });
  }

  const { query, location } = parsed as {
    query: string;
    location?: Location;
  };

  const authUser = await getUserFromRequest(req);

  try {
    const normalized = await normalizeProductQuery(query);

    const offersArrays = await Promise.all(
      ALL_CONNECTORS.map((connector) =>
        connector
          .search(normalized, location)
          .catch((error) => {
            console.error(
              `Connector ${connector.id} failed:`,
              error?.message || error
            );
            return [];
          })
      )
    );

    const allOffers = offersArrays.flat();
    const ranked = rankOffers(allOffers, 5);
    const masked = applyPremiumMask(ranked, authUser.role);

    const db = getDb();
    await db.insert(searchLogs).values({
      userId: authUser.id ?? undefined,
      query,
      productId: undefined
    });

    return res.status(200).json({
      ok: true,
      role: authUser.role,
      product: normalized,
      offers: masked
    });
  } catch (error: any) {
    console.error("Search handler error:", error);
    return res.status(500).json({
      error: "Search failed",
      message: error?.message || "Unknown error"
    });
  }
}
