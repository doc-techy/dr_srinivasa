import { Metadata } from 'next';
import { VideoSection } from '@/components/sections/VideoSection';

export const metadata: Metadata = {
  title: 'Educational Videos - Dr. Srinivasa C',
  description: 'Patient education videos from Dr. Srinivasa C, Consultant Rheumatologist, on arthritis, autoimmune diseases, gout, osteoporosis, and joint care.',
  keywords: ['rheumatology videos', 'arthritis', 'autoimmune disease', 'joint pain', 'Dr. Srinivasa C', 'rheumatologist Bangalore'],
};

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Educational Videos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, practical videos from Dr. Srinivasa C on arthritis, autoimmune diseases,
              bone health, and living well with joint and muscle conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <VideoSection />
    </div>
  );
}