import { create } from 'zustand';
import { SurfaceType, GarmentCategory } from '@/types/garment';
import { DesignLayer, ImageLayer, TextLayer, StudioProject } from '@/types/studio';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { generateId } from '@/lib/utils';
import { localDb } from '@/lib/storage/dexie-db';

interface StudioState {
  project: StudioProject;
  activeSurface: SurfaceType;
  selectedLayerId: string | null;
  viewMode: '2D' | '3D' | 'SPLIT';
  zoom: number;
  pan: { x: number; y: number };
  isSaving: boolean;
  lastSavedAt: string | null;
  history: StudioProject[];
  historyIndex: number;
  textureVersion: number;

  // Actions
  setProject: (project: StudioProject) => void;
  loadProjectById: (id: string) => Promise<boolean>;
  setProjectName: (name: string) => void;
  setGarmentId: (garmentId: string) => void;
  setGarmentColor: (color: string) => void;
  setActiveSurface: (surface: SurfaceType) => void;
  setSelectedLayerId: (id: string | null) => void;
  setViewMode: (mode: '2D' | '3D' | 'SPLIT') => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;

  // Layer Mutations
  addTextLayer: (customProps?: Partial<TextLayer>) => void;
  addImageLayer: (src: string, originalWidth: number, originalHeight: number, name?: string) => void;
  updateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  nudgeLayer: (id: string, dxPercent: number, dyPercent: number) => void;
  scaleLayer: (id: string, deltaPercent: number) => void;
  rotateLayer: (id: string, deltaDegrees: number) => void;
  centerLayer: (id: string, axis?: 'h' | 'v' | 'both') => void;
  alignLayer: (id: string, alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  duplicateLayer: (id: string) => void;
  deleteLayer: (id: string) => void;
  reorderLayers: (surface: SurfaceType, startIndex: number, endIndex: number) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Persistence
  saveProjectLocally: () => Promise<void>;
}

const createDefaultProject = (id = 'default-project'): StudioProject => ({
  id,
  name: 'ATELIER ZERO // DROP 01',
  garmentId: 'garment-oversized-tee',
  garmentColor: '#0B0B0D',
  layers: {
    FRONT: [
      {
        id: 'layer-brand-text',
        name: 'Brand Header',
        type: 'TEXT',
        surface: 'FRONT',
        x: 50,
        y: 40,
        width: 60,
        height: 14,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        isLocked: false,
        isVisible: true,
        zIndex: 1,
        text: 'ATELIER ZERO',
        fontFamily: 'Impact, sans-serif',
        fontSize: 34,
        fillColor: '#E2F952',
        letterSpacing: 3,
        lineHeight: 1.1,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      {
        id: 'layer-sub-text',
        name: 'Sub-Spec Text',
        type: 'TEXT',
        surface: 'FRONT',
        x: 50,
        y: 52,
        width: 50,
        height: 8,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 0.85,
        isLocked: false,
        isVisible: true,
        zIndex: 2,
        text: 'STREETWEAR ARCHIVE 2026 // HEAVYWEIGHT 280 GSM',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 11,
        fillColor: '#FFFFFF',
        letterSpacing: 2,
        lineHeight: 1.2,
        fontWeight: 'normal',
        textAlign: 'center',
      },
    ],
    BACK: [],
    LEFT_SLEEVE: [],
    RIGHT_SLEEVE: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const getInitialProject = (): StudioProject => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('stb_active_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.layers && parsed.id) return parsed;
      }
    } catch {}
  }
  return createDefaultProject();
};

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

const initialProject = getInitialProject();

export const useStudioStore = create<StudioState>((set, get) => ({
  project: initialProject,
  activeSurface: 'FRONT',
  selectedLayerId: 'layer-brand-text',
  viewMode: '2D',
  zoom: 1,
  pan: { x: 0, y: 0 },
  isSaving: false,
  lastSavedAt: null,
  history: [initialProject],
  historyIndex: 0,
  textureVersion: 0,

  setProject: (project) => {
    set({
      project,
      history: [project],
      historyIndex: 0,
      selectedLayerId: null,
      textureVersion: get().textureVersion + 1,
    });
  },

  loadProjectById: async (id: string) => {
    try {
      const record = await localDb.projects.get(id);
      if (record && record.data) {
        set({
          project: record.data,
          history: [record.data],
          historyIndex: 0,
          selectedLayerId: null,
          textureVersion: get().textureVersion + 1,
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error loading project by ID:', e);
      return false;
    }
  },

  setProjectName: (name) => {
    const updated = {
      ...get().project,
      name,
      updatedAt: new Date().toISOString(),
    };
    set({ project: updated });
    get().saveProjectLocally();
  },

  setGarmentId: (garmentId) => {
    const updated = {
      ...get().project,
      garmentId,
      updatedAt: new Date().toISOString(),
    };
    set({
      project: updated,
      textureVersion: get().textureVersion + 1,
    });
    get().saveProjectLocally();
  },

  setGarmentColor: (garmentColor) => {
    const updated = {
      ...get().project,
      garmentColor,
      updatedAt: new Date().toISOString(),
    };
    set({
      project: updated,
      textureVersion: get().textureVersion + 1,
    });
    get().saveProjectLocally();
  },

  setActiveSurface: (surface) => {
    set({
      activeSurface: surface,
      selectedLayerId: null,
    });
  },

  setSelectedLayerId: (id) => {
    set({ selectedLayerId: id });
  },

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.min(Math.max(zoom, 0.4), 2.5) });
  },

  setPan: (pan) => {
    set({ pan });
  },

  addTextLayer: (customProps) => {
    const { project, activeSurface, history, historyIndex } = get();
    const surfaceLayers = project.layers[activeSurface] || [];

    const newLayer: TextLayer = {
      id: generateId('layer-txt'),
      name: `Text ${surfaceLayers.length + 1}`,
      type: 'TEXT',
      surface: activeSurface,
      x: 50,
      y: 50,
      width: 50,
      height: 12,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      isLocked: false,
      isVisible: true,
      zIndex: surfaceLayers.length + 1,
      text: 'NEW STREET GRAPHIC',
      fontFamily: 'Impact, sans-serif',
      fontSize: 28,
      fillColor: '#FFFFFF',
      letterSpacing: 2,
      lineHeight: 1.2,
      fontWeight: 'bold',
      textAlign: 'center',
      ...customProps,
    };

    const updatedLayers = [...surfaceLayers, newLayer];
    const updatedProject = {
      ...project,
      layers: {
        ...project.layers,
        [activeSurface]: updatedLayers,
      },
      updatedAt: new Date().toISOString(),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({
      project: updatedProject,
      selectedLayerId: newLayer.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  addImageLayer: (src, originalWidth, originalHeight, name) => {
    const { project, activeSurface, history, historyIndex } = get();
    const surfaceLayers = project.layers[activeSurface] || [];

    const aspectRatio = originalWidth / (originalHeight || 1);
    let initialWidth = 40;
    let initialHeight = 40 / aspectRatio;
    if (initialHeight > 50) {
      initialHeight = 50;
      initialWidth = 50 * aspectRatio;
    }

    const newLayer: ImageLayer = {
      id: generateId('layer-img'),
      name: name || `Artwork ${surfaceLayers.length + 1}`,
      type: 'IMAGE',
      surface: activeSurface,
      x: 50,
      y: 50,
      width: Math.min(initialWidth, 75),
      height: Math.min(initialHeight, 75),
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      isLocked: false,
      isVisible: true,
      zIndex: surfaceLayers.length + 1,
      src,
      originalWidth,
      originalHeight,
      filterMode: 'ORIGINAL',
    };

    const updatedLayers = [...surfaceLayers, newLayer];
    const updatedProject = {
      ...project,
      layers: {
        ...project.layers,
        [activeSurface]: updatedLayers,
      },
      updatedAt: new Date().toISOString(),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({
      project: updatedProject,
      selectedLayerId: newLayer.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  updateLayer: (id, updates) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];

    const updatedLayers = surfaceLayers.map((layer) =>
      layer.id === id ? ({ ...layer, ...updates } as DesignLayer) : layer
    );

    const updatedProject = {
      ...project,
      layers: {
        ...project.layers,
        [activeSurface]: updatedLayers,
      },
      updatedAt: new Date().toISOString(),
    };

    set({
      project: updatedProject,
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  nudgeLayer: (id, dxPercent, dyPercent) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const target = surfaceLayers.find((l) => l.id === id);
    if (!target || target.isLocked) return;

    const newX = Math.round(Math.min(Math.max(target.x + dxPercent, 0), 100));
    const newY = Math.round(Math.min(Math.max(target.y + dyPercent, 0), 100));

    get().updateLayer(id, { x: newX, y: newY });
  },

  scaleLayer: (id, deltaPercent) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const target = surfaceLayers.find((l) => l.id === id);
    if (!target || target.isLocked) return;

    const aspectRatio = target.width / (target.height || 1);
    const newWidth = Math.max(5, Math.min(95, target.width + deltaPercent));
    const newHeight = Math.max(5, Math.min(95, newWidth / aspectRatio));

    get().updateLayer(id, { width: Math.round(newWidth), height: Math.round(newHeight) });
  },

  rotateLayer: (id, deltaDegrees) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const target = surfaceLayers.find((l) => l.id === id);
    if (!target || target.isLocked) return;

    let newRotation = (target.rotation + deltaDegrees) % 360;
    if (newRotation < 0) newRotation += 360;

    get().updateLayer(id, { rotation: newRotation });
  },

  centerLayer: (id, axis = 'both') => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const target = surfaceLayers.find((l) => l.id === id);
    if (!target || target.isLocked) return;

    const updates: Partial<DesignLayer> = {};
    if (axis === 'h' || axis === 'both') updates.x = 50;
    if (axis === 'v' || axis === 'both') updates.y = 50;

    get().updateLayer(id, updates);
  },

  alignLayer: (id, alignment) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const target = surfaceLayers.find((l) => l.id === id);
    if (!target || target.isLocked) return;

    const updates: Partial<DesignLayer> = {};
    switch (alignment) {
      case 'left':
        updates.x = Math.round(target.width / 2 + 8);
        break;
      case 'center':
        updates.x = 50;
        break;
      case 'right':
        updates.x = Math.round(100 - target.width / 2 - 8);
        break;
      case 'top':
        updates.y = Math.round(target.height / 2 + 10);
        break;
      case 'middle':
        updates.y = 50;
        break;
      case 'bottom':
        updates.y = Math.round(100 - target.height / 2 - 10);
        break;
    }

    get().updateLayer(id, updates);
  },

  duplicateLayer: (id) => {
    const { project, activeSurface, history, historyIndex } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const source = surfaceLayers.find((l) => l.id === id);
    if (!source) return;

    const duplicated: DesignLayer = {
      ...source,
      id: generateId('layer-copy'),
      name: `${source.name} Copy`,
      x: Math.min(source.x + 4, 90),
      y: Math.min(source.y + 4, 90),
      zIndex: surfaceLayers.length + 1,
    };

    const updatedLayers = [...surfaceLayers, duplicated];
    const updatedProject = {
      ...project,
      layers: {
        ...project.layers,
        [activeSurface]: updatedLayers,
      },
      updatedAt: new Date().toISOString(),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({
      project: updatedProject,
      selectedLayerId: duplicated.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  deleteLayer: (id) => {
    const { project, activeSurface, history, historyIndex } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const updatedLayers = surfaceLayers.filter((l) => l.id !== id);

    const updatedProject = {
      ...project,
      layers: {
        ...project.layers,
        [activeSurface]: updatedLayers,
      },
      updatedAt: new Date().toISOString(),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({
      project: updatedProject,
      selectedLayerId: null,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  reorderLayers: (surface, startIndex, endIndex) => {
    const { project } = get();
    const surfaceLayers = [...(project.layers[surface] || [])];
    const [moved] = surfaceLayers.splice(startIndex, 1);
    surfaceLayers.splice(endIndex, 0, moved);

    // Update zIndices
    const reindexed = surfaceLayers.map((layer, idx) => ({
      ...layer,
      zIndex: idx + 1,
    }));

    const updatedProject = {
      ...project,
      layers: {
        ...project.layers,
        [surface]: reindexed,
      },
      updatedAt: new Date().toISOString(),
    };

    set({
      project: updatedProject,
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  toggleLayerVisibility: (id) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const updatedLayers = surfaceLayers.map((l) =>
      l.id === id ? { ...l, isVisible: !l.isVisible } : l
    );

    const updatedProject = {
      ...project,
      layers: {
        ...project.layers,
        [activeSurface]: updatedLayers,
      },
      updatedAt: new Date().toISOString(),
    };

    set({
      project: updatedProject,
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  toggleLayerLock: (id) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const updatedLayers = surfaceLayers.map((l) =>
      l.id === id ? { ...l, isLocked: !l.isLocked } : l
    );

    set({
      project: {
        ...project,
        layers: {
          ...project.layers,
          [activeSurface]: updatedLayers,
        },
      },
    });

    get().saveProjectLocally();
  },

  bringToFront: (id) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const target = surfaceLayers.find((l) => l.id === id);
    if (!target) return;

    const remaining = surfaceLayers.filter((l) => l.id !== id);
    const updated = [...remaining, target].map((l, i) => ({ ...l, zIndex: i + 1 }));

    set({
      project: {
        ...project,
        layers: {
          ...project.layers,
          [activeSurface]: updated,
        },
      },
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  sendToBack: (id) => {
    const { project, activeSurface } = get();
    const surfaceLayers = project.layers[activeSurface] || [];
    const target = surfaceLayers.find((l) => l.id === id);
    if (!target) return;

    const remaining = surfaceLayers.filter((l) => l.id !== id);
    const updated = [target, ...remaining].map((l, i) => ({ ...l, zIndex: i + 1 }));

    set({
      project: {
        ...project,
        layers: {
          ...project.layers,
          [activeSurface]: updated,
        },
      },
      textureVersion: get().textureVersion + 1,
    });

    get().saveProjectLocally();
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({
        project: prev,
        historyIndex: historyIndex - 1,
        textureVersion: get().textureVersion + 1,
      });
      get().saveProjectLocally();
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      set({
        project: next,
        historyIndex: historyIndex + 1,
        textureVersion: get().textureVersion + 1,
      });
      get().saveProjectLocally();
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  saveProjectLocally: async () => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);

    // Immediate synchronous localStorage update for seamless instant hydration
    const { project } = get();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('stb_active_project', JSON.stringify(project));
      } catch {}
    }

    autoSaveTimer = setTimeout(async () => {
      set({ isSaving: true });
      try {
        await localDb.projects.put({
          id: project.id,
          name: project.name,
          updatedAt: new Date().toISOString(),
          data: project,
        });
        set({ isSaving: false, lastSavedAt: new Date().toLocaleTimeString() });
      } catch (err) {
        console.error('Failed to auto-save project to IndexedDB:', err);
        set({ isSaving: false });
      }
    }, 800);
  },
}));
