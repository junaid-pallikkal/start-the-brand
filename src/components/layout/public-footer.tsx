import Link from 'next/link';
import { Shirt, Terminal, Shield, Zap } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-[#07080A] py-16 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          {/* Brand Manifesto */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand-volt text-black">
                <Shirt className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="font-mono text-sm font-black tracking-wider">
                START<span className="text-brand-volt">THE</span>BRAND
              </span>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
              The high-performance apparel design suite engineered for streetwear founders, graphic artists, and print-on-demand pioneers. 2D graphics, realistic 3D PBR rendering, and screen-ready DTF print prep with zero paywalls.
            </p>
            <div className="mt-6 flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 text-brand-volt">
                <span className="h-2 w-2 rounded-full bg-brand-volt animate-pulse" />
                SYSTEM OPERATIONAL
              </span>
              <span>//</span>
              <span>FREE INITIAL ACCESS</span>
            </div>
          </div>

          {/* Platform Suite */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">Workspaces</h4>
            <ul className="mt-4 space-y-2 font-mono text-xs">
              <li><Link href="/studio/default" className="hover:text-brand-volt transition-colors">2D Design Studio</Link></li>
              <li><Link href="/mockups" className="hover:text-brand-volt transition-colors">3D PBR Garments</Link></li>
              <li><Link href="/motion" className="hover:text-brand-volt transition-colors">360° Turntable Video</Link></li>
              <li><Link href="/production" className="hover:text-brand-volt transition-colors">DTF Gang Sheet Builder</Link></li>
              <li><Link href="/production" className="hover:text-brand-volt transition-colors">Halftone & Knockout</Link></li>
              <li><Link href="/products" className="hover:text-brand-volt transition-colors">Profit Margin Calculator</Link></li>
            </ul>
          </div>

          {/* Garment Blanks */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">Garment Blanks</h4>
            <ul className="mt-4 space-y-2 font-mono text-xs">
              <li><Link href="/mockups" className="hover:text-brand-volt transition-colors">Oversized Boxy Tee</Link></li>
              <li><Link href="/mockups" className="hover:text-brand-volt transition-colors">Heavyweight Hoodie 450 GSM</Link></li>
              <li><Link href="/mockups" className="hover:text-brand-volt transition-colors">Tactical Cargo Pants</Link></li>
              <li><Link href="/mockups" className="hover:text-brand-volt transition-colors">Heavy Fleece Sweatpants</Link></li>
              <li><Link href="/mockups" className="hover:text-brand-volt transition-colors">14oz Washed Denim</Link></li>
              <li><Link href="/mockups" className="hover:text-brand-volt transition-colors">Retro Basketball Jersey</Link></li>
            </ul>
          </div>

          {/* Architecture & Legal */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">Platform Specs</h4>
            <ul className="mt-4 space-y-2 font-mono text-xs">
              <li className="flex items-center gap-1.5"><Terminal className="h-3 w-3 text-brand-volt" /> Next.js 15 & React 19</li>
              <li className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-brand-volt" /> WebGL & Three.js R3F</li>
              <li className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-brand-volt" /> Local-First Dexie DB</li>
              <li><Link href="/pricing" className="hover:text-brand-volt transition-colors">Pricing & Roadmap</Link></li>
              <li><Link href="/about" className="hover:text-brand-volt transition-colors">Founder Manifesto</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-border/40 pt-8 sm:flex-row font-mono text-[11px]">
          <p>© {new Date().getFullYear()} StartTheBrand. Crafted for independent apparel culture.</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <span className="text-zinc-500">Zero Paywalls</span>
            <span className="text-zinc-500">Zero AI Restrictions</span>
            <span className="text-zinc-500">Full 300 DPI Export</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
