import type { NormalizedProduct } from "../../ai";
import type {
  Location,
  RetailerConnector,
  RetailerOffer
} from "../types";

export const krogerConnector: RetailerConnector = {
  id: "kroger",
  displayName: "Kroger",
  type: "grocery",
  async search(
    product: NormalizedProduct,
    location?: Location | null
  ): Promise<RetailerOffer[]> {
    const basePrice = 3.99;
    return [
      {
        retailerId: "kroger",
        retailerName: "Kroger",
        isGrocery: true,
        price: basePrice,
        currency: "USD",
        shippingCost: 0,
        totalCost: basePrice,
        inStock: true,
        distanceKm: location ? 2.1 : undefined,
        etaDays: 0,
        productUrl: "https://www.kroger.com/",
        raw: { productTitle: product.title, mock: true }
      }
    ];
  }
};
