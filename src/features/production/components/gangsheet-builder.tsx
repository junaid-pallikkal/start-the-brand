'use client';

import { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  RotateCw,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Upload,
} from 'lucide-react';
import { useGangSheetStore } from '@/stores/gangsheet-store';
import { toast } from 'sonner';

export function GangsheetBuilder() {
  const {
    roll,
    items,
    result,
    selectedItemId,
    setRollDimensions,
    addItem,
    removeItem,
    updateItemQuantity,
    updateItemDimensions,
    toggleAllowRotation,
    setSelectedItemId,
    runAutoNest,
    saveGangSheet,
  } = useGangSheetStore();

  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Estimate initial size in inches assuming standard 300 DPI
        const widthInches = Math.max(3, Math.min(14, Math.round(img.width / 150)));
        const heightInches = Math.max(3, Math.min(18, Math.round(img.height / 150)));

        addItem({
          designName: file.name.replace(/\.[^/.]+$/, ''),
          imageUrl: src,
          widthInches,
          heightInches,
          quantity: 2,
          allowRotation: true,
        });
        toast.success(`Added ${file.name} to Gang Sheet`);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExportLayout = async () => {
    await saveGangSheet();

    // Render print canvas
    const canvas = document.createElement('canvas');
    const dpi = 150; // High resolution preview
    canvas.width = roll.widthInches * dpi;
    canvas.height = result.totalUsedLengthInches * dpi;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw transparent film background
    ctx.fillStyle = '#08090C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border cut lines
    ctx.strokeStyle = '#E2F952';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw placements
    for (const p of result.placements) {
      const x = p.xInches * dpi;
      const y = p.yInches * dpi;
      const w = p.widthInches * dpi;
      const h = p.heightInches * dpi;

      ctx.fillStyle = '#181A1F';
      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = '#343842';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);

      // Label
      ctx.fillStyle = '#E2F952';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`${p.designName} (${p.widthInches}"×${p.heightInches}")`, x + 10, y + 25);
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `dtf-gangsheet-${roll.widthInches}x${result.totalUsedLengthInches}in.png`;
    link.href = dataUrl;
    link.click();

    toast.success('Print-ready DTF Gang Sheet exported');
  };

  return (
    <div className="flex h-full w-full font-mono text-xs overflow-hidden">
      {/* Left: Configuration & Item Deck */}
      <div className="flex h-full w-84 flex-col border-r border-border bg-[#0C0D10] z-20 overflow-y-auto">
        <div className="border-b border-border p-4 bg-[#090A0C]">
          <div className="text-[10px] uppercase tracking-wider text-brand-volt font-bold">
            COMMERCIAL DTF PACKING
          </div>
          <h2 className="text-sm font-black text-white uppercase mt-0.5">
            Roll Specifications
          </h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Roll Dimensions */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1.5">
                Film Roll Width (Inches)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[22, 24].map((w) => (
                  <button
                    key={w}
                    onClick={() => setRollDimensions(w as 22 | 24, roll.lengthInches)}
                    className={`rounded-sm py-2 font-bold text-xs transition-colors ${
                      roll.widthInches === w
                        ? 'bg-brand-volt text-black'
                        : 'bg-[#07080A] text-zinc-400 hover:text-white border border-border'
                    }`}
                  >
                    {w}" Standard Roll
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                <span>Roll Length</span>
                <span className="text-white font-bold">{roll.lengthInches}"</span>
              </div>
              <input
                type="range"
                min="18"
                max="120"
                step="6"
                value={roll.lengthInches}
                onChange={(e) =>
                  setRollDimensions(roll.widthInches, parseInt(e.target.value))
                }
                className="w-full accent-brand-volt"
              />
            </div>
          </div>

          {/* Efficiency Metric Card */}
          <div className="rounded-sm border border-border/80 bg-[#07080A] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                Material Utilization
              </span>
              <span className="text-base font-black text-brand-volt">
                {result.materialEfficiencyPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border/60">
              <div
                className="h-full bg-brand-volt transition-all duration-300"
                style={{ width: `${Math.min(100, result.materialEfficiencyPercent)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-zinc-400">
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">Used Film</span>
                <span className="text-white font-bold">{result.totalUsedLengthInches}"</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">Placed Items</span>
                <span className="text-white font-bold">{result.placements.length} Total</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={runAutoNest}
              className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2.5 font-bold text-black hover:bg-brand-volt/90 transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4 stroke-[2.5]" />
              <span>MAXRECTS AUTO-NEST</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-sm border border-border bg-surface py-2 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <Upload className="h-4 w-4 text-brand-volt" />
              <span>UPLOAD NEW DESIGN</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleUploadItem}
                className="hidden"
              />
            </button>
          </div>

          {/* Item Deck */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              <span>Items to Pack ({items.length})</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`rounded-sm border p-3 transition-colors ${
                    selectedItemId === item.id
                      ? 'border-brand-volt bg-surface'
                      : 'border-border/60 bg-[#07080A] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs truncate max-w-[170px]">
                      {item.designName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="text-zinc-500 hover:text-red-400 p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Dimensions & Quantity */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-2.5">
                    <div>
                      <span className="text-zinc-500 text-[9px] block uppercase">Width (in)</span>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        step="0.5"
                        value={item.widthInches}
                        onChange={(e) =>
                          updateItemDimensions(
                            item.id,
                            parseFloat(e.target.value) || 1,
                            item.heightInches
                          )
                        }
                        className="w-full rounded border border-border bg-black py-0.5 px-1.5 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[9px] block uppercase">Height (in)</span>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        step="0.5"
                        value={item.heightInches}
                        onChange={(e) =>
                          updateItemDimensions(
                            item.id,
                            item.widthInches,
                            parseFloat(e.target.value) || 1
                          )
                        }
                        className="w-full rounded border border-border bg-black py-0.5 px-1.5 text-white"
                      />
                    </div>
                  </div>

                  {/* Quantity Stepper & Rotation Toggle */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-[10px]">QTY:</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, -1)}
                        className="h-5 w-5 rounded bg-surface border border-border flex items-center justify-center text-zinc-300 hover:text-white"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="h-5 w-5 rounded bg-surface border border-border flex items-center justify-center text-zinc-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => toggleAllowRotation(item.id)}
                      className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
                        item.allowRotation
                          ? 'text-brand-volt bg-brand-volt/10'
                          : 'text-zinc-500 bg-surface'
                      }`}
                      title="Allow 90° rotation during bin packing"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>ROTATE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Roll Preview & Packing Stage */}
      <div className="relative flex-1 h-full bg-[#07080A] p-6 overflow-auto flex flex-col justify-between">
        {/* Stage Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase text-sm">
              DTF Roll Visualizer ({roll.widthInches}" × {result.totalUsedLengthInches}")
            </span>
            {result.hasCollisions ? (
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <AlertTriangle className="h-3.5 w-3.5" />
                OVERFLOW DETECTED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                OPTIMAL PACKING
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#0C0D10] border border-border rounded p-1">
              <button
                onClick={() => setZoom(Math.max(0.4, zoom - 0.15))}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] w-10 text-center font-bold text-zinc-300">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(1.8, zoom + 0.15))}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={handleExportLayout}
              className="flex items-center gap-1.5 rounded-sm bg-brand-volt px-4 py-2 font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
            >
              <Download className="h-4 w-4" />
              <span>EXPORT PRINT LAYOUT</span>
            </button>
          </div>
        </div>

        {/* Scaled Roll Stage */}
        <div className="flex-1 flex items-start justify-center overflow-auto p-4">
          <div
            style={{
              width: `${roll.widthInches * 24 * zoom}px`,
              height: `${result.totalUsedLengthInches * 24 * zoom}px`,
              transformOrigin: 'top center',
            }}
            className="relative border-2 border-brand-volt/60 bg-[#0A0B0E] rounded-none shadow-2xl transition-all"
          >
            {/* Grid Pattern with 1-inch lines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
              }}
            />

            {/* Placed Items */}
            {result.placements.map((p, idx) => (
              <div
                key={`${p.itemId}-${idx}`}
                style={{
                  left: `${p.xInches * 24 * zoom}px`,
                  top: `${p.yInches * 24 * zoom}px`,
                  width: `${p.widthInches * 24 * zoom}px`,
                  height: `${p.heightInches * 24 * zoom}px`,
                }}
                className="absolute border border-brand-volt/80 bg-[#121318]/90 rounded-none overflow-hidden flex flex-col justify-between p-2 group hover:border-white hover:bg-surface transition-all shadow-sm"
              >
                <div className="flex justify-between items-start text-[9px] text-zinc-300">
                  <span className="font-bold text-brand-volt truncate max-w-[80%]">
                    {p.designName}
                  </span>
                  {p.isRotated && (
                    <span className="rounded bg-brand-volt/20 text-brand-volt px-1 text-[8px] font-bold">
                      90°
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt="" className="max-h-12 max-w-full object-contain" />
                </div>

                <div className="text-[8px] text-zinc-500 font-mono text-right">
                  {p.widthInches}" × {p.heightInches}"
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex justify-between text-[11px] text-zinc-500">
          <span>MaxRects 2D Rectangle Bin Packing Engine</span>
          <span>Margins: 0.25" • Inter-Item Spacing: 0.25"</span>
        </div>
      </div>
    </div>
  );
}
