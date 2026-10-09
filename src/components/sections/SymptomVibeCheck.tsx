'use client';

import { Flag, Flame, Footprints, Hand, Moon, Sparkles, Sunrise } from 'lucide-react';

export const symptoms = [
  {
    icon: Sunrise,
    label: 'Morning stiffness',
    image: '/images/symptom-morning-stiffness.jpg',
    alt: 'Person rubbing stiff fingers in the morning',
    color: '#DCF2E6',
    hint: 'Stiffness lasting over 30 minutes can be an early sign of inflammatory arthritis.',
    tips: ['Warm shower first thing to loosen up', 'Gentle stretches before getting out of bed', 'Track how long the stiffness lasts each day'],
    flag: 'Stiff for 30+ min most mornings? Get it checked.',
  },
  {
    icon: Flame,
    label: 'Swollen joints',
    image: '/images/symptom-swollen-joints.jpg',
    alt: 'Person holding a cold pack on a swollen knee',
    color: '#DDEEFA',
    hint: 'Warm, puffy joints usually point to active inflammation that needs attention.',
    tips: ['Cold pack for 15 min to calm the swelling', 'Rest the joint, but keep it gently moving', 'Snap a photo to show your doctor'],
    flag: 'Swelling with redness, heat or fever needs a visit soon.',
  },
  {
    icon: Moon,
    label: 'Back pain at night',
    image: '/images/symptom-back-pain-night.jpg',
    alt: 'Person holding their lower back at night',
    color: '#E3F5EE',
    hint: 'Back pain that eases with movement may signal spondyloarthritis.',
    tips: ['Stay active, movement helps more than bed rest', 'Try a firm mattress and a thin pillow', 'Daily posture and back-extension exercises'],
    flag: 'Pain waking you up at night for 3+ months is a red flag.',
  },
  {
    icon: Hand,
    label: 'Pain in many joints',
    image: '/images/symptom-many-joints.jpg',
    alt: 'Person massaging painful finger joints',
    color: '#E2ECFB',
    hint: 'Pain in small joints of both hands or feet is common in rheumatoid arthritis.',
    tips: ['Note which joints hurt and if it is both sides', 'Use easy-grip tools to protect your hands', 'Avoid long-term self-medication with painkillers'],
    flag: 'Same joints hurting on both sides? See a rheumatologist early.',
  },
  {
    icon: Footprints,
    label: 'Sudden toe pain',
    image: '/images/symptom-toe-pain.jpg',
    alt: 'Person holding a painful big toe',
    color: '#E6F4EA',
    hint: 'A sudden, intense big-toe flare is a classic sign of gout.',
    tips: ['Drink plenty of water through the day', 'Cut down on red meat, seafood and alcohol', 'Rest and elevate the foot during a flare'],
    flag: 'Repeated flares can damage joints, so get uric acid checked.',
  },
];

const tilts = ['-rotate-2', 'rotate-1', '-rotate-1'];

export function SymptomVibeCheck({ picked, onPick }: { picked: number; onPick: (i: number) => void }) {
  const s = symptoms[picked];

  return (
    <div className="relative mx-auto lg:mx-0 mt-10 max-w-xl rounded-3xl border-2 border-[#0B5FA5] bg-white p-4 sm:p-5 text-left shadow-[6px_6px_0_#1C7E4E]">
      <span className="absolute -top-4 left-5 rounded-full bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
        <Sparkles className="mr-1 inline h-3 w-3 -translate-y-px" />
        pain check
      </span>

      <p className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-gray-900">
        what&apos;s hurting rn?
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {symptoms.map((item, i) => {
          const active = picked === i;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onPick(i)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 border-[#0B5FA5] px-3.5 py-1.5 text-sm font-bold transition-all ${
                active
                  ? 'translate-x-[3px] translate-y-[3px] bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-none'
                  : 'bg-white text-[#0B5FA5] shadow-[3px_3px_0_#1C7E4E] hover:-translate-y-0.5'
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={2.5} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div key={picked} className="pop-in mt-5">
        <p className="text-sm font-medium leading-relaxed text-gray-800">
          <span className="mr-1.5 rounded-md border-2 border-[#0B5FA5] px-1.5 py-0.5 text-[11px] font-black uppercase" style={{ backgroundColor: s.color }}>
            the lowdown
          </span>
          {s.hint}
        </p>

        <div className="-mx-1 mt-4 flex snap-x gap-3 overflow-x-auto px-1 pb-3 pt-1 [scrollbar-width:none]">
          {s.tips.map((tip, i) => (
            <div
              key={tip}
              style={{ backgroundColor: s.color }}
              className={`snap-start shrink-0 basis-[44%] sm:basis-[31%] rounded-2xl border-2 border-[#0B5FA5] p-3 shadow-[3px_3px_0_#1C7E4E] ${tilts[i]}`}
            >
              <p className="text-2xl font-black leading-none text-gray-900/80">0{i + 1}</p>
              <p className="mt-2 text-[13px] font-bold leading-snug text-gray-900">{tip}</p>
            </div>
          ))}
        </div>

        <p className="mt-2 flex items-start gap-2 rounded-2xl border-2 border-[#0B5FA5] bg-[#0B5FA5] p-3 text-sm font-bold text-white">
          <Flag className="mt-0.5 h-4 w-4 shrink-0" />
          {s.flag}
        </p>
      </div>

      <style jsx>{`
        .pop-in {
          animation: pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pop-in {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pop-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
