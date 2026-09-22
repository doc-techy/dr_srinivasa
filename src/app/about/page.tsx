import { AboutSection } from '@/components/sections/AboutSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';

export const metadata = {
  title: 'About Dr. Srinivasa C - Consultant Rheumatologist',
  description: 'Qualifications and clinic details for Dr. Srinivasa C, Rheumatologist in Hulimavu, Bangalore.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
}
