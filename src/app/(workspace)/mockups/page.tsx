'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Palette, RotateCw, Box } from 'lucide-react';
import { MockupControls } from '@/features/mockups/components/mockup-controls';
import type { ViewportRef } from '@/features/mockups/components/mockup-viewport';
import { useMockupStore } from '@/stores/mockup-store';
import { useStudioStore } from '@/stores/studio-store';
import { toast } from 'sonner';

// Dynamic client-side import for Three.js R3F viewport
const MockupViewport = dynamic(
  () =>
    import('@/features/mockups/components/mockup-viewport').then(
      (mod) => mod.MockupViewport
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#07080A] font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-volt animate-ping" />
          <span>LOADING 3D PBR ENGINE & WEBGL...</span>
        </div>
      </div>
    ),
  }
);

export default function MockupsPage() {
  const viewportRef = useRef<ViewportRef>(null);
  const { saveMockupSnapshot, cameraPreset } = useMockupStore();
  const { project } = useStudioStore();

  const handleCaptureSnapshot = async () => {
    if (!viewportRef.current) return;
    const dataUrl = viewportRef.current.captureSnapshot();
    if (!dataUrl) {
      toast.error('Unable to capture 3D viewport');
      return;
    }

    // Save to local storage
    await saveMockupSnapshot(dataUrl);

    // Trigger download
    const link = document.createElement('a');
    link.download = `mockup-${project.name.toLowerCase().replace(/\s+/g, '-')}-${cameraPreset}.png`;
    link.href = dataUrl;
    link.click();

    toast.success('4K High-Resolution Mockup Downloaded');
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background font-mono">
      {/* Left: 3D Studio Controls & Silhouette Switcher */}
      <MockupControls onCapture={handleCaptureSnapshot} />

      {/* Center: Real-Time 3D WebGL PBR Viewport */}
      <div className="relative flex-1 h-full w-full overflow-hidden flex flex-col justify-between">
        {/* Viewport Top Bar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0C0D10]/80 p-2 rounded-sm border border-border backdrop-blur-md text-xs">
          <Link
            href={`/studio/${project.id}`}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-brand-volt transition-colors"
          >
            <Palette className="h-3.5 w-3.5" />
            <span>2D STUDIO</span>
          </Link>
          <span className="text-zinc-600">|</span>
          <Link
            href="/motion"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-brand-volt transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>TURNTABLE VIDEO</span>
          </Link>
        </div>

        {/* Viewport Top Right Status */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-[#0C0D10]/80 px-3 py-1.5 rounded-sm border border-border backdrop-blur-md text-[11px] text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>60 FPS PBR FABRIC WEAVE</span>
        </div>

        {/* Interactive 3D Canvas */}
        <div className="flex-1 h-full w-full">
          <MockupViewport ref={viewportRef} />
        </div>
      </div>
    </div>
  );
}
