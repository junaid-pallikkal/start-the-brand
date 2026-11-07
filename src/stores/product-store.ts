import { create } from 'zustand';
import { ProductItem, CollectionItem, UnitEconomics } from '@/types/product';
import { localDb } from '@/lib/storage/dexie-db';
import { generateId } from '@/lib/utils';

interface ProductState {
  products: ProductItem[];
  collections: CollectionItem[];
  activeProduct: ProductItem | null;

  // Actions
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ProductItem>;
  updateProduct: (id: string, updates: Partial<ProductItem>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  calculateEconomics: (
    retail: number,
    blank: number,
    print: number,
    packaging: number
  ) => UnitEconomics;
}

const calculateUnitEconomics = (
  retail: number,
  blank: number,
  print: number,
  packaging: number
): UnitEconomics => {
  const totalCost = blank + print + packaging;
  const paymentFee = retail * 0.029 + 0.3;
  const grossProfit = retail - (totalCost + paymentFee);
  const marginPct = retail > 0 ? (grossProfit / retail) * 100 : 0;
  const breakEven = grossProfit > 0 ? Math.ceil(totalCost / grossProfit) : 0;
  const markup = totalCost > 0 ? retail / totalCost : 0;

  return {
    blankCost: blank,
    printCost: print,
    packagingShipping: packaging,
    paymentFeePercent: 2.9,
    paymentFeeFixed: 0.3,
    retailPrice: retail,
    grossProfitUSD: parseFloat(grossProfit.toFixed(2)),
    grossMarginPercent: parseFloat(marginPct.toFixed(1)),
    breakEvenUnits: breakEven,
    markupMultiplier: parseFloat(markup.toFixed(2)),
  };
};

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-01',
    title: 'ATELIER ZERO // CYBER-CORE HEAVYWEIGHT TEE',
    slug: 'atelier-zero-cyber-core-tee',
    description: '280 GSM combed cotton drop-shoulder boxy t-shirt with DTF chest and sleeve graphics.',
    category: 'OVERSIZED_TEE',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0B0B0D' },
      { name: 'Washed Charcoal', hex: '#1F2023' },
    ],
    images: [],
    economics: calculateUnitEconomics(58.0, 11.5, 5.0, 3.0),
    status: 'published',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-02',
    title: 'SYSTEM 09 // TACTICAL ARTICULATED CARGO PANTS',
    slug: 'system-09-tactical-cargos',
    description: 'Heavyweight ripstop cotton cargo pants with 6 utility pockets and knee darts.',
    category: 'WIDE_LEG_CARGO_PANTS',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Raw Obsidian', hex: '#121316' },
      { name: 'Washed Olive', hex: '#4B5320' },
    ],
    images: [],
    economics: calculateUnitEconomics(110.0, 28.0, 6.0, 4.5),
    status: 'published',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-03',
    title: 'RAW ARCHIVE // 450 GSM CROSS-GRAIN HOODIE',
    slug: 'raw-archive-450gsm-hoodie',
    description: 'Custom milled cross-grain fleece streetwear hoodie with double-lined deep hood.',
    category: 'HEAVYWEIGHT_HOODIE',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Mocha Chocolate', hex: '#3E2723' },
      { name: 'Pitch Black', hex: '#0B0B0D' },
    ],
    images: [],
    economics: calculateUnitEconomics(95.0, 24.5, 6.5, 4.0),
    status: 'draft',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: DEFAULT_PRODUCTS,
  collections: [],
  activeProduct: DEFAULT_PRODUCTS[0],

  loadProducts: async () => {
    try {
      const records = await localDb.products.reverse().toArray();
      if (records.length === 0) {
        for (const p of DEFAULT_PRODUCTS) {
          await localDb.products.add(p);
        }
        set({ products: DEFAULT_PRODUCTS });
      } else {
        set({ products: records });
      }
    } catch (e) {
      console.error('Failed to load products from Dexie:', e);
    }
  },

  addProduct: async (productData) => {
    const newProduct: ProductItem = {
      ...productData,
      id: generateId('prod'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await localDb.products.add(newProduct);
      set((state) => ({ products: [newProduct, ...state.products] }));
    } catch (err) {
      console.error('Failed to add product to Dexie:', err);
    }

    return newProduct;
  },

  updateProduct: async (id, updates) => {
    const updated = get().products.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );

    set({ products: updated });

    try {
      const target = updated.find((p) => p.id === id);
      if (target) await localDb.products.put(target);
    } catch (err) {
      console.error('Failed to update product in Dexie:', err);
    }
  },

  deleteProduct: async (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
    try {
      await localDb.products.delete(id);
    } catch (err) {
      console.error('Failed to delete product from Dexie:', err);
    }
  },

  calculateEconomics: calculateUnitEconomics,
}));
