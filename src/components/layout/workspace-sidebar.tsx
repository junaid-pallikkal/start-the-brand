'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Box,
  RotateCw,
  Printer,
  ShoppingBag,
  Compass,
  Settings,
  ShieldCheck,
  LogOut,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const mainNav = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: '2D Studio', href: '/studio/default', icon: Palette, badge: 'CAD' },
    { label: '3D Garments', href: '/mockups', icon: Box, badge: 'PBR' },
    { label: 'Turntable Motion', href: '/motion', icon: RotateCw, badge: 'VIDEO' },
    { label: 'Print Prep & DTF', href: '/production', icon: Printer, badge: 'MAXRECTS' },
    { label: 'Products & Margins', href: '/products', icon: ShoppingBag },
    { label: 'Marketplace', href: '/marketplace', icon: Compass },
  ];

  const bottomNav = [
    { label: 'Settings', href: '/settings', icon: Settings },
    ...(user?.role === 'admin'
      ? [{ label: 'Admin Console', href: '/admin', icon: ShieldCheck, badge: 'ROOT' }]
      : []),
  ];

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="sticky top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-[#0C0D10] font-mono text-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-volt text-black font-bold">
            <Shirt className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-black tracking-wider text-white">
              START<span className="text-brand-volt">THE</span>BRAND
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
              CREATIVE ENGINE
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Workspaces
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-sm px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-surface text-brand-volt font-semibold border-l-2 border-brand-volt'
                      : 'text-zinc-400 hover:bg-surface/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`h-4 w-4 ${isActive ? 'text-brand-volt' : 'text-zinc-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-zinc-400 group-hover:text-zinc-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            System & Brand
          </div>
          <nav className="space-y-1">
            {bottomNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-sm px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-surface text-brand-volt font-semibold border-l-2 border-brand-volt'
                      : 'text-zinc-400 hover:bg-surface/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`h-4 w-4 ${isActive ? 'text-brand-volt' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-brand-volt/10 text-brand-volt px-1.5 py-0.5 text-[9px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Offline Status & User Footer */}
      <div className="border-t border-border bg-[#090A0C] p-3">
        <div className="mb-3 flex items-center justify-between rounded-sm bg-black/40 px-2.5 py-1.5 text-[10px] text-zinc-400 border border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dexie IndexedDB</span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">LOCAL FIRST</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm bg-zinc-800 text-xs font-bold text-white uppercase border border-border">
              {user?.username ? user.username.substring(0, 2) : 'AN'}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-semibold text-white">
                {user?.brandName || user?.fullName || 'Guest Creator'}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.email || 'offline-mode'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="rounded p-1 text-zinc-400 hover:bg-surface hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
