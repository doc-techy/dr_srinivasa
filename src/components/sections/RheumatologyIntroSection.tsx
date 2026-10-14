'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CONTACT } from '@/lib/site';
import { SymptomVibeCheck, symptoms } from './SymptomVibeCheck';

const heroImages = [
  {
    src: '/images/hero-active-stretch.jpg',
    alt: 'Active older adult stretching outdoors in a park',
    position: 'object-[center_30%]',
  },
  {
    src: '/images/hero-active-family.jpg',
    alt: 'Grandfather laughing with a child on his shoulders',
    position: 'object-[center_20%]',
  },
];

const HERO_ROTATE_MS = 5000;

const jointPainSignals = [
  {
    title: 'Morning stiffness',
    detail: 'Over 30 minutes of stiffness after waking can signal inflammatory arthritis.',
  },
  {
    title: 'Swollen or warm joints',
    detail: 'Puffy, warm joints often mean active inflammation that needs attention.',
  },
  {
    title: 'Pain on both sides',
    detail: 'Same joints hurting on both hands or knees is common in rheumatoid arthritis.',
  },
  {
    title: 'Night back pain',
    detail: 'Back pain that wakes you and eases with movement may point to spondyloarthritis.',
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

function BookButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={CONTACT.phoneHref}
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-95 ${className}`}
    >
      Book a consultation
    </a>
  );
}

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
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20"
          aria-hidden
        />

        <div className="relative z-10 flex h-full flex-col justify-center px-5 sm:px-8 lg:px-16 xl:px-20 py-8 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.08] tracking-tight text-white max-w-xl">
            Living with{' '}
            <span className="text-[#B8F0D4] font-extrabold">joint pain?</span>
            <br />
            Let&apos;s get you moving again.
          </h1>

          <div className="mt-8 max-w-xl space-y-3">
            <p className="text-sm font-semibold text-white">Signs it may be more than everyday strain</p>
            <ul className="space-y-2.5">
              {jointPainSignals.map(item => (
                <li key={item.title} className="text-sm leading-relaxed text-white/85">
                  <span className="font-semibold text-white">{item.title}.</span> {item.detail}
                </li>
              ))}
            </ul>
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
          <div className="grid items-center gap-10 lg:gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="text-center lg:text-left">
              <SymptomVibeCheck picked={picked} onPick={setPicked} />

              <div className="mt-8 hidden lg:flex flex-wrap items-center justify-start gap-3">
                <BookButton />
              </div>
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
              <div className="mt-6 flex justify-center lg:hidden">
                <BookButton />
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
