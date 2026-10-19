import { Metadata } from 'next';
import { VideoSection } from '@/components/sections/VideoSection';

export const metadata: Metadata = {
  title: 'Educational Videos - Dr. Srinivasa C',
  description:
    'Patient education videos from Dr. Srinivasa C, Consultant Rheumatologist, on arthritis, autoimmune diseases, gout, osteoporosis, and joint care.',
  keywords: [
    'rheumatology videos',
    'arthritis',
    'autoimmune disease',
    'joint pain',
    'Dr. Srinivasa C',
    'rheumatologist Bangalore',
  ],
};

export default function VideosPage() {
  return (
    <div className="min-h-screen pt-20">
      <VideoSection />
    </div>
  );
}
