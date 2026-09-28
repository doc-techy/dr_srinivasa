'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CalendarCheck, Clock, Eye, EyeOff, Loader2, Lock, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { btnPrimary, inputClass, labelClass } from '@/components/admin/ui';

const highlights = [
  { icon: CalendarCheck, text: 'Confirm or cancel booking requests' },
  { icon: Clock, text: 'Set weekly consultation hours' },
  { icon: ShieldCheck, text: 'Block dates for leave and holidays' },
];

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { login, user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) router.replace('/admin/dashboard');
  }, [user, isAdmin, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (await login(username, password)) router.replace('/admin/dashboard');
      else setError('Incorrect username or password, or this account has no clinic admin access.');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] p-12 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/10 blur-2xl" />

        <Link href="/" className="relative inline-flex items-center gap-2 text-green-100 hover:text-white text-sm font-semibold w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </Link>

        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl mb-6">
            <Image src="/images/doctor-profile.webp" alt="Dr. Srinivasa C" width={112} height={112} className="w-full h-full object-cover" priority />
          </div>
          <h2 className="text-4xl font-bold leading-tight">Dr. Srinivasa C</h2>
          <p className="text-green-100 text-lg mt-1">Consultant Rheumatologist · Hulimavu, Bangalore</p>
          <ul className="mt-10 space-y-4">
            {highlights.map(item => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </span>
                <span className="text-white/90">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-green-100">Appointment Management</p>
      </div>

      <div className="flex flex-col">
        <div className="lg:hidden bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-6 py-5 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-white font-bold text-lg leading-tight">Dr. Srinivasa C</p>
            <p className="text-green-100 text-sm">Appointment Management</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-white/90 hover:text-white">Website</Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center shadow-lg mb-5">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin{' '}
                <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Login</span>
              </h1>
              <p className="text-gray-600 mt-2">Sign in to manage appointments</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 space-y-5">
              <div>
                <label htmlFor="username" className={labelClass}>Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className={`${inputClass} pl-11 py-3`}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`${inputClass} pl-11 pr-12 py-3`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(show => !show)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#047BCA]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={submitting} className={`${btnPrimary} w-full py-3 text-base`}>
                {submitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</>) : 'Sign in'}
              </button>

              <p className="text-center text-xs text-gray-400">Access restricted to authorised clinic staff.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
