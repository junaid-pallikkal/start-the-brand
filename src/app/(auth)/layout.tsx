import Link from 'next/link';
import { Shirt, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#0A0B0D] font-mono">
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />

      {/* Top Header */}
      <header className="relative z-10 flex h-16 items-center justify-between px-6 border-b border-border/60">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs">
          <ArrowLeft className="h-4 w-4" />
          <span>RETURN TO HOME</span>
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand-volt text-black font-bold">
            <Shirt className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="font-mono text-sm font-black tracking-wider text-white">
            START<span className="text-brand-volt">THE</span>BRAND
          </span>
        </Link>
      </header>

      {/* Auth Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-zinc-500 border-t border-border/40">
        StartTheBrand Session Security & Local Encrypted Storage. Zero Paywalls.
      </footer>
    </div>
  );
}
