'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/site';
import { RcButton } from './ui';

const SLIDE_MS = 4500;

const slides: ReactNode[] = [
  <>
    No more <strong>joint pain</strong>, comfort begins <strong>today</strong>
  </>,
  <>
    Consult a <strong>DM-qualified</strong> rheumatologist in Bangalore
  </>,
  <>
    Advanced care for <strong>autoimmune</strong> conditions
  </>,
];

export function HomeHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setActive(index => (index + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <div className="px-3 pt-[5.5rem] sm:px-4 sm:pt-24 lg:pt-[6.75rem]">
      <div className="relative isolate flex min-h-[calc(100svh-6.5rem)] flex-col overflow-hidden rounded-[2rem] bg-rc-teal px-6 pt-10 text-rc-offwhite sm:px-10 lg:min-h-[max(620px,calc(100svh-8.5rem))] lg:px-[2.68rem] lg:pt-[3.18rem]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-rc-aqua/45 blur-3xl" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[48px] border-white/[0.06]" />
          <div className="absolute -bottom-24 right-[6%] h-[30rem] w-[30rem] rounded-full bg-rc-soft/35 blur-2xl" />
          <svg className="absolute bottom-0 left-0 h-48 w-[60%] text-white/[0.07]" viewBox="0 0 600 200" fill="none" preserveAspectRatio="none">
            <path d="M0 160C120 90 240 200 360 130S560 40 600 80" stroke="currentColor" strokeWidth="2" />
            <path d="M0 190C140 120 260 220 380 160S560 80 600 110" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="sr-only">Dr. Srinivasa C — Consultant Rheumatologist in Hulimavu, Bangalore</h1>

        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-[5.625rem]">
          <div className="lg:w-[60%]">
            <div aria-hidden className="grid">
              {slides.map((slide, index) => (
                <p
                  key={index}
                  className={`[grid-area:1/1] max-w-[680px] text-[clamp(2.25rem,4.444vw,4rem)] font-normal leading-[1.2] transition-all duration-700 ease-out [&_strong]:font-bold ${
                    index === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
                  }`}
                >
                  {slide}
                </p>
              ))}
            </div>

            <p className="mt-4 max-w-md text-base font-medium leading-normal lg:hidden">
              Take the first step toward healthier joints, with expert guidance by your side and care that&apos;s truly
              dedicated.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10">
              <RcButton href="/appointment" variant="lemon" icon={<ArrowRight className="h-4 w-4" />}>
                Book Appointment
              </RcButton>
              <RcButton href={CONTACT.phoneHref} variant="outlineLight" icon={<Phone className="h-4 w-4" />}>
                {CONTACT.phone}
              </RcButton>
            </div>
          </div>

          <p className="hidden max-w-[32rem] pt-8 text-base font-medium leading-normal lg:block lg:w-[40%] xl:text-lg">
            Get expert guidance and the right treatment plan from Dr. Srinivasa C, Consultant Rheumatologist at Artho
            Rheuma Care, Hulimavu.
          </p>
        </div>

        <div
          className="relative z-10 mt-10 flex gap-[7px] lg:absolute lg:bottom-[82px] lg:left-[2.68rem] lg:mt-0"
          style={{ '--rc-slide-ms': `${SLIDE_MS}ms` } as CSSProperties}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show slide ${index + 1}`}
              className="relative h-[3px] w-full max-w-[170px] overflow-hidden rounded-2xl bg-rc-offwhite/40 py-0 sm:w-[170px]"
            >
              {index === active && <span key={active} className="absolute inset-y-0 left-0 animate-rc-progress bg-white" />}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-auto w-[78%] max-w-[340px] pt-8 sm:max-w-[380px] lg:absolute lg:bottom-0 lg:right-[4%] lg:mt-0 lg:h-[76%] lg:w-auto lg:max-w-none lg:pt-0">
          <Image
            src="/images/doctor-cutout.png"
            alt="Dr. Srinivasa C, Consultant Rheumatologist"
            width={574}
            height={793}
            priority
            sizes="(min-width: 1024px) 34vw, 80vw"
            className="h-auto w-full lg:h-full lg:w-auto"
          />
          <div className="absolute bottom-5 left-0 rounded-2xl bg-rc-offwhite/95 px-4 py-3 text-rc-ink shadow-[0_10px_30px_rgba(44,60,56,0.18)] backdrop-blur lg:-left-16 lg:bottom-10">
            <p className="text-sm font-semibold leading-tight">Dr. Srinivasa C</p>
            <p className="mt-1 text-xs text-rc-muted">MBBS, MD, DM (Rheumatology)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
