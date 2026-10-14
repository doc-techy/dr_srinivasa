'use client';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { Activity, FlaskConical, Microscope, ShieldCheck, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const LAB_TESTS = [
  {
    title: 'Routine Lab Tests',
    description: 'Biochemistry • Haematology • Microbiology • Hormone Tests • Serology • and more',
    Icon: FlaskConical,
  },
  {
    title: 'Inflammation Tests',
    description: 'ESR, CRP and other inflammation-related investigations',
    Icon: Activity,
  },
  {
    title: 'Rheumatology & Immunology Tests',
    description: 'RF, Anti-CCP, ANA, Anti-dsDNA, ENA profile, complements and more',
    Icon: ShieldCheck,
  },
  {
    title: 'Specialised Tests',
    description:
      'HLA-B27, TB QuantiFERON Gold, ANCA, myositis antibodies and other specialised rheumatology & immunology tests',
    Icon: Microscope,
  },
];

type LabTestsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LabTestsModal({ open, onClose }: LabTestsModalProps) {
  const openedAtRef = useRef(0);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    openedAtRef.current = Date.now();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const onBackdropPointerUp = useCallback(() => {
    if (Date.now() - openedAtRef.current < 400) return;
    onCloseRef.current();
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-tests-modal-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onPointerUp={onBackdropPointerUp}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full sm:max-w-3xl max-h-[min(92vh,100dvh)] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-gradient-to-br from-[#F2FBFA] via-white to-[#E8F4FC] shadow-2xl border border-[#047BCA]/15"
        data-scroll-lock-allow
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-5 sm:px-8 pt-8 pb-8 sm:pt-10 sm:pb-10">
          <button
            type="button"
            onClick={() => onCloseRef.current()}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#047BCA]/20 text-[#0B5FA5] hover:bg-[#E6F5F3] flex items-center justify-center transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h3
            id="lab-tests-modal-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight pr-12 mb-6 sm:mb-8"
          >
            <span className="text-gray-900">Find the </span>
            <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">
              Test You Need
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {LAB_TESTS.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="rounded-2xl bg-white/90 border border-[#047BCA]/12 p-5 sm:p-6 text-left shadow-sm"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA]">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
