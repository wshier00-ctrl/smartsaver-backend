import type { RetailerOffer } from "./connectors/types";

export type UserRole = "free" | "premium";

export type SearchOffer = RetailerOffer & {
  isPremiumLocked?: boolean;
};

export function rankOffers(
  offers: RetailerOffer[],
  maxResults: number = 5
): RetailerOffer[] {
  return [...offers]
    .sort((a, b) => a.totalCost - b.totalCost)
    .slice(0, maxResults);
}

export function applyPremiumMask(
  offers: RetailerOffer[],
  role: UserRole
): SearchOffer[] {
  if (role === "premium") {
    return offers.map((o) => ({ ...o, isPremiumLocked: false }));
  }

  return offers.map((o) => {
    if (o.isGrocery) {
      return { ...o, isPremiumLocked: false };
    }
    return {
      ...o,
      isPremiumLocked: true,
      price: 0,
      shippingCost: 0,
      totalCost: 0
    };
  });
}
