'use client';

import { useEffect } from 'react';
import { SurfaceType } from '@/types/garment';
import { useStudioStore } from '@/stores/studio-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';

export function SurfaceSelector() {
  const { project, activeSurface, setActiveSurface } = useStudioStore();

  const currentGarment = DEFAULT_GARMENTS.find((g) => g.id === project.garmentId);
  const isLowerBody =
    currentGarment?.geometryType === 'cargos' ||
    currentGarment?.geometryType === 'sweatpants' ||
    currentGarment?.geometryType === 'jeans' ||
    currentGarment?.geometryType === 'shorts';
  const isSocks = currentGarment?.geometryType === 'socks';

  const surfaces: { id: SurfaceType; label: string; shortcut: string }[] = isLowerBody
    ? [
        { id: 'FRONT', label: 'Front Thigh', shortcut: '1' },
        { id: 'BACK', label: 'Back Hip', shortcut: '2' },
      ]
    : isSocks
    ? [
        { id: 'FRONT', label: 'Ankle Rib', shortcut: '1' },
        { id: 'BACK', label: 'Calf Back', shortcut: '2' },
      ]
    : [
        { id: 'FRONT', label: 'Front Chest', shortcut: '1' },
        { id: 'BACK', label: 'Full Back', shortcut: '2' },
        { id: 'LEFT_SLEEVE', label: 'Left Sleeve', shortcut: '3' },
        { id: 'RIGHT_SLEEVE', label: 'Right Sleeve', shortcut: '4' },
      ];

  // Number key shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === '1') setActiveSurface('FRONT');
      if (e.key === '2') setActiveSurface('BACK');
      if (e.key === '3') setActiveSurface('LEFT_SLEEVE');
      if (e.key === '4') setActiveSurface('RIGHT_SLEEVE');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveSurface]);

  return (
    <div className="flex items-center gap-1.5 p-2 bg-[#0C0D10] border-b border-border font-mono text-xs">
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider px-2 hidden sm:inline">
        Garment Surface:
      </span>
      <div className="flex items-center gap-1">
        {surfaces.map((s) => {
          const isActive = activeSurface === s.id;
          const layerCount = project.layers[s.id]?.length || 0;

          return (
            <button
              key={s.id}
              onClick={() => setActiveSurface(s.id)}
              className={`flex items-center gap-2 rounded-sm px-3 py-1.5 transition-all text-xs ${
                isActive
                  ? 'bg-brand-volt text-black font-bold shadow-sm'
                  : 'bg-surface text-zinc-300 hover:text-white border border-border/60 hover:border-zinc-600'
              }`}
            >
              <span>{s.label}</span>
              <span
                className={`rounded px-1 py-0.2 text-[9px] font-bold ${
                  isActive ? 'bg-black/20 text-black' : 'bg-black/60 text-zinc-400'
                }`}
              >
                {layerCount}
              </span>
              <span
                className={`text-[9px] opacity-60 hidden md:inline ${
                  isActive ? 'text-black' : 'text-zinc-500'
                }`}
              >
                [{s.shortcut}]
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
