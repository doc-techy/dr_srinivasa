import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { CLINIC_NAME } from '@/lib/site';
import { RcButton, bodyText, container, heading, leadHeading } from './ui';

const education = [
  { title: 'DM — Rheumatology & Immunology', detail: "Nizam's Institute of Medical Sciences, Hyderabad" },
  { title: 'MD — General Medicine', detail: 'Sri Devaraj Urs Medical College, Kolar' },
  { title: 'MBBS', detail: 'Vijayanagar Institute of Medical Sciences (VIMS), Bellary' },
];

const experience = [
  { title: `${CLINIC_NAME}, Hulimavu`, detail: 'Consultant Rheumatologist · Present' },
  { title: 'Fortis Hospital, Bannerghatta Road', detail: 'Rheumatology consultation' },
  { title: 'Sakra World Hospital', detail: 'Associate Consultant – Rheumatology · 2014 – 2019' },
];

function CredentialList({ label, items }: { label: string; items: { title: string; detail: string }[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-teal-dark">{label}</p>
      <ul className="mt-3">
        {items.map(({ title, detail }) => (
          <li key={title} className="border-t border-rc-rule py-4">
            <h4 className="text-base font-semibold text-rc-ink">{title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-rc-muted">{detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MeetDoctor() {
  return (
    <div className="py-[clamp(80px,8.333vw,120px)]">
      <div className={container}>
        <h2 className={`${leadHeading} max-w-3xl`}>
          Specialist rheumatology care, <span className="text-rc-teal">under one trusted name</span>
        </h2>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <div className="relative isolate overflow-hidden rounded-[24px] bg-rc-mist px-8 pt-10">
              <span aria-hidden className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full border-[40px] border-white/70" />
              <span aria-hidden className="absolute -bottom-20 -left-16 -z-10 h-72 w-72 rounded-full bg-rc-line blur-2xl" />
              <Image
                src="/images/doctor-cutout.png"
                alt="Dr. Srinivasa C"
                width={574}
                height={793}
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="mx-auto h-auto w-full max-w-[380px]"
              />
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-rc-ink">Dr. Srinivasa C</p>
                <p className="text-sm text-rc-muted">Consultant Rheumatologist</p>
              </div>
              <span className="rounded-full bg-rc-lemon px-4 py-2 text-xs font-semibold text-rc-ink">16+ years</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rc-teal-dark">Meet your doctor</p>
            <h3 className={`${heading} mt-3`}>MBBS, MD (General Medicine), DM (Rheumatology & Immunology)</h3>
            <p className={`${bodyText} mt-4`}>
              Dr. Srinivasa C is a Consultant Rheumatologist in Bangalore. He cares for inflammatory and degenerative
              joint disease, connective tissue disorders, vasculitis, osteoporosis and related immune conditions — with
              clear explanations, evidence-based treatment and planned follow-up.
            </p>
            <p className="mt-3 text-sm text-rc-ink">
              <span className="font-semibold">Languages:</span> English, Hindi, Kannada, Telugu
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-8">
              <CredentialList label="Education" items={education} />
              <CredentialList label="Experience" items={experience} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RcButton href="/appointment" icon={<ArrowRight className="h-4 w-4" />}>
                Book Consultation
              </RcButton>
              <RcButton href="/about" variant="outlineDark">
                Full profile
              </RcButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
