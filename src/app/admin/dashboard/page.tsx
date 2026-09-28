'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Ban, CalendarCheck, CalendarDays, Check, CheckCircle, Clock, Hourglass, Phone, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, type BookedAppointment } from '@/lib/api';
import { notifyAdminStatsChanged } from '@/components/admin/AdminShell';
import {
  Card, EmptyState, ErrorBanner, PageHeader, Spinner, StatCard, StatusBadge,
  btnPrimary, formatDate, formatTime, iconBtn, todayISO,
} from '@/components/admin/ui';

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
  upcoming: number;
}

interface BlockedSummary {
  total_blocked: number;
  this_week: number;
  this_month: number;
  upcoming: number;
}

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const byDateTime = (a: BookedAppointment, b: BookedAppointment) =>
  `${a.appointment_date} ${a.appointment_time}`.localeCompare(`${b.appointment_date} ${b.appointment_time}`);

export default function AdminDashboard() {
  const { tokens } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [blocked, setBlocked] = useState<BlockedSummary | null>(null);
  const [todayList, setTodayList] = useState<BookedAppointment[]>([]);
  const [pendingList, setPendingList] = useState<BookedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!tokens?.access) return;
    const today = todayISO();
    const [statsRes, blockedRes, todayRes, pendingRes] = await Promise.all([
      apiClient.getAppointmentStats(tokens.access),
      apiClient.getBlockedSlotsSummary(tokens.access),
      apiClient.getAppointments(1, 50, tokens.access, { date: today }),
      apiClient.getAppointments(1, 50, tokens.access, { status: 'pending' }),
    ]);

    if (!statsRes.success) setError(statsRes.error || 'Could not load dashboard data.');
    setStats(statsRes.data?.stats ?? null);
    setBlocked(blockedRes.data?.summary ?? null);
    setTodayList((todayRes.data?.appointments ?? []).filter(a => a.status !== 'cancelled').sort(byDateTime));
    setPendingList((pendingRes.data?.appointments ?? []).filter(a => a.appointment_date >= today).sort(byDateTime).slice(0, 6));
    setLoading(false);
  }, [tokens?.access]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id: number, action: 'confirm' | 'cancel') => {
    if (!tokens?.access) return;
    setBusyId(id);
    const response = await apiClient.adminAppointmentAction(id, action, tokens.access);
    setBusyId(null);
    if (!response.success) {
      setError(response.error || `Could not ${action} the appointment.`);
      return;
    }
    notifyAdminStatsChanged();
    load();
  };

  if (loading) return <Spinner label="Loading dashboard…" />;

  const rate = (value: number) => (stats && stats.total ? Math.round((value / stats.total) * 100) : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, Doctor`}
        subtitle={formatDate(todayISO(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={
          <Link href="/admin/appointments" className={btnPrimary}>
            All appointments <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Today" value={stats.today} icon={CalendarDays} tone="brand" hint="Active visits today" />
          <StatCard label="Awaiting confirmation" value={stats.pending} icon={Hourglass} tone="amber" />
          <StatCard label="Upcoming" value={stats.upcoming} icon={CalendarCheck} tone="green" hint="Pending + confirmed" />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle} tone="blue" />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Today&apos;s schedule</h2>
            <span className="text-sm text-gray-500">{todayList.length} visit{todayList.length === 1 ? '' : 's'}</span>
          </div>
          {todayList.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No visits scheduled today" />
          ) : (
            <ul className="divide-y divide-gray-100">
              {todayList.map(appointment => (
                <li key={appointment.appointment_id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-20 flex-shrink-0 text-center rounded-xl bg-gradient-to-br from-green-50 to-blue-50 py-2">
                    <p className="text-sm font-bold text-[#047BCA]">{formatTime(appointment.appointment_time)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{appointment.patient_name}</p>
                    <p className="text-sm text-gray-500 truncate">{appointment.reason || 'No reason given'}</p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Awaiting confirmation</h2>
            <Link href="/admin/appointments?status=pending" className="text-sm font-semibold text-[#047BCA] hover:text-[#1C7E4E]">
              View all
            </Link>
          </div>
          {pendingList.length === 0 ? (
            <EmptyState icon={CheckCircle} title="You're all caught up" text="New booking requests will appear here." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {pendingList.map(appointment => (
                <li key={appointment.appointment_id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{appointment.patient_name}</p>
                    <p className="text-sm text-gray-500 flex flex-wrap items-center gap-x-3">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(appointment.appointment_date)} · {formatTime(appointment.appointment_time)}
                      </span>
                      {appointment.patient_phone && (
                        <a href={`tel:${appointment.patient_phone}`} className="inline-flex items-center gap-1 hover:text-[#047BCA]">
                          <Phone className="w-3.5 h-3.5" />
                          {appointment.patient_phone}
                        </a>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => act(appointment.appointment_id, 'confirm')}
                      disabled={busyId === appointment.appointment_id}
                      title="Confirm"
                      className={`${iconBtn} hover:!border-[#1C7E4E] hover:!text-[#1C7E4E]`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => act(appointment.appointment_id, 'cancel')}
                      disabled={busyId === appointment.appointment_id}
                      title="Cancel"
                      className={`${iconBtn} hover:!border-red-300 hover:!text-red-600`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stats && (
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900">All-time overview</h2>
            <p className="text-sm text-gray-500 mb-5">{stats.total} appointment{stats.total === 1 ? '' : 's'} booked in total</p>
            <div className="space-y-4">
              {[
                { label: 'Confirmed', value: stats.confirmed, bar: 'from-[#1C7E4E] to-[#1C7E4E]' },
                { label: 'Completed', value: stats.completed, bar: 'from-[#047BCA] to-[#047BCA]' },
                { label: 'Pending', value: stats.pending, bar: 'from-amber-400 to-amber-500' },
                { label: 'Cancelled', value: stats.cancelled, bar: 'from-red-400 to-red-500' },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{row.label}</span>
                    <span className="text-gray-500">{row.value} · {rate(row.value)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${row.bar} transition-all duration-700`} style={{ width: `${rate(row.value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center">
              <Ban className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Blocked time</h2>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              { label: 'Upcoming', value: blocked?.upcoming ?? 0 },
              { label: 'This week', value: blocked?.this_week ?? 0 },
              { label: 'This month', value: blocked?.this_month ?? 0 },
              { label: 'All time', value: blocked?.total_blocked ?? 0 },
            ].map(item => (
              <div key={item.label} className="rounded-xl bg-gradient-to-br from-green-50 to-blue-50 p-3">
                <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
                <dd className="text-xl font-bold text-gray-900">{item.value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/admin/blocked-slots" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#047BCA] hover:text-[#1C7E4E]">
            Manage blocked time <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
