'use client';

import Link from 'next/link';
import { CLINIC_NAME, CONTACT } from '@/lib/site';

const focusAreas = [
  { title: 'Joints', text: 'Rheumatoid and other inflammatory arthritis, with swelling and morning stiffness.' },
  { title: 'Immune system', text: 'Lupus, Sjögren’s syndrome and other autoimmune disease.' },
  { title: 'Spine', text: 'Ankylosing spondylitis and back pain that eases once you start moving.' },
  { title: 'Bones', text: 'Osteoporosis, fracture risk and disorders of calcium and bone strength.' },
  { title: 'Blood vessels', text: 'Vasculitis, where inflammation affects blood vessels of different sizes.' },
  { title: 'Muscles', text: 'Inflammatory muscle disease, fibromyalgia and widespread body pain.' },
];

const facts = [
  { value: '16+', label: 'Years in rheumatology' },
  { value: 'DM', label: "Nizam's Institute, Hyderabad" },
  { value: '3', label: 'English, Hindi, Kannada' },
];

export function RheumatologyIntroSection() {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (!element) return;
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 80;
    window.scrollTo({ top: element.offsetTop - headerHeight, behavior: 'smooth' });
  };

  return (
    <section className="pt-28 pb-12 lg:pt-32 lg:pb-16">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center border-l-4 border-[#1C7E4E] pl-5 sm:pl-7">
            <p className="text-sm font-semibold text-[#047BCA]">{CLINIC_NAME} · Hulimavu, Bangalore</p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-gray-900 leading-[1.08]">
              Joint pain deserves a <span className="text-[#1C7E4E]">proper diagnosis.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-600">
              Rheumatology is the medicine of joints, muscles, bones and the immune system. Many of these illnesses are
              autoimmune: the body’s defence turns on its own tissue and causes inflammation.
            </p>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600">
              They are long-term conditions, and most of them can be controlled. The earlier the diagnosis, the better
              the chance of protecting the joints and staying active.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/appointment"
                className="inline-flex justify-center bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] hover:from-[#145C38] hover:to-[#0369A1] text-white px-8 py-3.5 font-semibold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Consultation
              </Link>
              <a href={CONTACT.phoneHref} className="text-center sm:text-left text-gray-800 hover:text-[#047BCA]">
                Call <span className="font-semibold">{CONTACT.phone}</span>
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-3">
              {facts.map(({ value, label }) => (
                <div key={label} className="bg-white/80 rounded-xl border border-white/70 shadow-md px-3 py-4 text-center">
                  <dt className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">{value}</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-600 leading-snug">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6 bg-white/90 border border-white/70 rounded-3xl shadow-xl p-5 sm:p-7 lg:p-8 flex flex-col">
            <div className="flex items-end justify-between gap-4 border-b-4 border-[#047BCA] pb-3">
              <h2 className="text-2xl font-bold text-gray-900">What we treat</h2>
              <button onClick={scrollToServices} className="text-sm font-semibold text-[#047BCA] hover:text-[#1C7E4E] shrink-0">
                All conditions →
              </button>
            </div>
            <ul className="mt-1">
              {focusAreas.map(({ title, text }) => (
                <li key={title} className="py-3.5 border-b border-gray-100 last:border-b-0">
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">Clinic hours.</span> Monday to Saturday, 9:00 AM – 12:00 noon
              and 4:00 PM – 7:30 PM. Sunday holiday. Consultations by appointment at Hulimavu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
