'use client';

import { useState, useRef, useEffect } from 'react';
import { Sliders, Download, Upload, RotateCcw, Check } from 'lucide-react';
import { HalftoneParams } from '@/types/production';
import { applyHalftoneFilter } from '../algorithms/halftone-filter';
import { downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><radialGradient id="grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23FFFFFF"/><stop offset="50%" stop-color="%23888888"/><stop offset="100%" stop-color="%23000000"/></radialGradient></defs><rect width="400" height="400" fill="%23000000"/><circle cx="200" cy="200" r="160" fill="url(%23grad)"/><text x="200" y="210" font-family="monospace" font-size="28" font-weight="black" fill="%23000000" text-anchor="middle">ATELIER</text></svg>';

export function HalftoneTool() {
  const [params, setParams] = useState<HalftoneParams>({
    dotSize: 8,
    angle: 45,
    contrast: 20,
    brightness: 0,
    shape: 'round',
    transparentThreshold: 20,
  });

  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_IMAGE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    renderHalftone();
  }, [params, imageSrc]);

  const renderHalftone = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 480;
      canvas.height = 480;
      ctx.drawImage(img, 0, 0, 480, 480);
      applyHalftoneFilter(ctx, 480, 480, params);
    };
    img.src = imageSrc;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      toast.success('Loaded artwork for halftone processing');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const filename = `halftone-print-${params.dotSize}px-${params.angle}deg.png`;
    downloadFile(dataUrl, filename);
    toast.success('Halftone transparent PNG downloaded');
  };

  return (
    <div className="flex h-full w-full font-mono text-xs overflow-hidden">
      {/* Controls Sidebar */}
      <div className="w-80 flex flex-col border-r border-border bg-[#0C0D10] p-5 space-y-6 overflow-y-auto">
        <div className="border-b border-border pb-4">
          <div className="text-[10px] uppercase tracking-wider text-brand-volt font-bold">
            SCREENPRINT UTILITY
          </div>
          <h2 className="text-sm font-black text-white uppercase mt-0.5">
            Halftone Generator
          </h2>
          <p className="text-[11px] text-zinc-400 font-sans mt-1">
            Convert photographic gradients into print-ready dot matrices with screen angles.
          </p>
        </div>

        {/* Upload Button */}
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

        {/* Parametric Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] uppercase text-zinc-400 mb-1">
              <span>Dot Frequency (Size)</span>
              <span className="text-white font-bold">{params.dotSize}px</span>
            </div>
            <input
              type="range"
              min="3"
              max="18"
              value={params.dotSize}
              onChange={(e) =>
                setParams({ ...params, dotSize: parseInt(e.target.value) })
              }
              className="w-full accent-brand-volt"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase text-zinc-400 mb-1">
              <span>Screen Angle</span>
              <span className="text-white font-bold">{params.angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={params.angle}
              onChange={(e) =>
                setParams({ ...params, angle: parseInt(e.target.value) })
              }
              className="w-full accent-brand-volt"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase text-zinc-400 mb-1">
              <span>Contrast Boost</span>
              <span className="text-white font-bold">+{params.contrast}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              value={params.contrast}
              onChange={(e) =>
                setParams({ ...params, contrast: parseInt(e.target.value) })
              }
              className="w-full accent-brand-volt"
            />
          </div>

          {/* Dot Shape */}
          <div>
            <label className="text-[10px] uppercase text-zinc-400 block mb-1.5">
              Dot Geometry
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['round', 'ellipse', 'square'].map((shape) => (
                <button
                  key={shape}
                  onClick={() => setParams({ ...params, shape: shape as any })}
                  className={`rounded py-1 text-[11px] uppercase font-bold ${
                    params.shape === shape
                      ? 'bg-brand-volt text-black'
                      : 'bg-[#07080A] text-zinc-400 hover:text-white border border-border'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
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
      <div className="flex-1 flex flex-col items-center justify-center bg-[#07080A] p-8 relative">
        <div className="rounded-sm border border-border bg-[#0C0D10] p-6 shadow-2xl flex flex-col items-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
            Real-Time Halftone Matrix Output
          </div>
          {/* Transparency checkerboard background */}
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
