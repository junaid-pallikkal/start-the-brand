'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Undo2,
  Redo2,
  Box,
  Download,
  Check,
  ChevronLeft,
  Columns2,
  Square,
  Sparkles,
} from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';
import { texturePipeline } from '../canvas-2d/texture-pipeline';
import { downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

export function StudioHeader() {
  const {
    project,
    activeSurface,
    viewMode,
    isSaving,
    lastSavedAt,
    setProjectName,
    setViewMode,
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

      const safeTitle = (project.name || 'garment').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `${safeTitle}-${activeSurface.toLowerCase()}-300dpi.png`;
      downloadFile(dataUrl, filename);
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
            <span className="font-bold text-white uppercase group-hover:text-brand-volt transition-colors truncate max-w-[160px] sm:max-w-xs">
              {project.name}
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">
              // STUDIO
            </span>
          </button>
        )}
      </div>

      {/* Center: Mode Switcher (2D Flat CAD vs 3D Interactive vs Split) */}
      <div className="flex items-center gap-1 rounded bg-[#07080A] p-1 border border-border">
        <button
          onClick={() => setViewMode('2D')}
          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold transition-all ${
            viewMode === '2D'
              ? 'bg-brand-volt text-black shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-surface'
          }`}
          title="2D Flat CAD Canvas View"
        >
          <Square className="h-3.5 w-3.5" />
          <span>2D CAD</span>
        </button>

        <button
          onClick={() => setViewMode('3D')}
          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold transition-all ${
            viewMode === '3D'
              ? 'bg-brand-volt text-black shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-surface'
          }`}
          title="100% 3D Garment Studio (Edit cloth & designs directly in 3D)"
        >
          <Box className="h-3.5 w-3.5" />
          <span>3D CLOTH</span>
        </button>

        <button
          onClick={() => setViewMode('SPLIT')}
          className={`hidden md:flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold transition-all ${
            viewMode === 'SPLIT'
              ? 'bg-brand-volt text-black shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-surface'
          }`}
          title="Side-by-side 2D and 3D View"
        >
          <Columns2 className="h-3.5 w-3.5" />
          <span>SPLIT VIEW</span>
        </button>
      </div>

      {/* Right: Undo/Redo & Export Actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-3 w-[1px] bg-border mx-1 hidden sm:block" />

        {/* Print PNG Export */}
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
