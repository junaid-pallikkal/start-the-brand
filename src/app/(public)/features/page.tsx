import Link from 'next/link';
import {
  Layers,
  Box,
  RotateCw,
  Printer,
  TrendingUp,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      id: '2d-studio',
      category: '2D CREATIVE CAD',
      title: 'Multi-Surface 2D Apparel Studio',
      description:
        'A dedicated vector and raster placement workstation built specifically for garment geometry. Switch seamlessly between Front chest, Full Back, Left Sleeve, and Right Sleeve with independent coordinates and preserved layer hierarchies.',
      highlights: [
        'Multi-surface coordinate matrices with garment contour guides',
        'Curated streetwear typographic engine with kerning & letterspacing',
        'PNG, JPG, and vector SVG upload support with alpha channel preservation',
        'Linear history stack with Ctrl+Z undo and Ctrl+Y redo',
        'Automatic debounced 2048x2048 offscreen texture map rendering',
      ],
      linkText: 'Open 2D Studio',
      linkHref: '/studio/default',
      icon: Layers,
    },
    {
      id: '3d-engine',
      category: '3D PBR REALTIME',
      title: 'Three.js & React Three Fiber Garment Viewport',
      description:
        'Inspect how graphics wrap across physical garment fabric in real-time. Procedural cloth weaves (combed cotton, French terry, athletic mesh) react to multi-angle studio lighting and cinematic camera presets at 60fps.',
      highlights: [
        '10 streetwear silhouettes: Oversized Tee, Hoodie, Sweatpants, Cargo Pants, Denim, etc.',
        'Cloth PBR roughness, normal weave mapping, and Fresnel sheen effects',
        'Dynamic UV texture mapping binds 2D artwork to 3D meshes without page refresh',
        'Studio Clean, Obsidian Dark, Urban Sunlight, and Minimal Gray lighting presets',
        'Super-sampled 4K PNG mockup exports with transparent background option',
      ],
      linkText: 'Launch 3D Viewport',
      linkHref: '/mockups',
      icon: Box,
    },
    {
      id: 'production-suite',
      category: 'PRINT PRODUCTION',
      title: 'Screenprint & DTF Gang Sheet Preparation',
      description:
        'No more sending unverified files to print shops. Prepare graphics for high-volume Direct-to-Film (DTF) rolls or classic plastisol screen printing with mathematical precision.',
      highlights: [
        'MaxRects 2D bin packing algorithm for commercial 22" and 24" rolls',
        'Live material efficiency percentage calculation and overlap collision detection',
        'Parametric Halftone generator with customizable LPI frequency and angles',
        '1-bit Color Threshold filter for separation film positives',
        'Euclidean distance Knockout Color background eliminator to save garment ink',
      ],
      linkText: 'Explore Print Suite',
      linkHref: '/production',
      icon: Printer,
    },
    {
      id: 'motion-turntable',
      category: 'MOTION GRAPHICS',
      title: '360° Continuous Turntable Video Studio',
      description:
        'Generate viral social media video showcases directly in the browser. Uses canvas.captureStream() and MediaRecorder to render seamless rotational loops in 9:16 Reels and 1:1 format without third-party render queues.',
      highlights: [
        'Mathematical continuous 360° rotational loops with customizable RPM',
        'Client-side VP9 / H.264 video encoding directly from WebGL canvas',
        'Vertical 9:16 preset for TikTok / Instagram Reels, 1:1 for product listings',
        'Configurable 3s, 5s, and 10s loop duration with seamless start/end frames',
        'Zero cloud render delay or credit costs',
      ],
      linkText: 'Record Turntable Loop',
      linkHref: '/motion',
      icon: RotateCw,
    },
    {
      id: 'merch-economics',
      category: 'COMMERCE ENGINE',
      title: 'Unit Economics & Profit Margin Calculator',
      description:
        'Stop guessing apparel profitability. Calculate exact gross profit and profit margins per unit by factoring blank garment cost, print costs, packaging, shipping, and credit card gateway fees.',
      highlights: [
        'Real-time gross margin % and dollar profit calculations',
        'Multi-size SKU breakdown (XS through 3XL) and garment colorways',
        'Seasonal collection organizer with lookbook management',
        'Break-even unit volume estimation based on initial production runs',
        'Exportable manufacturing cost sheets for cut-and-sew vendors',
      ],
      linkText: 'Calculate Profit Margins',
      linkHref: '/products',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-volt mb-2">
            PLATFORM CAPABILITIES
          </div>
          <h1 className="font-mono text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Engineering Features For Modern Apparel Brands
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            From initial graphic sketch to 3D mockup render, DTF roll nesting, and unit economics—every step of the clothing brand lifecycle is integrated.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-12">
          {features.map((feature, idx) => (
            <div
              key={feature.id}
              className="rounded-sm border border-border bg-[#0C0D10] p-6 sm:p-8 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-brand-volt mb-2">
                    <feature.icon className="h-4 w-4" />
                    <span>{feature.category}</span>
                  </div>
                  <h2 className="font-mono text-2xl font-black text-white uppercase">
                    {feature.title}
                  </h2>
                  <p className="mt-3 text-sm text-zinc-300 leading-relaxed font-sans max-w-2xl">
                    {feature.description}
                  </p>

                  <div className="mt-6 space-y-2.5 font-mono text-xs text-zinc-400">
                    {feature.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-volt flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Link
                      href={feature.linkHref}
                      className="inline-flex items-center gap-2 rounded-sm bg-brand-volt px-5 py-2.5 font-mono text-xs font-bold text-black hover:bg-brand-volt/90 transition-all"
                    >
                      <span>{feature.linkText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Technical Metric Box */}
                <div className="lg:w-80 rounded-sm border border-border/80 bg-[#07080A] p-5 font-mono text-xs space-y-3 self-stretch flex flex-col justify-between">
                  <div className="border-b border-border/60 pb-3">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Engine Status</span>
                    <div className="text-white font-bold text-sm mt-0.5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      CLIENT-SIDE PRODUCTION
                    </div>
                  </div>
                  <div className="space-y-2 text-[11px] text-zinc-400">
                    <div className="flex justify-between">
                      <span>Compute:</span>
                      <span className="text-white">Browser WebGL/Canvas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Persistence:</span>
                      <span className="text-white">IndexedDB / Dexie</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span className="text-brand-volt">300 DPI Export</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/60 text-[10px] text-zinc-500">
                    Ready for commercial apparel manufacturing.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
