import { Sora } from 'next/font/google';
import { HomeHero } from '@/components/home/HomeHero';
import { TrustBand } from '@/components/home/TrustBand';
import { DecodeSigns } from '@/components/home/DecodeSigns';
import { SpecializedCare } from '@/components/home/SpecializedCare';
import { MeetDoctor } from '@/components/home/MeetDoctor';
import { HolisticCare } from '@/components/home/HolisticCare';
import { CareCompanion } from '@/components/home/CareCompanion';
import { VisitClinic } from '@/components/home/VisitClinic';
import { Resources } from '@/components/home/Resources';
import { FaqRows } from '@/components/home/FaqRows';
import { FinalCta } from '@/components/home/FinalCta';
import { Marquee } from '@/components/home/ui';
import { FAQS } from '@/lib/faqs';

const sora = Sora({ subsets: ['latin'], display: 'swap' });

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const conditionsTreated = [
  'Rheumatoid Arthritis',
  'Ankylosing Spondylitis',
  'Lupus (SLE)',
  'Gout',
  'Psoriatic Arthritis',
  'Osteoarthritis',
  'Vasculitis',
  'Osteoporosis',
  'Fibromyalgia',
  'Sjögren’s Syndrome',
  'Myositis',
  'Arthritis in Children',
];

const anchor = 'scroll-mt-24 lg:scroll-mt-28';

export default function Home() {
  return (
    <div className={`${sora.className} min-h-screen bg-rc-offwhite text-rc-ink antialiased`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section id="home">
        <HomeHero />
      </section>
      <Marquee items={conditionsTreated} className="bg-white" />
      <TrustBand />
      <DecodeSigns />
      <section id="services" className={anchor}>
        <SpecializedCare />
      </section>
      <section id="doctor" className={anchor}>
        <MeetDoctor />
      </section>
      <HolisticCare />
      <CareCompanion />
      <VisitClinic />
      <section id="videos" className={anchor}>
        <Resources />
      </section>
      <section id="faq" className={anchor}>
        <FaqRows />
      </section>
      <Marquee items={Array(8).fill('Live Pain-Free')} size="large" className="border-y border-rc-rule bg-rc-cream" />
      <section id="contact" className={anchor}>
        <FinalCta />
      </section>
    </div>
  );
}
