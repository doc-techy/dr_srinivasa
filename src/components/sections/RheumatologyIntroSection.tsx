'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CONTACT } from '@/lib/site';
import { SymptomVibeCheck, symptoms } from './SymptomVibeCheck';

const heroImages = [
  {
    src: '/images/hero-jp-knee.jpg',
    alt: 'Hands holding a swollen, painful knee joint',
    position: 'object-[center_40%]',
  },
  {
    src: '/images/hero-jp-hands.jpg',
    alt: 'Stiff fingers showing morning joint pain',
    position: 'object-center',
  },
  {
    src: '/images/hero-jp-back.jpg',
    alt: 'Person holding lower back pain at night',
    position: 'object-[center_35%]',
  },
  {
    src: '/images/hero-jp-foot.jpg',
    alt: 'Painful big toe flare with ice pack nearby',
    position: 'object-center',
  },
];

const HERO_ROTATE_MS = 3500;

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
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setHeroIndex(i => (i + 1) % heroImages.length);
    }, HERO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#E6F5F3]">
        <div className="grid min-h-[100svh] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 pt-28 pb-10 lg:py-24">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-6xl font-semibold leading-[1.08] tracking-tight text-gray-900 max-w-xl">
              Living with{' '}
              <span className="gradient-text-primary font-extrabold">joint pain?</span>
              <br />
              Let&apos;s get you moving again.
            </h1>

            <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-gray-700">
              Stiff mornings, swollen joints, or a back that won&apos;t settle are not something you have to live with.
              Early diagnosis and the right treatment make all the difference.
            </p>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-700">
              Joint pain can come from wear-and-tear, inflammation, autoimmune disease, or crystal arthritis such as gout.
              Knowing which pattern you have helps protect the joint before lasting damage sets in.
            </p>

            <div className="mt-7 max-w-lg space-y-3">
              <p className="text-sm font-semibold text-gray-900">Signs it may be more than everyday strain</p>
              <ul className="space-y-2.5">
                {jointPainSignals.map(item => (
                  <li key={item.title} className="text-sm leading-relaxed text-gray-700">
                    <span className="font-semibold text-gray-900">{item.title}.</span> {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative min-h-[48vh] sm:min-h-[56vh] lg:min-h-full overflow-hidden bg-[#cfe8e3]">
            {heroImages.map((item, i) => (
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                fill
                priority={i === 0}
                quality={90}
                aria-hidden={i !== heroIndex}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover ${item.position} transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  i === heroIndex
                    ? 'z-[1] opacity-100 scale-100'
                    : 'z-0 opacity-0 scale-105'
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 z-[2] flex justify-center gap-2 pb-5 lg:pb-8">
              {heroImages.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === heroIndex}
                  onClick={() => setHeroIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === heroIndex ? 'w-9 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pain-check" className="relative isolate overflow-hidden bg-[#EAF7F5] py-10 lg:py-14">
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
