'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, CalendarX, History, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import {
  Card, EmptyState, ErrorBanner, Modal, PageHeader, Spinner, StatCard,
  btnDanger, btnPrimary, btnSecondary, formatDate, formatTime, iconBtn, inputClass, labelClass, todayISO,
} from '@/components/admin/ui';

interface BlockedSlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
}

interface BlockedSummary {
  total_blocked: number;
  this_week: number;
  this_month: number;
  upcoming: number;
}

type BlockedForm = Omit<BlockedSlot, 'id'>;

const DAY_START = '00:00';
const DAY_END = '23:59';

const isWholeDay = (slot: Pick<BlockedSlot, 'start_time' | 'end_time'>) => slot.start_time === DAY_START && slot.end_time === DAY_END;

export default function BlockedSlotsPage() {
  const { tokens } = useAuth();
  const [slots, setSlots] = useState<BlockedSlot[]>([]);
  const [summary, setSummary] = useState<BlockedSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<BlockedSlot | null>(null);
  const [form, setForm] = useState<BlockedForm | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const load = useCallback(async () => {
    if (!tokens?.access) return;
    const [slotsRes, summaryRes] = await Promise.all([
      apiClient.getBlockedSlots(tokens.access),
      apiClient.getBlockedSlotsSummary(tokens.access),
    ]);
    if (slotsRes.success && slotsRes.data) setSlots(slotsRes.data.blocked_slots);
    else setError(slotsRes.error || 'Could not load blocked time.');
    setSummary(summaryRes.data?.summary ?? null);
    setLoading(false);
  }, [tokens?.access]);

  useEffect(() => {
    load();
  }, [load]);

  const today = todayISO();
  const upcoming = useMemo(() => slots.filter(slot => slot.date >= today), [slots, today]);
  const past = useMemo(() => slots.filter(slot => slot.date < today).reverse(), [slots, today]);

  const openCreate = () => {
    setEditing(null);
    setForm({ date: today, start_time: DAY_START, end_time: DAY_END, reason: '' });
    setFormError('');
  };

  const openEdit = (slot: BlockedSlot) => {
    setEditing(slot);
    setForm({ date: slot.date, start_time: slot.start_time, end_time: slot.end_time, reason: slot.reason });
    setFormError('');
  };

  const closeForm = () => {
    setForm(null);
    setEditing(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.access || !form) return;
    setSaving(true);
    const response = editing
      ? await apiClient.updateBlockedSlot(editing.id, form, tokens.access)
      : await apiClient.createBlockedSlot(form, tokens.access);
    setSaving(false);
    if (!response.success) {
      setFormError(response.error || 'Could not save this block.');
      return;
    }
    closeForm();
    load();
  };

  const remove = async (slot: BlockedSlot) => {
    if (!tokens?.access) return;
    if (!confirm(`Unblock ${formatDate(slot.date)}? Patients will be able to book this time again.`)) return;
    const response = await apiClient.deleteBlockedSlot(slot.id, tokens.access);
    if (!response.success) setError(response.error || 'Could not remove this block.');
    closeForm();
    load();
  };

  const SlotRow = ({ slot, muted = false }: { slot: BlockedSlot; muted?: boolean }) => (
    <li className="flex items-center gap-4 px-6 py-4">
      <div className={`w-14 flex-shrink-0 rounded-xl py-2 text-center ${muted ? 'bg-gray-50' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
        <p className={`text-xs font-semibold uppercase ${muted ? 'text-gray-400' : 'text-[#1C7E4E]'}`}>
          {formatDate(slot.date, { month: 'short' })}
        </p>
        <p className={`text-xl font-bold leading-none ${muted ? 'text-gray-400' : 'text-[#047BCA]'}`}>
          {formatDate(slot.date, { day: 'numeric' })}
        </p>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${muted ? 'text-gray-500' : 'text-gray-900'}`}>
          {formatDate(slot.date, { weekday: 'long' })} · {isWholeDay(slot) ? 'Whole day' : `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`}
        </p>
        <p className="text-sm text-gray-500 truncate">{slot.reason || 'No reason given'}</p>
      </div>
      {!muted && (
        <div className="flex gap-1.5">
          <button onClick={() => openEdit(slot)} title="Edit" className={iconBtn}>
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => remove(slot)} title="Unblock" className={`${iconBtn} hover:!border-red-300 hover:!text-red-600`}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  );

  if (loading) return <Spinner label="Loading blocked time…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blocked Time"
        subtitle="Close the clinic for leave, holidays or emergencies. Blocked slots disappear from the booking page."
        actions={
          <button onClick={openCreate} className={btnPrimary}>
            <Plus className="w-4 h-4" /> Block time
          </button>
        }
      />

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Upcoming blocks" value={summary.upcoming} icon={Ban} tone="brand" />
          <StatCard label="This week" value={summary.this_week} icon={CalendarX} tone="green" />
          <StatCard label="This month" value={summary.this_month} icon={CalendarX} tone="blue" />
        </div>
      )}

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Upcoming</h2>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState icon={Ban} title="No upcoming blocks" text="All regular weekly hours are open for booking." />
        ) : (
          <ul className="divide-y divide-gray-100">
            {upcoming.map(slot => <SlotRow key={slot.id} slot={slot} />)}
          </ul>
        )}
      </Card>

      {past.length > 0 && (
        <Card>
          <button onClick={() => setShowPast(open => !open)} className="w-full flex items-center justify-between px-6 py-4 text-left">
            <span className="flex items-center gap-2 font-bold text-gray-700">
              <History className="w-4 h-4 text-gray-400" /> Past blocks ({past.length})
            </span>
            <span className="text-sm font-semibold text-[#047BCA]">{showPast ? 'Hide' : 'Show'}</span>
          </button>
          {showPast && (
            <ul className="divide-y divide-gray-100 border-t border-gray-100">
              {past.map(slot => <SlotRow key={slot.id} slot={slot} muted />)}
            </ul>
          )}
        </Card>
      )}

      {form && (
        <Modal title={editing ? 'Edit blocked time' : 'Block time'} onClose={closeForm}>
          <form onSubmit={save} className="space-y-4">
            {formError && <ErrorBanner message={formError} />}
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" required min={today} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isWholeDay(form)}
                onChange={e => setForm(e.target.checked
                  ? { ...form, start_time: DAY_START, end_time: DAY_END }
                  : { ...form, start_time: '09:00', end_time: '12:00' })}
                className="w-4 h-4 rounded border-gray-300 text-[#047BCA] focus:ring-[#047BCA]/30"
              />
              <span className="text-sm font-medium text-gray-700">Block the whole day</span>
            </label>
            {!isWholeDay(form) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>From</label>
                  <input type="time" required value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>To</label>
                  <input type="time" required value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} className={inputClass} />
                </div>
              </div>
            )}
            <div>
              <label className={labelClass}>Reason <span className="font-normal text-gray-400">(optional, only visible to admins)</span></label>
              <input
                value={form.reason}
                maxLength={200}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                placeholder="e.g. Conference, personal leave"
                className={inputClass}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {editing && (
                <button type="button" onClick={() => remove(editing)} className={btnDanger}>
                  <Trash2 className="w-4 h-4" /> Unblock
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button type="button" onClick={closeForm} className={btnSecondary}>Cancel</button>
                <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
