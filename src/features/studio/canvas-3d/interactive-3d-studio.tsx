'use client';

import { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GarmentMesh } from '@/features/mockups/3d-engine/garment-mesh';
import { StudioEnvironment } from '@/features/mockups/3d-engine/studio-environment';
import { useStudioStore } from '@/stores/studio-store';
import { useMockupStore } from '@/stores/mockup-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { APPAREL_COLOR_PRESETS } from '@/constants/color-presets';
import { CameraPreset, EnvironmentPreset } from '@/types/mockup';
import {
  RotateCw,
  Box,
  Eye,
  Camera,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Crosshair,
  Trash2,
  Type,
  Plus,
  Upload,
  Sparkles,
  Shirt,
  Palette,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

// Quick Preset Graphics for 1-click addition in 3D
const QUICK_3D_DECALS = [
  {
    name: 'Brutalist Spec Block',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%23000000" stroke="%23E2F952" stroke-width="4"/><text x="20" y="40" font-family="monospace" font-size="20" font-weight="bold" fill="%23E2F952">STARTTHEBRAND // SPEC</text><text x="20" y="70" font-family="monospace" font-size="12" fill="%23FFFFFF">ARCHIVE: ATELIER-2026</text><text x="20" y="90" font-family="monospace" font-size="12" fill="%23FFFFFF">WEIGHT: 450 GSM COTTON</text><line x1="20" y1="110" x2="280" y2="110" stroke="%23E2F952" stroke-width="2"/><text x="20" y="130" font-family="monospace" font-size="11" fill="%23E2F952">ALL RIGHTS RESERVED [01/99]</text></svg>`,
    width: 300,
    height: 150,
  },
  {
    name: 'Industrial Barcode',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120"><rect width="320" height="120" fill="transparent"/><rect x="20" y="10" width="8" height="70" fill="%23FFFFFF"/><rect x="34" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="44" y="10" width="12" height="70" fill="%23FFFFFF"/><rect x="62" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="74" y="10" width="14" height="70" fill="%23FFFFFF"/><rect x="94" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="104" y="10" width="10" height="70" fill="%23FFFFFF"/><rect x="120" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="132" y="10" width="16" height="70" fill="%23FFFFFF"/><rect x="154" y="10" width="8" height="70" fill="%23FFFFFF"/><rect x="168" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="178" y="10" width="14" height="70" fill="%23FFFFFF"/><rect x="198" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="210" y="10" width="10" height="70" fill="%23FFFFFF"/><rect x="226" y="10" width="14" height="70" fill="%23FFFFFF"/><rect x="246" y="10" width="4" height="70" fill="%23FFFFFF"/><rect x="256" y="10" width="12" height="70" fill="%23FFFFFF"/><rect x="274" y="10" width="6" height="70" fill="%23FFFFFF"/><rect x="286" y="10" width="14" height="70" fill="%23FFFFFF"/><text x="160" y="105" font-family="monospace" font-size="14" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">STB-8940-2026-X</text></svg>`,
    width: 320,
    height: 120,
  },
  {
    name: 'Volt Acid Star',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><polygon points="100,10 120,70 185,75 135,120 150,185 100,145 50,185 65,120 15,75 80,70" fill="%23E2F952"/><circle cx="100" cy="100" r="18" fill="%23000000"/></svg>`,
    width: 200,
    height: 200,
  },
];

// Inner 3D Camera Controller
function CameraManager({
  cameraAngle,
  autoRotate,
}: {
  cameraAngle: CameraPreset;
  autoRotate: boolean;
}) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object as THREE.PerspectiveCamera;
    const target = controlsRef.current.target as THREE.Vector3;

    switch (cameraAngle) {
      case 'back':
        cam.position.set(0, 0.05, -3.2);
        target.set(0, 0, 0);
        break;
      case 'isometric':
        cam.position.set(2.4, 1.2, 2.4);
        target.set(0, 0, 0);
        break;
      case 'macro':
        cam.position.set(0, 0.1, 1.45);
        target.set(0, 0.05, 0);
        break;
      case 'hero':
      default:
        cam.position.set(0, 0.05, 3.2);
        target.set(0, 0, 0);
        break;
    }

    cam.updateProjectionMatrix();
    controlsRef.current.update();
  }, [cameraAngle]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.8}
      maxDistance={6.0}
      autoRotate={autoRotate}
      autoRotateSpeed={2.0}
      makeDefault
    />
  );
}

export function Interactive3DStudio() {
  const {
    project,
    activeSurface,
    selectedLayerId,
    setGarmentId,
    setGarmentColor,
    setActiveSurface,
    setSelectedLayerId,
    addTextLayer,
    addImageLayer,
    nudgeLayer,
    scaleLayer,
    rotateLayer,
    centerLayer,
    deleteLayer,
  } = useStudioStore();

  const {
    backgroundModel,
    setBackgroundModel,
  } = useMockupStore();

  const [cameraAngle, setCameraAngle] = useState<CameraPreset>('hero');
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<EnvironmentPreset>('obsidian_dark');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentGarment =
    DEFAULT_GARMENTS.find((g) => g.id === project.garmentId) || DEFAULT_GARMENTS[0];
  const surfaceLayers = project.layers[activeSurface] || [];
  const selectedLayer = surfaceLayers.find((l) => l.id === selectedLayerId);

  // Sync camera orientation when switching surfaces
  const handleSwitchSurface = (surface: 'FRONT' | 'BACK') => {
    setActiveSurface(surface);
    if (surface === 'FRONT') {
      setCameraAngle('hero');
    } else {
      setCameraAngle('back');
    }
  };

  // Handle direct file upload in 3D
  const handle3DUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      toast.error('Please upload an image file (PNG, JPG, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        addImageLayer(src, img.width, img.height, file.name);
        toast.success(`Placed ${file.name} directly onto 3D ${activeSurface}`);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden bg-[#07080A] flex flex-col select-none">
      {/* 3D WebGL Canvas */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 3.2], fov: 42 }}
        >
          <color attach="background" args={['#07080A']} />
          <StudioEnvironment preset={lightingPreset} />

          <Suspense fallback={null}>
            <GarmentMesh />
          </Suspense>

          <CameraManager cameraAngle={cameraAngle} autoRotate={autoRotate} />
        </Canvas>

        {/* Top-Left: Active 3D Surface & Cloth Status */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 font-mono text-xs pointer-events-auto">
          {/* Surface Toggle Buttons (Front vs Back) */}
          <div className="flex items-center gap-1 rounded bg-[#090A0D]/90 p-1 border border-border backdrop-blur shadow-xl">
            <button
              onClick={() => handleSwitchSurface('FRONT')}
              className={`rounded px-3 py-1 text-xs font-bold transition-all ${
                activeSurface === 'FRONT'
                  ? 'bg-brand-volt text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-surface'
              }`}
            >
              FRONT CHEST
            </button>
            <button
              onClick={() => handleSwitchSurface('BACK')}
              className={`rounded px-3 py-1 text-xs font-bold transition-all ${
                activeSurface === 'BACK'
                  ? 'bg-brand-volt text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-surface'
              }`}
            >
              FULL BACK
            </button>
          </div>

          {/* Garment Silhouette Indicator */}
          <div className="flex items-center gap-2 rounded bg-[#090A0D]/90 px-2.5 py-1.5 border border-border/80 backdrop-blur text-[11px] text-zinc-300">
            <Shirt className="h-3.5 w-3.5 text-brand-volt" />
            <span className="font-bold uppercase text-white truncate max-w-[160px]">
              {currentGarment.shortName}
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">
              (${currentGarment.baseCostUSD.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Top-Right: Camera Presets & View Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded bg-[#090A0D]/90 p-1.5 border border-border backdrop-blur shadow-xl font-mono text-xs pointer-events-auto">
          <button
            onClick={() => setCameraAngle('hero')}
            className={`rounded px-2.5 py-1 text-[10px] uppercase font-bold transition-all ${
              cameraAngle === 'hero'
                ? 'bg-brand-volt text-black'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
            title="Front Hero View"
          >
            Front
          </button>
          <button
            onClick={() => setCameraAngle('isometric')}
            className={`rounded px-2.5 py-1 text-[10px] uppercase font-bold transition-all ${
              cameraAngle === 'isometric'
                ? 'bg-brand-volt text-black'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
            title="45° Angle View"
          >
            45°
          </button>
          <button
            onClick={() => setCameraAngle('back')}
            className={`rounded px-2.5 py-1 text-[10px] uppercase font-bold transition-all ${
              cameraAngle === 'back'
                ? 'bg-brand-volt text-black'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
            title="Back View"
          >
            Back
          </button>
          <button
            onClick={() => setCameraAngle('macro')}
            className={`rounded px-2.5 py-1 text-[10px] uppercase font-bold transition-all ${
              cameraAngle === 'macro'
                ? 'bg-brand-volt text-black'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
            title="Close-Up Graphic"
          >
            Zoom
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          {/* 3D Stage Background Model Switcher */}
          <select
            value={backgroundModel}
            onChange={(e) => setBackgroundModel(e.target.value as any)}
            className="rounded bg-[#07080A] border border-border px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none focus:border-brand-volt cursor-pointer"
            title="3D Background Stage Model"
          >
            <option value="podium">Stage: Podium</option>
            <option value="studio_cyc">Stage: Cyc Wall</option>
            <option value="mannequin">Stage: Mannequin</option>
            <option value="concrete_runway">Stage: Runway</option>
            <option value="neon_gallery">Stage: Neon Pillars</option>
            <option value="none">Stage: Floating</option>
          </select>

          <div className="h-4 w-[1px] bg-border mx-1" />

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`rounded p-1.5 transition-all ${
              autoRotate ? 'bg-brand-volt text-black' : 'text-zinc-400 hover:text-white'
            }`}
            title={autoRotate ? 'Stop 360° Rotation' : 'Start 360° Turntable Rotation'}
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Floating In-3D Decal & Artwork Manipulation HUD (When a layer is selected) */}
        {selectedLayer && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded bg-[#090A0D]/95 px-3 py-2 border border-brand-volt shadow-2xl backdrop-blur font-mono text-xs pointer-events-auto">
            {/* Layer Info */}
            <div className="flex items-center gap-2 border-r border-zinc-700 pr-2 mr-1">
              <span className="h-2 w-2 rounded-full bg-brand-volt animate-pulse" />
              <div className="text-[10px] leading-tight">
                <span className="font-bold text-white block truncate max-w-[120px]">
                  {selectedLayer.name}
                </span>
                <span className="text-zinc-500 text-[9px] uppercase">
                  3D Decal ({activeSurface})
                </span>
              </div>
            </div>

            {/* 4-Way Slide Nudge Controls on 3D Surface */}
            <div className="flex items-center gap-1 border-r border-zinc-700 pr-2">
              <button
                onClick={() => nudgeLayer(selectedLayer.id, -3, 0)}
                className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
                title="Slide Left on 3D Cloth"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => nudgeLayer(selectedLayer.id, 0, -3)}
                className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
                title="Slide Up on 3D Cloth"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => nudgeLayer(selectedLayer.id, 0, 3)}
                className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
                title="Slide Down on 3D Cloth"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => nudgeLayer(selectedLayer.id, 3, 0)}
                className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
                title="Slide Right on 3D Cloth"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Center Graphic on 3D Mesh */}
            <button
              onClick={() => centerLayer(selectedLayer.id, 'both')}
              className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
              title="Center Decal on 3D Chest"
            >
              <Crosshair className="h-3.5 w-3.5" />
            </button>

            {/* Scale Decal Size on 3D Mesh */}
            <div className="flex items-center gap-0.5 border-r border-zinc-700 pr-2">
              <button
                onClick={() => scaleLayer(selectedLayer.id, -5)}
                className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
                title="Scale Decal Smaller (-5%)"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => scaleLayer(selectedLayer.id, 5)}
                className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
                title="Scale Decal Larger (+5%)"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Rotate Decal on 3D Mesh */}
            <button
              onClick={() => rotateLayer(selectedLayer.id, 15)}
              className="rounded p-1 text-zinc-300 hover:bg-surface hover:text-brand-volt"
              title="Rotate Decal (+15°)"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>

            {/* Delete Decal */}
            <button
              onClick={() => deleteLayer(selectedLayer.id)}
              className="rounded p-1 text-red-400 hover:bg-red-500/20"
              title="Delete Graphic"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Bottom Bar: Direct 3D Add Tools & Cloth Customizer */}
        <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          {/* Quick Add Design directly in 3D */}
          <div className="flex items-center gap-1.5 rounded bg-[#090A0D]/95 p-1.5 border border-border backdrop-blur shadow-xl font-mono text-xs">
            <span className="text-[10px] uppercase text-zinc-500 px-1 hidden sm:inline">
              Add to 3D:
            </span>

            {/* Add Text Graphic in 3D */}
            <button
              onClick={() => {
                addTextLayer({ text: 'STREET WEAR 2026' });
                toast.success(`Added 3D text to ${activeSurface}`);
              }}
              className="flex items-center gap-1 rounded bg-brand-volt/15 border border-brand-volt/40 px-2.5 py-1 text-[11px] font-bold text-brand-volt hover:bg-brand-volt hover:text-black transition-all"
            >
              <Type className="h-3.5 w-3.5" />
              <span>+ Text</span>
            </button>

            {/* Upload Graphic in 3D */}
            <label className="flex items-center gap-1 rounded bg-surface border border-border px-2.5 py-1 text-[11px] font-semibold text-zinc-200 hover:text-white hover:border-zinc-500 cursor-pointer transition-all">
              <Upload className="h-3.5 w-3.5 text-brand-volt" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handle3DUpload}
                className="hidden"
              />
            </label>

            {/* Quick Decal Presets */}
            {QUICK_3D_DECALS.map((decal, i) => (
              <button
                key={i}
                onClick={() => {
                  addImageLayer(decal.svg, decal.width, decal.height, decal.name);
                  toast.success(`Placed ${decal.name} in 3D`);
                }}
                className="hidden md:flex items-center gap-1 rounded bg-surface/60 border border-border/80 px-2 py-1 text-[10px] text-zinc-300 hover:text-white hover:border-brand-volt transition-colors"
                title={`Add ${decal.name} to 3D`}
              >
                <Sparkles className="h-3 w-3 text-brand-volt" />
                <span>{decal.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Garment Fabric Color Swatches in 3D */}
          <div className="flex items-center gap-1.5 rounded bg-[#090A0D]/95 p-1.5 border border-border backdrop-blur shadow-xl font-mono text-xs">
            <span className="text-[10px] uppercase text-zinc-500 px-1 hidden sm:inline">
              Fabric Color:
            </span>
            <div className="flex items-center gap-1">
              {APPAREL_COLOR_PRESETS.slice(0, 7).map((color) => {
                const isSelected = project.garmentColor === color.hex;
                return (
                  <button
                    key={color.hex}
                    onClick={() => setGarmentColor(color.hex)}
                    title={color.name}
                    className={`h-5 w-5 rounded-sm border transition-transform ${
                      isSelected
                        ? 'scale-125 border-brand-volt ring-2 ring-brand-volt/50'
                        : 'border-zinc-700 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
