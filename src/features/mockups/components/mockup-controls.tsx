'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  Sun,
  Shirt,
  Palette,
  RotateCw,
  Download,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Minimize2,
  Check,
  Type,
  Upload,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Trash2,
  Plus,
  Box,
  Layers,
} from 'lucide-react';
import { useMockupStore } from '@/stores/mockup-store';
import { useStudioStore } from '@/stores/studio-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { APPAREL_COLOR_PRESETS } from '@/constants/color-presets';
import { CameraPreset, EnvironmentPreset, BackgroundModelType } from '@/types/mockup';
import { toast } from 'sonner';

interface MockupControlsProps {
  onCapture: () => void;
}

export function MockupControls({ onCapture }: MockupControlsProps) {
  const {
    garmentId,
    garmentColor,
    cameraPreset,
    environmentPreset,
    backgroundModel,
    showSoftboxes,
    showFloorGrid,
    pbr,
    autoRotate,
    wireframe,
    setGarmentId,
    setGarmentColor,
    setCameraPreset,
    setEnvironmentPreset,
    setBackgroundModel,
    setShowSoftboxes,
    setShowFloorGrid,
    updatePBR,
    setAutoRotate,
    setWireframe,
  } = useMockupStore();

  const {
    project,
    activeSurface,
    selectedLayerId,
    setActiveSurface,
    setSelectedLayerId,
    addTextLayer,
    addImageLayer,
    nudgeLayer,
    scaleLayer,
    rotateLayer,
    centerLayer,
    deleteLayer,
  } = useStudioStore();

  const [activeTab, setActiveTab] = useState<'garment' | 'design' | 'stage' | 'camera' | 'material'>('garment');

  const surfaceLayers = project.layers[activeSurface] || [];
  const selectedLayer = surfaceLayers.find((l) => l.id === selectedLayerId);

  const cameraOptions: { id: CameraPreset; label: string }[] = [
    { id: 'hero', label: 'Front Hero' },
    { id: 'isometric', label: '45° Angle' },
    { id: 'graphic', label: 'Chest Graphic' },
    { id: 'back', label: 'Back View' },
    { id: 'macro', label: 'Macro Weave' },
  ];

  const envOptions: { id: EnvironmentPreset; label: string }[] = [
    { id: 'obsidian_dark', label: 'Obsidian Dark' },
    { id: 'studio_clean', label: 'Studio Clean' },
    { id: 'urban_street', label: 'Urban Street' },
    { id: 'minimal_gray', label: 'Minimal Gray' },
  ];

  const stageOptions: { id: BackgroundModelType; name: string; desc: string }[] = [
    { id: 'podium', name: 'Showroom Plinth', desc: 'Bevelled podium with volt glow ring' },
    { id: 'studio_cyc', name: 'Studio Cyc Wall', desc: 'Infinite curved backdrop wall' },
    { id: 'mannequin', name: 'Mannequin Stand', desc: 'Cast-iron base & wood hanger neck' },
    { id: 'concrete_runway', name: 'Concrete Runway', desc: 'Industrial street stage + hazard lines' },
    { id: 'neon_gallery', name: 'Neon Pillars', desc: 'Brutalist pillars with vertical LED strips' },
    { id: 'none', name: 'Pure Floating', desc: 'Minimal clean floating shadow' },
  ];

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
        toast.success(`Placed ${file.name} onto 3D ${activeSurface}`);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-[#0C0D10] font-mono text-xs z-20 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-[#090A0C]">
        <div className="flex items-center gap-2">
          <Shirt className="h-4 w-4 text-brand-volt" />
          <span className="font-bold text-white uppercase text-xs">3D STUDIO</span>
        </div>
        <span className="rounded bg-brand-volt/10 text-brand-volt px-2 py-0.5 text-[9px] font-bold">
          PBR REAL-TIME
        </span>
      </div>

      {/* 5 Navigation Tabs */}
      <div className="grid grid-cols-5 border-b border-border bg-[#08090C] text-[10px]">
        {[
          { id: 'garment', label: 'Cloth' },
          { id: 'design', label: 'Design' },
          { id: 'stage', label: 'Stage' },
          { id: 'camera', label: 'Camera' },
          { id: 'material', label: 'Shader' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 font-bold uppercase transition-colors text-center ${
              activeTab === tab.id
                ? 'border-b-2 border-brand-volt text-brand-volt bg-surface'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        {/* TAB 1: GARMENT CLOTH CONFIG */}
        {activeTab === 'garment' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
                Garment Silhouette
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {DEFAULT_GARMENTS.map((g) => {
                  const isSelected = g.id === garmentId;
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

            {/* Garment Color Swatches */}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
                <span>Fabric Color</span>
                <span className="text-brand-volt font-bold">{garmentColor}</span>
              </div>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {APPAREL_COLOR_PRESETS.map((color) => {
                  const isSelected = garmentColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => setGarmentColor(color.hex)}
                      title={color.name}
                      className={`h-7 w-full rounded-sm border transition-transform ${
                        isSelected
                          ? 'scale-110 border-brand-volt ring-2 ring-brand-volt/40'
                          : 'border-zinc-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={garmentColor}
                  onChange={(e) => setGarmentColor(e.target.value)}
                  className="h-7 w-9 cursor-pointer rounded-sm border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={garmentColor}
                  onChange={(e) => setGarmentColor(e.target.value)}
                  className="flex-1 rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IN-3D DESIGN & DECAL MANAGEMENT */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            {/* Active Surface Switcher */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1.5">
                Target Surface
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setActiveSurface('FRONT');
                    setCameraPreset('hero');
                  }}
                  className={`py-1.5 px-2 text-center rounded text-xs font-bold ${
                    activeSurface === 'FRONT'
                      ? 'bg-brand-volt text-black'
                      : 'bg-surface text-zinc-400 hover:text-white border border-border'
                  }`}
                >
                  Front Chest
                </button>
                <button
                  onClick={() => {
                    setActiveSurface('BACK');
                    setCameraPreset('back');
                  }}
                  className={`py-1.5 px-2 text-center rounded text-xs font-bold ${
                    activeSurface === 'BACK'
                      ? 'bg-brand-volt text-black'
                      : 'bg-surface text-zinc-400 hover:text-white border border-border'
                  }`}
                >
                  Full Back
                </button>
              </div>
            </div>

            {/* Quick Add Buttons in 3D */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  addTextLayer({ text: 'STREET WEAR 2026' });
                  toast.success(`Added 3D text graphic to ${activeSurface}`);
                }}
                className="flex items-center justify-center gap-1.5 rounded-sm bg-brand-volt py-2 font-bold text-black hover:bg-brand-volt/90 transition-all text-xs"
              >
                <Type className="h-3.5 w-3.5" />
                <span>+ Text</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 rounded-sm bg-surface border border-border py-2 font-semibold text-white hover:border-zinc-500 cursor-pointer transition-all text-xs">
                <Upload className="h-3.5 w-3.5 text-brand-volt" />
                <span>+ Upload</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Selected Decal Controls */}
            {selectedLayer ? (
              <div className="rounded border border-brand-volt/50 bg-[#07080A] p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs truncate max-w-[150px]">
                    {selectedLayer.name}
                  </span>
                  <button
                    onClick={() => deleteLayer(selectedLayer.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete Graphic"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* D-Pad Controls for 3D Movement */}
                <div className="flex flex-col items-center justify-center p-2 rounded bg-surface border border-border">
                  <button
                    onClick={() => nudgeLayer(selectedLayer.id, 0, -4)}
                    className="p-1 rounded bg-[#07080A] hover:text-brand-volt text-zinc-300 border border-border"
                    title="Slide Up on 3D Cloth"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center gap-3 my-1">
                    <button
                      onClick={() => nudgeLayer(selectedLayer.id, -4, 0)}
                      className="p-1 rounded bg-[#07080A] hover:text-brand-volt text-zinc-300 border border-border"
                      title="Slide Left on 3D Cloth"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => centerLayer(selectedLayer.id, 'both')}
                      className="p-1 rounded bg-brand-volt/10 text-brand-volt hover:bg-brand-volt hover:text-black border border-brand-volt/40"
                      title="Center on Chest"
                    >
                      <Crosshair className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => nudgeLayer(selectedLayer.id, 4, 0)}
                      className="p-1 rounded bg-[#07080A] hover:text-brand-volt text-zinc-300 border border-border"
                      title="Slide Right on 3D Cloth"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => nudgeLayer(selectedLayer.id, 0, 4)}
                    className="p-1 rounded bg-[#07080A] hover:text-brand-volt text-zinc-300 border border-border"
                    title="Slide Down on 3D Cloth"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Scale & Rotate */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => scaleLayer(selectedLayer.id, -5)}
                    className="rounded border border-border bg-surface py-1 text-[10px] text-zinc-300 hover:text-white"
                  >
                    - Scale Size
                  </button>
                  <button
                    onClick={() => scaleLayer(selectedLayer.id, 5)}
                    className="rounded border border-border bg-surface py-1 text-[10px] text-zinc-300 hover:text-white"
                  >
                    + Scale Size
                  </button>
                  <button
                    onClick={() => rotateLayer(selectedLayer.id, -15)}
                    className="rounded border border-border bg-surface py-1 text-[10px] text-zinc-300 hover:text-white"
                  >
                    Rotate -15°
                  </button>
                  <button
                    onClick={() => rotateLayer(selectedLayer.id, 15)}
                    className="rounded border border-border bg-surface py-1 text-[10px] text-zinc-300 hover:text-white"
                  >
                    Rotate +15°
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block mb-2">
                  Layers on {activeSurface} ({surfaceLayers.length})
                </span>
                {surfaceLayers.length === 0 ? (
                  <p className="text-[11px] text-zinc-500 italic">
                    No decals on {activeSurface}. Add one with the buttons above.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {surfaceLayers.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setSelectedLayerId(l.id)}
                        className="w-full text-left rounded p-2 bg-surface hover:bg-surface/80 border border-border flex items-center justify-between text-zinc-300 hover:text-white"
                      >
                        <span className="truncate">{l.name}</span>
                        <span className="text-[9px] text-brand-volt uppercase">{l.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STAGE & BACKGROUND MODELS */}
        {activeTab === 'stage' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2 flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5 text-brand-volt" />
                <span>3D Background Model / Stage Set</span>
              </label>
              <div className="space-y-1.5">
                {stageOptions.map((opt) => {
                  const isSelected = backgroundModel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setBackgroundModel(opt.id)}
                      className={`w-full text-left rounded p-2 text-xs transition-all border ${
                        isSelected
                          ? 'border-brand-volt bg-brand-volt/10 text-white'
                          : 'border-border/60 bg-[#07080A] text-zinc-400 hover:text-white hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{opt.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-brand-volt" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage Props & Toggles */}
            <div className="border-t border-border pt-4 space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
                Studio Environment Elements
              </label>
              <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
                <span className="text-zinc-300 text-xs">Photo Studio Softbox Lights</span>
                <button
                  onClick={() => setShowSoftboxes(!showSoftboxes)}
                  className={`rounded px-2.5 py-0.5 text-[10px] font-bold border transition-colors ${
                    showSoftboxes
                      ? 'border-brand-volt bg-brand-volt text-black'
                      : 'border-border bg-[#07080A] text-zinc-500'
                  }`}
                >
                  {showSoftboxes ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
                <span className="text-zinc-300 text-xs">Floor CAD Grid & Markings</span>
                <button
                  onClick={() => setShowFloorGrid(!showFloorGrid)}
                  className={`rounded px-2.5 py-0.5 text-[10px] font-bold border transition-colors ${
                    showFloorGrid
                      ? 'border-brand-volt bg-brand-volt text-black'
                      : 'border-border bg-[#07080A] text-zinc-500'
                  }`}
                >
                  {showFloorGrid ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAMERA PRESETS */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2 flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-brand-volt" />
                <span>Camera Preset</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {cameraOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCameraPreset(opt.id)}
                    className={`rounded-sm py-2 px-2 text-[11px] transition-colors ${
                      cameraPreset === opt.id
                        ? 'bg-brand-volt text-black font-bold'
                        : 'bg-[#07080A] text-zinc-400 hover:text-white border border-border/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2 flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-brand-volt" />
                <span>Lighting Environment</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {envOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setEnvironmentPreset(opt.id)}
                    className={`rounded-sm py-2 px-2 text-[11px] transition-colors ${
                      environmentPreset === opt.id
                        ? 'bg-brand-volt text-black font-bold'
                        : 'bg-[#07080A] text-zinc-400 hover:text-white border border-border/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 360 Spin */}
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <span className="text-zinc-400 text-xs">360° Turntable Spin</span>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-bold border transition-colors ${
                  autoRotate
                    ? 'border-brand-volt bg-brand-volt text-black'
                    : 'border-border bg-[#07080A] text-zinc-400 hover:text-white'
                }`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>{autoRotate ? 'ACTIVE' : 'OFF'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PBR FABRIC SHADER */}
        {activeTab === 'material' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Cloth Roughness</span>
                <span className="text-brand-volt font-bold">{pbr.roughness}</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.02"
                value={pbr.roughness}
                onChange={(e) => updatePBR({ roughness: parseFloat(e.target.value) })}
                className="w-full accent-brand-volt"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Fabric Weave Normal Bump</span>
                <span className="text-brand-volt font-bold">{pbr.normalScale}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={pbr.normalScale}
                onChange={(e) => updatePBR({ normalScale: parseFloat(e.target.value) })}
                className="w-full accent-brand-volt"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-zinc-400 text-xs">Wireframe Mesh</span>
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`rounded-sm px-3 py-1 text-xs font-bold border transition-colors ${
                  wireframe
                    ? 'border-brand-volt bg-brand-volt text-black'
                    : 'border-border bg-[#07080A] text-zinc-400 hover:text-white'
                }`}
              >
                {wireframe ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Capture Snapshot Action */}
      <div className="border-t border-border p-4 bg-[#090A0C]">
        <button
          onClick={onCapture}
          className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-3 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
        >
          <Download className="h-4 w-4" />
          <span>CAPTURE 4K MOCKUP</span>
        </button>
      </div>
    </div>
  );
}
