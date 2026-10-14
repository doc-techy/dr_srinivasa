'use client';

import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MODAL_COLORS = ['#243b55', '#0d9db8', '#5a9e3a', '#1C7E4E', '#047BCA'] as const;

type ServiceColorModalProps = {
  open: boolean;
  title: string;
  body: string;
  colorIndex: number;
  onClose: () => void;
  titleId?: string;
};

export function ServiceColorModal({
  open,
  title,
  body,
  colorIndex,
  onClose,
  titleId = 'service-color-modal-title',
}: ServiceColorModalProps) {
  const openedAtRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    openedAtRef.current = Date.now();
    const scrollY = window.scrollY;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      body.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const onBackdropPointerUp = useCallback(() => {
    if (Date.now() - openedAtRef.current < 400) return;
    onClose();
  }, [onClose]);

  if (!open || !mounted) return null;

  const backgroundColor = MODAL_COLORS[colorIndex % MODAL_COLORS.length];

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-xl"
        onPointerUp={onBackdropPointerUp}
        aria-hidden="true"
      />
      <div
        className="service-color-modal-panel relative z-10 w-full sm:max-w-lg max-h-[min(92vh,100dvh)] overflow-hidden rounded-t-3xl sm:rounded-2xl shadow-2xl mx-0 sm:mx-4 border border-white/40 bg-white/25 backdrop-blur-2xl"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative px-6 py-12 sm:px-8 sm:py-14 min-h-[min(55vh,420px)] sm:min-h-[280px] flex flex-col justify-center backdrop-blur-md border-t border-white/25"
          style={{
            background: `linear-gradient(145deg, color-mix(in srgb, ${backgroundColor} 94%, transparent) 0%, color-mix(in srgb, ${backgroundColor} 88%, transparent) 100%)`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h3
            id={titleId}
            className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight pr-14 mb-5"
          >
            {title}
          </h3>
          <p className="text-base sm:text-lg text-white leading-relaxed font-serif font-medium">
            {body}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
