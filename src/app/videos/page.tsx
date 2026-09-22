import { Metadata } from 'next';
import { VideoSection } from '@/components/sections/VideoSection';

export const metadata: Metadata = {
  title: 'Educational Videos - Dr. Vivek Shetty',
  description: 'Watch educational videos by Dr. Vivek Shetty on Head & Neck Oncology, surgical procedures, and patient care.',
  keywords: ['educational videos', 'head neck oncology', 'surgical procedures', 'Dr. Vivek Shetty', 'medical education'],
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
              Learn from Dr. Vivek Shetty&apos;s expertise through comprehensive educational videos 
              covering Head & Neck Oncology, surgical procedures, and patient care.
            </p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <VideoSection />
    </div>
  );
}