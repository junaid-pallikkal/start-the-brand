import { create } from 'zustand';
import {
  GangSheetRoll,
  GangSheetItemInput,
  GangSheetResult,
} from '@/types/production';
import { packGangSheetMaxRects } from '@/features/production/algorithms/maxrects-packer';
import { generateId } from '@/lib/utils';
import { localDb } from '@/lib/storage/dexie-db';

interface GangSheetState {
  roll: GangSheetRoll;
  items: GangSheetItemInput[];
  result: GangSheetResult;
  selectedItemId: string | null;

  // Actions
  setRollDimensions: (width: 22 | 24, length: number) => void;
  addItem: (item: Omit<GangSheetItemInput, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, delta: number) => void;
  updateItemDimensions: (id: string, width: number, height: number) => void;
  toggleAllowRotation: (id: string) => void;
  setSelectedItemId: (id: string | null) => void;
  runAutoNest: () => void;
  saveGangSheet: () => Promise<void>;
}

const DEFAULT_ROLL: GangSheetRoll = {
  widthInches: 22,
  lengthInches: 36,
  marginInches: 0.25,
  spacingInches: 0.25,
};

const DEFAULT_ITEMS: GangSheetItemInput[] = [
  {
    id: 'item-1',
    designName: 'Atelier Zero Front Graphic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%230B0B0D"/><text x="150" y="100" font-family="monospace" font-size="24" font-weight="bold" fill="%23E2F952" text-anchor="middle">ATELIER ZERO</text><text x="150" y="130" font-family="monospace" font-size="12" fill="%23FFFFFF" text-anchor="middle">SPEC-01</text></svg>',
    widthInches: 11,
    heightInches: 7,
    quantity: 4,
    allowRotation: true,
  },
  {
    id: 'item-2',
    designName: 'Full Back Cyber Artwork',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="280" height="340" viewBox="0 0 280 340"><rect width="280" height="340" fill="%230B0B0D"/><text x="140" y="160" font-family="monospace" font-size="28" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">NEW WORLD</text><line x1="40" y1="180" x2="240" y2="180" stroke="%23E2F952" stroke-width="4"/><text x="140" y="210" font-family="monospace" font-size="14" fill="%23E2F952" text-anchor="middle">ORDER 2026</text></svg>',
    widthInches: 13,
    heightInches: 16,
    quantity: 2,
    allowRotation: true,
  },
  {
    id: 'item-3',
    designName: 'Sleeve Badge Barcode',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><rect width="200" height="80" fill="%230B0B0D"/><text x="100" y="45" font-family="monospace" font-size="14" font-weight="bold" fill="%23E2F952" text-anchor="middle">STB-8940</text></svg>',
    widthInches: 4,
    heightInches: 2.5,
    quantity: 6,
    allowRotation: true,
  },
];

export const useGangSheetStore = create<GangSheetState>((set, get) => ({
  roll: DEFAULT_ROLL,
  items: DEFAULT_ITEMS,
  result: packGangSheetMaxRects(DEFAULT_ROLL, DEFAULT_ITEMS),
  selectedItemId: null,

  setRollDimensions: (width, length) => {
    const updatedRoll = {
      ...get().roll,
      widthInches: width,
      lengthInches: Math.max(12, Math.min(length, 120)),
    };
    const result = packGangSheetMaxRects(updatedRoll, get().items);
    set({ roll: updatedRoll, result });
  },

  addItem: (item) => {
    const newItem: GangSheetItemInput = {
      ...item,
      id: generateId('gang-item'),
    };
    const updatedItems = [...get().items, newItem];
    const result = packGangSheetMaxRects(get().roll, updatedItems);
    set({ items: updatedItems, result, selectedItemId: newItem.id });
  },

  removeItem: (id) => {
    const updatedItems = get().items.filter((item) => item.id !== id);
    const result = packGangSheetMaxRects(get().roll, updatedItems);
    set({ items: updatedItems, result, selectedItemId: null });
  },

  updateItemQuantity: (id, delta) => {
    const updatedItems = get().items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    const result = packGangSheetMaxRects(get().roll, updatedItems);
    set({ items: updatedItems, result });
  },

  updateItemDimensions: (id, width, height) => {
    const updatedItems = get().items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          widthInches: Math.max(1, parseFloat(width.toFixed(1))),
          heightInches: Math.max(1, parseFloat(height.toFixed(1))),
        };
      }
      return item;
    });
    const result = packGangSheetMaxRects(get().roll, updatedItems);
    set({ items: updatedItems, result });
  },

  toggleAllowRotation: (id) => {
    const updatedItems = get().items.map((item) => {
      if (item.id === id) {
        return { ...item, allowRotation: !item.allowRotation };
      }
      return item;
    });
    const result = packGangSheetMaxRects(get().roll, updatedItems);
    set({ items: updatedItems, result });
  },

  setSelectedItemId: (id) => set({ selectedItemId: id }),

  runAutoNest: () => {
    const result = packGangSheetMaxRects(get().roll, get().items);
    set({ result });
  },

  saveGangSheet: async () => {
    const { roll, result } = get();
    try {
      await localDb.gangSheets.put({
        id: generateId('gs-saved'),
        name: `DTF Roll ${roll.widthInches}"x${result.totalUsedLengthInches}" (${result.materialEfficiencyPercent}%)`,
        updatedAt: new Date().toISOString(),
        data: result,
      });
    } catch (err) {
      console.error('Failed to save gang sheet:', err);
    }
  },
}));
