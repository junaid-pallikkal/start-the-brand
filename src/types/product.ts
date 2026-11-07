export interface UnitEconomics {
  blankCost: number;
  printCost: number;
  packagingShipping: number;
  paymentFeePercent: number; // e.g. 2.9%
  paymentFeeFixed: number; // e.g. $0.30
  retailPrice: number;
  grossProfitUSD: number;
  grossMarginPercent: number;
  breakEvenUnits: number;
  markupMultiplier: number;
}

export interface ProductItem {
  id: string;
  projectId?: string;
  collectionId?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  economics: UnitEconomics;
  status: 'draft' | 'published';
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  isPublic: boolean;
  productCount: number;
  createdAt: string;
}
