'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/site';
import { SymptomVibeCheck, symptoms } from './SymptomVibeCheck';

const marqueeItems = [
  'Rheumatoid Arthritis',
  'Ankylosing Spondylitis',
  'Lupus (SLE)',
  'Psoriatic Arthritis',
  'Gout',
  'Osteoarthritis',
  'Vasculitis',
  'Osteoporosis',
  'Fibromyalgia',
  'Sjogren’s Syndrome',
];

function BookButton() {
  return (
    <Link
      href="/appointment"
      className="group inline-flex items-center gap-2 rounded-full bg-gray-900 pl-6 pr-2 py-2 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#0B5FA5]"
    >
      Book a consultation
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-gray-900 transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function ContactButtons() {
  return (
    <>
      <a
        href={CONTACT.phoneHref}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-[#047BCA] hover:text-[#047BCA]"
      >
        <Phone className="h-4 w-4" />
        {CONTACT.phone}
      </a>
      <a
        href={CONTACT.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-12 w-12 place-items-center rounded-full border border-gray-200 bg-white text-[#1C7E4E] transition-colors hover:border-[#1C7E4E] hover:bg-[#1C7E4E] hover:text-white"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </>
  );
}

export function RheumatologyIntroSection() {
  const [picked, setPicked] = useState(0);

  return (
    <section className="relative isolate overflow-hidden pt-28 lg:pt-32 bg-[#F6FAF8]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-20 right-0 h-[24rem] w-[24rem] rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#0B5FA5_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.05]" />
      </div>

      <div className="container-custom">
        <div className="grid items-center gap-10 lg:gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-gray-900">
              Living with{' '}
              <span className="relative whitespace-nowrap">
                <span className="gradient-text-primary font-extrabold">joint pain?</span>
                <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none">
                  <path d="M2 9c60-6 180-8 296-3" stroke="#1C7E4E" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".45" />
                </svg>
              </span>
              <br />
              Let&apos;s get you moving again.
            </h1>

            <p className="mx-auto lg:mx-0 mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-gray-600">
              Stiff mornings, swollen joints or a back that won&apos;t settle are not something you have to live with.
              Early diagnosis and the right treatment make all the difference.
            </p>

            <SymptomVibeCheck picked={picked} onPick={setPicked} />

            <div className="mt-8 hidden lg:flex flex-wrap items-center justify-start gap-3">
              <BookButton />
              <ContactButtons />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-[#047BCA]/20 ring-1 ring-black/5">
              {symptoms.map((item, i) => (
                <Image
                  key={item.image}
                  src={item.image}
                  alt={item.alt}
                  fill
                  priority={i === 0}
                  aria-hidden={i !== picked}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className={`object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    i === picked ? 'z-[1] opacity-100 scale-100 blur-0' : 'z-0 opacity-0 scale-110 blur-md'
                  }`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 z-[2] h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-3 lg:hidden">
              <BookButton />
              <div className="flex items-center gap-3">
                <ContactButtons />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mt-16 overflow-hidden border-y border-[#047BCA]/10 bg-white/70 py-4 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="hero-marquee flex w-max whitespace-nowrap text-lg sm:text-xl font-semibold text-[#0B5FA5]/80">
          {[0, 1].map(copy => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {marqueeItems.map(item => (
                <span key={item} className="flex items-center gap-10 pr-10">
                  {item}
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1C7E4E]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-marquee {
          animation: hero-marquee 35s linear infinite;
          will-change: transform;
        }
        @keyframes hero-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-marquee {
            animation-duration: 90s;
          }
        }
      `}</style>
    </section>
  );
}
