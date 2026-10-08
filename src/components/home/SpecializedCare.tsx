'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Baby,
  Bone,
  Hand,
  HeartPulse,
  Layers,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { RcButton, bodyText, container, heading } from './ui';

type Condition = { name: string; icon: LucideIcon; description: string; points: string[] };

const conditions: Condition[] = [
  {
    name: 'Joint Pains & Arthritis',
    icon: Hand,
    description:
      'Persistent joint pain, swelling and stiffness can come from inflammatory arthritis such as rheumatoid or psoriatic arthritis, or from wear-and-tear osteoarthritis. Finding the exact cause early protects the joints and keeps you moving.',
    points: ['Evaluation of joint pain, swelling and stiffness', 'Care for inflammatory and degenerative arthritis', 'Treatment planned around disease activity'],
  },
  {
    name: 'Autoimmune Diseases',
    icon: ShieldPlus,
    description:
      'In autoimmune conditions like lupus (SLE), Sjögren’s syndrome and systemic sclerosis, the immune system attacks healthy tissue. Care is guided by symptoms and immunology tests, with long-term monitoring to keep the disease under control.',
    points: ['Lupus and related connective tissue disorders', 'Care guided by immunology tests', 'Long-term monitoring of disease activity'],
  },
  {
    name: 'Back & Spine Problems',
    icon: Layers,
    description:
      'Back pain with morning stiffness that eases with movement may point to spondyloarthritis such as ankylosing spondylitis. Distinguishing inflammatory from mechanical back pain is the first step to the right treatment.',
    points: ['Inflammatory and mechanical back pain', 'Assessment of stiffness and mobility', 'Care for spondyloarthritis when indicated'],
  },
  {
    name: 'Vasculitis',
    icon: HeartPulse,
    description:
      'Vasculitis is inflammation of blood vessels that can affect the skin, kidneys, lungs, nerves and other organs. Early recognition and investigation matched to the clinical picture help prevent lasting organ damage.',
    points: ['Inflammation of small, medium and large vessels', 'Early recognition of organ involvement', 'Structured follow-up after treatment'],
  },
  {
    name: 'Gout & Uric Acid',
    icon: Zap,
    description:
      'Gout causes sudden, severe attacks of joint pain — often in the big toe — due to uric acid crystals. With the right diagnosis and urate-lowering treatment, repeat attacks and joint damage can be prevented.',
    points: ['Acute flares and chronic uric acid disease', 'Diagnosis of crystal arthritis', 'Advice to reduce repeat attacks'],
  },
  {
    name: 'Muscle Pain & Weakness',
    icon: Activity,
    description:
      'Muscle weakness, especially in the shoulders and thighs, can be a sign of inflammatory myopathies such as myositis. Careful assessment and targeted tests guide treatment and rehabilitation.',
    points: ['Evaluation of muscle pain and weakness', 'Assessment for inflammatory myopathies', 'Treatment and rehabilitation guidance'],
  },
  {
    name: 'Osteoporosis',
    icon: Bone,
    description:
      'Osteoporosis weakens bones silently until a fracture happens. Fracture-risk assessment, advice on bone strength and falls, and medical treatment when needed keep bones healthy for longer.',
    points: ['Osteoporosis and metabolic bone disorders', 'Fracture-risk assessment', 'Medical treatment when indicated'],
  },
  {
    name: 'Soft Tissue & Tendon Pain',
    icon: Stethoscope,
    description:
      'Tendon, ligament and soft-tissue problems such as bursitis and enthesitis can limit daily activity. Conservative care and targeted therapy support a safe return to normal movement.',
    points: ['Tendon, ligament and soft-tissue pain', 'Assessment of bursitis and enthesitis', 'Support for return to daily activity'],
  },
  {
    name: 'Fibromyalgia',
    icon: Sparkles,
    description:
      'Fibromyalgia causes widespread body pain with fatigue, poor sleep and low mood. A clear evaluation, counselling and a mix of sleep, activity and symptom strategies improve day-to-day comfort.',
    points: ['Widespread body pain and fatigue', 'Evaluation and counselling', 'Multimodal care for daily comfort'],
  },
  {
    name: 'Arthritis in Children (JIA)',
    icon: Baby,
    description:
      'Juvenile idiopathic arthritis (JIA) causes joint pain and swelling in children. Child-focused assessment, monitoring of growth and family-centred treatment planning help children stay active.',
    points: ['Juvenile idiopathic arthritis', 'Monitoring growth and disease activity', 'Family-centred treatment planning'],
  },
];

export function SpecializedCare() {
  const [active, setActive] = useState(0);
  const condition = conditions[active];
  const Icon = condition.icon;

  return (
    <div className="relative overflow-hidden bg-rc-mist py-[clamp(80px,8.333vw,120px)]">
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${heading} lg:text-[2.5rem]`}>Get specialized care</h2>
          <Link href="/services" className="group inline-flex items-center gap-2 font-medium text-rc-ink hover:text-rc-teal">
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="Conditions"
          className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {conditions.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls="condition-panel"
              onClick={() => setActive(index)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-3 text-sm leading-tight transition-colors ${
                index === active
                  ? 'border-rc-teal bg-rc-teal text-rc-offwhite'
                  : 'border-rc-rule bg-transparent text-rc-ink hover:border-rc-teal-dark hover:text-rc-teal-dark'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div
          id="condition-panel"
          role="tabpanel"
          key={condition.name}
          className="mt-10 grid animate-rc-fade gap-8 md:mt-14 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-[clamp(60px,8.333vw,120px)]"
        >
          <div className="relative isolate flex aspect-[4/3] max-h-[400px] w-full items-center justify-center overflow-hidden rounded-[24px] bg-rc-teal">
            <span aria-hidden className="absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full border-[40px] border-white/[0.07]" />
            <span aria-hidden className="absolute -bottom-24 -right-10 -z-10 h-80 w-80 rounded-full bg-rc-aqua/50 blur-2xl" />
            <span className="flex h-32 w-32 items-center justify-center rounded-full bg-rc-offwhite/10 ring-1 ring-rc-offwhite/30 md:h-44 md:w-44">
              <Icon className="h-14 w-14 text-rc-lemon md:h-20 md:w-20" strokeWidth={1.25} />
            </span>
            <span className="absolute bottom-5 left-5 rounded-full bg-rc-offwhite px-4 py-2 text-xs font-medium text-rc-ink">
              {String(active + 1).padStart(2, '0')} / {String(conditions.length).padStart(2, '0')}
            </span>
          </div>

          <div>
            <h3 className={heading}>{condition.name}</h3>
            <p className={`${bodyText} mt-4`}>{condition.description}</p>
            <ul className="mt-6 border-t border-rc-rule">
              {condition.points.map(point => (
                <li key={point} className="flex items-start gap-3 border-b border-rc-rule py-3 text-sm text-rc-ink">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rc-teal" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RcButton href="/appointment" icon={<ArrowRight className="h-4 w-4" />}>
                Book Consultation
              </RcButton>
              <RcButton href="/services" variant="outlineDark">
                Know more
              </RcButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
