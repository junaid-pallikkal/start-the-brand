'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Eye, Heart, Layers, ArrowUpRight, Filter, Search, Shirt } from 'lucide-react';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';

interface DropItem {
  id: string;
  title: string;
  creator: string;
  brand: string;
  garmentName: string;
  category: string;
  colorHex: string;
  likes: number;
  views: number;
  retailPrice: number;
  tags: string[];
}

const COMMUNITY_DROPS: DropItem[] = [
  {
    id: 'drop-01',
    title: 'CYBER-CORE HEAVYWEIGHT OVERSIZED TEE',
    creator: 'kurt_studio',
    brand: 'ATELIER ZERO',
    garmentName: 'Oversized Boxy Heavyweight T-Shirt',
    category: 'OVERSIZED_TEE',
    colorHex: '#0B0B0D',
    likes: 142,
    views: 890,
    retailPrice: 58.00,
    tags: ['cyberpunk', 'boxy', '280gsm', 'streetwear'],
  },
  {
    id: 'drop-02',
    title: 'TACTICAL ARTICULATED CARGO PANTS',
    creator: 'tech_wear_tokyo',
    brand: 'SYSTEM 09',
    garmentName: 'Tactical Wide-Leg Streetwear Cargo Pants',
    category: 'WIDE_LEG_CARGO_PANTS',
    colorHex: '#1F2023',
    likes: 219,
    views: 1240,
    retailPrice: 110.00,
    tags: ['tactical', 'ripstop', 'wide-leg', 'cargos'],
  },
  {
    id: 'drop-03',
    title: 'CROSS-GRAIN HEAVY FLEECE HOODIE',
    creator: 'marcus_raw',
    brand: 'RAW ARCHIVE',
    garmentName: 'Heavyweight Fleece Streetwear Hoodie',
    category: 'HEAVYWEIGHT_HOODIE',
    colorHex: '#3E2723',
    likes: 308,
    views: 1670,
    retailPrice: 95.00,
    tags: ['450gsm', 'fleece', 'earthtone', 'streetwear'],
  },
  {
    id: 'drop-04',
    title: 'RETRO 90S MESH TOURNAMENT JERSEY',
    creator: 'courtside_nyc',
    brand: 'EAST RIVER ATHLETICS',
    garmentName: 'Retro Mesh Basketball Jersey',
    category: 'BASKETBALL_JERSEY',
    colorHex: '#1E40AF',
    likes: 98,
    views: 650,
    retailPrice: 65.00,
    tags: ['vintage', 'mesh', 'basketball', 'sportswear'],
  },
  {
    id: 'drop-05',
    title: 'VINTAGE STONE WASH 14OZ DENIM',
    creator: 'denim_craft',
    brand: 'LOOM & WEAVE',
    garmentName: 'Relaxed Fit 14oz Washed Denim Jeans',
    category: 'RELAXED_DENIM_JEANS',
    colorHex: '#587394',
    likes: 184,
    views: 940,
    retailPrice: 130.00,
    tags: ['14oz', 'selvedge', 'stonewash', 'denim'],
  },
  {
    id: 'drop-06',
    title: 'BRUTALIST TERROR CREWNECK FLEECE',
    creator: 'berlin_sub',
    brand: 'NOISE SECTOR',
    garmentName: 'Relaxed Crewneck Fleece Sweatshirt',
    category: 'CREWNECK_SWEATSHIRT',
    colorHex: '#34373E',
    likes: 165,
    views: 820,
    retailPrice: 85.00,
    tags: ['brutalist', 'frenchterry', 'minimal', 'monochrome'],
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredDrops = COMMUNITY_DROPS.filter((drop) => {
    const matchesSearch =
      drop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drop.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drop.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'ALL' || drop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-brand-volt mb-2">
              COMMUNITY SHOWROOM
            </div>
            <h1 className="font-mono text-3xl sm:text-4xl font-black text-white uppercase">
              Explore Streetwear Drops & 3D Silhouettes
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Inspect apparel drops created with StartTheBrand. View real 3D draping, examine graphic placement, and remix into your own project.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/studio/default"
              className="inline-flex items-center gap-2 rounded-sm bg-brand-volt px-4 py-2 font-mono text-xs font-bold text-black hover:bg-brand-volt/90"
            >
              <span>CREATE YOUR DROP</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 font-mono text-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by drop title, brand, or tag (e.g. 450gsm, tactical, cargos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-border bg-[#0C0D10] py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:border-brand-volt focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'OVERSIZED_TEE', 'HEAVYWEIGHT_HOODIE', 'WIDE_LEG_CARGO_PANTS', 'RELAXED_DENIM_JEANS', 'BASKETBALL_JERSEY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-sm px-3 py-2 text-xs transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-brand-volt text-black font-bold'
                    : 'bg-surface text-zinc-400 hover:text-white border border-border'
                }`}
              >
                {cat === 'ALL' ? 'ALL BLANKS' : cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Drops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          {filteredDrops.map((drop) => (
            <div
              key={drop.id}
              className="group rounded-sm border border-border bg-[#0C0D10] overflow-hidden hover:border-zinc-500 transition-all flex flex-col justify-between"
            >
              {/* Garment Visual Header */}
              <div
                className="relative h-64 p-6 flex flex-col justify-between transition-colors duration-200"
                style={{ backgroundColor: drop.colorHex }}
              >
                <div className="flex justify-between items-center text-[10px] text-zinc-300">
                  <span className="rounded bg-black/60 px-2 py-0.5 uppercase tracking-wider backdrop-blur-sm">
                    {drop.brand}
                  </span>
                  <span className="rounded bg-black/60 px-2 py-0.5 text-brand-volt font-bold backdrop-blur-sm">
                    ${drop.retailPrice.toFixed(2)} USD
                  </span>
                </div>

                {/* Graphic Decal Mock */}
                <div className="mx-auto flex flex-col items-center justify-center border border-white/20 bg-black/70 p-4 rounded backdrop-blur-sm shadow-xl text-center">
                  <span className="text-xs font-black tracking-widest text-brand-volt uppercase">
                    {drop.brand}
                  </span>
                  <span className="text-[9px] text-zinc-300 tracking-wider mt-0.5">
                    SPEC // DROP 2026
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-400">
                  <span className="rounded bg-black/50 px-2 py-0.5">
                    {drop.garmentName}
                  </span>
                  <span className="text-white font-bold">PBR TEXTURED</span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase group-hover:text-brand-volt transition-colors">
                    {drop.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
                    <span>By @{drop.creator}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {drop.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-surface px-2 py-0.5 text-[10px] text-zinc-400 border border-border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" /> {drop.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {drop.views}
                    </span>
                  </div>

                  <Link
                    href={`/mockups?drop=${drop.id}`}
                    className="flex items-center gap-1 text-brand-volt font-bold hover:underline"
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span>3D INSPECT</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
