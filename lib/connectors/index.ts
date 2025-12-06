import type { RetailerConnector } from "./types";
import { krogerConnector } from "./grocery/kroger";
import { walmartGroceryConnector } from "./grocery/walmart_grocery";
import { amazonConnector } from "./general/amazon";
import { bestbuyConnector } from "./general/bestbuy";

export const ALL_CONNECTORS: RetailerConnector[] = [
  krogerConnector,
  walmartGroceryConnector,
  amazonConnector,
  bestbuyConnector
];
