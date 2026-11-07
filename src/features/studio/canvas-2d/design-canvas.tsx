'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { DesignLayer, TextLayer, ImageLayer } from '@/types/studio';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId) {
          e.preventDefault();
          deleteLayer(selectedLayerId);
        }
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
        }
      } else if (selectedLayer && !selectedLayer.isLocked) {
        const step = e.shiftKey ? 5 : 1;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateLayer(selectedLayer.id, { x: Math.max(0, selectedLayer.x - step) });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          updateLayer(selectedLayer.id, { x: Math.min(100, selectedLayer.x + step) });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          updateLayer(selectedLayer.id, { y: Math.max(0, selectedLayer.y - step) });
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          updateLayer(selectedLayer.id, { y: Math.min(100, selectedLayer.y + step) });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, selectedLayer, deleteLayer, updateLayer, undo, redo]);

  // Handle Layer Selection & Dragging
  const handleLayerMouseDown = (e: React.MouseEvent, layer: DesignLayer) => {
    e.stopPropagation();
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

  // Mouse Move listener on window for drag/resize/rotate
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState || !canvasAreaRef.current) return;

      const rect = canvasAreaRef.current.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      const deltaXPercent = ((e.clientX - dragState.startX) / canvasWidth) * 100 / zoom;
      const deltaYPercent = ((e.clientY - dragState.startY) / canvasHeight) * 100 / zoom;

      if (dragState.type === 'move') {
        updateLayer(dragState.layerId, {
          x: Math.round(Math.min(Math.max(dragState.startLayerX + deltaXPercent, 0), 100)),
          y: Math.round(Math.min(Math.max(dragState.startLayerY + deltaYPercent, 0), 100)),
        });
      } else if (dragState.type === 'resize' && dragState.handle) {
        let newWidth = dragState.startWidth;
        let newHeight = dragState.startHeight;

        if (dragState.handle.includes('e')) newWidth += deltaXPercent * 2;
        if (dragState.handle.includes('w')) newWidth -= deltaXPercent * 2;
        if (dragState.handle.includes('s')) newHeight += deltaYPercent * 2;
        if (dragState.handle.includes('n')) newHeight -= deltaYPercent * 2;

        updateLayer(dragState.layerId, {
          width: Math.max(5, Math.min(newWidth, 95)),
          height: Math.max(5, Math.min(newHeight, 95)),
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

  // Garment silhouette outline
  const renderGarmentContour = () => {
    const isPants =
      garment.geometryType === 'cargos' ||
      garment.geometryType === 'sweatpants' ||
      garment.geometryType === 'jeans' ||
      garment.geometryType === 'shorts';

    return (
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-20"
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
      onClick={() => setSelectedLayerId(null)}
      className="relative flex-1 h-full w-full overflow-hidden bg-[#07080A] flex items-center justify-center select-none"
    >
      {/* Background CAD Grid */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />

      {/* Viewport Zoom & HUD Controls */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1.5 rounded-sm border border-border bg-[#0C0D10]/90 p-1.5 backdrop-blur font-mono text-xs shadow-lg">
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
        <div className="absolute inset-x-12 inset-y-16 border border-dashed border-brand-volt/30 rounded-sm pointer-events-none flex flex-col justify-between p-2">
          <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-brand-volt/60">
            <span>PRINT BOUNDARY // {activeSurface}</span>
            <span>2048 × 2048 UV</span>
          </div>
          <div className="text-[8px] font-mono text-zinc-600 text-right">
            STARTTHEBRAND CAD
          </div>
        </div>

        {/* Rendered Layers */}
        {surfaceLayers
          .filter((l) => l.isVisible)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((layer) => {
            const isSelected = layer.id === selectedLayerId;

            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  width: `${layer.width}%`,
                  height: `${layer.height}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity,
                  zIndex: layer.zIndex + 10,
                }}
                className={`absolute flex items-center justify-center cursor-move transition-shadow ${
                  isSelected ? 'ring-1 ring-brand-volt ring-offset-1 ring-offset-black' : ''
                }`}
              >
                {layer.type === 'TEXT' ? (
                  <div
                    style={{
                      fontFamily: (layer as TextLayer).fontFamily,
                      fontSize: `${((layer as TextLayer).fontSize * 0.9)}px`,
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
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                )}

                {/* Transform Handles on Selected Layer */}
                {isSelected && !layer.isLocked && (
                  <>
                    <div className="absolute inset-0 border border-brand-volt pointer-events-none" />

                    {/* Top Rotation Anchor */}
                    <div
                      onMouseDown={(e) => handleAnchorMouseDown(e, 'rotate')}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-volt border-2 border-black cursor-grab shadow flex items-center justify-center"
                      title="Rotate (Drag)"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-brand-volt pointer-events-none" />

                    {/* 8 Resize Handles */}
                    {['nw', 'ne', 'se', 'sw', 'n', 's', 'e', 'w'].map((h) => {
                      let posClasses = '';
                      if (h === 'nw') posClasses = '-top-1.5 -left-1.5 cursor-nwse-resize';
                      if (h === 'ne') posClasses = '-top-1.5 -right-1.5 cursor-nesw-resize';
                      if (h === 'se') posClasses = '-bottom-1.5 -right-1.5 cursor-nwse-resize';
                      if (h === 'sw') posClasses = '-bottom-1.5 -left-1.5 cursor-nesw-resize';
                      if (h === 'n') posClasses = '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize';
                      if (h === 's') posClasses = '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize';
                      if (h === 'e') posClasses = 'top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize';
                      if (h === 'w') posClasses = 'top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize';

                      return (
                        <div
                          key={h}
                          onMouseDown={(e) => handleAnchorMouseDown(e, h)}
                          className={`absolute w-3 h-3 bg-white border border-black rounded-none shadow-sm ${posClasses}`}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
