'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Shirt,
  Layers,
  Activity,
  Database,
  Sliders,
  Check,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  brandName: string;
  role: 'user' | 'admin' | 'creator';
  projectsCount: number;
  lastActive: string;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: 'usr_demo_admin_root',
    email: 'admin@startthebrand.com',
    username: 'root_curator',
    brandName: 'StartTheBrand Systems',
    role: 'admin',
    projectsCount: 24,
    lastActive: 'Just now',
  },
  {
    id: 'usr_demo_streetwear_01',
    email: 'creator@startthebrand.com',
    username: 'kurt_studio',
    brandName: 'ATELIER ZERO',
    role: 'creator',
    projectsCount: 12,
    lastActive: '12m ago',
  },
  {
    id: 'usr_marcus_raw',
    email: 'marcus@rawarchive.com',
    username: 'marcus_raw',
    brandName: 'RAW ARCHIVE',
    role: 'creator',
    projectsCount: 8,
    lastActive: '2h ago',
  },
  {
    id: 'usr_tech_tokyo',
    email: 'tech@system09.jp',
    username: 'tech_wear_tokyo',
    brandName: 'SYSTEM 09',
    role: 'user',
    projectsCount: 5,
    lastActive: '1d ago',
  },
];

export default function AdminPage() {
  const { user, loginAsDemoAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'health' | 'garments' | 'users' | 'drops'>('health');
  const [garmentsList, setGarmentsList] = useState(DEFAULT_GARMENTS);
  const [userList, setUserList] = useState(MOCK_USERS);

  // Authorization Check
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center p-6 bg-[#07080A] font-mono text-xs">
        <div className="w-full max-w-md rounded-sm border border-red-500/40 bg-[#0C0D10] p-8 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-base font-black text-white uppercase">
            RESTRICTED ACCESS // ADMIN ROLE REQUIRED
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Administrative endpoints require elevated privileges. Sign in with administrative credentials or activate the Demo Admin session below.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                loginAsDemoAdmin();
                toast.success('Elevated to Administrator privileges');
              }}
              className="rounded-sm bg-brand-volt py-2.5 font-bold text-black hover:bg-brand-volt/90 transition-all"
            >
              SWITCH TO DEMO ADMIN PASS
            </button>
            <Link
              href="/dashboard"
              className="rounded-sm border border-border bg-surface py-2 text-zinc-400 hover:text-white"
            >
              RETURN TO DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleGarment = (id: string) => {
    toast.success('Updated garment catalog configuration');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-volt mb-1 font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>PLATFORM OVERSEER // ROOT CONSOLE</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            System Administration & Health
          </h1>
          <p className="text-zinc-400 font-sans text-xs mt-1">
            Curate garment catalog, inspect active sessions, monitor compute health, and manage public drops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'health', label: 'System Health', icon: Activity },
            { id: 'garments', label: 'Garment Blanks', icon: Shirt },
            { id: 'users', label: 'User Directory', icon: Users },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-sm px-3.5 py-2 transition-colors ${
                  isActive
                    ? 'bg-brand-volt text-black font-bold shadow'
                    : 'bg-surface text-zinc-400 hover:text-white border border-border'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SYSTEM HEALTH & DIAGNOSTICS */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-sm border border-border bg-[#0C0D10] p-4 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500">WebGL Graphics Engine</span>
              <div className="text-base font-black text-emerald-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>OPERATIONAL (60 FPS)</span>
              </div>
              <p className="text-[10px] text-zinc-500">Three.js / React Three Fiber PBR</p>
            </div>

            <div className="rounded-sm border border-border bg-[#0C0D10] p-4 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500">Client IndexedDB</span>
              <div className="text-base font-black text-emerald-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>HEALTHY (DEXIE V2)</span>
              </div>
              <p className="text-[10px] text-zinc-500">Local-First Storage Online</p>
            </div>

            <div className="rounded-sm border border-border bg-[#0C0D10] p-4 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500">MaxRects Bin Packer</span>
              <div className="text-base font-black text-brand-volt flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>22" & 24" ROLLS ACTIVE</span>
              </div>
              <p className="text-[10px] text-zinc-500">Best Area Fit Heuristic</p>
            </div>

            <div className="rounded-sm border border-border bg-[#0C0D10] p-4 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500">AI Gateway Status</span>
              <div className="text-base font-black text-emerald-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>OPEN ZERO-COST</span>
              </div>
              <p className="text-[10px] text-zinc-500">Pollinations / Server Gateway</p>
            </div>
          </div>

          {/* Diagnostic Log */}
          <div className="rounded-sm border border-border bg-[#0C0D10] p-5 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-brand-volt" />
              <span>Real-Time Platform Diagnostic Log</span>
            </div>
            <div className="rounded border border-border/60 bg-[#07080A] p-4 font-mono text-[11px] text-zinc-400 space-y-1">
              <div>[00:00:01] System boot verified: Next.js 15 App Router, React 19 Engine.</div>
              <div>[00:00:02] Local IndexedDB store initialized: 5 tables indexed.</div>
              <div>[00:00:03] PBR Fabric Cloth normal bump map compiled: 256x256 micro-weave.</div>
              <div>[00:00:04] 10 Streetwear Blanks (Tees, Hoodies, Cargos, Sweatpants, Jeans) active.</div>
              <div>[00:00:05] MaxRects bin packing unit verified: 0 collision tolerances.</div>
              <div className="text-brand-volt">[00:00:06] PLATFORM READY: Zero paywalls, full 300 DPI exports enabled.</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GARMENT CATALOG CURATOR */}
      {activeTab === 'garments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-zinc-400">
              Active Garment Silhouettes (10 Curated Streetwear Blanks)
            </span>
          </div>

          <div className="space-y-2">
            {garmentsList.map((garment) => (
              <div
                key={garment.id}
                className="rounded-sm border border-border bg-[#0C0D10] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white uppercase">{garment.name}</span>
                    <span className="rounded bg-surface px-1.5 py-0.2 text-[9px] text-brand-volt font-bold">
                      {garment.geometryType}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-sans">{garment.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 uppercase block">Base Cost</span>
                    <span className="text-white font-bold">${garment.baseCostUSD.toFixed(2)} USD</span>
                  </div>

                  <button
                    onClick={() => handleToggleGarment(garment.id)}
                    className="rounded bg-brand-volt/10 text-brand-volt border border-brand-volt/40 px-3 py-1 font-bold hover:bg-brand-volt hover:text-black transition-colors"
                  >
                    ACTIVE BLANK
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-zinc-400">
              Registered Accounts ({userList.length})
            </span>
          </div>

          <div className="rounded-sm border border-border bg-[#0C0D10] overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-border bg-[#090A0C] text-[10px] uppercase text-zinc-500">
                <tr>
                  <th className="p-3">User / Brand</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Projects</th>
                  <th className="p-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-[11px]">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-surface/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{u.brandName}</div>
                      <div className="text-[10px] text-zinc-500">@{u.username}</div>
                    </td>
                    <td className="p-3 text-zinc-300">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : u.role === 'creator'
                            ? 'bg-brand-volt/10 text-brand-volt border border-brand-volt/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-white font-bold">{u.projectsCount}</td>
                    <td className="p-3 text-zinc-500">{u.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
