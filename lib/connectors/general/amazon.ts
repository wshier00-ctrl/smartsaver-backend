import type { NormalizedProduct } from "../../ai";
import type {
  Location,
  RetailerConnector,
  RetailerOffer
} from "../types";

export const amazonConnector: RetailerConnector = {
  id: "amazon",
  displayName: "Amazon",
  type: "general",
  async search(
    product: NormalizedProduct,
    _location?: Location | null
  ): Promise<RetailerOffer[]> {
    const basePrice = 19.99;
    const shipping = 3.99;
    return [
      {
        retailerId: "amazon",
        retailerName: "Amazon",
        isGrocery: false,
        price: basePrice,
        currency: "USD",
        shippingCost: shipping,
        totalCost: basePrice + shipping,
        inStock: true,
        etaDays: 2,
        productUrl: "https://www.amazon.com/",
        raw: { productTitle: product.title, mock: true }
      }
    ];
  }
};
