'use client';

import Link from 'next/link';
import { Activity, ArrowRight, Award, Bone, Calendar, CheckCircle, Dna, HeartPulse, Layers, Microscope, ShieldCheck } from 'lucide-react';

const focusAreas = [
  { title: 'Joints', text: 'Arthritis, swelling & stiffness', Icon: Activity },
  { title: 'Immune System', text: 'Lupus, Sjögren’s & autoimmunity', Icon: ShieldCheck },
  { title: 'Spine', text: 'Inflammatory back pain', Icon: Layers },
  { title: 'Bones', text: 'Osteoporosis & bone health', Icon: Bone },
  { title: 'Blood Vessels', text: 'Vasculitis care', Icon: HeartPulse },
  { title: 'Muscles', text: 'Myositis & body pain', Icon: Dna },
];

const pillars = ['Early, accurate diagnosis', 'Evidence-based treatment', 'Long-term follow-up'];

const warningSigns = [
  'Joint pain or swelling for over 6 weeks',
  'Morning stiffness over 30 minutes',
  'Back pain that eases with activity',
  'Unexplained fever, rash or fatigue',
  'Fingers turning white or blue in cold',
  'Dry eyes and dry mouth',
  'Sudden attacks of painful joints',
  'Muscle weakness',
];

export function RheumatologyIntroSection() {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (!element) return;
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 80;
    window.scrollTo({ top: element.offsetTop - headerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-10 lg:pt-36 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1C7E4E]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] bg-[#047BCA]/10 rounded-full blur-3xl -z-10" />

      <div className="container-custom w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="fade-in-left space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#1C7E4E]/20 rounded-full shadow-sm text-sm font-semibold text-[#1C7E4E]">
              <span className="w-2 h-2 rounded-full bg-[#1C7E4E] animate-pulse" />
              Rheumatology &amp; Immunology Care
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Specialist care for
              <span className="block bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">
                Joints, Bones &amp; Immunity
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Rheumatology is the medical speciality that diagnoses and treats arthritis, autoimmune diseases, and
              disorders of the joints, muscles, bones, and blood vessels. Early diagnosis and the right treatment
              control inflammation, prevent damage, and keep you active.
            </p>

            <ul className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
              {pillars.map(pillar => (
                <li key={pillar} className="flex items-center text-sm sm:text-base font-medium text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-2 text-[#1C7E4E]" />
                  {pillar}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/appointment"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-[#145C38] hover:to-[#0369A1] transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button
                onClick={scrollToServices}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/90 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-[#047BCA] hover:text-[#047BCA] transition-all duration-300 hover:scale-105"
              >
                Conditions We Treat
              </button>
            </div>
          </div>

          <div className="fade-in-right relative">
            <div className="absolute inset-6 bg-gradient-to-br from-[#1C7E4E]/20 to-[#047BCA]/20 rounded-[2.5rem] blur-2xl -z-10" />
            <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-[2rem] p-4 sm:p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {focusAreas.map(({ title, text, Icon }) => (
                  <div
                    key={title}
                    className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#047BCA]/30 transition-all duration-300"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">{title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex absolute -top-5 -right-3 lg:-right-6 float-animation items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100">
              <Award className="w-8 h-8 text-[#1C7E4E]" />
              <div>
                <div className="text-lg font-bold text-gray-900 leading-none">16+ Years</div>
                <div className="text-xs text-gray-500">in Rheumatology</div>
              </div>
            </div>
            <div className="hidden sm:flex absolute -bottom-5 -left-3 lg:-left-6 float-animation items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100" style={{ animationDelay: '2s' }}>
              <Microscope className="w-8 h-8 text-[#047BCA]" />
              <div>
                <div className="text-lg font-bold text-gray-900 leading-none">DM Rheumatology</div>
                <div className="text-xs text-gray-500">NIMS, Hyderabad</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 lg:mt-16 bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-lg">
          <h2 className="text-center text-base sm:text-lg font-bold text-gray-900 mb-4">
            When should you see a <span className="text-[#047BCA]">Rheumatologist?</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {warningSigns.map(sign => (
              <span
                key={sign}
                className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 border border-[#047BCA]/15 text-xs sm:text-sm font-medium text-gray-700 hover:border-[#047BCA]/50 hover:text-[#047BCA] transition-colors duration-200"
              >
                {sign}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
