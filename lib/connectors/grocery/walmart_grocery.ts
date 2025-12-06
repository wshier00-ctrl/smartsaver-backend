import type { NormalizedProduct } from "../../ai";
import type {
  Location,
  RetailerConnector,
  RetailerOffer
} from "../types";

export const walmartGroceryConnector: RetailerConnector = {
  id: "walmart_grocery",
  displayName: "Walmart (Grocery)",
  type: "grocery",
  async search(
    product: NormalizedProduct,
    location?: Location | null
  ): Promise<RetailerOffer[]> {
    const basePrice = 4.59;
    return [
      {
        retailerId: "walmart_grocery",
        retailerName: "Walmart (Grocery)",
        isGrocery: true,
        price: basePrice,
        currency: "USD",
        shippingCost: 0,
        totalCost: basePrice,
        inStock: true,
        distanceKm: location ? 1.4 : undefined,
        etaDays: 0,
        productUrl: "https://www.walmart.com/",
        raw: { productTitle: product.title, mock: true }
      }
    ];
  }
};
