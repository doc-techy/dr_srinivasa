'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export const ADMIN_STATS_EVENT = 'admin:stats-changed';

export const notifyAdminStatsChanged = () => window.dispatchEvent(new Event(ADMIN_STATS_EVENT));

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { tokens } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPending = useCallback(async () => {
    if (!tokens?.access) return;
    const response = await apiClient.getAppointmentStats(tokens.access);
    if (response.success && response.data?.stats) setPendingCount(response.data.stats.pending ?? 0);
  }, [tokens?.access]);

  useEffect(() => {
    refreshPending();
  }, [refreshPending, pathname]);

  useEffect(() => {
    window.addEventListener(ADMIN_STATS_EVENT, refreshPending);
    return () => window.removeEventListener(ADMIN_STATS_EVENT, refreshPending);
  }, [refreshPending]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pendingCount={pendingCount} />
      <main className="pt-20 lg:pl-64">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
