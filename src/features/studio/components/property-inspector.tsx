'use client';

import { useStudioStore } from '@/stores/studio-store';
import { TextLayer, ImageLayer } from '@/types/studio';
import { STREETWEAR_FONTS } from '@/constants/typography-presets';
import { APPAREL_COLOR_PRESETS } from '@/constants/color-presets';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  RotateCw,
  Sliders,
} from 'lucide-react';

export function PropertyInspector() {
  const {
    project,
    activeSurface,
    selectedLayerId,
    updateLayer,
    duplicateLayer,
    deleteLayer,
    bringToFront,
    sendToBack,
  } = useStudioStore();

  const surfaceLayers = project.layers[activeSurface] || [];
  const selectedLayer = surfaceLayers.find((l) => l.id === selectedLayerId);

  if (!selectedLayer) {
    return (
      <div className="flex h-full w-72 flex-col items-center justify-center border-l border-border bg-[#0C0D10] p-6 text-center font-mono text-xs z-20">
        <Layers className="h-8 w-8 text-zinc-600 mb-2" />
        <div className="text-zinc-400 font-bold uppercase">No Selection</div>
        <p className="text-[10px] text-zinc-500 font-sans mt-1">
          Select an artwork or text layer on the canvas to configure properties.
        </p>
      </div>
    );
  }

  const isText = selectedLayer.type === 'TEXT';
  const textLayer = isText ? (selectedLayer as TextLayer) : null;
  const imageLayer = !isText ? (selectedLayer as ImageLayer) : null;

  return (
    <div className="flex h-full w-72 flex-col border-l border-border bg-[#0C0D10] font-mono text-xs z-20 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-[#090A0C]">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-brand-volt" />
          <span className="font-bold text-white uppercase text-xs">INSPECTOR</span>
        </div>
        <span className="rounded bg-surface px-2 py-0.5 text-[9px] text-zinc-400 border border-border">
          {selectedLayer.type}
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* Layer Name */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
            Layer Name
          </label>
          <input
            type="text"
            value={selectedLayer.name}
            onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
            className="w-full rounded-sm border border-border bg-[#07080A] py-1.5 px-2.5 text-xs text-white focus:border-brand-volt focus:outline-none"
          />
        </div>

        {/* Text Specific Properties */}
        {isText && textLayer && (
          <>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                Text Content
              </label>
              <textarea
                rows={2}
                value={textLayer.text}
                onChange={(e) => updateLayer(textLayer.id, { text: e.target.value })}
                className="w-full rounded-sm border border-border bg-[#07080A] p-2 text-xs text-white focus:border-brand-volt focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                Font Family
              </label>
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

            {/* Font Size & Alignment */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                  Font Size ({textLayer.fontSize}px)
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={textLayer.fontSize}
                  onChange={(e) =>
                    updateLayer(textLayer.id, { fontSize: parseInt(e.target.value) })
                  }
                  className="w-full accent-brand-volt"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                  Letter Spacing
                </label>
                <input
                  type="number"
                  min="-2"
                  max="12"
                  value={textLayer.letterSpacing}
                  onChange={(e) =>
                    updateLayer(textLayer.id, {
                      letterSpacing: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white focus:border-brand-volt focus:outline-none"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                Fill Color ({textLayer.fillColor})
              </label>
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
          </>
        )}

        {/* Position & Dimensions */}
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
              Position X ({selectedLayer.x}%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={selectedLayer.x}
              onChange={(e) =>
                updateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
              Position Y ({selectedLayer.y}%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={selectedLayer.y}
              onChange={(e) =>
                updateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-sm border border-border bg-[#07080A] py-1 px-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Rotation & Opacity */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
              <span>Rotation</span>
              <span>{selectedLayer.rotation}°</span>
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
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
              <span>Opacity</span>
              <span>{Math.round(selectedLayer.opacity * 100)}%</span>
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

        {/* Quick Align Buttons */}
        <div className="border-t border-border pt-4">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
            Quick Alignment
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateLayer(selectedLayer.id, { x: 50 })}
              className="rounded-sm border border-border bg-[#07080A] py-1 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Center H
            </button>
            <button
              onClick={() => updateLayer(selectedLayer.id, { y: 50 })}
              className="rounded-sm border border-border bg-[#07080A] py-1 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Center V
            </button>
          </div>
        </div>

        {/* Layer Organization & Actions */}
        <div className="border-t border-border pt-4 space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
            Layer Actions
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => bringToFront(selectedLayer.id)}
              className="flex items-center justify-center gap-1.5 rounded-sm border border-border bg-[#07080A] py-1.5 text-[10px] text-zinc-300 hover:text-white"
            >
              <ArrowUp className="h-3 w-3" />
              <span>To Front</span>
            </button>
            <button
              onClick={() => sendToBack(selectedLayer.id)}
              className="flex items-center justify-center gap-1.5 rounded-sm border border-border bg-[#07080A] py-1.5 text-[10px] text-zinc-300 hover:text-white"
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
