import { create } from 'zustand';
import { CameraPreset, EnvironmentPreset, BackgroundModelType, PBRProperties, SavedMockup } from '@/types/mockup';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { localDb } from '@/lib/storage/dexie-db';
import { generateId } from '@/lib/utils';
import { useStudioStore } from './studio-store';

interface MockupState {
  garmentId: string;
  garmentColor: string;
  cameraPreset: CameraPreset;
  environmentPreset: EnvironmentPreset;
  backgroundModel: BackgroundModelType;
  showSoftboxes: boolean;
  showFloorGrid: boolean;
  pbr: PBRProperties;
  autoRotate: boolean;
  wireframe: boolean;
  savedMockups: SavedMockup[];

  // Actions
  setGarmentId: (id: string) => void;
  setGarmentColor: (color: string) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setEnvironmentPreset: (env: EnvironmentPreset) => void;
  setBackgroundModel: (bg: BackgroundModelType) => void;
  setShowSoftboxes: (show: boolean) => void;
  setShowFloorGrid: (show: boolean) => void;
  updatePBR: (updates: Partial<PBRProperties>) => void;
  setAutoRotate: (rotate: boolean) => void;
  setWireframe: (wireframe: boolean) => void;
  saveMockupSnapshot: (imageUrl: string, title?: string) => Promise<SavedMockup>;
  loadSavedMockups: () => Promise<void>;
  deleteMockup: (id: string) => Promise<void>;
}

export const useMockupStore = create<MockupState>((set, get) => ({
  garmentId: 'garment-oversized-tee',
  garmentColor: '#0B0B0D',
  cameraPreset: 'hero',
  environmentPreset: 'obsidian_dark',
  backgroundModel: 'podium',
  showSoftboxes: true,
  showFloorGrid: true,
  pbr: {
    roughness: 0.88,
    metalness: 0.05,
    sheen: 0.3,
    normalScale: 1.0,
  },
  autoRotate: false,
  wireframe: false,
  savedMockups: [],

  setGarmentId: (garmentId) => {
    set({ garmentId });
    try {
      useStudioStore.getState().setGarmentId(garmentId);
    } catch {}
  },
  setGarmentColor: (garmentColor) => {
    set({ garmentColor });
    try {
      useStudioStore.getState().setGarmentColor(garmentColor);
    } catch {}
  },
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setEnvironmentPreset: (environmentPreset) => set({ environmentPreset }),
  setBackgroundModel: (backgroundModel) => set({ backgroundModel }),
  setShowSoftboxes: (showSoftboxes) => set({ showSoftboxes }),
  setShowFloorGrid: (showFloorGrid) => set({ showFloorGrid }),
  updatePBR: (updates) => set((state) => ({ pbr: { ...state.pbr, ...updates } })),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setWireframe: (wireframe) => set({ wireframe }),

  saveMockupSnapshot: async (imageUrl: string, title?: string) => {
    const { garmentId, garmentColor, cameraPreset, environmentPreset } = get();
    const garment = DEFAULT_GARMENTS.find((g) => g.id === garmentId) || DEFAULT_GARMENTS[0];

    const mockup: SavedMockup = {
      id: generateId('mockup'),
      projectId: 'active-project',
      title: title || `${garment.shortName.toUpperCase()} - ${cameraPreset.toUpperCase()}`,
      garmentName: garment.name,
      garmentColor,
      cameraPreset,
      environmentPreset,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      await localDb.mockups.add(mockup);
      set((state) => ({ savedMockups: [mockup, ...state.savedMockups] }));
    } catch (err) {
      console.error('Failed to save mockup to IndexedDB:', err);
    }

    return mockup;
  },

  loadSavedMockups: async () => {
    try {
      const records = await localDb.mockups.reverse().toArray();
      set({ savedMockups: records });
    } catch (err) {
      console.error('Failed to load mockups:', err);
    }
  },

  deleteMockup: async (id: string) => {
    try {
      await localDb.mockups.delete(id);
      set((state) => ({ savedMockups: state.savedMockups.filter((m) => m.id !== id) }));
    } catch (err) {
      console.error('Failed to delete mockup:', err);
    }
  },
}));
