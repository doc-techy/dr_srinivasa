'use client';

import { useEffect, useState } from 'react';
import {
  Bone,
  ChevronDown,
  Droplets,
  Dumbbell,
  Hand,
  PersonStanding,
  ShieldPlus,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
type FocusArea = { title: string; text: string; icon: LucideIcon };

const focusAreas: FocusArea[] = [
  { title: 'Joints', text: 'Inflammatory arthritis', icon: Hand },
  { title: 'Immune system', text: 'Lupus, Sjögren’s', icon: ShieldPlus },
  { title: 'Spine', text: 'Ankylosing spondylitis', icon: PersonStanding },
  { title: 'Bones', text: 'Osteoporosis', icon: Bone },
  { title: 'Blood vessels', text: 'Vasculitis', icon: Droplets },
  { title: 'Muscles', text: 'Myositis, fibromyalgia', icon: Dumbbell },
];

const rheumatologyFacts = [
  { value: '100+', text: 'Types of arthritis and related conditions are treated by rheumatologists.' },
  { value: '3–6 months', text: 'The early window in rheumatoid arthritis when treatment best prevents joint damage.' },
  { value: '9 in 10', text: 'People with lupus are women, most often diagnosed between 15 and 45.' },
  { value: 'Any age', text: 'Rheumatic disease affects children and young adults too, not only the elderly.' },
];

const REVEAL_DELAYS = {
  150: 'delay-150',
  300: 'delay-300',
  500: 'delay-500',
} as const;

const ORBIT_RADIUS = 40;

function orbitPosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    left: `${50 + ORBIT_RADIUS * Math.cos(angle)}%`,
    top: `${50 + ORBIT_RADIUS * Math.sin(angle)}%`,
  };
}

export function RheumatologyIntroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 80;
    window.scrollTo({ top: element.offsetTop - headerHeight, behavior: 'smooth' });
  };

  const reveal = (delay: keyof typeof REVEAL_DELAYS) =>
    `transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${REVEAL_DELAYS[delay]}`;

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20 lg:min-h-screen flex items-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#1C7E4E]/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-[#047BCA]/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#047BCA1f_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      </div>

      <div className="container-custom w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 xl:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className={`text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] ${reveal(150)}`}>
              What is{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Rheumatology?</span>
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-[#1C7E4E]/40"
                >
                  <path d="M2 9c60-6 120-8 296-4" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className={`mt-6 text-base sm:text-lg leading-relaxed text-gray-600 max-w-xl mx-auto lg:mx-0 ${reveal(300)}`}>
              It is the branch of medicine that treats the{' '}
              <span className="font-semibold text-gray-900">joints, muscles, bones and immune system</span>. Many of these
              illnesses are autoimmune: the body’s defence turns on its own tissue and causes inflammation. Most can be
              controlled, and the earlier they are diagnosed, the better the joints are protected.
            </p>

            <div className={`mt-9 max-w-xl mx-auto lg:mx-0 text-left ${reveal(500)}`}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#047BCA]">
                Rheumatology at a glance
              </h2>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rheumatologyFacts.map(({ value, text }) => (
                  <div
                    key={value}
                    className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <dt className="text-2xl font-extrabold gradient-text-primary">{value}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-gray-600">{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative hidden lg:block mx-auto aspect-square w-full max-w-[600px]">
              <div className="absolute inset-[10%] rounded-full border-2 border-dashed border-[#047BCA]/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-[24%] rounded-full border border-[#1C7E4E]/15" />

              <div className="absolute inset-[31%] rounded-full bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] p-1 shadow-2xl shadow-[#047BCA]/30">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#1C7E4E]/30 to-[#047BCA]/30 blur-2xl -z-10 pulse-animation" />
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] text-white">
                  <Stethoscope className="h-12 w-12" strokeWidth={1.6} />
                  <span className="mt-2 text-xl font-bold tracking-tight">Rheumatology</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/80">6 body systems</span>
                </div>
              </div>

              {focusAreas.map(({ title, text, icon: Icon }, index) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => scrollTo('services')}
                  style={orbitPosition(index, focusAreas.length)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className="float-animation flex w-44 items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 text-left shadow-xl shadow-gray-900/5 backdrop-blur transition-all duration-300 group-hover:border-[#1C7E4E]/30 group-hover:shadow-2xl"
                    style={{ animationDelay: `${index * 0.6}s` }}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-gray-900">{title}</span>
                      <span className="block text-xs text-gray-500 truncate">{text}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:hidden rounded-3xl border border-white/80 bg-white/70 p-5 sm:p-6 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] text-white">
                  <Stethoscope className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-gray-900">What rheumatology covers</p>
                  <p className="text-xs text-gray-500">Six body systems, one specialist</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {focusAreas.map(({ title, text, icon: Icon }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => scrollTo('services')}
                    className="flex flex-col items-start gap-2 rounded-2xl border border-gray-100 bg-white p-3.5 text-left shadow-sm transition-all active:scale-[0.98] hover:border-[#1C7E4E]/30 hover:shadow-md"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1C7E4E]/10 to-[#047BCA]/10 text-[#047BCA]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold text-gray-900">{title}</span>
                    <span className="-mt-1.5 text-xs text-gray-500">{text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollTo('doctor')}
          className="mx-auto mt-12 hidden lg:flex flex-col items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-[#047BCA] transition-colors"
        >
          Meet the doctor
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
