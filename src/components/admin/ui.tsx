'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle, Clock, Loader2, X, XCircle, type LucideIcon } from 'lucide-react';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white text-sm font-semibold shadow-md hover:from-[#145C38] hover:to-[#0369A1] focus:outline-none focus:ring-4 focus:ring-[#047BCA]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
export const btnSecondary =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-[#047BCA] hover:text-[#047BCA] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
export const btnDanger =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-all duration-200 disabled:opacity-50';
export const iconBtn =
  'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#047BCA] hover:text-[#047BCA] transition-colors disabled:opacity-50';
export const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#047BCA] focus:outline-none focus:ring-2 focus:ring-[#047BCA]/20';
export const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const statTones = {
  brand: 'from-[#1C7E4E] to-[#047BCA]',
  green: 'from-[#1C7E4E] to-[#1C7E4E]',
  blue: 'from-[#047BCA] to-[#047BCA]',
  amber: 'from-amber-500 to-amber-500',
  red: 'from-red-500 to-red-500',
};

export function StatCard({ label, value, icon: Icon, tone = 'brand', hint }: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof statTones;
  hint?: string;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${statTones[tone]} flex items-center justify-center shadow-md flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 leading-tight">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {hint && <p className="hidden sm:block text-xs text-gray-400 truncate">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}

const statusStyles: Record<string, { className: string; icon: LucideIcon }> = {
  pending: { className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  confirmed: { className: 'bg-green-50 text-[#1C7E4E] border-green-200', icon: CheckCircle },
  completed: { className: 'bg-blue-50 text-[#047BCA] border-blue-200', icon: CheckCircle },
  cancelled: { className: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? { className: 'bg-gray-50 text-gray-600 border-gray-200', icon: Clock };
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${style.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin text-[#047BCA]" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBanner({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="text-red-400 hover:text-red-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text?: string }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-[#047BCA]" />
      </div>
      <p className="font-semibold text-gray-900">{title}</p>
      {text && <p className="text-sm text-gray-500 mt-1">{text}</p>}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-t-3xl">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export const formatDate = (iso: string, options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', options);
};

export const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
