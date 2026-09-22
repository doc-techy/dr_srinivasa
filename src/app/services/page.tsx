import { ServicesSection } from '@/components/sections/ServicesSection';
import { CtaSection } from '@/components/sections/CtaSection';

export const metadata = {
  title: 'Services - Dr. Srinivasa C, Rheumatologist',
  description: 'Rheumatology services with Dr. Srinivasa C in Hulimavu, Bangalore.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ServicesSection />
      <CtaSection />
    </div>
  );
}
