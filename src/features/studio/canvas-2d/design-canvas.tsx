'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { DesignLayer, TextLayer, ImageLayer } from '@/types/studio';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCw,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Crosshair,
} from 'lucide-react';

interface DragState {
  layerId: string;
  type: 'move' | 'resize' | 'rotate';
  handle?: string;
  startX: number;
  startY: number;
  startLayerX: number;
  startLayerY: number;
  startWidth: number;
  startHeight: number;
  startRotation: number;
}

export function DesignCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  const {
    project,
    activeSurface,
    selectedLayerId,
    zoom,
    pan,
    setSelectedLayerId,
    updateLayer,
    nudgeLayer,
    scaleLayer,
    rotateLayer,
    centerLayer,
    duplicateLayer,
    toggleLayerLock,
    deleteLayer,
    setZoom,
    setPan,
    undo,
    redo,
  } = useStudioStore();

  const [dragState, setDragState] = useState<DragState | null>(null);

  const garment =
    DEFAULT_GARMENTS.find((g) => g.id === project.garmentId) || DEFAULT_GARMENTS[0];
  const surfaceLayers = project.layers[activeSurface] || [];
  const selectedLayer = surfaceLayers.find((l) => l.id === selectedLayerId);

  // Keyboard controls for layer movement and history
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId) {
          e.preventDefault();
          deleteLayer(selectedLayerId);
        }
      } else if (e.key === 'Escape') {
        setSelectedLayerId(null);
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        } else if (e.key === 'd' && selectedLayerId) {
          e.preventDefault();
          duplicateLayer(selectedLayerId);
        }
      } else if (selectedLayer && !selectedLayer.isLocked) {
        const step = e.shiftKey ? 5 : 1;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          nudgeLayer(selectedLayer.id, -step, 0);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nudgeLayer(selectedLayer.id, step, 0);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          nudgeLayer(selectedLayer.id, 0, -step);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          nudgeLayer(selectedLayer.id, 0, step);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedLayerId,
    selectedLayer,
    deleteLayer,
    nudgeLayer,
    duplicateLayer,
    setSelectedLayerId,
    undo,
    redo,
  ]);

  // Handle Layer Selection & Mouse Down for Dragging
  const handleLayerMouseDown = (e: React.MouseEvent, layer: DesignLayer) => {
    e.preventDefault(); // Prevents browser native image ghost dragging!
    e.stopPropagation(); // Prevents bubbling to canvas container and deselecting!
    setSelectedLayerId(layer.id);

    if (layer.isLocked) return;

    setDragState({
      layerId: layer.id,
      type: 'move',
      startX: e.clientX,
      startY: e.clientY,
      startLayerX: layer.x,
      startLayerY: layer.y,
      startWidth: layer.width,
      startHeight: layer.height,
      startRotation: layer.rotation,
    });
  };

  // Handle Resize & Rotate Anchors
  const handleAnchorMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedLayer || selectedLayer.isLocked) return;

    setDragState({
      layerId: selectedLayer.id,
      type: handle === 'rotate' ? 'rotate' : 'resize',
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startLayerX: selectedLayer.x,
      startLayerY: selectedLayer.y,
      startWidth: selectedLayer.width,
      startHeight: selectedLayer.height,
      startRotation: selectedLayer.rotation,
    });
  };

  // Window mouse move listener during active drag/resize/rotate
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState || !canvasAreaRef.current) return;

      const rect = canvasAreaRef.current.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      const deltaXPercent = (((e.clientX - dragState.startX) / canvasWidth) * 100) / zoom;
      const deltaYPercent = (((e.clientY - dragState.startY) / canvasHeight) * 100) / zoom;

      if (dragState.type === 'move') {
        const nextX = Math.round(
          Math.min(Math.max(dragState.startLayerX + deltaXPercent, 0), 100)
        );
        const nextY = Math.round(
          Math.min(Math.max(dragState.startLayerY + deltaYPercent, 0), 100)
        );
        updateLayer(dragState.layerId, { x: nextX, y: nextY });
      } else if (dragState.type === 'resize' && dragState.handle) {
        let newWidth = dragState.startWidth;
        let newHeight = dragState.startHeight;

        if (dragState.handle.includes('e')) newWidth += deltaXPercent * 2;
        if (dragState.handle.includes('w')) newWidth -= deltaXPercent * 2;
        if (dragState.handle.includes('s')) newHeight += deltaYPercent * 2;
        if (dragState.handle.includes('n')) newHeight -= deltaYPercent * 2;

        updateLayer(dragState.layerId, {
          width: Math.max(5, Math.min(Math.round(newWidth), 95)),
          height: Math.max(5, Math.min(Math.round(newHeight), 95)),
        });
      } else if (dragState.type === 'rotate') {
        const centerX = rect.left + (dragState.startLayerX / 100) * canvasWidth;
        const centerY = rect.top + (dragState.startLayerY / 100) * canvasHeight;
        const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let degrees = Math.round((angleRad * 180) / Math.PI + 90);
        if (degrees < 0) degrees += 360;

        if (e.shiftKey) {
          degrees = Math.round(degrees / 45) * 45;
        }

        updateLayer(dragState.layerId, { rotation: degrees % 360 });
      }
    },
    [dragState, zoom, updateLayer]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  // Garment vector contour
  const renderGarmentContour = () => {
    const isPants =
      garment.geometryType === 'cargos' ||
      garment.geometryType === 'sweatpants' ||
      garment.geometryType === 'jeans' ||
      garment.geometryType === 'shorts';

    return (
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-25"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {isPants ? (
          <path
            d="M 28 8 L 72 8 L 76 24 L 72 92 L 53 92 L 50 48 L 47 92 L 28 92 L 24 24 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            className="text-white"
          />
        ) : (
          <path
            d="M 36 8 Q 50 16 64 8 L 86 26 L 76 38 L 70 32 L 72 92 L 28 92 L 30 32 L 24 38 L 14 26 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            className="text-white"
          />
        )}
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        // Only deselect if clicking directly on the empty background container
        if (e.target === containerRef.current) {
          setSelectedLayerId(null);
        }
      }}
      className="relative flex-1 h-full w-full overflow-hidden bg-[#07080A] flex items-center justify-center select-none"
    >
      {/* Background CAD Grid */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />

      {/* Viewport Zoom & Reset Controls */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1.5 rounded-sm border border-border bg-[#0C0D10]/95 p-1.5 backdrop-blur font-mono text-xs shadow-xl">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(zoom - 0.15);
          }}
          className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span className="w-12 text-center text-[10px] text-zinc-300 font-bold">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(zoom + 0.15);
          }}
          className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <div className="h-3 w-[1px] bg-border mx-1" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-white"
          title="Reset View"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>

      {/* Main Garment Canvas Stage */}
      <div
        ref={canvasAreaRef}
        onClick={(e) => {
          // Deselect only if clicking on garment blank background, not a layer
          if (e.target === canvasAreaRef.current) {
            setSelectedLayerId(null);
          }
        }}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transition: dragState ? 'none' : 'transform 0.1s ease-out',
          backgroundColor: project.garmentColor || '#0B0B0D',
        }}
        className="relative w-[480px] h-[580px] sm:w-[560px] sm:h-[680px] rounded-sm border border-border shadow-2xl overflow-hidden cursor-default transition-colors duration-200"
      >
        {/* Silhouette Vector Contour */}
        {renderGarmentContour()}

        {/* Printable Area Boundary */}
        <div className="absolute inset-x-12 inset-y-16 border border-dashed border-brand-volt/35 rounded-sm pointer-events-none flex flex-col justify-between p-2">
          <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-brand-volt/70">
            <span>PRINT BOUNDARY // {activeSurface}</span>
            <span>2048 × 2048 UV (300 DPI)</span>
          </div>
          <div className="text-[8px] font-mono text-zinc-500 text-right">
            STARTTHEBRAND CAD
          </div>
        </div>

        {/* Rendered Design Layers */}
        {surfaceLayers
          .filter((l) => l.isVisible)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((layer) => {
            const isSelected = layer.id === selectedLayerId;

            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLayerId(layer.id);
                }}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  width: `${layer.width}%`,
                  height: `${layer.height}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity,
                  zIndex: isSelected ? 100 : layer.zIndex + 10,
                }}
                className={`absolute flex items-center justify-center cursor-move transition-shadow ${
                  isSelected
                    ? 'ring-1 ring-brand-volt ring-offset-2 ring-offset-black'
                    : 'hover:ring-1 hover:ring-zinc-500/50'
                }`}
              >
                {layer.type === 'TEXT' ? (
                  <div
                    style={{
                      fontFamily: (layer as TextLayer).fontFamily,
                      fontSize: `${(layer as TextLayer).fontSize * 0.9}px`,
                      color: (layer as TextLayer).fillColor,
                      letterSpacing: `${(layer as TextLayer).letterSpacing}px`,
                      fontWeight: (layer as TextLayer).fontWeight,
                      textAlign: (layer as TextLayer).textAlign,
                      lineHeight: (layer as TextLayer).lineHeight,
                    }}
                    className="w-full h-full flex items-center justify-center whitespace-pre-wrap select-none leading-none break-words"
                  >
                    {(layer as TextLayer).text}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(layer as ImageLayer).src}
                    alt={layer.name}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                )}

                {/* Transform Handles & Floating Action HUD on Selected Layer */}
                {isSelected && (
                  <>
                    {/* Vibrant Bounding Box */}
                    <div className="absolute inset-0 border-2 border-brand-volt pointer-events-none" />

                    {/* Floating Quick Action Mini HUD (Above Layer) */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded bg-[#090A0D]/95 px-2 py-1 border border-brand-volt/60 shadow-2xl backdrop-blur font-mono text-[10px] text-white whitespace-nowrap"
                    >
                      {/* Movement Nudge Arrow Controls */}
                      <div className="flex items-center gap-0.5 border-r border-zinc-700 pr-1.5 mr-0.5">
                        <button
                          onClick={() => nudgeLayer(layer.id, -2, 0)}
                          className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                          title="Nudge Left (2%)"
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => nudgeLayer(layer.id, 0, -2)}
                          className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                          title="Nudge Up (2%)"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => nudgeLayer(layer.id, 0, 2)}
                          className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                          title="Nudge Down (2%)"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => nudgeLayer(layer.id, 2, 0)}
                          className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                          title="Nudge Right (2%)"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Center Graphic */}
                      <button
                        onClick={() => centerLayer(layer.id, 'both')}
                        className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                        title="Center on Chest/Surface"
                      >
                        <Crosshair className="h-3 w-3" />
                      </button>

                      {/* Scale Controls */}
                      <button
                        onClick={() => scaleLayer(layer.id, -5)}
                        className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                        title="Scale Down (-5%)"
                      >
                        <Minimize2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => scaleLayer(layer.id, 5)}
                        className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                        title="Scale Up (+5%)"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </button>

                      {/* Rotate 15 deg */}
                      <button
                        onClick={() => rotateLayer(layer.id, 15)}
                        className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                        title="Rotate (+15°)"
                      >
                        <RotateCw className="h-3 w-3" />
                      </button>

                      {/* Duplicate Layer */}
                      <button
                        onClick={() => duplicateLayer(layer.id)}
                        className="rounded p-1 hover:bg-surface hover:text-brand-volt"
                        title="Duplicate Layer"
                      >
                        <Copy className="h-3 w-3" />
                      </button>

                      {/* Lock Toggle */}
                      <button
                        onClick={() => toggleLayerLock(layer.id)}
                        className={`rounded p-1 hover:bg-surface ${
                          layer.isLocked ? 'text-amber-400' : 'text-zinc-400 hover:text-white'
                        }`}
                        title={layer.isLocked ? 'Unlock Layer' : 'Lock Layer'}
                      >
                        {layer.isLocked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3" />
                        )}
                      </button>

                      {/* Delete Layer */}
                      <button
                        onClick={() => deleteLayer(layer.id)}
                        className="rounded p-1 hover:bg-red-500/20 text-red-400"
                        title="Delete Layer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    {!layer.isLocked && (
                      <>
                        {/* Top Rotation Anchor Handle */}
                        <div
                          onMouseDown={(e) => handleAnchorMouseDown(e, 'rotate')}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-volt border-2 border-black cursor-grab shadow-lg flex items-center justify-center hover:scale-125 transition-transform"
                          title="Drag to Rotate"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        </div>
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[1px] h-3.5 bg-brand-volt pointer-events-none" />

                        {/* 8 Bounding Resize Handles */}
                        {['nw', 'ne', 'se', 'sw', 'n', 's', 'e', 'w'].map((h) => {
                          let posClasses = '';
                          if (h === 'nw') posClasses = '-top-1.5 -left-1.5 cursor-nwse-resize';
                          if (h === 'ne') posClasses = '-top-1.5 -right-1.5 cursor-nesw-resize';
                          if (h === 'se') posClasses = '-bottom-1.5 -right-1.5 cursor-nwse-resize';
                          if (h === 'sw') posClasses = '-bottom-1.5 -left-1.5 cursor-nesw-resize';
                          if (h === 'n')
                            posClasses = '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize';
                          if (h === 's')
                            posClasses = '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize';
                          if (h === 'e')
                            posClasses = 'top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize';
                          if (h === 'w')
                            posClasses = 'top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize';

                          return (
                            <div
                              key={h}
                              onMouseDown={(e) => handleAnchorMouseDown(e, h)}
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute w-3 h-3 bg-white border border-black shadow-sm ${posClasses}`}
                            />
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
