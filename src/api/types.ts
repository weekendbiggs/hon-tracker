export type Condition = "mint" | "excellent" | "good" | "fair" | "poor";
export type NestType = "stippled" | "striated";
export type DecorationCondition = "" | "intact" | "partial" | "missing";
export type PriceSource =
  | "ebay_active"
  | "ebay_sold"
  | "etsy"
  | "antique_shop"
  | "auction"
  | "other";

export interface CollectionItem {
  id: string;
  honColorId: number;
  dateAcquired: string;
  purchasePrice: number | null;
  purchaseSource: string;
  condition: Condition;
  nestType: NestType | "";
  hasSlottedBeads: boolean;
  hasDecoration: boolean;
  decorationCondition: DecorationCondition;
  photoUrl: string;
  notes: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface PriceEntry {
  id: string;
  honColorId: number;
  price: number;
  source: PriceSource;
  condition: Condition | "";
  listingUrl: string;
  dateObserved: string;
  notes: string;
  isAutomated: boolean;
  createdAt: string;
}
