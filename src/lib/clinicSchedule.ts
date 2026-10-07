import { AvailableDate } from './api';

// Keep in sync with the backend seed schedule (backend/srinivasa/migrations/0002_seed_schedule.py).
const SESSIONS: [string, string][] = [['09:00', '12:00'], ['16:00', '19:30']];
const SLOT_MINUTES = 15;
const SAME_DAY_LEAD_MINUTES = 30;
const CLOSED_WEEKDAYS = [0]; // Sunday

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function getScheduleSlots(isoDate: string, now: Date = new Date()): string[] {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (CLOSED_WEEKDAYS.includes(date.getDay())) return [];

  const today = toISODate(now);
  if (isoDate < today) return [];
  const cutoff = isoDate === today ? now.getHours() * 60 + now.getMinutes() + SAME_DAY_LEAD_MINUTES : -1;

  const slots: string[] = [];
  for (const [start, end] of SESSIONS) {
    for (let t = toMinutes(start); t + SLOT_MINUTES <= toMinutes(end); t += SLOT_MINUTES) {
      if (t >= cutoff) slots.push(toHHMM(t));
    }
  }
  return slots;
}

export function getScheduleDates(days: number, now: Date = new Date()): AvailableDate[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const date = toISODate(d);
    return { date, available_count: getScheduleSlots(date, now).length };
  });
}
