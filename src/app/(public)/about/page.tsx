import Link from 'next/link';
import { Shirt, Terminal, Zap, Shield, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-volt mb-2">
            FOUNDER MANIFESTO
          </div>
          <h1 className="font-mono text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Built For Independent Apparel Founders
          </h1>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed font-sans">
            StartTheBrand was created to eliminate the unnecessary technical and financial friction of launching an apparel label.
          </p>
        </div>

        {/* Manifesto Content */}
        <div className="space-y-8 font-sans text-sm text-zinc-300 leading-relaxed">
          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 sm:p-8 font-mono">
            <h2 className="text-sm font-bold text-brand-volt uppercase tracking-wider mb-3">
              01 // The Problem with Legacy Apparel Tools
            </h2>
            <p className="font-sans text-zinc-300 text-sm leading-relaxed">
              For years, independent clothing designers have been forced to juggle disjointed and costly tools: paying \$60/month for Adobe Creative Cloud, hundreds for 3D garment simulation software like Clo3D, separate DTF gang sheet nesting tools, and complex spreadsheets just to know if their t-shirt makes a profit. Most mockups were flat, static Photoshop templates that didn't accurately show how ink wraps around fabric in physical space.
            </p>
          </div>

          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 sm:p-8 font-mono">
            <h2 className="text-sm font-bold text-brand-volt uppercase tracking-wider mb-3">
              02 // The StartTheBrand Solution
            </h2>
            <p className="font-sans text-zinc-300 text-sm leading-relaxed">
              We engineered a unified platform combining precision 2D graphic placement, real-time 3D PBR WebGL visualization at 60fps, 360° social video recording, mathematical 2D bin packing for commercial gang sheets, and automated unit economics calculations. Every feature runs client-side in modern web standards with zero paywalls.
            </p>
          </div>

          <div className="rounded-sm border border-border bg-[#0C0D10] p-6 sm:p-8 font-mono">
            <h2 className="text-sm font-bold text-brand-volt uppercase tracking-wider mb-3">
              03 // Real Streetwear Silhouettes
            </h2>
            <p className="font-sans text-zinc-300 text-sm leading-relaxed">
              Standard mockups are usually generic slim-fit t-shirts that look nothing like authentic streetwear. StartTheBrand provides 10 core streetwear blanks: oversized boxy tees with drop shoulders, 450 GSM cross-grain hoodies, tactical wide-leg cargo pants, relaxed fleece joggers, and vintage stone-washed denim jeans with true-to-life fabric textures.
            </p>
          </div>

          {/* Technical Architecture Specs */}
          <div className="rounded-sm border border-border/80 bg-[#07080A] p-6 font-mono text-xs">
            <h3 className="text-white font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-brand-volt" />
              Engineering Foundations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-400">
              <div>
                <span className="text-white font-bold">Framework:</span> Next.js 15 & React 19
              </div>
              <div>
                <span className="text-white font-bold">3D Engine:</span> Three.js, R3F & Drei
              </div>
              <div>
                <span className="text-white font-bold">Storage:</span> Dexie IndexedDB (Local-First)
              </div>
              <div>
                <span className="text-white font-bold">Packing:</span> MaxRects 2D Bin Packing
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-center">
            <Link
              href="/studio/default"
              className="inline-flex items-center gap-2 rounded-sm bg-brand-volt px-8 py-3.5 font-mono text-xs font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
            >
              <span>LAUNCH YOUR BRAND TODAY</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
