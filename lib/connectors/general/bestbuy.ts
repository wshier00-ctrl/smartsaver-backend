import type { NormalizedProduct } from "../../ai";
import type {
  Location,
  RetailerConnector,
  RetailerOffer
} from "../types";

export const bestbuyConnector: RetailerConnector = {
  id: "bestbuy",
  displayName: "Best Buy",
  type: "general",
  async search(
    product: NormalizedProduct,
    location?: Location | null
  ): Promise<RetailerOffer[]> {
    const basePrice = 24.99;
    const shipping = 4.99;
    return [
      {
        retailerId: "bestbuy",
        retailerName: "Best Buy",
        isGrocery: false,
        price: basePrice,
        currency: "USD",
        shippingCost: shipping,
        totalCost: basePrice + shipping,
        inStock: true,
        distanceKm: location ? 3.3 : undefined,
        etaDays: 1,
        productUrl: "https://www.bestbuy.com/",
        raw: { productTitle: product.title, mock: true }
      }
    ];
  }
};
