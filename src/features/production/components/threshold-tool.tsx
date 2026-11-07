'use client';

import { useState, useRef, useEffect } from 'react';
import { Sliders, Download, Upload, ArrowLeftRight } from 'lucide-react';
import { ThresholdParams } from '@/types/production';
import { applyThresholdFilter } from '../algorithms/threshold-filter';
import { toast } from 'sonner';

const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFFFFF"/><stop offset="50%" stop-color="%23777777"/><stop offset="100%" stop-color="%23000000"/></linearGradient></defs><rect width="400" height="400" fill="%23FFFFFF"/><circle cx="200" cy="200" r="140" fill="url(%23grad2)"/><polygon points="200,80 230,160 310,170 250,230 270,310 200,270 130,310 150,230 90,170 170,160" fill="%23222222"/></svg>';

export function ThresholdTool() {
  const [params, setParams] = useState<ThresholdParams>({
    cutoff: 128,
    invert: false,
  });

  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_IMAGE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    renderThreshold();
  }, [params, imageSrc]);

  const renderThreshold = () => {
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
      const imgData = ctx.getImageData(0, 0, 480, 480);
      applyThresholdFilter(imgData, params);
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
      toast.success('Loaded artwork for 1-bit thresholding');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `threshold-positive-cutoff-${params.cutoff}.png`;
    link.href = dataUrl;
    link.click();
    toast.success('1-bit Film Positive PNG downloaded');
  };

  return (
    <div className="flex h-full w-full font-mono text-xs overflow-hidden">
      {/* Controls Sidebar */}
      <div className="w-80 flex flex-col border-r border-border bg-[#0C0D10] p-5 space-y-6 overflow-y-auto">
        <div className="border-b border-border pb-4">
          <div className="text-[10px] uppercase tracking-wider text-brand-volt font-bold">
            FILM POSITIVE UTILITY
          </div>
          <h2 className="text-sm font-black text-white uppercase mt-0.5">
            Color Threshold
          </h2>
          <p className="text-[11px] text-zinc-400 font-sans mt-1">
            Binarize images into pure black and white for screen printing exposure film.
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

        {/* Cutoff Slider */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] uppercase text-zinc-400 mb-1">
              <span>Cutoff Threshold</span>
              <span className="text-white font-bold">{params.cutoff} / 255</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={params.cutoff}
              onChange={(e) =>
                setParams({ ...params, cutoff: parseInt(e.target.value) })
              }
              className="w-full accent-brand-volt"
            />
          </div>

          <button
            onClick={() => setParams({ ...params, invert: !params.invert })}
            className={`w-full flex items-center justify-center gap-2 rounded-sm py-2 text-xs font-bold border transition-colors ${
              params.invert
                ? 'border-brand-volt bg-brand-volt/10 text-brand-volt'
                : 'border-border bg-[#07080A] text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>INVERT BLACK / WHITE</span>
          </button>
        </div>

        {/* Download Action */}
        <div className="border-t border-border pt-4">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2.5 font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
          >
            <Download className="h-4 w-4" />
            <span>DOWNLOAD FILM POSITIVE</span>
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#07080A] p-8">
        <div className="rounded-sm border border-border bg-[#0C0D10] p-6 shadow-2xl flex flex-col items-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
            Pure 1-Bit Film Output
          </div>
          <div className="rounded border border-zinc-700 overflow-hidden bg-white">
            <canvas ref={canvasRef} className="w-[360px] h-[360px] sm:w-[440px] sm:h-[440px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
