'use client';

import { useState, useRef, useEffect } from 'react';
import { Pipette, Download, Upload, Sliders } from 'lucide-react';
import { KnockoutParams } from '@/types/production';
import { applyKnockoutFilter } from '../algorithms/knockout-filter';
import { downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%230B0B0D"/><circle cx="200" cy="200" r="140" fill="%23E2F952"/><text x="200" y="210" font-family="monospace" font-size="28" font-weight="black" fill="%230B0B0D" text-anchor="middle">KNOCKOUT</text></svg>';

export function KnockoutTool() {
  const [params, setParams] = useState<KnockoutParams>({
    targetHex: '#0B0B0D',
    tolerance: 45,
    feather: 4,
  });

  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_IMAGE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    renderKnockout();
  }, [params, imageSrc]);

  const renderKnockout = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 480;
      canvas.height = 480;
      ctx.clearRect(0, 0, 480, 480);
      ctx.drawImage(img, 0, 0, 480, 480);
      const imgData = ctx.getImageData(0, 0, 480, 480);
      applyKnockoutFilter(imgData, params);
      ctx.putImageData(imgData, 0, 0);
    };
    img.src = imageSrc;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      toast.success('Loaded artwork for knockout color removal');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const filename = `knockout-transparent-${params.targetHex.replace('#', '')}.png`;
    downloadFile(dataUrl, filename);
    toast.success('Transparent Knockout PNG downloaded');
  };

  return (
    <div className="flex h-full w-full font-mono text-xs overflow-hidden">
      {/* Controls Sidebar */}
      <div className="w-80 flex flex-col border-r border-border bg-[#0C0D10] p-5 space-y-6 overflow-y-auto">
        <div className="border-b border-border pb-4">
          <div className="text-[10px] uppercase tracking-wider text-brand-volt font-bold">
            INK OPTIMIZATION
          </div>
          <h2 className="text-sm font-black text-white uppercase mt-0.5">
            Knockout Color
          </h2>
          <p className="text-[11px] text-zinc-400 font-sans mt-1">
            Remove shirt background color from graphics to save ink and preserve a soft garment drape.
          </p>
        </div>

        {/* Upload Action */}
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-sm border border-border bg-surface py-2 text-zinc-300 hover:text-white hover:border-zinc-500"
          >
            <Upload className="h-4 w-4 text-brand-volt" />
            <span>UPLOAD ARTWORK</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>
        </div>

        {/* Target Color Picker */}
        <div>
          <label className="text-[10px] uppercase text-zinc-400 block mb-1.5">
            Target Color to Knock Out
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={params.targetHex}
              onChange={(e) => setParams({ ...params, targetHex: e.target.value })}
              className="h-8 w-10 cursor-pointer rounded-sm border border-border bg-transparent p-0.5"
            />
            <input
              type="text"
              value={params.targetHex}
              onChange={(e) => setParams({ ...params, targetHex: e.target.value })}
              className="flex-1 rounded-sm border border-border bg-[#07080A] py-1 px-2.5 text-xs text-white uppercase"
            />
          </div>
        </div>

        {/* Sliders: Tolerance & Feather */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] uppercase text-zinc-400 mb-1">
              <span>Color Tolerance (ΔE)</span>
              <span className="text-white font-bold">{params.tolerance}</span>
            </div>
            <input
              type="range"
              min="5"
              max="160"
              value={params.tolerance}
              onChange={(e) =>
                setParams({ ...params, tolerance: parseInt(e.target.value) })
              }
              className="w-full accent-brand-volt"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase text-zinc-400 mb-1">
              <span>Edge Feathering</span>
              <span className="text-white font-bold">{params.feather}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={params.feather}
              onChange={(e) =>
                setParams({ ...params, feather: parseInt(e.target.value) })
              }
              className="w-full accent-brand-volt"
            />
          </div>
        </div>

        {/* Download Action */}
        <div className="border-t border-border pt-4">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2.5 font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
          >
            <Download className="h-4 w-4" />
            <span>EXPORT TRANSPARENT PNG</span>
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#07080A] p-8">
        <div className="rounded-sm border border-border bg-[#0C0D10] p-6 shadow-2xl flex flex-col items-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
            Alpha Transparency Preview
          </div>
          <div
            className="rounded border border-zinc-700 overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(45deg, #181920 25%, transparent 25%), linear-gradient(-45deg, #181920 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #181920 75%), linear-gradient(-45deg, transparent 75%, #181920 75%)`,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            }}
          >
            <canvas ref={canvasRef} className="w-[360px] h-[360px] sm:w-[440px] sm:h-[440px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
