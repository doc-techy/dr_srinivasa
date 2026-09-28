'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ban, CalendarCheck, CalendarClock, ExternalLink, LayoutDashboard, Settings, X } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarCheck, badgeKey: 'pending' as const },
  { name: 'Weekly Hours', href: '/admin/availability', icon: CalendarClock },
  { name: 'Blocked Time', href: '/admin/blocked-slots', icon: Ban },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  pendingCount?: number;
}

export default function AdminSidebar({ open, onClose, pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-sm lg:hidden transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 lg:top-20 bottom-0 left-0 z-40 w-72 lg:w-64 bg-white/95 backdrop-blur-xl border-r border-gray-100 shadow-xl lg:shadow-none flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-20 px-5 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] lg:hidden">
          <span className="text-white font-bold">Dr. Srinivasa C</span>
          <button onClick={onClose} aria-label="Close menu" className="p-2 rounded-lg bg-white/20 hover:bg-white/30">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Manage</p>
          {navigation.map(item => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const badge = item.badgeKey === 'pending' && pendingCount > 0 ? pendingCount : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-[#047BCA]'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-[#047BCA]'}`} />
                <span className="flex-1">{item.name}</span>
                {badge !== null && (
                  <span className={`min-w-[1.5rem] px-1.5 py-0.5 rounded-full text-xs text-center ${active ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700'}`}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#047BCA] hover:text-[#047BCA] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View website
          </Link>
        </div>
      </aside>
    </>
  );
}
