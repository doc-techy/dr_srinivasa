'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Menu, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Admin';
  const initials = displayName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace('/admin-login');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-20 h-20 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] shadow-xl">
      <div className="h-full flex items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="lg:hidden p-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <Link href="/admin/dashboard" className="min-w-0">
            <p className="text-white font-bold text-lg sm:text-xl leading-tight truncate">Dr. Srinivasa C</p>
            <p className="text-green-100 text-xs sm:text-sm truncate">Appointment Management</p>
          </Link>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(open => !open)}
            className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-white text-[#047BCA] font-bold text-sm flex items-center justify-center">
              {initials}
            </span>
            <span className="hidden sm:block text-white text-sm font-semibold max-w-[10rem] truncate">{displayName}</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || user?.username}</p>
              </div>
              <Link
                href="/admin/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
