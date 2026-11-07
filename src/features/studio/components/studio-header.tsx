'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Undo2,
  Redo2,
  Box,
  Download,
  Save,
  Check,
  ChevronLeft,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { texturePipeline } from '../canvas-2d/texture-pipeline';
import { toast } from 'sonner';

export function StudioHeader() {
  const {
    project,
    activeSurface,
    isSaving,
    lastSavedAt,
    setProjectName,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useStudioStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      setProjectName(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleExportPrintPNG = () => {
    try {
      const surfaceLayers = project.layers[activeSurface] || [];
      const dataUrl = texturePipeline.exportHighResPNG(activeSurface, surfaceLayers);

      if (!dataUrl) {
        toast.error('Unable to generate canvas export');
        return;
      }

      const link = document.createElement('a');
      link.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-${activeSurface.toLowerCase()}-300dpi.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`Exported ${activeSurface} print decal (300 DPI)`);
    } catch (e) {
      toast.error('Export failed');
    }
  };

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-border bg-[#0B0C0E] px-4 font-mono text-xs z-30">
      {/* Left: Back & Project Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-white transition-colors"
          title="Return to Dashboard"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="h-4 w-[1px] bg-border" />

        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
            className="rounded border border-brand-volt bg-surface px-2 py-0.5 text-xs font-bold text-white focus:outline-none"
          />
        ) : (
          <button
            onClick={() => {
              setTitleInput(project.name);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-2 group text-left"
            title="Click to rename project"
          >
            <span className="font-bold text-white uppercase group-hover:text-brand-volt transition-colors truncate max-w-[200px] sm:max-w-xs">
              {project.name}
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">
              // CAD
            </span>
          </button>
        )}
      </div>

      {/* Center: Undo / Redo & Save Status */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="rounded p-1.5 text-zinc-400 hover:bg-surface hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="rounded p-1.5 text-zinc-400 hover:bg-surface hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="h-3 w-[1px] bg-border mx-2" />

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
          {isSaving ? (
            <span className="text-amber-400">Saving...</span>
          ) : (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span>Auto-saved</span>
            </>
          )}
        </div>
      </div>

      {/* Right: 3D Viewport Toggle & Export Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/mockups?projectId=${project.id}`}
          className="flex items-center gap-1.5 rounded-sm border border-brand-volt/40 bg-brand-volt/10 px-3 py-1 font-bold text-brand-volt hover:bg-brand-volt hover:text-black transition-all"
        >
          <Box className="h-3.5 w-3.5" />
          <span>INSPECT IN 3D</span>
        </Link>

        <button
          onClick={handleExportPrintPNG}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1 font-semibold text-white hover:border-zinc-500 hover:bg-surface/80 transition-colors"
          title="Export 300 DPI Transparent PNG"
        >
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden sm:inline">PRINT PNG</span>
        </button>
      </div>
    </header>
  );
}
