'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shirt,
  Box,
  RotateCw,
  Printer,
  Sparkles,
  TrendingUp,
  Layers,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { APPAREL_COLOR_PRESETS } from '@/constants/color-presets';

export default function HomePage() {
  const [selectedGarmentIndex, setSelectedGarmentIndex] = useState(0);
  const [activeColorHex, setActiveColorHex] = useState('#0B0B0D');
  const activeGarment = DEFAULT_GARMENTS[selectedGarmentIndex];

  return (
    <div className="relative min-h-screen">
      {/* Background Grid Pattern & Ambient Streetwear Glow */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
      <div className="pointer-events-none absolute inset-0 radial-glow" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-volt/40 bg-brand-volt/10 px-3.5 py-1 text-[11px] font-mono font-semibold tracking-wider text-brand-volt mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-volt animate-ping" />
            STARTTHEBRAND // APPAREL OPERATING SYSTEM
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl font-mono text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.08]">
            ENGINEER YOUR <br />
            <span className="text-brand-volt underline decoration-brand-volt/40 decoration-4 underline-offset-8">
              STREETWEAR BRAND
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            The unified design studio for modern apparel founders. Place graphics across multi-surface 2D canvases, visualize in real-time 3D PBR drape, prepare 300 DPI DTF gang sheets, and calculate exact production profit margins.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <Link
              href="/studio/default"
              className="flex items-center gap-2 rounded-sm bg-brand-volt px-6 py-3.5 font-bold text-black transition-all hover:bg-brand-volt/90 hover:scale-[1.02] shadow-lg shadow-brand-volt/20"
            >
              <span>LAUNCH DESIGN STUDIO</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>

            <Link
              href="/mockups"
              className="flex items-center gap-2 rounded-sm border border-border bg-surface px-6 py-3.5 font-semibold text-white transition-all hover:border-zinc-500 hover:bg-surface/80"
            >
              <Box className="h-4 w-4 text-brand-volt" />
              <span>EXPLORE 3D SILHOUETTES</span>
            </Link>
          </div>

          {/* Industrial Metric Badges */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-left w-full max-w-3xl border border-border/80 bg-surface/50 p-4 rounded-sm backdrop-blur-sm">
            <div className="border-r border-border/60 pr-4">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Garment Blanks</div>
              <div className="text-xl font-black text-white mt-1">10 MODELS</div>
              <div className="text-[10px] text-brand-volt">Tees, Hoodies & Pants</div>
            </div>
            <div className="border-r border-border/60 pr-4">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">3D Precision</div>
              <div className="text-xl font-black text-white mt-1">60 FPS PBR</div>
              <div className="text-[10px] text-emerald-400">Live UV Canvas Sync</div>
            </div>
            <div className="border-r border-border/60 pr-4">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Print Utilities</div>
              <div className="text-xl font-black text-white mt-1">MAXRECTS</div>
              <div className="text-[10px] text-orange-400">22" & 24" Gang Sheets</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Access Model</div>
              <div className="text-xl font-black text-brand-volt mt-1">100% FREE</div>
              <div className="text-[10px] text-zinc-400">Zero Paywalls / No Locks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Garment & 3D Silhouettes Showcase */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-brand-volt mb-2">
              AUTHENTIC APPAREL BLANKS
            </div>
            <h2 className="font-mono text-2xl sm:text-3xl font-black text-white uppercase">
              7 Silhouettes + 3 Technical Pants Styles
            </h2>
          </div>
          <p className="mt-2 md:mt-0 font-mono text-xs text-zinc-400 max-w-md">
            Engineered with drop-shoulder silhouettes, 450 GSM heavyweight fleece textures, and technical pocket geometries.
          </p>
        </div>

        {/* Interactive Garment Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-sm border border-border bg-[#0C0D10] p-6">
          {/* Garment Selector Tabs */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Select Silhouette Blanks
              </span>
              <div className="mt-3 space-y-1.5 max-h-[380px] overflow-y-auto pr-2">
                {DEFAULT_GARMENTS.map((garment, idx) => {
                  const isSelected = idx === selectedGarmentIndex;
                  return (
                    <button
                      key={garment.id}
                      onClick={() => setSelectedGarmentIndex(idx)}
                      className={`w-full text-left rounded-sm px-3.5 py-2.5 font-mono text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-volt text-black font-bold shadow-md'
                          : 'bg-surface/60 text-zinc-300 hover:bg-surface hover:text-white border border-border/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Shirt className={`h-3.5 w-3.5 ${isSelected ? 'stroke-[2.5]' : 'text-zinc-500'}`} />
                        <span>{garment.shortName}</span>
                      </div>
                      <span className={`text-[10px] ${isSelected ? 'text-black/80 font-bold' : 'text-zinc-500'}`}>
                        ${garment.baseCostUSD.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Color Swatches */}
            <div className="border-t border-border pt-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">
                Color Preset: <span className="text-white">{APPAREL_COLOR_PRESETS.find(c => c.hex === activeColorHex)?.name}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {APPAREL_COLOR_PRESETS.slice(0, 10).map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setActiveColorHex(color.hex)}
                    title={color.name}
                    className={`h-6 w-6 rounded-sm border transition-transform ${
                      activeColorHex === color.hex ? 'scale-110 border-brand-volt ring-2 ring-brand-volt/40' : 'border-zinc-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Garment View Stage */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-sm border border-border bg-[#07080A] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-white uppercase">{activeGarment.name}</span>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">{activeGarment.description}</p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="rounded bg-surface px-2.5 py-1 text-brand-volt border border-border font-bold">
                  BASE: ${activeGarment.baseCostUSD.toFixed(2)}
                </span>
                <Link
                  href="/mockups"
                  className="flex items-center gap-1 rounded bg-brand-volt px-2.5 py-1 text-black font-bold hover:bg-brand-volt/90 transition-colors"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>INSPECT 3D</span>
                </Link>
              </div>
            </div>

            {/* Garment Graphic Visualizer */}
            <div className="my-8 flex flex-col items-center justify-center relative min-h-[300px]">
              {/* Silhouette Vector Representation */}
              <div
                className="relative flex items-center justify-center rounded-lg p-10 border border-border/80 shadow-2xl transition-colors duration-300"
                style={{ backgroundColor: activeColorHex }}
              >
                {/* Visual Garment Wireframe / Cutout */}
                <div className="flex flex-col items-center justify-center w-64 h-64 border border-dashed border-zinc-600/60 rounded p-4 relative">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 absolute top-2 left-2">
                    {activeGarment.uvZones.FRONT.printableAreaInches.width}" × {activeGarment.uvZones.FRONT.printableAreaInches.height}" PRINT ZONE
                  </span>

                  {/* Artwork Preview Mock */}
                  <div className="flex flex-col items-center justify-center border border-brand-volt/60 bg-black/60 backdrop-blur-sm p-4 rounded-sm">
                    <span className="font-mono text-xs font-black tracking-widest text-brand-volt">
                      STARTTHEBRAND
                    </span>
                    <span className="font-mono text-[9px] text-white/80 mt-1">
                      ATELIER SPEC 2026
                    </span>
                    <div className="h-[2px] w-12 bg-brand-volt mt-2" />
                  </div>

                  <span className="font-mono text-[9px] text-zinc-500 absolute bottom-2 right-2">
                    UV: 2048 × 2048
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Actions */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 font-mono text-xs">
              <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
                <span>Surfaces: Front, Back, Left, Right</span>
                <span>•</span>
                <span>Fabric: Ring-spun Heavyweight Cotton</span>
              </div>
              <Link
                href={`/studio/new?garment=${activeGarment.id}&color=${encodeURIComponent(activeColorHex)}`}
                className="flex items-center gap-1.5 text-brand-volt hover:underline font-bold"
              >
                <span>OPEN IN 2D STUDIO</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Suites */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-border">
        <div className="text-center mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-volt mb-2">
            INTEGRATED PRODUCTION STACK
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-black text-white uppercase">
            Everything Required To Launch A Label
          </h2>
          <p className="mt-3 font-mono text-xs text-zinc-400 max-w-xl mx-auto">
            Replacing expensive patchwork subscriptions (Illustrator + Clo3D + Gang Sheet Software + Spreadsheets) with a single, lightning-fast platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          {/* Feature 1: 2D Studio */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 hover:border-brand-volt/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white uppercase">2D CAD Apparel Studio</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Precision multi-surface placement for chest, back, and sleeves. Curated streetwear typography presets, artwork import, and linear history with instant undo/redo.
            </p>
            <Link href="/studio/default" className="mt-4 inline-flex items-center gap-1 text-xs text-brand-volt font-bold hover:underline">
              Launch Studio <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Feature 2: 3D Engine */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 hover:border-brand-volt/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border">
              <Box className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white uppercase">Real-Time 3D PBR Garments</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Three.js & React Three Fiber apparel viewer. Dynamic UV texture decals reflect 2D canvas edits at 60fps. Studio lighting presets and 4K mockup generation.
            </p>
            <Link href="/mockups" className="mt-4 inline-flex items-center gap-1 text-xs text-brand-volt font-bold hover:underline">
              Inspect 3D Models <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Feature 3: Turntable Motion */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 hover:border-brand-volt/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border">
              <RotateCw className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white uppercase">360° Turntable Video</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Browser-based canvas video recorder. Capture seamless rotational loops in 9:16 vertical (Instagram Reels / TikTok) and 1:1 square with zero cloud rendering wait times.
            </p>
            <Link href="/motion" className="mt-4 inline-flex items-center gap-1 text-xs text-brand-volt font-bold hover:underline">
              Record Video <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Feature 4: DTF Gang Sheet */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 hover:border-brand-volt/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border">
              <Printer className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white uppercase">DTF Gang Sheet Builder</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              MaxRects 2D bin packing algorithm. Automatically nests multiple graphics on commercial 22" and 24" rolls. Calculates exact material utilization and prevents collisions.
            </p>
            <Link href="/production" className="mt-4 inline-flex items-center gap-1 text-xs text-brand-volt font-bold hover:underline">
              Build Gang Sheet <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Feature 5: Print Filters */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 hover:border-brand-volt/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border">
              <Sliders className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white uppercase">Halftone & Knockout Color</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Parametric halftone dot matrix converter for screen printing. 1-bit threshold film positives. Euclidean delta background color remover to preserve soft garment hand-feel.
            </p>
            <Link href="/production" className="mt-4 inline-flex items-center gap-1 text-xs text-brand-volt font-bold hover:underline">
              Open Print Suite <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Feature 6: Merch Economics */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 hover:border-brand-volt/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white uppercase">Unit Economics Calculator</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Live profit margin analysis. Factor blank garment costs, print methods, polymailers, and transaction fees. Size run matrix (XS-3XL) and seasonal drop collection organizer.
            </p>
            <Link href="/products" className="mt-4 inline-flex items-center gap-1 text-xs text-brand-volt font-bold hover:underline">
              Calculate Margins <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative rounded-sm border border-brand-volt/40 bg-gradient-to-r from-[#121316] via-[#15181E] to-[#121316] p-8 sm:p-12 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 radial-glow" />
          <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase">
            Start Designing Immediately. Zero Barrier To Entry.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Full client-side persistence via Dexie IndexedDB. No mandatory cloud sign-up to test or export 300 DPI apparel graphics.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 font-mono text-xs">
            <Link
              href="/studio/default"
              className="rounded-sm bg-brand-volt px-8 py-3.5 font-bold text-black transition-all hover:bg-brand-volt/90 shadow-md shadow-brand-volt/20"
            >
              LAUNCH FREE STUDIO
            </Link>
            <Link
              href="/dashboard"
              className="rounded-sm border border-border bg-surface px-8 py-3.5 font-bold text-white transition-all hover:border-zinc-500"
            >
              ACCESS DASHBOARD
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
