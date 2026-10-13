'use client';

import { Clock, MapPin, CheckCircle, Navigation, Phone } from 'lucide-react';
import { CLINIC_NAME, CLINIC_TAGLINE, CONTACT } from '@/lib/site';

interface AppointmentBookingProps {
  className?: string;
}

const CLINIC = {
  name: `${CLINIC_NAME} (${CLINIC_TAGLINE})`,
  address: '#251, 11th Cross Road, BDA Layout, Opp. Hulimavu Lake, Hulimavu, Bengaluru - 560076',
  hours: 'Mon–Sat: 9:00 AM – 12:00 PM and 4:00 PM – 7:30 PM. Sunday holiday.',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=251+11th+Cross+Road+BDA+Layout+Hulimavu+Bengaluru+560076',
};

export function AppointmentBooking({ className = '' }: AppointmentBookingProps) {
  return (
    <div className={`bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-8 min-w-0 max-w-full overflow-hidden ${className}`}>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Book an Appointment</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Call the Hulimavu clinic to schedule your consultation at a time that works for you.
        </p>
      </div>

      <div className="text-center mb-8">
        <a
          href={CONTACT.phoneHref}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white text-base sm:text-lg font-semibold rounded-xl hover:from-[#145C38] hover:to-[#0369A1] focus:ring-4 focus:ring-[#047BCA]/30 transition-all duration-300 shadow-lg"
        >
          <Phone className="w-5 h-5 mr-2" />
          Call to book
        </a>
        <p className="mt-3 text-sm text-gray-500">{CONTACT.phone}</p>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="flex items-start space-x-3 mb-3">
          <MapPin className="w-5 h-5 text-[#047BCA] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">{CLINIC.name}</h4>
            <p className="text-gray-600 text-sm">{CLINIC.address}</p>
            <a href={CLINIC.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#047BCA] text-sm font-medium mt-1">
              <Navigation className="w-3 h-3 mr-1" />
              Get Directions
            </a>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-[#047BCA] mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-sm">{CLINIC.hours}</p>
        </div>
      </div>

      <div className="mt-6 p-6 bg-green-50 rounded-2xl">
        <h3 className="text-lg font-semibold text-[#1C7E4E] mb-4 text-center">Important Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-[#047BCA]">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Please arrive 15 minutes before your scheduled appointment time
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Bring a valid ID and any relevant medical reports
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-[#047BCA]">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Cancellations must be made at least 24 hours in advance
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Emergency cases will be given priority
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
