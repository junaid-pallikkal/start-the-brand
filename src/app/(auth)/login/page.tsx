'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsGuest, loginAsDemoAdmin, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            username: data.user.user_metadata?.username || email.split('@')[0],
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            brandName: data.user.user_metadata?.brand_name || 'Independent Brand',
            role: (data.user.app_metadata?.role as any) || 'user',
            isGuest: false,
            createdAt: data.user.created_at,
          });
          setLoading(false);
          toast.success('Signed in with Supabase successfully');
          router.push('/dashboard');
          return;
        }
      }

      // Local fallback if Supabase client is not configured yet
      setUser({
        id: `usr_${Date.now().toString(36)}`,
        email,
        username: email.split('@')[0],
        fullName: email.split('@')[0],
        brandName: `${email.split('@')[0].toUpperCase()} STUDIOS`,
        role: 'user',
        isGuest: false,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Error signing in');
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    toast.success('Signed in as Guest Creator');
    router.push('/dashboard');
  };

  const handleAdminLogin = () => {
    loginAsDemoAdmin();
    toast.success('Signed in as Platform Administrator');
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md rounded-sm border border-border bg-[#0C0D10] p-6 sm:p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-xl font-black text-white uppercase tracking-wider">
          SIGN IN TO STUDIO
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Access your apparel graphics, 3D garments, and print gang sheets
        </p>
      </div>

      {/* Quick Demo Access Bar */}
      <div className="mb-6 rounded-sm border border-brand-volt/40 bg-brand-volt/5 p-3 text-xs">
        <div className="flex items-center gap-1.5 text-brand-volt font-bold text-[11px] mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>INSTANT GUEST & DEMO ACCESS</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="rounded-sm bg-brand-volt px-2.5 py-1.5 text-[11px] font-bold text-black hover:bg-brand-volt/90 transition-all text-center"
          >
            GUEST CREATOR
          </button>
          <button
            type="button"
            onClick={handleAdminLogin}
            className="rounded-sm border border-zinc-700 bg-surface px-2.5 py-1.5 text-[11px] font-bold text-zinc-200 hover:text-white hover:border-zinc-500 transition-all text-center"
          >
            DEMO ADMIN
          </button>
        </div>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-[#0C0D10] px-2 text-zinc-500">Or continue with credentials</span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@yourbrand.com"
              className="w-full rounded-sm border border-border bg-[#07080A] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:border-brand-volt focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <span className="text-[10px] text-zinc-500 cursor-pointer hover:text-brand-volt">
              Reset?
            </span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-sm border border-border bg-[#07080A] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:border-brand-volt focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2.5 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'AUTHENTICATING...' : 'ENTER WORKSPACE'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-zinc-500">
        New to StartTheBrand?{' '}
        <Link href="/signup" className="text-brand-volt font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
