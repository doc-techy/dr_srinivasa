'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { apiUtils, handleApiError } from '@/lib/api';

interface AppointmentBookingProps {
  className?: string;
}

export function AppointmentBooking({ className = '' }: AppointmentBookingProps) {
  const hospitals = [
    {
      name: 'Hulimavu Clinic',
      address: '#251, 11th Cross Road, Muthurayya Swamy Layout, Opposite Hulimavu Lake Road, Hulimavu, Bangalore 560076',
      availableAt: 'Mon–Sat: 9:00 AM – 12:00 noon and 4:00 PM – 7:30 PM. Sunday holiday.',
      website: 'https://www.google.com/maps/search/?api=1&query=251+11th+Cross+Road+Muthurayya+Swamy+Layout+Hulimavu+Bangalore+560076',
      mapLink: 'https://www.google.com/maps/search/?api=1&query=251+11th+Cross+Road+Muthurayya+Swamy+Layout+Hulimavu+Bangalore+560076',
      description: 'Rheumatology consultation at the Hulimavu clinic'
    }
  ];

  return (
    <div className={`bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        {/* <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white rounded-2xl text-lg font-bold mb-6 shadow-lg">
          <Calendar className="w-6 h-6 mr-3" />
          Book Your Appointment
        </div> */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Choose Your Preferred Location
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Dr. Srinivasa C consults at his Hulimavu clinic in Bangalore
        </p>
      </div>

      {/* Hospital Sections */}
      <div className="grid grid-cols-1 gap-6 items-stretch max-w-xl mx-auto">
        {hospitals.map((hospital, index) => (
          <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-[#047BCA]/20 transition-all duration-300 flex flex-col h-full">
            {/* Hospital Header */}
            <div className="text-center mb-4 flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{hospital.description}</p>
            </div>

            {/* Hospital Details */}
            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#047BCA] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Address</h4>
                  <p className="text-gray-600 text-sm">{hospital.address}</p>
                  <a
                    href={hospital.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#047BCA] text-xs font-medium hover:text-[#047BCA] transition-colors duration-200 mt-1"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Get Directions
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-[#047BCA] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Available At</h4>
                  <p className="text-gray-600 text-sm">{hospital.availableAt}</p>
                </div>
              </div>
            </div>

            {/* Book Appointment Button */}
            <div className="text-center mt-auto flex-shrink-0">
              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white font-semibold rounded-lg hover:from-[#145C38] hover:to-[#0369A1] focus:ring-4 focus:ring-[#047BCA]/30 transition-all duration-300 shadow-lg group-hover:shadow-xl text-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Get Directions
              </a>
            </div>

            {/* Hover Effect Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"></div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-12 p-6 bg-green-50 rounded-2xl">
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
