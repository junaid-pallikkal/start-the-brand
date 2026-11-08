'use client';

import { useState } from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { SurfaceType } from '@/types/garment';
import { TextLayer, ImageLayer } from '@/types/studio';
import { STREETWEAR_FONTS } from '@/constants/typography-presets';
import { APPAREL_COLOR_PRESETS } from '@/constants/color-presets';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Layers,
  RotateCw,
  Sliders,
  Crosshair,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  Shirt,
  Box,
  Palette,
  X,
  Type,
  Upload,
  Plus,
} from 'lucide-react';

export function PropertyInspector() {
  const {
    project,
    activeSurface,
    selectedLayerId,
    viewMode,
    updateLayer,
    nudgeLayer,
    scaleLayer,
    rotateLayer,
    centerLayer,
    alignLayer,
    duplicateLayer,
    deleteLayer,
    toggleLayerLock,
    bringToFront,
    sendToBack,
    setSelectedLayerId,
    setGarmentId,
    setGarmentColor,
    setActiveSurface,
    setViewMode,
    addTextLayer,
  } = useStudioStore();

  const [nudgeStep, setNudgeStep] = useState<1 | 5>(5);

  const surfaceLayers = project.layers[activeSurface] || [];
  const selectedLayer = surfaceLayers.find((l) => l.id === selectedLayerId);
  const currentGarment =
    DEFAULT_GARMENTS.find((g) => g.id === project.garmentId) || DEFAULT_GARMENTS[0];

  // --------------------------------------------------------------------------
  // 1. GLOBAL GARMENT & CANVAS INSPECTOR (When NO layer is selected)
  // --------------------------------------------------------------------------
  if (!selectedLayer) {
    return (
      <div className="flex h-full w-80 flex-col border-l border-border bg-[#0C0D10] font-mono text-xs z-20 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-[#090A0C]">
          <div className="flex items-center gap-2">
            <Shirt className="h-4 w-4 text-brand-volt" />
            <span className="font-bold text-white uppercase text-xs tracking-wider">
              GARMENT INSPECTOR
            </span>
          </div>
          <span className="rounded bg-brand-volt/10 border border-brand-volt/30 px-2 py-0.5 text-[9px] font-bold text-brand-volt">
            {activeSurface}
          </span>
        </div>

        <div className="p-4 space-y-5">
          {/* Active Garment Silhouette Switcher */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center justify-between">
              <span>Apparel Silhouette</span>
              <span className="text-zinc-500">${currentGarment.baseCostUSD.toFixed(2)} USD</span>
            </label>
            <select
              value={project.garmentId}
              onChange={(e) => setGarmentId(e.target.value)}
              className="w-full rounded-sm border border-border bg-[#07080A] py-2 px-2.5 text-xs text-white focus:border-brand-volt focus:outline-none"
            >
              {DEFAULT_GARMENTS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (${g.baseCostUSD.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Garment Fabric Color */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-2 flex items-center justify-between">
              <span>Fabric Blank Color</span>
              <span className="text-brand-volt uppercase font-bold">
                {project.garmentColor || '#0B0B0D'}
              </span>
            </label>
            <div className="grid grid-cols-6 gap-2 mb-2">
              {APPAREL_COLOR_PRESETS.map((color) => {
                const isSelected = project.garmentColor === color.hex;
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
            {/* Custom Hex Color Picker */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={project.garmentColor || '#0B0B0D'}
                onChange={(e) => setGarmentColor(e.target.value)}
                className="h-7 w-9 cursor-pointer rounded-sm border border-border bg-transparent p-0.5"
              />
              <input
                type="text"
                value={project.garmentColor || '#0B0B0D'}
                onChange={(e) => setGarmentColor(e.target.value)}
                className="flex-1 rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white uppercase"
              />
            </div>
          </div>

          {/* Surface Views */}
          <div className="border-t border-border pt-4">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-2">
              Active Garment Surface
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'FRONT', label: 'Front Chest' },
                  { id: 'BACK', label: 'Full Back' },
                  { id: 'LEFT_SLEEVE', label: 'Left Sleeve' },
                  { id: 'RIGHT_SLEEVE', label: 'Right Sleeve' },
                ] as { id: SurfaceType; label: string }[]
              ).map((s) => {
                const isActive = activeSurface === s.id;
                const count = project.layers[s.id]?.length || 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSurface(s.id)}
                    className={`flex items-center justify-between rounded-sm border p-2 text-left transition-colors ${
                      isActive
                        ? 'border-brand-volt bg-surface text-white font-bold'
                        : 'border-border/60 bg-[#07080A] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="rounded bg-black/40 px-1.5 py-0.2 text-[9px] text-zinc-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Creation Actions */}
          <div className="border-t border-border pt-4 space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-2">
              Add Design to {activeSurface}
            </label>
            <button
              onClick={() => addTextLayer()}
              className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2 font-bold text-black hover:bg-brand-volt/90 transition-all"
            >
              <Type className="h-4 w-4" />
              <span>ADD TEXT GRAPHIC</span>
            </button>

            {viewMode !== '3D' && (
              <button
                onClick={() => setViewMode('3D')}
                className="w-full flex items-center justify-center gap-2 rounded-sm border border-brand-volt/50 bg-brand-volt/10 py-2 font-bold text-brand-volt hover:bg-brand-volt hover:text-black transition-all"
              >
                <Box className="h-4 w-4" />
                <span>SWITCH TO 3D VIEWPORT</span>
              </button>
            )}
          </div>

          {/* Surface Layers on this Garment View */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-400 mb-2">
              <span>Layers on {activeSurface}</span>
              <span className="text-zinc-500">{surfaceLayers.length} total</span>
            </div>
            {surfaceLayers.length === 0 ? (
              <p className="text-[11px] text-zinc-500 font-sans italic">
                No artwork placed on this surface yet. Click above or use the left toolbar.
              </p>
            ) : (
              <div className="space-y-1">
                {[...surfaceLayers]
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className="w-full text-left rounded-sm border border-border/60 bg-[#07080A] p-2 hover:border-brand-volt hover:bg-surface flex items-center justify-between text-zinc-300 hover:text-white transition-all"
                    >
                      <span className="truncate font-semibold">{layer.name}</span>
                      <span className="text-[9px] uppercase text-zinc-500">{layer.type}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. LAYER PROPERTY INSPECTOR (When a layer IS selected)
  // --------------------------------------------------------------------------
  const isText = selectedLayer.type === 'TEXT';
  const textLayer = isText ? (selectedLayer as TextLayer) : null;
  const imageLayer = !isText ? (selectedLayer as ImageLayer) : null;

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-[#0C0D10] font-mono text-xs z-20 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-[#090A0C]">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-brand-volt" />
          <span className="font-bold text-white uppercase text-xs tracking-wider">
            LAYER INSPECTOR
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-brand-volt/10 border border-brand-volt/30 px-2 py-0.5 text-[9px] font-bold text-brand-volt">
            {selectedLayer.type}
          </span>
          <button
            onClick={() => setSelectedLayerId(null)}
            className="rounded p-1 text-zinc-500 hover:bg-surface hover:text-white"
            title="Deselect Layer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Layer Name & Lock Status */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400">
              Layer Name
            </label>
            <button
              onClick={() => toggleLayerLock(selectedLayer.id)}
              className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                selectedLayer.isLocked
                  ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                  : 'border-border text-zinc-400 hover:text-white'
              }`}
            >
              {selectedLayer.isLocked ? (
                <>
                  <Lock className="h-2.5 w-2.5" />
                  <span>Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="h-2.5 w-2.5" />
                  <span>Unlocked</span>
                </>
              )}
            </button>
          </div>
          <input
            type="text"
            value={selectedLayer.name}
            onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
            className="w-full rounded-sm border border-border bg-[#07080A] py-1.5 px-2.5 text-xs text-white focus:border-brand-volt focus:outline-none"
          />
        </div>

        {/* Tactile D-Pad & Movement System */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400">
              Layer Movement
            </label>
            {/* Step size toggle */}
            <div className="flex items-center gap-1 text-[9px] text-zinc-400">
              <span>Step:</span>
              <button
                onClick={() => setNudgeStep(1)}
                className={`px-1.5 py-0.5 rounded ${
                  nudgeStep === 1 ? 'bg-brand-volt text-black font-bold' : 'bg-surface text-zinc-400'
                }`}
              >
                1%
              </button>
              <button
                onClick={() => setNudgeStep(5)}
                className={`px-1.5 py-0.5 rounded ${
                  nudgeStep === 5 ? 'bg-brand-volt text-black font-bold' : 'bg-surface text-zinc-400'
                }`}
              >
                5%
              </button>
            </div>
          </div>

          {/* D-Pad Controller */}
          <div className="flex flex-col items-center justify-center p-2 rounded-sm bg-[#07080A] border border-border">
            <button
              onClick={() => nudgeLayer(selectedLayer.id, 0, -nudgeStep)}
              className="p-1.5 rounded-sm bg-surface border border-border hover:border-brand-volt hover:text-brand-volt text-zinc-300 transition-colors"
              title={`Move Up (${nudgeStep}%)`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 my-1">
              <button
                onClick={() => nudgeLayer(selectedLayer.id, -nudgeStep, 0)}
                className="p-1.5 rounded-sm bg-surface border border-border hover:border-brand-volt hover:text-brand-volt text-zinc-300 transition-colors"
                title={`Move Left (${nudgeStep}%)`}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => centerLayer(selectedLayer.id, 'both')}
                className="p-1.5 rounded-sm bg-brand-volt/10 border border-brand-volt/50 text-brand-volt hover:bg-brand-volt hover:text-black transition-colors"
                title="Center on Chest / Surface"
              >
                <Crosshair className="h-4 w-4" />
              </button>
              <button
                onClick={() => nudgeLayer(selectedLayer.id, nudgeStep, 0)}
                className="p-1.5 rounded-sm bg-surface border border-border hover:border-brand-volt hover:text-brand-volt text-zinc-300 transition-colors"
                title={`Move Right (${nudgeStep}%)`}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => nudgeLayer(selectedLayer.id, 0, nudgeStep)}
              className="p-1.5 rounded-sm bg-surface border border-border hover:border-brand-volt hover:text-brand-volt text-zinc-300 transition-colors"
              title={`Move Down (${nudgeStep}%)`}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>

          {/* Position X / Y Coordinate Readouts */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Position X ({selectedLayer.x}%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                value={selectedLayer.x}
                onChange={(e) =>
                  updateLayer(selectedLayer.id, {
                    x: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                  })
                }
                className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white"
              />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Position Y ({selectedLayer.y}%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                value={selectedLayer.y}
                onChange={(e) =>
                  updateLayer(selectedLayer.id, {
                    y: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                  })
                }
                className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Quick Alignment 6-pack */}
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            <button
              onClick={() => alignLayer(selectedLayer.id, 'left')}
              className="rounded-sm border border-border bg-[#07080A] py-1 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Align Left
            </button>
            <button
              onClick={() => centerLayer(selectedLayer.id, 'h')}
              className="rounded-sm border border-brand-volt/40 bg-brand-volt/5 py-1 text-[10px] font-bold text-brand-volt hover:bg-brand-volt hover:text-black"
            >
              Center H
            </button>
            <button
              onClick={() => alignLayer(selectedLayer.id, 'right')}
              className="rounded-sm border border-border bg-[#07080A] py-1 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Align Right
            </button>
            <button
              onClick={() => alignLayer(selectedLayer.id, 'top')}
              className="rounded-sm border border-border bg-[#07080A] py-1 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Align Top
            </button>
            <button
              onClick={() => centerLayer(selectedLayer.id, 'v')}
              className="rounded-sm border border-brand-volt/40 bg-brand-volt/5 py-1 text-[10px] font-bold text-brand-volt hover:bg-brand-volt hover:text-black"
            >
              Center V
            </button>
            <button
              onClick={() => alignLayer(selectedLayer.id, 'bottom')}
              className="rounded-sm border border-border bg-[#07080A] py-1 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Align Bottom
            </button>
          </div>
        </div>

        {/* Dimensions & Scale */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400">
              Dimensions & Scale
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => scaleLayer(selectedLayer.id, -5)}
                className="flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] hover:border-brand-volt text-zinc-300 hover:text-white"
                title="Scale -5%"
              >
                <Minimize2 className="h-2.5 w-2.5" />
                <span>-5%</span>
              </button>
              <button
                onClick={() => scaleLayer(selectedLayer.id, 5)}
                className="flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] hover:border-brand-volt text-zinc-300 hover:text-white"
                title="Scale +5%"
              >
                <Maximize2 className="h-2.5 w-2.5" />
                <span>+5%</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Width ({selectedLayer.width}%)
              </span>
              <input
                type="number"
                min="5"
                max="95"
                value={selectedLayer.width}
                onChange={(e) =>
                  updateLayer(selectedLayer.id, {
                    width: Math.min(95, Math.max(5, parseInt(e.target.value) || 5)),
                  })
                }
                className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white"
              />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Height ({selectedLayer.height}%)
              </span>
              <input
                type="number"
                min="5"
                max="95"
                value={selectedLayer.height}
                onChange={(e) =>
                  updateLayer(selectedLayer.id, {
                    height: Math.min(95, Math.max(5, parseInt(e.target.value) || 5)),
                  })
                }
                className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Rotation & Opacity */}
        <div className="border-t border-border pt-4 space-y-3">
          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              <span>Rotation</span>
              <span className="text-brand-volt font-bold">{selectedLayer.rotation}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={selectedLayer.rotation}
              onChange={(e) =>
                updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-brand-volt"
            />
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  onClick={() => updateLayer(selectedLayer.id, { rotation: deg })}
                  className={`rounded border py-0.5 text-[9px] ${
                    selectedLayer.rotation === deg
                      ? 'border-brand-volt bg-brand-volt/10 text-brand-volt font-bold'
                      : 'border-border bg-[#07080A] text-zinc-400 hover:text-white'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              <span>Opacity</span>
              <span className="text-brand-volt font-bold">
                {Math.round(selectedLayer.opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={selectedLayer.opacity}
              onChange={(e) =>
                updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) || 1 })
              }
              className="w-full accent-brand-volt"
            />
          </div>
        </div>

        {/* Text Specific Properties */}
        {isText && textLayer && (
          <div className="border-t border-border pt-4 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block">
              Typography Settings
            </label>

            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Text Content
              </span>
              <textarea
                rows={2}
                value={textLayer.text}
                onChange={(e) => updateLayer(textLayer.id, { text: e.target.value })}
                className="w-full rounded-sm border border-border bg-[#07080A] p-2 text-xs text-white focus:border-brand-volt focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Font Family
              </span>
              <select
                value={textLayer.fontFamily}
                onChange={(e) => updateLayer(textLayer.id, { fontFamily: e.target.value })}
                className="w-full rounded-sm border border-border bg-[#07080A] py-1.5 px-2 text-xs text-white focus:border-brand-volt focus:outline-none"
              >
                {STREETWEAR_FONTS.map((font) => (
                  <option key={font.id} value={font.fontFamily}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                  Font Size ({textLayer.fontSize}px)
                </span>
                <input
                  type="range"
                  min="12"
                  max="96"
                  value={textLayer.fontSize}
                  onChange={(e) =>
                    updateLayer(textLayer.id, { fontSize: parseInt(e.target.value) || 24 })
                  }
                  className="w-full accent-brand-volt"
                />
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                  Letter Spacing
                </span>
                <input
                  type="number"
                  min="-4"
                  max="20"
                  value={textLayer.letterSpacing}
                  onChange={(e) =>
                    updateLayer(textLayer.id, {
                      letterSpacing: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Fill Color ({textLayer.fillColor})
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textLayer.fillColor}
                  onChange={(e) => updateLayer(textLayer.id, { fillColor: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded-sm border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={textLayer.fillColor}
                  onChange={(e) => updateLayer(textLayer.id, { fillColor: e.target.value })}
                  className="flex-1 rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white uppercase"
                />
              </div>
            </div>

            {/* Text Align */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-1">
                Text Align
              </span>
              <div className="grid grid-cols-3 gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateLayer(textLayer.id, { textAlign: align })}
                    className={`rounded border py-1 flex items-center justify-center ${
                      textLayer.textAlign === align
                        ? 'border-brand-volt bg-brand-volt/10 text-brand-volt'
                        : 'border-border bg-[#07080A] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="h-3.5 w-3.5" />}
                    {align === 'center' && <AlignCenter className="h-3.5 w-3.5" />}
                    {align === 'right' && <AlignRight className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Artwork / Image Specific Properties */}
        {imageLayer && (
          <div className="border-t border-border pt-4 space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
              Artwork Properties
            </label>
            <div className="flex items-center gap-3 rounded-sm border border-border bg-[#07080A] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageLayer.src}
                alt={imageLayer.name}
                className="h-10 w-10 object-contain rounded border border-border/60 bg-black"
              />
              <div className="text-[10px] text-zinc-400 truncate">
                <div className="font-bold text-white truncate">{imageLayer.name}</div>
                <div>
                  {imageLayer.originalWidth} × {imageLayer.originalHeight} px
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layer Organization & Order Actions */}
        <div className="border-t border-border pt-4 space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
            Layer Organization
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => bringToFront(selectedLayer.id)}
              className="flex items-center justify-center gap-1.5 rounded-sm border border-border bg-[#07080A] py-1.5 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              <ArrowUp className="h-3 w-3" />
              <span>To Front</span>
            </button>
            <button
              onClick={() => sendToBack(selectedLayer.id)}
              className="flex items-center justify-center gap-1.5 rounded-sm border border-border bg-[#07080A] py-1.5 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              <ArrowDown className="h-3 w-3" />
              <span>To Back</span>
            </button>
          </div>

          <button
            onClick={() => duplicateLayer(selectedLayer.id)}
            className="w-full flex items-center justify-center gap-1.5 rounded-sm border border-border bg-[#07080A] py-1.5 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
          >
            <Copy className="h-3 w-3" />
            <span>Duplicate Layer</span>
          </button>

          <button
            onClick={() => deleteLayer(selectedLayer.id)}
            className="w-full flex items-center justify-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 py-1.5 text-[10px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete Layer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
