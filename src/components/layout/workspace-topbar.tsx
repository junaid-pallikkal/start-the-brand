'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Box, PanelLeft, ArrowUpRight, Search } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';

export function WorkspaceTopbar() {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const getSectionTitle = () => {
    if (pathname.includes('/dashboard')) return 'FOUNDER DASHBOARD';
    if (pathname.includes('/studio')) return '2D CAD DESIGN STUDIO';
    if (pathname.includes('/mockups')) return '3D PBR GARMENT STUDIO';
    if (pathname.includes('/motion')) return '360° TURNTABLE VIDEO STUDIO';
    if (pathname.includes('/production')) return 'DTF & PRINT PREPARATION SUITE';
    if (pathname.includes('/products')) return 'MERCHANDISE & PROFIT CALCULATOR';
    if (pathname.includes('/marketplace')) return 'COMMUNITY DROPS & SHOWROOM';
    if (pathname.includes('/admin')) return 'SYSTEM CONTROL PANEL';
    if (pathname.includes('/settings')) return 'BRAND & USER SETTINGS';
    return 'STUDIO SUITE';
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-[#0B0C0E]/90 px-4 backdrop-blur-md font-mono text-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-white transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <div className="h-4 w-[1px] bg-border" />
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-white">
            {getSectionTitle()}
          </span>
          <span className="text-[10px] text-zinc-500 font-normal">
            // LIVE WORKSPACE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/mockups"
          className="hidden sm:flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
        >
          <Box className="h-3.5 w-3.5 text-brand-volt" />
          <span>3D VIEWPORT</span>
        </Link>

        <Link
          href="/studio/new"
          className="flex items-center gap-1.5 rounded-sm bg-brand-volt px-3 py-1 font-bold text-black hover:bg-brand-volt/90 transition-all shadow-sm shadow-brand-volt/20"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>NEW APPAREL</span>
        </Link>
      </div>
    </header>
  );
}
