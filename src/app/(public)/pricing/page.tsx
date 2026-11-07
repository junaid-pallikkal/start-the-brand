import Link from 'next/link';
import { Check, ArrowRight, Sparkles, Shield, Terminal } from 'lucide-react';

export default function PricingPage() {
  const currentFeatures = [
    'Unlimited 2D Multi-Surface Apparel Design',
    'Full 3D Garment Viewport & PBR Shader Inspector',
    'All 10 Streetwear Blanks (Tees, Hoodies, Cargo Pants, Jeans, Shorts, Socks)',
    '360° Continuous Turntable Video Generation (9:16 & 1:1)',
    'MaxRects DTF Gang Sheet Builder (22" & 24" rolls)',
    'Screenprint Halftone, 1-bit Threshold & Knockout Color Filters',
    '300 DPI High-Resolution Print-Ready PNG Exports',
    'Unit Economics & Profit Margin Calculator',
    'Local-First IndexedDB Auto-Save (Zero Data Loss)',
    'Zero AI Credit Paywalls or Artificial Feature Locks',
  ];

  const roadmapProFeatures = [
    'Direct 1-Click Shopify & Etsy Product Publishing',
    'Automated Print-on-Demand Order Fulfillment Webhooks',
    'Vector Cut-and-Sew Factory Tech Pack PDF Generator',
    'Private Team Brand Workspaces & Collaboration',
    'Cloud Asset Backup & Synchronized Multi-Device Storage',
  ];

  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-volt mb-2">
            FREE INITIAL ACCESS POLICY
          </div>
          <h1 className="font-mono text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Transparent Access For Independent Creators
          </h1>
          <p className="mt-4 text-sm text-zinc-400 font-normal leading-relaxed">
            All creative tools, 3D visualization, print utilities, and gang sheet builders are 100% free to use. No hidden credit systems, paywalls, or feature locks.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
          {/* Current Free Plan */}
          <div className="rounded-sm border-2 border-brand-volt bg-[#0C0D10] p-8 flex flex-col justify-between relative shadow-xl shadow-brand-volt/5">
            <div className="absolute top-0 right-8 -translate-y-1/2 rounded bg-brand-volt px-3 py-1 text-[10px] font-bold text-black uppercase tracking-wider">
              ACTIVE LAUNCH TIER
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase">CREATOR ACCESS</h3>
                  <p className="text-xs text-zinc-400 mt-1">Full apparel design & production platform</p>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-brand-volt">$0</span>
                <span className="text-xs text-zinc-500 uppercase">/ PERPETUAL FREE ACCESS</span>
              </div>

              <div className="mt-8 space-y-3 text-xs">
                {currentFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-zinc-300">
                    <Check className="h-4 w-4 text-brand-volt flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-border">
              <Link
                href="/studio/default"
                className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-3.5 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md"
              >
                <span>OPEN STUDIO NOW</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Future Pro Roadmap */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase">PRO & AUTOMATION</h3>
                  <p className="text-xs text-zinc-400 mt-1">Future e-commerce & factory pipeline</p>
                </div>
                <span className="rounded bg-surface px-2.5 py-1 text-[10px] text-zinc-400 border border-border">
                  ROADMAP
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">FUTURE</span>
                <span className="text-xs text-zinc-500 uppercase">/ OPTIONAL SERVICES</span>
              </div>

              <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed">
                When introduced, core design and print tools will always remain free. Paid tiers will only cover high-volume automated store sync and factory fulfillment APIs.
              </p>

              <div className="mt-6 space-y-3 text-xs text-zinc-400">
                {roadmapProFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-border font-mono text-[11px] text-zinc-500 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-brand-volt" />
              <span>Modular architecture ready for future API expansion.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
