'use client';

import { useState } from 'react';
import {
  Upload,
  Type,
  Sparkles,
  Shirt,
  Layers,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Check,
} from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { APPAREL_COLOR_PRESETS } from '@/constants/color-presets';
import { STREETWEAR_FONTS } from '@/constants/typography-presets';
import { toast } from 'sonner';

// Curated SVG Streetwear Decal Library
const PRESET_DECALS = [
  {
    name: 'Brutalist Spec Block',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%23000000" stroke="%23E2F952" stroke-width="4"/><text x="20" y="40" font-family="monospace" font-size="20" font-weight="bold" fill="%23E2F952">STARTTHEBRAND // SPEC</text><text x="20" y="70" font-family="monospace" font-size="12" fill="%23FFFFFF">ARCHIVE: ATELIER-2026</text><text x="20" y="90" font-family="monospace" font-size="12" fill="%23FFFFFF">WEIGHT: 450 GSM COTTON</text><line x1="20" y1="110" x2="280" y2="110" stroke="%23E2F952" stroke-width="2"/><text x="20" y="130" font-family="monospace" font-size="11" fill="%23E2F952">ALL RIGHTS RESERVED [01/99]</text></svg>`,
    width: 300,
    height: 150,
  },
  {
    name: 'Industrial Barcode',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120"><rect width="320" height="120" fill="transparent"/><rect x="20" y="10" width="8" height="70" fill="%23FFFFFF"/><rect x="34" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="44" y="10" width="12" height="70" fill="%23FFFFFF"/><rect x="62" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="74" y="10" width="14" height="70" fill="%23FFFFFF"/><rect x="94" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="104" y="10" width="10" height="70" fill="%23FFFFFF"/><rect x="120" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="132" y="10" width="16" height="70" fill="%23FFFFFF"/><rect x="154" y="10" width="8" height="70" fill="%23FFFFFF"/><rect x="168" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="178" y="10" width="14" height="70" fill="%23FFFFFF"/><rect x="198" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="210" y="10" width="10" height="70" fill="%23FFFFFF"/><rect x="226" y="10" width="14" height="70" fill="%23FFFFFF"/><rect x="246" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="256" y="10" width="12" height="70" fill="%23FFFFFF"/><rect x="274" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="286" y="10" width="14" height="70" fill="%23FFFFFF"/><text x="160" y="105" font-family="monospace" font-size="14" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">STB-8940-2026-X</text></svg>`,
    width: 320,
    height: 120,
  },
  {
    name: 'Gothic Cross Emblem',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><path d="M 90 20 L 110 20 L 110 75 L 165 75 L 165 95 L 110 95 L 110 180 L 90 180 L 90 95 L 35 95 L 35 75 L 90 75 Z" fill="%23FFFFFF"/><circle cx="100" cy="85" r="35" fill="none" stroke="%23E2F952" stroke-width="4"/></svg>`,
    width: 200,
    height: 200,
  },
  {
    name: 'Volt Acid Star',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><polygon points="100,10 120,70 185,75 135,120 150,185 100,145 50,185 65,120 15,75 80,70" fill="%23E2F952"/><circle cx="100" cy="100" r="18" fill="%23000000"/></svg>`,
    width: 200,
    height: 200,
  },
  {
    name: 'Caution High Voltage',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="190" viewBox="0 0 220 190"><polygon points="110,15 205,175 15,175" fill="none" stroke="%23FF4800" stroke-width="8"/><polygon points="110,50 125,100 105,100 120,150 90,110 110,110" fill="%23FF4800"/><text x="110" y="165" font-family="monospace" font-size="10" font-weight="bold" fill="%23FF4800" text-anchor="middle">HEAVY SOUND</text></svg>`,
    width: 220,
    height: 190,
  },
];

export function ToolSidebar() {
  const [activeTab, setActiveTab] = useState<'upload' | 'type' | 'library' | 'garment' | 'layers'>('upload');

  const {
    project,
    activeSurface,
    selectedLayerId,
    addTextLayer,
    addImageLayer,
    setGarmentId,
    setGarmentColor,
    setSelectedLayerId,
    deleteLayer,
    duplicateLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    bringToFront,
    sendToBack,
  } = useStudioStore();

  const surfaceLayers = project.layers[activeSurface] || [];
  const currentGarment =
    DEFAULT_GARMENTS.find((g) => g.id === project.garmentId) || DEFAULT_GARMENTS[0];

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      toast.error('Please upload an image file (PNG, JPG, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        addImageLayer(src, img.width, img.height, file.name);
        toast.success(`Added ${file.name} to ${activeSurface}`);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-[#0C0D10] font-mono text-xs z-20">
      {/* Tab Switcher */}
      <div className="grid grid-cols-5 border-b border-border bg-[#090A0C]">
        {[
          { id: 'upload', icon: Upload, label: 'Upload' },
          { id: 'type', icon: Type, label: 'Text' },
          { id: 'library', icon: Sparkles, label: 'Library' },
          { id: 'garment', icon: Shirt, label: 'Blank' },
          { id: 'layers', icon: Layers, label: 'Layers' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-3 px-1 transition-colors ${
                isActive
                  ? 'border-b-2 border-brand-volt text-brand-volt bg-surface'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-[9px] uppercase tracking-wider mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: ARTWORK UPLOAD */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="border border-dashed border-border rounded-sm p-6 text-center hover:border-brand-volt/60 transition-colors bg-[#07080A]">
              <Upload className="h-8 w-8 text-brand-volt mx-auto mb-2" />
              <div className="font-bold text-white text-xs uppercase">UPLOAD ARTWORK</div>
              <p className="text-[10px] text-zinc-500 font-sans mt-1">
                PNG, JPG, or SVG. Transparent PNGs recommended for DTF.
              </p>
              <label className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-brand-volt px-4 py-2 font-bold text-black text-xs cursor-pointer hover:bg-brand-volt/90 transition-all">
                <span>SELECT FILE</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-[10px] text-zinc-500 font-sans leading-relaxed">
              Artwork placed on the 2D surface will immediately reflect on the 3D model's PBR fabric texture in real-time.
            </div>
          </div>
        )}

        {/* TAB 2: STREETWEAR TYPOGRAPHY */}
        {activeTab === 'type' && (
          <div className="space-y-4">
            <button
              onClick={() => addTextLayer()}
              className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2.5 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>ADD TEXT LAYER</span>
            </button>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
                Streetwear Typography Presets
              </div>
              <div className="space-y-2">
                {STREETWEAR_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() =>
                      addTextLayer({
                        text: font.previewText,
                        fontFamily: font.fontFamily,
                        letterSpacing: font.defaultLetterSpacing,
                      })
                    }
                    className="w-full text-left rounded-sm border border-border bg-[#07080A] p-2.5 hover:border-zinc-500 hover:bg-surface transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] text-brand-volt font-bold uppercase">
                        {font.name}
                      </div>
                      <div
                        style={{ fontFamily: font.fontFamily }}
                        className="text-xs text-white mt-0.5 truncate max-w-[200px]"
                      >
                        {font.previewText}
                      </div>
                    </div>
                    <Plus className="h-3.5 w-3.5 text-zinc-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DECAL & GRAPHIC LIBRARY */}
        {activeTab === 'library' && (
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              Curated Streetwear Decals
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESET_DECALS.map((decal, i) => (
                <button
                  key={i}
                  onClick={() => {
                    addImageLayer(decal.svg, decal.width, decal.height, decal.name);
                    toast.success(`Added ${decal.name}`);
                  }}
                  className="rounded-sm border border-border bg-[#07080A] p-3 text-left hover:border-brand-volt/60 transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-brand-volt transition-colors">
                      {decal.name}
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">
                      {decal.width} × {decal.height} Vector Decal
                    </span>
                  </div>
                  <Plus className="h-4 w-4 text-zinc-500 group-hover:text-brand-volt" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GARMENT & BLANKS */}
        {activeTab === 'garment' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
                Active Silhouette Blank
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {DEFAULT_GARMENTS.map((g) => {
                  const isSelected = g.id === project.garmentId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGarmentId(g.id)}
                      className={`w-full text-left rounded-sm p-2 text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-volt text-black font-bold'
                          : 'bg-surface text-zinc-300 hover:text-white border border-border/60'
                      }`}
                    >
                      <span className="truncate">{g.shortName}</span>
                      <span className="text-[10px]">${g.baseCostUSD.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
                Garment Blank Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {APPAREL_COLOR_PRESETS.map((color) => {
                  const isSelected = project.garmentColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => setGarmentColor(color.hex)}
                      title={color.name}
                      className={`h-7 w-full rounded-sm border transition-transform ${
                        isSelected ? 'scale-110 border-brand-volt ring-2 ring-brand-volt/40' : 'border-zinc-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LAYER MANAGER */}
        {activeTab === 'layers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              <span>Layers ({surfaceLayers.length})</span>
              <span>{activeSurface}</span>
            </div>

            {surfaceLayers.length === 0 ? (
              <div className="rounded border border-dashed border-border p-6 text-center text-zinc-500 text-xs">
                No layers on {activeSurface}. Upload artwork or add text above.
              </div>
            ) : (
              <div className="space-y-1">
                {[...surfaceLayers]
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((layer) => {
                    const isSelected = layer.id === selectedLayerId;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`group flex items-center justify-between rounded-sm border p-2 text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-volt bg-surface text-white'
                            : 'border-border/60 bg-[#07080A] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {layer.type === 'TEXT' ? (
                            <Type className="h-3.5 w-3.5 text-brand-volt flex-shrink-0" />
                          ) : (
                            <Upload className="h-3.5 w-3.5 text-brand-cyan flex-shrink-0" />
                          )}
                          <span className="truncate font-semibold">{layer.name}</span>
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerVisibility(layer.id);
                            }}
                            className="p-1 hover:text-white"
                          >
                            {layer.isVisible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-zinc-600" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerLock(layer.id);
                            }}
                            className="p-1 hover:text-white"
                          >
                            {layer.isLocked ? (
                              <Lock className="h-3 w-3 text-amber-400" />
                            ) : (
                              <Unlock className="h-3 w-3 text-zinc-600" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLayer(layer.id);
                            }}
                            className="p-1 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
