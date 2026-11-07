'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Palette, RotateCw, Box, Download, Check, RefreshCw } from 'lucide-react';
import { MockupControls } from '@/features/mockups/components/mockup-controls';
import type { ViewportRef } from '@/features/mockups/components/mockup-viewport';
import { useMockupStore } from '@/stores/mockup-store';
import { useStudioStore } from '@/stores/studio-store';
import { downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

// Dynamic client-side import for Three.js R3F viewport to prevent SSR issues
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
          <span>INITIALIZING 3D PBR ENGINE & WEBGL...</span>
        </div>
      </div>
    ),
  }
);

function MockupsContent() {
  const [viewportApi, setViewportApi] = useState<ViewportRef | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { saveMockupSnapshot, cameraPreset, garmentId, setGarmentId, setGarmentColor } = useMockupStore();
  const { project, loadProjectById } = useStudioStore();
  const searchParams = useSearchParams();
  const queryProjectId = searchParams.get('projectId');

  // Load project if requested via URL
  useEffect(() => {
    if (queryProjectId && queryProjectId !== project.id) {
      loadProjectById(queryProjectId);
    }
  }, [queryProjectId, project.id, loadProjectById]);

  // Keep garmentId & color synced with project
  useEffect(() => {
    if (project.garmentId && project.garmentId !== garmentId) {
      setGarmentId(project.garmentId);
    }
    if (project.garmentColor) {
      setGarmentColor(project.garmentColor);
    }
  }, [project.garmentId, project.garmentColor, garmentId, setGarmentId, setGarmentColor]);

  const handleCaptureSnapshot = async () => {
    setIsCapturing(true);
    let dataUrl = '';

    try {
      // Primary: Direct R3F capture method
      if (viewportApi && typeof viewportApi.captureSnapshot === 'function') {
        dataUrl = viewportApi.captureSnapshot();
      }

      // Secondary: Window global fallback attached by R3F controller
      if (!dataUrl && typeof window !== 'undefined' && (window as any).__STB_MOCKUP_CAPTURE__) {
        dataUrl = (window as any).__STB_MOCKUP_CAPTURE__();
      }

      // Tertiary: Direct DOM canvas element capture
      if (!dataUrl && typeof document !== 'undefined') {
        const canvases = Array.from(document.querySelectorAll('canvas'));
        // Find WebGL canvas
        const webglCanvas = canvases.find(
          (c) => c.width > 300 && (c.getAttribute('data-engine') || c.style.width || c.className.includes('r3f') || true)
        );
        if (webglCanvas) {
          dataUrl = webglCanvas.toDataURL('image/png', 1.0);
        }
      }

      if (!dataUrl || dataUrl.length < 50) {
        toast.error('Unable to capture 3D viewport canvas. Please verify WebGL is active.');
        setIsCapturing(false);
        return;
      }

      // Save to local IndexedDB store
      await saveMockupSnapshot(dataUrl);

      // Trigger bulletproof file download
      const safeTitle = (project.name || 'garment').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `3d-mockup-${safeTitle}-${cameraPreset}.png`;
      downloadFile(dataUrl, filename);

      toast.success('4K High-Resolution 3D Mockup Captured & Downloaded');
    } catch (err) {
      console.error('Snapshot capture failed:', err);
      toast.error('Error generating 3D snapshot');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background font-mono">
      {/* Left: 3D Studio Controls & Silhouette Switcher */}
      <MockupControls onCapture={handleCaptureSnapshot} />

      {/* Center: Real-Time 3D WebGL PBR Viewport */}
      <div className="relative flex-1 h-full w-full overflow-hidden flex flex-col justify-between">
        {/* Viewport Top Bar */}
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
            href="/motion"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-brand-volt transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>TURNTABLE VIDEO</span>
          </Link>
        </div>

        {/* Viewport Top Right Status & Direct Download CTA */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-[#0C0D10]/85 px-3 py-1.5 rounded-sm border border-border backdrop-blur-md text-[11px] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>60 FPS PBR FABRIC WEAVE</span>
          </div>

          <button
            onClick={handleCaptureSnapshot}
            disabled={isCapturing}
            className="flex items-center gap-1.5 bg-brand-volt text-black px-3 py-1.5 rounded-sm font-bold text-xs hover:bg-brand-volt/90 shadow-lg shadow-brand-volt/20 transition-all disabled:opacity-50"
            title="Download high-resolution 3D garment snapshot"
          >
            <Download className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{isCapturing ? 'CAPTURING...' : 'TAKE MOCKUP'}</span>
          </button>
        </div>

        {/* Interactive 3D Canvas */}
        <div className="flex-1 h-full w-full">
          <MockupViewport onReady={setViewportApi} />
        </div>
      </div>
    </div>
  );
}

export default function MockupsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-[#07080A] font-mono text-xs text-zinc-500">
          <span>LOADING 3D WORKSPACE...</span>
        </div>
      }
    >
      <MockupsContent />
    </Suspense>
  );
}
