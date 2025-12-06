import type { NormalizedProduct } from "../ai";

export type Location = {
  lat: number;
  lng: number;
};

export type RetailerOffer = {
  retailerId: string;
  retailerName: string;
  isGrocery: boolean;
  price: number;
  currency: string;
  shippingCost: number;
  totalCost: number;
  inStock: boolean;
  distanceKm?: number;
  etaDays?: number;
  productUrl: string;
  raw?: any;
};

export type RetailerConnector = {
  id: string;
  displayName: string;
  type: "grocery" | "general";
  search: (
    product: NormalizedProduct,
    location?: Location | null
  ) => Promise<RetailerOffer[]>;
};
