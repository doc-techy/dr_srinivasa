'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import {
  Card, ErrorBanner, Modal, PageHeader, Spinner,
  btnDanger, btnPrimary, btnSecondary, formatTime, iconBtn, inputClass, labelClass,
} from '@/components/admin/ui';

interface Availability {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  is_active: boolean;
}

type AvailabilityForm = Omit<Availability, 'id'>;

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DURATIONS = [10, 15, 20, 30, 45, 60];

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const emptyForm = (day = 'monday'): AvailabilityForm => ({
  day_of_week: day,
  start_time: '09:00',
  end_time: '12:00',
  slot_duration: 15,
  is_active: true,
});

export default function AvailabilityPage() {
  const { tokens } = useAuth();
  const [items, setItems] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Availability | null>(null);
  const [form, setForm] = useState<AvailabilityForm | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!tokens?.access) return;
    const response = await apiClient.getDoctorAvailability(tokens.access);
    if (response.success && response.data) setItems(response.data.availability);
    else setError(response.error || 'Could not load weekly hours.');
    setLoading(false);
  }, [tokens?.access]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = (day?: string) => {
    setEditing(null);
    setForm(emptyForm(day));
    setFormError('');
  };

  const openEdit = (item: Availability) => {
    setEditing(item);
    setForm({
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      slot_duration: item.slot_duration,
      is_active: item.is_active,
    });
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
      ? await apiClient.updateDoctorAvailability(editing.id, form, tokens.access)
      : await apiClient.createDoctorAvailability(form, tokens.access);
    setSaving(false);
    if (!response.success) {
      setFormError(response.error || 'Could not save these hours.');
      return;
    }
    closeForm();
    load();
  };

  const toggleActive = async (item: Availability) => {
    if (!tokens?.access) return;
    const response = await apiClient.updateDoctorAvailability(item.id, { is_active: !item.is_active }, tokens.access);
    if (!response.success) setError(response.error || 'Could not update these hours.');
    load();
  };

  const remove = async (item: Availability) => {
    if (!tokens?.access) return;
    if (!confirm(`Remove ${capitalize(item.day_of_week)} ${formatTime(item.start_time)} – ${formatTime(item.end_time)}?`)) return;
    const response = await apiClient.deleteDoctorAvailability(item.id, tokens.access);
    if (!response.success) setError(response.error || 'Could not remove these hours.');
    closeForm();
    load();
  };

  if (loading) return <Spinner label="Loading weekly hours…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Hours"
        subtitle="Patients can only book slots inside these windows."
        actions={
          <button onClick={() => openCreate()} className={btnPrimary}>
            <Plus className="w-4 h-4" /> Add hours
          </button>
        }
      />

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      <Card className="divide-y divide-gray-100">
        {DAYS.map(day => {
          const windows = items.filter(item => item.day_of_week === day);
          return (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4">
              <div className="sm:w-32 flex-shrink-0">
                <p className="font-bold text-gray-900">{capitalize(day)}</p>
                {windows.length === 0 && <p className="text-sm text-gray-400">Closed</p>}
              </div>
              <div className="flex-1 flex flex-wrap gap-2">
                {windows.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl border ${
                      item.is_active ? 'border-green-200 bg-gradient-to-r from-green-50 to-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => toggleActive(item)}
                      title={item.is_active ? 'Active: click to pause' : 'Paused: click to activate'}
                      className={`w-2.5 h-2.5 rounded-full ${item.is_active ? 'bg-[#1C7E4E]' : 'bg-gray-300'}`}
                    />
                    <span className={`text-sm font-semibold ${item.is_active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                      {formatTime(item.start_time)} – {formatTime(item.end_time)}
                    </span>
                    <span className="text-xs text-gray-500">{item.slot_duration} min</span>
                    <button onClick={() => openEdit(item)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-[#047BCA] hover:bg-white">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => openCreate(day)} title={`Add hours on ${capitalize(day)}`} className={`${iconBtn} self-start sm:self-center`}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </Card>

      <p className="flex items-center gap-2 text-sm text-gray-500">
        <CalendarClock className="w-4 h-4" />
        Click the dot on a window to pause or resume it without deleting it. To close a single date, use Blocked Time.
      </p>

      {form && (
        <Modal title={editing ? 'Edit hours' : 'Add hours'} onClose={closeForm}>
          <form onSubmit={save} className="space-y-4">
            {formError && <ErrorBanner message={formError} />}
            <div>
              <label className={labelClass}>Day</label>
              <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })} className={inputClass}>
                {DAYS.map(day => <option key={day} value={day}>{capitalize(day)}</option>)}
              </select>
            </div>
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
            <div>
              <label className={labelClass}>Slot length</label>
              <select value={form.slot_duration} onChange={e => setForm({ ...form, slot_duration: Number(e.target.value) })} className={inputClass}>
                {DURATIONS.map(minutes => <option key={minutes} value={minutes}>{minutes} minutes</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#047BCA] focus:ring-[#047BCA]/30"
              />
              <span className="text-sm font-medium text-gray-700">Open for booking</span>
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              {editing && (
                <button type="button" onClick={() => remove(editing)} className={btnDanger}>
                  <Trash2 className="w-4 h-4" /> Remove
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
