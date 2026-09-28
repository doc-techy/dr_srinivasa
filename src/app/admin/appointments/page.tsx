'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarDays, Check, CheckCheck, ChevronLeft, ChevronRight, Eye, Mail, MessageSquare, Phone, Search, Trash2, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, type AppointmentPagination, type BookedAppointment } from '@/lib/api';
import { notifyAdminStatsChanged } from '@/components/admin/AdminShell';
import {
  Card, EmptyState, ErrorBanner, Modal, PageHeader, Spinner, StatusBadge,
  btnDanger, btnPrimary, btnSecondary, formatDate, formatTime, iconBtn, inputClass,
} from '@/components/admin/ui';

type Action = 'confirm' | 'cancel' | 'complete';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAGE_SIZE = 20;

const availableActions = (status: BookedAppointment['status']): Action[] => {
  if (status === 'pending') return ['confirm', 'cancel'];
  if (status === 'confirmed') return ['complete', 'cancel'];
  return [];
};

const actionMeta: Record<Action, { label: string; icon: typeof Check; hover: string }> = {
  confirm: { label: 'Confirm', icon: Check, hover: 'hover:!border-[#1C7E4E] hover:!text-[#1C7E4E]' },
  complete: { label: 'Mark completed', icon: CheckCheck, hover: 'hover:!border-[#047BCA] hover:!text-[#047BCA]' },
  cancel: { label: 'Cancel', icon: X, hover: 'hover:!border-red-300 hover:!text-red-600' },
};

function AppointmentsContent() {
  const { tokens } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const date = searchParams.get('date') ?? '';

  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);
  const [pagination, setPagination] = useState<AppointmentPagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<BookedAppointment | null>(null);

  const setFilter = (key: 'status' | 'date', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setPage(1);
    router.replace(params.toString() ? `${pathname}?${params}` : pathname);
  };

  const load = useCallback(async () => {
    if (!tokens?.access) return;
    setLoading(true);
    const response = await apiClient.getAppointments(page, PAGE_SIZE, tokens.access, { status, date });
    if (response.success && response.data) {
      setAppointments(response.data.appointments);
      setPagination(response.data.pagination);
      setError('');
    } else {
      setError(response.error || 'Could not load appointments.');
    }
    setLoading(false);
  }, [tokens?.access, page, status, date]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter(a =>
      [a.patient_name, a.patient_email, a.patient_phone, a.reason].some(field => field?.toLowerCase().includes(term)),
    );
  }, [appointments, search]);

  const runAction = async (appointment: BookedAppointment, action: Action) => {
    if (!tokens?.access) return;
    if (action === 'cancel' && !confirm(`Cancel ${appointment.patient_name}'s appointment?${appointment.patient_email ? ' The patient will be emailed.' : ''}`)) return;
    setBusyId(appointment.appointment_id);
    const response = await apiClient.adminAppointmentAction(appointment.appointment_id, action, tokens.access);
    setBusyId(null);
    if (!response.success) {
      setError(response.error || 'Action failed.');
      return;
    }
    const updated = (response.data as { appointment?: BookedAppointment })?.appointment;
    if (updated && selected?.appointment_id === updated.appointment_id) setSelected(updated);
    notifyAdminStatsChanged();
    load();
  };

  const remove = async (appointment: BookedAppointment) => {
    if (!tokens?.access) return;
    if (!confirm(`Permanently delete ${appointment.patient_name}'s appointment? This cannot be undone.`)) return;
    setBusyId(appointment.appointment_id);
    const response = await apiClient.deleteAppointment(appointment.appointment_id, tokens.access);
    setBusyId(null);
    if (!response.success) {
      setError(response.error || 'Could not delete the appointment.');
      return;
    }
    setSelected(null);
    notifyAdminStatsChanged();
    load();
  };

  const ActionButtons = ({ appointment }: { appointment: BookedAppointment }) => (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setSelected(appointment)} title="View details" className={iconBtn}>
        <Eye className="w-4 h-4" />
      </button>
      {availableActions(appointment.status).map(action => {
        const meta = actionMeta[action];
        return (
          <button
            key={action}
            onClick={() => runAction(appointment, action)}
            disabled={busyId === appointment.appointment_id}
            title={meta.label}
            className={`${iconBtn} ${meta.hover}`}
          >
            <meta.icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle={pagination ? `${pagination.total_count} appointment${pagination.total_count === 1 ? '' : 's'}${status ? ` · ${status}` : ''}${date ? ` · ${formatDate(date)}` : ''}` : undefined}
      />

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      <Card className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter('status', tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                status === tab.value
                  ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-[#047BCA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, phone, email or reason"
              className={`${inputClass} pl-10`}
            />
          </div>
          <input type="date" value={date} onChange={e => setFilter('date', e.target.value)} className={inputClass} aria-label="Filter by date" />
          {(status || date || search) && (
            <button onClick={() => { setSearch(''); setPage(1); router.replace(pathname); }} className={btnSecondary}>
              Clear filters
            </button>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <Spinner label="Loading appointments…" />
        ) : visible.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No appointments found" text={search || status || date ? 'Try changing the filters.' : 'New bookings from the website will appear here.'} />
        ) : (
          <>
            <table className="hidden md:table w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-green-50 to-blue-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Date &amp; time</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(appointment => (
                  <tr key={appointment.appointment_id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{appointment.patient_name}</p>
                      <p className="text-gray-500">{appointment.patient_phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{formatDate(appointment.appointment_date)}</p>
                      <p className="text-gray-500">{formatTime(appointment.appointment_time)}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-gray-600 truncate">{appointment.reason || '—'}</p>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={appointment.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end"><ActionButtons appointment={appointment} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="md:hidden divide-y divide-gray-100">
              {visible.map(appointment => (
                <li key={appointment.appointment_id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{appointment.patient_name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(appointment.appointment_date)} · {formatTime(appointment.appointment_time)}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                  {appointment.reason && <p className="text-sm text-gray-600 line-clamp-2">{appointment.reason}</p>}
                  <ActionButtons appointment={appointment} />
                </li>
              ))}
            </ul>
          </>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {pagination.current_page} of {pagination.total_pages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={!pagination.has_previous} className={btnSecondary}>
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={!pagination.has_next} className={btnSecondary}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {selected && (
        <Modal title="Appointment details" onClose={() => setSelected(null)}>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-bold text-gray-900">{selected.patient_name}</p>
                <p className="text-sm text-gray-500">Booking #{selected.appointment_id}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Visit</p>
              <p className="text-lg font-bold text-gray-900">
                {formatDate(selected.appointment_date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[#047BCA] font-semibold">{formatTime(selected.appointment_time)}</p>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${selected.patient_phone}`} className="font-medium text-gray-900 hover:text-[#047BCA]">{selected.patient_phone}</a>
              </div>
              {selected.patient_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${selected.patient_email}`} className="font-medium text-gray-900 hover:text-[#047BCA] break-all">{selected.patient_email}</a>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                <p className="text-gray-700 whitespace-pre-wrap">{selected.reason || 'No reason given'}</p>
              </div>
            </dl>

            <p className="text-xs text-gray-400">
              Requested {new Date(selected.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {availableActions(selected.status).map(action => (
                <button
                  key={action}
                  onClick={() => runAction(selected, action)}
                  disabled={busyId === selected.appointment_id}
                  className={action === 'cancel' ? btnDanger : btnPrimary}
                >
                  {actionMeta[action].label}
                </button>
              ))}
              <button onClick={() => remove(selected)} disabled={busyId === selected.appointment_id} className={`${btnSecondary} ml-auto`}>
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<Spinner label="Loading appointments…" />}>
      <AppointmentsContent />
    </Suspense>
  );
}
