import { RheumatologyIntroSection } from '@/components/sections/RheumatologyIntroSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ServicesOfferedSection } from '@/components/sections/ServicesOfferedSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { FAQS } from '@/lib/faqs';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section id="home">
        <RheumatologyIntroSection />
      </section>
      <section id="doctor">
        <HeroSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      <ServicesOfferedSection />
      <section id="videos">
        <VideoSection />
      </section>
      <section id="faq">
        <FaqSection />
      </section>
      <section id="contact">
        <CtaSection />
      </section>
    </div>
  );
}
