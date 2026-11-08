'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, Shirt } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !brandName) {
      toast.error('Please fill in email, password, and brand name');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              brand_name: brandName,
              username: email.split('@')[0],
            },
          },
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
            username: email.split('@')[0],
            fullName: fullName || email.split('@')[0],
            brandName: brandName.toUpperCase(),
            role: 'user',
            isGuest: false,
            createdAt: new Date().toISOString(),
          });
          setLoading(false);
          toast.success('Account created in Supabase! Welcome to StartTheBrand');
          router.push('/dashboard');
          return;
        }
      }

      // Local fallback
      setUser({
        id: `usr_${Date.now().toString(36)}`,
        email,
        username: email.split('@')[0],
        fullName: fullName || email.split('@')[0],
        brandName: brandName.toUpperCase(),
        role: 'user',
        isGuest: false,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      toast.success('Account created! Welcome to StartTheBrand');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.message || 'Error creating account');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-sm border border-border bg-[#0C0D10] p-6 sm:p-8 shadow-2xl font-mono">
      <div className="text-center mb-6">
        <h1 className="text-xl font-black text-white uppercase tracking-wider">
          CREATE BRAND ACCOUNT
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Start designing and engineering your clothing line today
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
            Brand / Label Name
          </label>
          <div className="relative">
            <Shirt className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. ATELIER ZERO"
              className="w-full rounded-sm border border-border bg-[#07080A] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:border-brand-volt focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
            Designer / Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Kurt Vance"
              className="w-full rounded-sm border border-border bg-[#07080A] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:border-brand-volt focus:outline-none"
            />
          </div>
        </div>

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
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-sm border border-border bg-[#07080A] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:border-brand-volt focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 rounded-sm bg-brand-volt py-2.5 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'INITIALIZING BRAND...' : 'START FREE ACCOUNT'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-volt font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
