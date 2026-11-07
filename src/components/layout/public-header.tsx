'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Sparkles, Box, Scissors, ArrowRight, Layers } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export function PublicHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { label: 'Features', href: '/features', icon: Sparkles },
    { label: '3D Mockups', href: '/mockups', icon: Box },
    { label: 'Print Production', href: '/production', icon: Scissors },
    { label: 'Explore Drops', href: '/explore', icon: Layers },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-brand-volt text-black transition-transform duration-200 group-hover:scale-105">
            <Shirt className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-black tracking-wider text-white">
              START<span className="text-brand-volt">THE</span>BRAND
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              v1.0 // CAD & 3D STUDIO
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-surface text-brand-volt'
                    : 'text-muted-foreground hover:bg-surface/50 hover:text-white'
                }`}
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-sm border border-brand-volt/40 bg-brand-volt/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-brand-volt transition-all hover:bg-brand-volt hover:text-black"
            >
              <span>DASHBOARD</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-sm px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-white"
              >
                SIGN IN
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 rounded-sm bg-brand-volt px-3.5 py-1.5 font-mono text-xs font-bold text-black transition-all hover:bg-brand-volt/90"
              >
                GET STARTED
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
