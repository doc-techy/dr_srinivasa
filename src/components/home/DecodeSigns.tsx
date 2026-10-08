'use client';

import { useRef } from 'react';
import {
  Activity,
  ArrowRight,
  BatteryLow,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Footprints,
  Hand,
  PersonStanding,
  ScanFace,
  Sunrise,
  Thermometer,
  type LucideIcon,
} from 'lucide-react';
import { RcButton, bodyText, container, leadHeading } from './ui';

type Sign = { title: string; hint: string; icon: LucideIcon; tone: string };

const signs: Sign[] = [
  { title: 'Joint pain & swelling', hint: 'Rheumatoid or psoriatic arthritis', icon: Hand, tone: 'bg-rc-mist' },
  { title: 'Morning stiffness', hint: 'Inflammatory arthritis', icon: Sunrise, tone: 'bg-rc-cream ring-1 ring-inset ring-rc-lemon' },
  { title: 'Back pain', hint: 'Ankylosing spondylitis', icon: PersonStanding, tone: 'bg-rc-line' },
  { title: 'Big toe pain', hint: 'Gout and uric acid problems', icon: Footprints, tone: 'bg-rc-mist' },
  { title: 'Muscle weakness', hint: 'Myositis', icon: Activity, tone: 'bg-rc-cream ring-1 ring-inset ring-rc-lemon' },
  { title: 'Skin rash', hint: 'Lupus (SLE) or vasculitis', icon: ScanFace, tone: 'bg-rc-line' },
  { title: 'Dry eyes & mouth', hint: 'Sjögren’s syndrome', icon: Droplets, tone: 'bg-rc-mist' },
  { title: 'Constant fatigue', hint: 'Fibromyalgia or autoimmune disease', icon: BatteryLow, tone: 'bg-rc-cream ring-1 ring-inset ring-rc-lemon' },
  { title: 'Unexplained fever', hint: 'Autoimmune or vasculitis flare', icon: Thermometer, tone: 'bg-rc-line' },
];

const arrowClass =
  'absolute top-[calc(50%-20px)] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-rc-ink opacity-0 shadow-[0_6px_24px_rgba(44,60,56,0.15)] transition-opacity duration-300 group-hover:opacity-100 md:flex';

export function DecodeSigns() {
  const trackRef = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) => trackRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' });

  return (
    <section className="overflow-hidden py-[clamp(80px,8.333vw,120px)]">
      <div className={container}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <h2 className={leadHeading}>
            Decode the signs of <span className="text-rc-teal">rheumatic conditions</span>
          </h2>
          <div>
            <p className={bodyText}>
              Rheumatology addresses conditions that affect the joints, bones, muscles and immune system. If you have
              persistent joint pain, swelling, stiffness or fatigue, it is a good idea to see a rheumatologist.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8">
              <RcButton href="/appointment" icon={<ArrowRight className="h-4 w-4" />}>
                Book Appointment
              </RcButton>
              <RcButton href="#faq" variant="outlineDark">
                Common questions
              </RcButton>
            </div>
          </div>
        </div>

        <div className="group relative mr-[calc(50%-50vw)] mt-[clamp(48px,5.556vw,80px)]">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous signs" className={`${arrowClass} left-2`}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <ul
            ref={trackRef}
            className="-ml-4 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto scroll-smooth pb-2 pl-4 pr-4 [scrollbar-width:none] sm:-ml-6 sm:scroll-pl-6 sm:pl-6 md:gap-8 [&::-webkit-scrollbar]:hidden"
          >
            {signs.map(({ title, hint, icon: Icon, tone }) => (
              <li key={title} className="w-[185px] shrink-0 snap-start md:w-[240px]">
                <div className={`relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-lg md:min-h-[320px] ${tone}`}>
                  <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[18px] border-white/60" />
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-rc-teal shadow-[0_8px_30px_rgba(122,186,178,0.35)] md:h-28 md:w-28">
                    <Icon className="h-9 w-9 md:h-12 md:w-12" strokeWidth={1.5} />
                  </span>
                  <p className="absolute inset-x-3 bottom-3 rounded-md bg-white/80 px-3 py-2 text-center text-[11px] leading-snug text-rc-muted backdrop-blur md:inset-x-4 md:bottom-4 md:text-xs">
                    May point to: <span className="font-medium text-rc-ink">{hint}</span>
                  </p>
                </div>
                <h3 className="mt-4 text-center text-xs font-semibold text-rc-ink md:mt-5 md:text-lg">{title}</h3>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => scroll(1)} aria-label="Next signs" className={`${arrowClass} right-6`}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
