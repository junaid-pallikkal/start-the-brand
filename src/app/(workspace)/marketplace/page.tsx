'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Box,
  Palette,
  Heart,
  Eye,
  ArrowUpRight,
  Filter,
  Shirt,
} from 'lucide-react';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';

interface MarketplaceItem {
  id: string;
  title: string;
  brand: string;
  creator: string;
  garmentCategory: string;
  colorHex: string;
  retailPrice: number;
  likes: number;
  views: number;
  tags: string[];
}

const MARKETPLACE_DROPS: MarketplaceItem[] = [
  {
    id: 'mkt-01',
    title: 'ATELIER ZERO // CYBER-CORE HEAVYWEIGHT TEE',
    brand: 'ATELIER ZERO',
    creator: 'kurt_studio',
    garmentCategory: 'OVERSIZED_TEE',
    colorHex: '#0B0B0D',
    retailPrice: 58.0,
    likes: 340,
    views: 1890,
    tags: ['cyberpunk', 'boxy', '280gsm', 'streetwear'],
  },
  {
    id: 'mkt-02',
    title: 'SYSTEM 09 // TACTICAL WIDE-LEG CARGO PANTS',
    brand: 'SYSTEM 09',
    creator: 'tech_wear_tokyo',
    garmentCategory: 'WIDE_LEG_CARGO_PANTS',
    colorHex: '#121316',
    retailPrice: 110.0,
    likes: 420,
    views: 2450,
    tags: ['ripstop', 'wide-leg', 'cargos', 'tactical'],
  },
  {
    id: 'mkt-03',
    title: 'RAW ARCHIVE // 450 GSM HEAVYWEIGHT HOODIE',
    brand: 'RAW ARCHIVE',
    creator: 'marcus_raw',
    garmentCategory: 'HEAVYWEIGHT_HOODIE',
    colorHex: '#3E2723',
    retailPrice: 95.0,
    likes: 512,
    views: 3100,
    tags: ['450gsm', 'cross-grain', 'earthtone', 'streetwear'],
  },
  {
    id: 'mkt-04',
    title: 'EAST RIVER // RETRO MESH BASKETBALL JERSEY',
    brand: 'EAST RIVER ATHLETICS',
    creator: 'courtside_nyc',
    garmentCategory: 'BASKETBALL_JERSEY',
    colorHex: '#1E40AF',
    retailPrice: 65.0,
    likes: 215,
    views: 1120,
    tags: ['vintage', 'mesh', 'basketball', 'sportswear'],
  },
  {
    id: 'mkt-05',
    title: 'LOOM & WEAVE // 14OZ STONE WASHED DENIM',
    brand: 'LOOM & WEAVE',
    creator: 'denim_craft',
    garmentCategory: 'RELAXED_DENIM_JEANS',
    colorHex: '#587394',
    retailPrice: 130.0,
    likes: 298,
    views: 1640,
    tags: ['14oz', 'selvedge', 'stonewash', 'denim'],
  },
  {
    id: 'mkt-06',
    title: 'NOISE SECTOR // BRUTALIST CREWNECK FLEECE',
    brand: 'NOISE SECTOR',
    creator: 'berlin_sub',
    garmentCategory: 'CREWNECK_SWEATSHIRT',
    colorHex: '#34373E',
    retailPrice: 85.0,
    likes: 240,
    views: 1380,
    tags: ['brutalist', 'frenchterry', 'minimal', 'monochrome'],
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeModalDrop, setActiveModalDrop] = useState<MarketplaceItem | null>(null);

  const filtered = MARKETPLACE_DROPS.filter((drop) => {
    const matchesQuery =
      drop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drop.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drop.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedCategory === 'ALL' || drop.garmentCategory === selectedCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-volt mb-1 font-bold uppercase tracking-wider">
            <Compass className="h-4 w-4" />
            <span>COMMUNITY SHOWCASE</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Streetwear Marketplace & Drops
          </h1>
          <p className="text-zinc-400 font-sans text-xs mt-1">
            Explore apparel drops created by independent designers worldwide. Inspect 3D drape and remix graphics.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search drops, brands, silhouettes, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-sm border border-border bg-[#0C0D10] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:border-brand-volt focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'OVERSIZED_TEE', 'HEAVYWEIGHT_HOODIE', 'WIDE_LEG_CARGO_PANTS', 'RELAXED_DENIM_JEANS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-sm px-3 py-2 text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-volt text-black font-bold'
                  : 'bg-surface text-zinc-400 hover:text-white border border-border'
              }`}
            >
              {cat === 'ALL' ? 'ALL DROPS' : cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Drops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((drop) => {
          const garment =
            DEFAULT_GARMENTS.find((g) => g.category === drop.garmentCategory) ||
            DEFAULT_GARMENTS[0];

          return (
            <div
              key={drop.id}
              onClick={() => setActiveModalDrop(drop)}
              className="group cursor-pointer rounded-sm border border-border bg-[#0C0D10] overflow-hidden hover:border-zinc-500 transition-all flex flex-col justify-between"
            >
              {/* Visual Garment Stage */}
              <div
                className="relative h-60 p-5 flex flex-col justify-between transition-colors"
                style={{ backgroundColor: drop.colorHex }}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="rounded bg-black/70 px-2 py-0.5 text-white font-bold backdrop-blur-sm">
                    {drop.brand}
                  </span>
                  <span className="rounded bg-brand-volt px-2 py-0.5 text-black font-bold">
                    ${drop.retailPrice.toFixed(2)} USD
                  </span>
                </div>

                {/* Graphic Decal Representation */}
                <div className="mx-auto flex flex-col items-center justify-center border border-white/20 bg-black/75 p-3 rounded backdrop-blur-sm text-center shadow-lg">
                  <span className="text-xs font-black tracking-widest text-brand-volt">
                    {drop.brand}
                  </span>
                  <span className="text-[9px] text-zinc-300 mt-0.5">
                    SPEC ARCHIVE 2026
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-400">
                  <span className="rounded bg-black/60 px-2 py-0.5 text-zinc-300">
                    {garment.shortName}
                  </span>
                  <span className="text-brand-volt font-bold">3D READY</span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-brand-volt transition-colors truncate">
                    {drop.title}
                  </h3>
                  <div className="mt-1 text-[11px] text-zinc-500">
                    Creator: @{drop.creator}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {drop.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-surface px-1.5 py-0.5 text-[9px] text-zinc-400 border border-border"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" /> {drop.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {drop.views}
                    </span>
                  </div>

                  <span className="text-brand-volt font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>INSPECT</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DROP INSPECTION MODAL */}
      {activeModalDrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-sm border border-border bg-[#0C0D10] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] text-brand-volt uppercase font-bold">
                  {activeModalDrop.brand}
                </span>
                <h3 className="font-black text-white uppercase text-base mt-0.5">
                  {activeModalDrop.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalDrop(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Swatch & Decal Visual */}
              <div
                className="h-64 rounded border border-border p-6 flex flex-col justify-between items-center text-center"
                style={{ backgroundColor: activeModalDrop.colorHex }}
              >
                <span className="text-[10px] text-zinc-300 rounded bg-black/60 px-2 py-0.5">
                  Fabric Hex: {activeModalDrop.colorHex}
                </span>
                <div className="border border-white/20 bg-black/80 p-4 rounded text-center">
                  <div className="text-sm font-black text-brand-volt">
                    {activeModalDrop.brand}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">ATELIER ZERO SPEC</div>
                </div>
                <span className="text-[10px] text-zinc-400">
                  Print Method: Direct-to-Film (DTF)
                </span>
              </div>

              {/* Specs & Quick Action Buttons */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2 text-xs text-zinc-400">
                  <div className="flex justify-between border-b border-border/60 pb-1.5">
                    <span>Retail Price:</span>
                    <span className="text-white font-bold">${activeModalDrop.retailPrice.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-1.5">
                    <span>Creator:</span>
                    <span className="text-brand-volt font-bold">@{activeModalDrop.creator}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-1.5">
                    <span>Silhoutte:</span>
                    <span className="text-white font-bold">{activeModalDrop.garmentCategory}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-1.5">
                    <span>Community Likes:</span>
                    <span className="text-white">{activeModalDrop.likes} Designers</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Link
                    href={`/mockups?drop=${activeModalDrop.id}`}
                    className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2.5 font-bold text-black hover:bg-brand-volt/90 transition-all"
                  >
                    <Box className="h-4 w-4" />
                    <span>INSPECT 3D PBR DRAPE</span>
                  </Link>

                  <Link
                    href={`/studio/new?garment=${activeModalDrop.garmentCategory.toLowerCase()}`}
                    className="w-full flex items-center justify-center gap-2 rounded-sm border border-border bg-surface py-2 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                  >
                    <Palette className="h-4 w-4 text-brand-volt" />
                    <span>REMIX IN 2D STUDIO</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
