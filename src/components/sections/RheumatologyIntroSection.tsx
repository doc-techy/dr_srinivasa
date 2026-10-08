'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Great_Vibes } from 'next/font/google';
import {
  ArrowRight,
  Bone,
  ChevronRight,
  Hand,
  HeartHandshake,
  MapPin,
  MessageCircle,
  PersonStanding,
  Phone,
  ShieldCheck,
  ShieldPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { CONTACT } from '@/lib/site';

const script = Great_Vibes({ weight: '400', subsets: ['latin'] });

type Item = { title: string; icon: LucideIcon; href: string };

const trustPoints: Item[] = [
  { title: 'Expert Care for All Ages', icon: Users, href: '/about' },
  { title: 'Evidence Based Treatment', icon: ShieldCheck, href: '/services' },
  { title: 'Personalised Long Term Care', icon: HeartHandshake, href: '/appointment' },
];

const conditions: Item[] = [
  { title: 'Arthritis Management', icon: Hand, href: '/services' },
  { title: 'Autoimmune Conditions', icon: ShieldPlus, href: '/services' },
  { title: 'Joint Pain Care', icon: PersonStanding, href: '/services' },
  { title: 'Bone & Muscle Health', icon: Bone, href: '/services' },
];

const REVEAL_DELAYS = {
  150: 'delay-150',
  300: 'delay-300',
  500: 'delay-500',
} as const;

const HERO_IMAGE = '/images/hero-mobility.jpg';
const HERO_ALT = 'Woman stretching with a healthy, highlighted spine';

const primaryBtn =
  'group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#047BCA]/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#145C38] hover:to-[#0369A1] hover:shadow-xl';

function ContactRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
      <a href={CONTACT.phoneHref} className="inline-flex items-center gap-1.5 font-medium hover:text-[#047BCA]">
        <Phone className="h-4 w-4 text-[#047BCA]" />
        {CONTACT.phone}
      </a>
      <a
        href={CONTACT.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-medium hover:text-[#1C7E4E]"
      >
        <MessageCircle className="h-4 w-4 text-[#1C7E4E]" />
        WhatsApp
      </a>
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="h-4 w-4 text-gray-400" />
        Bangalore
      </span>
    </div>
  );
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
    <section className="relative isolate overflow-hidden pt-24 pb-8 lg:pt-28 lg:pb-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#1C7E4E]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-[#047BCA]/15 blur-3xl" />
      </div>

      <div className="container-custom w-full">
        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-[1fr_1.15fr] items-center gap-6 xl:gap-10 overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white/90 via-white/70 to-sky-50/80 pl-10 xl:pl-14 py-8 shadow-2xl shadow-[#047BCA]/10 backdrop-blur">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.35em] text-gray-500 ${reveal(150)}`}>
              Specialised Rheumatology Care
            </p>
            <h1 className={`mt-4 text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.05] ${reveal(150)}`}>
              Move Freely.
              <br />
              <span className="gradient-text-primary">Live</span> Better.
            </h1>
            <p className={`mt-5 max-w-xl text-base xl:text-lg leading-relaxed text-gray-600 ${reveal(300)}`}>
              Comprehensive care for arthritis, autoimmune and musculoskeletal conditions — with a focus on long-term
              relief and better mobility. From early diagnosis to ongoing management, every treatment plan is tailored
              to your condition, lifestyle and goals, so you can stay active and enjoy the things you love.
            </p>
            <div className={`mt-6 flex flex-wrap gap-4 ${reveal(300)}`}>
              <Link href="/appointment" className={primaryBtn}>
                Book Appointment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() => scrollTo('doctor')}
                className="rounded-full border-2 border-[#047BCA]/30 bg-white px-7 py-3 text-sm font-semibold text-[#047BCA] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#047BCA] hover:bg-sky-50"
              >
                Know More
              </button>
            </div>
            <div className={`mt-4 ${reveal(300)}`}>
              <ContactRow />
            </div>
            <ul className={`mt-6 flex flex-wrap gap-2 ${reveal(500)}`}>
              {trustPoints.map(({ title, icon: Icon, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-sky-50 px-3.5 py-2 ring-1 ring-[#047BCA]/15 transition-all hover:-translate-y-0.5 hover:ring-[#047BCA]/40"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#047BCA]" strokeWidth={2} />
                    <span className="text-xs font-medium text-gray-800">{title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`relative -my-8 self-stretch min-h-[34rem] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_22%)]">
              <Image src={HERO_IMAGE} alt={HERO_ALT} fill priority sizes="55vw" className="object-cover object-[45%_center]" />
            </div>
            <div
              aria-hidden
              className={`${script.className} pointer-events-none absolute right-8 top-[10%] -rotate-12 text-right text-5xl xl:text-6xl leading-[1.05] text-[#0B5FA5]`}
            >
              Stronger
              <br />
              Joints
              <br />
              Brighter
              <br />
              Days
              <svg viewBox="0 0 120 12" className="ml-auto mt-1 h-3 w-28 text-[#1C7E4E]">
                <path d="M2 10C40 3 80 2 118 4" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile & tablet */}
        <div className="lg:hidden space-y-4">
          <div
            className={`relative min-h-[17rem] overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-100 shadow-xl shadow-[#047BCA]/10 ${reveal(150)}`}
          >
            <div className="absolute inset-y-0 right-0 w-[55%] [mask-image:linear-gradient(to_right,transparent,black_35%)]">
              <Image src={HERO_IMAGE} alt={HERO_ALT} fill priority sizes="55vw" className="object-cover object-[55%_30%]" />
            </div>
            <div className="relative z-10 w-[62%] p-5 sm:p-8">
              <h1 className="text-[1.6rem] sm:text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
                Expert <span className="gradient-text-primary">Rheumatology</span> Care
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
                Relief. Mobility.
                <br />
                Better Living.
              </p>
              <Link href="/appointment" className={`${primaryBtn} mt-5 px-5 py-2.5`}>
                Book Appointment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className={`rounded-2xl bg-white/90 px-4 py-3 shadow-sm ${reveal(300)}`}>
            <ContactRow />
          </div>

          <ul className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${reveal(300)}`}>
            {conditions.map(({ title, icon: Icon, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="flex h-full w-full items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1C7E4E]/10 to-[#047BCA]/15 text-[#047BCA]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-snug text-gray-800">{title}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className={`flex w-full items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-left ring-1 ring-[#1C7E4E]/15 transition-colors hover:bg-emerald-100/70 ${reveal(500)}`}
          >
            <ShieldCheck className="h-7 w-7 shrink-0 text-[#1C7E4E]" />
            <span className="flex-1 text-sm font-semibold text-[#145C38]">
              Personalised. Compassionate. Evidence Based.
            </span>
            <ChevronRight className="h-5 w-5 text-[#1C7E4E]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
