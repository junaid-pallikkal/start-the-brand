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
  Check,
} from 'lucide-react';
import { useMockupStore } from '@/stores/mockup-store';
import { useStudioStore } from '@/stores/studio-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { APPAREL_COLOR_PRESETS } from '@/constants/color-presets';
import { CameraPreset, EnvironmentPreset } from '@/types/mockup';
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
    pbr,
    autoRotate,
    wireframe,
    setGarmentId,
    setGarmentColor,
    setCameraPreset,
    setEnvironmentPreset,
    updatePBR,
    setAutoRotate,
    setWireframe,
  } = useMockupStore();

  const { project } = useStudioStore();

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

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-[#0C0D10] font-mono text-xs z-20 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-[#090A0C]">
        <div className="flex items-center gap-2">
          <Shirt className="h-4 w-4 text-brand-volt" />
          <span className="font-bold text-white uppercase text-xs">3D CONTROLS</span>
        </div>
        <span className="rounded bg-brand-volt/10 text-brand-volt px-2 py-0.5 text-[9px] font-bold">
          R3F PBR
        </span>
      </div>

      <div className="p-4 space-y-6">
        {/* Silhouette Blank Selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
            Garment Silhouette
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
        <div>
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
            <span>Fabric Color</span>
            <span className="text-white font-bold">{garmentColor}</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {APPAREL_COLOR_PRESETS.map((color) => {
              const isSelected = garmentColor === color.hex;
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

        {/* Camera Angles */}
        <div className="border-t border-border pt-4">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2 flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-brand-volt" />
            <span>Cinematic Camera Angle</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {cameraOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setCameraPreset(opt.id)}
                className={`rounded-sm py-1.5 px-2 text-[11px] transition-colors ${
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

        {/* Studio Lighting & Environments */}
        <div className="border-t border-border pt-4">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2 flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-brand-volt" />
            <span>Lighting Preset</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {envOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setEnvironmentPreset(opt.id)}
                className={`rounded-sm py-1.5 px-2 text-[11px] transition-colors ${
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

        {/* PBR Fabric Shaders */}
        <div className="border-t border-border pt-4 space-y-3">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-brand-volt" />
            <span>Fabric PBR Properties</span>
          </label>

          <div>
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
              <span>Cloth Roughness</span>
              <span>{pbr.roughness}</span>
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
              <span>Fabric Weave Bump</span>
              <span>{pbr.normalScale}</span>
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

          {/* Toggles */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-bold border transition-colors ${
                autoRotate
                  ? 'border-brand-volt bg-brand-volt/10 text-brand-volt'
                  : 'border-border bg-[#07080A] text-zinc-400 hover:text-white'
              }`}
            >
              <RotateCw className="h-3 w-3" />
              <span>360° SPIN</span>
            </button>

            <button
              onClick={() => setWireframe(!wireframe)}
              className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-bold border transition-colors ${
                wireframe
                  ? 'border-brand-volt bg-brand-volt/10 text-brand-volt'
                  : 'border-border bg-[#07080A] text-zinc-400 hover:text-white'
              }`}
            >
              <span>WIREFRAME</span>
            </button>
          </div>
        </div>

        {/* Snapshot Export Button */}
        <div className="border-t border-border pt-4">
          <button
            onClick={onCapture}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-3 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
          >
            <Download className="h-4 w-4" />
            <span>CAPTURE 4K MOCKUP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
