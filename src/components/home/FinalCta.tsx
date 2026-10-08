import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/site';
import { RcButton, bodyText, container, leadHeading } from './ui';

export function FinalCta() {
  return (
    <div className="relative overflow-hidden py-20">
      <svg aria-hidden className="absolute inset-0 h-full w-full text-rc-rule" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
        <path d="M-40 420C240 300 420 560 720 430S1180 160 1480 260" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-40 480C260 360 460 620 760 490S1200 220 1480 320" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>

      <div className={`${container} relative grid items-center gap-12 text-center md:grid-cols-2 md:text-left`}>
        <div className="mx-auto max-w-xl md:mx-0">
          <h2 className={leadHeading}>
            One step closer to a <span className="text-rc-teal">pain-free life</span>
          </h2>
          <p className={`${bodyText} mt-4 md:mt-5`}>Tomorrow is too late — your joints need attention today.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:mt-10 md:justify-start">
            <RcButton href="/appointment" icon={<ArrowRight className="h-4 w-4" />}>
              Request appointment
            </RcButton>
            <RcButton href={CONTACT.phoneHref} variant="outlineDark" icon={<Phone className="h-4 w-4" />}>
              Call the clinic
            </RcButton>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <div aria-hidden className="absolute -inset-4 rounded-full bg-rc-lemon/60 blur-3xl" />
          <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-white bg-white shadow-[0_24px_80px_rgba(44,60,56,0.14)] animate-float motion-reduce:animate-none">
            <Image
              src="/images/hero-mobility.jpg"
              alt="Woman stretching freely with a healthy spine"
              fill
              sizes="(min-width: 768px) 420px, 80vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
