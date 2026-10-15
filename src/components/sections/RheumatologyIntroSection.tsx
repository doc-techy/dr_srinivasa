'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SymptomVibeCheck, symptoms } from './SymptomVibeCheck';

const heroImages = [
  {
    src: '/images/hero-stretch-third.jpg',
    alt: 'Older man stretching in a garden, standing from the right two-thirds of the frame',
    position: 'object-center',
  },
  {
    src: '/images/hero-walk-third.jpg',
    alt: 'Older man walking a garden path, starting a third of the way across the frame',
    position: 'object-center',
  },
];

const HERO_ROTATE_MS = 5000;

const jointPainSignals = [
  {
    title: 'Morning stiffness',
    detail: 'Lasts over 30 minutes after waking.',
  },
  {
    title: 'Swollen or warm joints',
    detail: 'Often a sign of active inflammation.',
  },
  {
    title: 'Pain on both sides',
    detail: 'Same joints on both hands or knees.',
  },
  {
    title: 'Night back pain',
    detail: 'Wakes you and eases when you move.',
  },
];

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

export function RheumatologyIntroSection() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex(i => (i + 1) % heroImages.length);
    }, HERO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <section className="relative isolate mt-[var(--site-header-height,6rem)] h-[calc(100svh-var(--site-header-height,6rem))] overflow-hidden bg-[#0B2A28]">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-700 ease-out"
            style={{
              width: `${heroImages.length * 100}%`,
              transform: `translateX(-${(heroIndex * 100) / heroImages.length}%)`,
            }}
          >
            {heroImages.map((item, i) => (
              <div key={item.src} className="relative h-full shrink-0" style={{ width: `${100 / heroImages.length}%` }}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority
                  quality={90}
                  aria-hidden={i !== heroIndex}
                  sizes="100vw"
                  className={`object-cover ${item.position}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex h-full items-center px-6 sm:px-10 lg:px-16">
          <div className="w-full max-w-lg lg:max-w-[36rem] [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight text-white">
              Living with
              <br />
              <span className="text-[#B8F0D4] font-extrabold">joint pain?</span>
              <span className="mt-4 block">
                Let&apos;s get you
                <br />
                moving again.
              </span>
            </h1>

            <div className="mt-6 space-y-3 border-t border-white/40 pt-5">
              <p className="text-base font-semibold text-white">Signs it may be more than everyday strain</p>
              <ul className="space-y-2">
                {jointPainSignals.map(item => (
                  <li key={item.title} className="text-base leading-snug text-white">
                    <span className="font-semibold">{item.title}.</span> {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2">
          {heroImages.map((item, i) => (
            <button
              key={item.src}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === heroIndex}
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === heroIndex ? 'w-9 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      <section id="pain-check" className="relative isolate overflow-hidden bg-[#B5DBD3] py-10 lg:py-14">
        <div className="container-custom">
          <div className="rounded-3xl border border-white/80 bg-white/60 p-4 sm:p-6 lg:p-8 shadow-lg">
            <div className="grid items-center gap-8 lg:gap-10 lg:grid-cols-[1.15fr_1fr]">
              <div className="text-center lg:text-left">
                <SymptomVibeCheck picked={picked} onPick={setPicked} />
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-2xl bg-[#cfe8e3]">
                  {symptoms.map((item, i) => (
                    <Image
                      key={item.image}
                      src={item.image}
                      alt={item.alt}
                      fill
                      aria-hidden={i !== picked}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                        i === picked ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
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
    </>
  );
}
