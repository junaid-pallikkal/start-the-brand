'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Palette, Box, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import { MotionControls } from '@/features/motion/components/motion-controls';
import type { TurntableRef } from '@/features/motion/components/turntable-viewport';
import { useStudioStore } from '@/stores/studio-store';
import { STREETWEAR_PROMPT_PRESETS } from '@/lib/ai/provider-gateway';
import { toast } from 'sonner';

const TurntableViewport = dynamic(
  () =>
    import('@/features/motion/components/turntable-viewport').then(
      (mod) => mod.TurntableViewport
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#07080A] font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-volt animate-ping" />
          <span>INITIALIZING 360° MOTION ENGINE...</span>
        </div>
      </div>
    ),
  }
);

export default function MotionPage() {
  const turntableRef = useRef<TurntableRef>(null);
  const { project, addImageLayer } = useStudioStore();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(STREETWEAR_PROMPT_PRESETS[0].prompt);
  const [generating, setGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const handleStartRecord = () => {
    turntableRef.current?.startVideoRecording();
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    setGeneratedImg(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImg(data.imageUrl);
        toast.success('Generated streetwear concept');
      } else {
        toast.error('AI generation unavailable');
      }
    } catch {
      toast.error('Network error during AI request');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddAiGraphicToStudio = () => {
    if (!generatedImg) return;
    addImageLayer(generatedImg, 768, 768, 'AI Concept Decal');
    toast.success('Decal added to 2D Studio Canvas');
    setAiModalOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background font-mono">
      {/* Left: Motion & Rotational Video Controls */}
      <MotionControls onStartRecord={handleStartRecord} />

      {/* Center: Turntable 3D Viewport with Canvas Recording */}
      <div className="relative flex-1 h-full w-full overflow-hidden flex flex-col justify-between">
        {/* Navigation Quick Bar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0C0D10]/85 p-2 rounded-sm border border-border backdrop-blur-md text-xs">
          <Link
            href={`/studio/${project.id}`}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-brand-volt transition-colors"
          >
            <Palette className="h-3.5 w-3.5" />
            <span>2D STUDIO</span>
          </Link>
          <span className="text-zinc-600">|</span>
          <Link
            href="/mockups"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-brand-volt transition-colors"
          >
            <Box className="h-3.5 w-3.5" />
            <span>3D MOCKUPS</span>
          </Link>
          <span className="text-zinc-600">|</span>
          <button
            onClick={() => setAiModalOpen(true)}
            className="flex items-center gap-1.5 text-brand-volt hover:underline font-bold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI GRAPHIC SUITE</span>
          </button>
        </div>

        {/* Viewport Top Right Status */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-[#0C0D10]/85 px-3 py-1.5 rounded-sm border border-border backdrop-blur-md text-[11px] text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>CANVAS CAPTURESTREAM (60 FPS)</span>
        </div>

        {/* Interactive Turntable Rotational Stage */}
        <TurntableViewport ref={turntableRef} />
      </div>

      {/* AI DESIGN ASSISTANT MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-sm border border-border bg-[#0C0D10] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-volt" />
                <h3 className="font-bold text-white uppercase text-sm">
                  Streetwear AI Graphic Generator
                </h3>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                Prompt Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STREETWEAR_PROMPT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiPrompt(preset.prompt)}
                    className="rounded border border-border bg-[#07080A] p-2 text-left hover:border-brand-volt hover:text-white transition-colors"
                  >
                    <div className="text-[10px] text-brand-volt font-bold">
                      {preset.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                Design Prompt Brief
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full rounded border border-border bg-[#07080A] p-2.5 text-xs text-white focus:border-brand-volt focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-zinc-500">
                Zero-Cost Open Gateway (Pollinations)
              </span>
              <button
                onClick={handleGenerateAI}
                disabled={generating}
                className="flex items-center gap-2 rounded-sm bg-brand-volt px-5 py-2 font-bold text-black hover:bg-brand-volt/90 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{generating ? 'GENERATING...' : 'GENERATE GRAPHIC'}</span>
              </button>
            </div>

            {/* Generated Preview */}
            {generatedImg && (
              <div className="rounded border border-border bg-[#07080A] p-4 flex flex-col items-center space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImg}
                  alt="Generated Concept"
                  className="max-h-56 rounded border border-zinc-700 object-contain"
                />
                <button
                  onClick={handleAddAiGraphicToStudio}
                  className="flex items-center gap-2 rounded-sm bg-brand-volt px-6 py-2 text-xs font-bold text-black hover:bg-brand-volt/90"
                >
                  <Plus className="h-4 w-4" />
                  <span>ADD TO 2D STUDIO CANVAS</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
