'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import { useStudioStore } from '@/stores/studio-store';
import { StudioHeader } from '@/features/studio/components/studio-header';
import { SurfaceSelector } from '@/features/studio/components/surface-selector';
import { ToolSidebar } from '@/features/studio/components/tool-sidebar';
import { DesignCanvas } from '@/features/studio/canvas-2d/design-canvas';
import { PropertyInspector } from '@/features/studio/components/property-inspector';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';

// Dynamic client-side import for 3D Studio to prevent SSR hydration issues
const Interactive3DStudio = dynamic(
  () =>
    import('@/features/studio/canvas-3d/interactive-3d-studio').then(
      (mod) => mod.Interactive3DStudio
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#07080A] font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-volt animate-ping" />
          <span>INITIALIZING REAL-TIME 3D CLOTH ENGINE...</span>
        </div>
      </div>
    ),
  }
);

export default function StudioProjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = (params?.projectId as string) || 'default-project';
  const garmentParam = searchParams?.get('garment');
  const colorParam = searchParams?.get('color');

  const { project, viewMode, loadProjectById, setGarmentId, setGarmentColor } = useStudioStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (projectId && projectId !== 'new' && projectId !== 'default') {
        const found = await loadProjectById(projectId);
        if (!found && garmentParam) {
          setGarmentId(garmentParam);
        }
      } else if (garmentParam) {
        setGarmentId(garmentParam);
      }

      if (colorParam) {
        setGarmentColor(decodeURIComponent(colorParam));
      }

      setIsReady(true);
    }
    init();
  }, [projectId, garmentParam, colorParam, loadProjectById, setGarmentId, setGarmentColor]);

  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#07080A] font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-volt animate-ping" />
          <span>INITIALIZING APPAREL DESIGN STUDIO...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Top Studio Bar with 2D / 3D / Split Switcher */}
      <StudioHeader />

      {/* Surface Selector (Front, Back, Sleeves) */}
      <SurfaceSelector />

      {/* Main Studio Creative Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Tools, Typography, Library, Garment Blanks, Layers */}
        <ToolSidebar />

        {/* Center: Stage View (2D Flat CAD, 3D Cloth, or Split View) */}
        {viewMode === '2D' && <DesignCanvas />}

        {viewMode === '3D' && <Interactive3DStudio />}

        {viewMode === 'SPLIT' && (
          <div className="flex flex-1 h-full w-full overflow-hidden">
            <div className="w-1/2 h-full border-r border-border relative">
              <DesignCanvas />
            </div>
            <div className="w-1/2 h-full relative">
              <Interactive3DStudio />
            </div>
          </div>
        )}

        {/* Right: Permanent Rock-Solid Property Inspector */}
        <PropertyInspector />
      </div>
    </div>
  );
}
