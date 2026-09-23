'use client';

import { AppointmentBooking } from '@/components/sections/AppointmentBooking';
import { Phone, Mail, MapPin, Clock, User, Award } from 'lucide-react';

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Appointment Form */}
            <div className="lg:col-span-2">
              <AppointmentBooking className="mt-8 mb-8" />
            </div>

            {/* Sidebar */}
            <div className="space-y-6 mt-8 mb-8">
              {/* Doctor Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hidden md:block">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Dr. Srinivasa C
                  </h3>
                  <p className="text-[#047BCA] font-semibold">
                    Consultant Rheumatologist
                  </p>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-3 text-[#047BCA]" />
                    <span><strong>Experience:</strong> 10+ years in rheumatology</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-[#047BCA]" />
                    <span><strong>Location:</strong> Hulimavu, Bangalore</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-[#047BCA]" />
                    <span><strong>Languages:</strong> English, Hindi, Kannada</span>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#047BCA]" />
                  Office Hours
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-[#047BCA] font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Saturday</span>
                    <span className="text-[#047BCA] font-semibold">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sunday</span>
                    <span className="text-red-600 font-semibold">Emergency Only</span>
                  </div>
                </div>
              </div> */}

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-[#047BCA]/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Need Immediate Help?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                      <Phone className="w-5 h-5 text-[#047BCA]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Appointments</p>
                      <p className="text-sm text-gray-600">By appointment</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-[#047BCA]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-600">Email to be added</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  What to Expect
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Comprehensive consultation
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Detailed medical history review
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Personalized treatment plan
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Follow-up care guidance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
