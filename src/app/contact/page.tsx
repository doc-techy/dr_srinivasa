import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Languages, MapPin, Navigation } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Clinic Location in Hulimavu',
  description: 'Clinic address, timings and directions for Dr. Srinivasa C, Consultant Rheumatologist in Hulimavu, Bangalore. Book an appointment online.',
};

const ADDRESS = '#251, 11th Cross Road, Muthurayya Swamy Layout, Opposite Hulimavu Lake Road, Hulimavu, Bangalore 560076';
const MAPS_QUERY = encodeURIComponent('251 11th Cross Road Muthurayya Swamy Layout Hulimavu Bangalore 560076');

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact{' '}
            <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent whitespace-nowrap">Dr. Srinivasa C</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Visit the clinic in Hulimavu or book your consultation online.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-3xl p-8 text-white shadow-2xl">
              <Calendar className="w-10 h-10 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Book an appointment</h2>
              <p className="text-white/85 mb-6">
                Pick a free slot online. The clinic confirms your request, and you get an email if you share your address.
              </p>
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#047BCA] rounded-xl font-semibold hover:bg-green-50 transition-colors"
              >
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <iframe
                title="Map to Dr. Srinivasa C's clinic"
                src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
                className="w-full h-72 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-[#047BCA] hover:text-[#1C7E4E]"
                >
                  <Navigation className="w-5 h-5" /> Get directions
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-5">
                <MapPin className="w-6 h-6 text-[#047BCA]" /> Clinic location
              </h2>
              <p className="font-semibold text-gray-900">Hulimavu Clinic</p>
              <p className="text-gray-600 mt-1">{ADDRESS}</p>
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-4">
                <p className="font-semibold text-gray-900 mb-2">How to reach</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Opposite Hulimavu Lake Road</li>
                  <li>• Landmark: Muthurayya Swamy Layout</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-5">
                <Clock className="w-6 h-6 text-[#047BCA]" /> Clinic timings
              </h2>
              <dl className="space-y-3 text-gray-700">
                <div className="flex justify-between gap-4">
                  <dt>Monday – Saturday</dt>
                  <dd className="font-semibold text-right">9:00 AM – 12:00 noon<br />4:00 PM – 7:30 PM</dd>
                </div>
                <div className="flex justify-between gap-4 pt-3 border-t border-gray-100">
                  <dt>Sunday</dt>
                  <dd className="font-semibold">Holiday</dd>
                </div>
              </dl>
              <p className="text-sm text-gray-500 mt-4">Consultations are by appointment.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                <Languages className="w-6 h-6 text-[#047BCA]" /> Languages spoken
              </h2>
              <div className="flex flex-wrap gap-2">
                {['English', 'Hindi', 'Kannada'].map(language => (
                  <span key={language} className="px-3 py-1 bg-gradient-to-r from-green-50 to-blue-50 text-[#1C7E4E] rounded-full text-sm font-medium">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
