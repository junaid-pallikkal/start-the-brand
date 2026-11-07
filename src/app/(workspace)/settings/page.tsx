'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { User, Shirt, Mail, Shield, Save, Database, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { localDb } from '@/lib/storage/dexie-db';

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [brandName, setBrandName] = useState(user?.brandName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateProfile({
        fullName,
        brandName,
        bio,
      });
      setLoading(false);
      toast.success('Brand profile updated successfully');
    }, 300);
  };

  const handleClearLocalData = async () => {
    if (confirm('Are you sure you want to clear all locally cached projects and gang sheets?')) {
      await localDb.projects.clear();
      await localDb.gangSheets.clear();
      toast.success('Local database cleared');
      window.location.reload();
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto font-mono text-xs">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-brand-volt mb-1">
          SYSTEM CONFIGURATION
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Brand & Account Settings
        </h1>
        <p className="text-zinc-400 font-sans text-xs mt-1">
          Manage your label details, default currency, and local IndexedDB storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-sm border border-border bg-[#0C0D10] p-6 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border text-xl font-bold uppercase mx-auto">
            {user?.username ? user.username.substring(0, 2) : 'ST'}
          </div>
          <div className="text-center">
            <h3 className="font-bold text-white text-sm uppercase">
              {user?.brandName || 'Untitled Brand'}
            </h3>
            <p className="text-zinc-500 text-[11px] mt-0.5">@{user?.username || 'creator'}</p>
          </div>
          <div className="border-t border-border pt-3 space-y-2 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="text-brand-volt uppercase font-bold">{user?.role || 'user'}</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-emerald-400 font-bold">
                {user?.isGuest ? 'Guest Session' : 'Registered'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Local Storage:</span>
              <span className="text-white">Active</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 rounded-sm border border-border bg-[#0C0D10] p-6">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Brand / Studio Name
              </label>
              <div className="relative">
                <Shirt className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full rounded-sm border border-border bg-[#07080A] py-2 pl-9 pr-3 text-xs text-white focus:border-brand-volt focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Founder / Designer Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-sm border border-border bg-[#07080A] py-2 pl-9 pr-3 text-xs text-white focus:border-brand-volt focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Studio Bio & Location
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Cut-and-sew streetwear studio based in Tokyo / NYC..."
                className="w-full rounded-sm border border-border bg-[#07080A] p-2.5 text-xs text-white focus:border-brand-volt focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-sm bg-brand-volt px-5 py-2.5 font-bold text-black hover:bg-brand-volt/90 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'SAVING...' : 'SAVE SETTINGS'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Storage & Database Diagnostics */}
      <div className="rounded-sm border border-border bg-[#0C0D10] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-brand-volt" />
            <h3 className="font-bold text-white uppercase text-sm">IndexedDB Local Storage</h3>
          </div>
          <span className="text-emerald-400 text-[10px] uppercase font-bold">100% OFFLINE READY</span>
        </div>
        <p className="text-xs text-zinc-400 font-sans">
          Your apparel projects, high-res canvas states, and DTF gang sheets are stored persistently inside your browser's IndexedDB engine (Dexie.js).
        </p>
        <button
          onClick={handleClearLocalData}
          className="flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>RESET LOCAL CACHE</span>
        </button>
      </div>
    </div>
  );
}
