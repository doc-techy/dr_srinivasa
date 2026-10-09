'use client';

import { GraduationCap, Calendar, MapPin, Stethoscope, Building2 } from 'lucide-react';
import { useState } from 'react';
import { CLINIC_NAME } from '@/lib/site';

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<'education' | 'experience'>('experience');
  const education = [
    {
      degree: 'DM (Rheumatology & Immunology)',
      institution: "Nizam's Institute of Medical Sciences",
      location: 'Hyderabad',
      description: 'Super-speciality training in rheumatology and immunology'
    },
    {
      degree: 'MD (General Medicine)',
      institution: 'Sri Devaraj Urs Medical College',
      location: 'Kolar',
      description: 'Postgraduate training in general medicine'
    },
    {
      degree: 'MBBS',
      institution: 'Vijayanagar Institute of Medical Sciences (VIMS)',
      location: 'Bellary',
      description: 'Bachelor of Medicine and Bachelor of Surgery'
    },
  ];

  const experience = [
    {
      hospital: `${CLINIC_NAME}, Hulimavu`,
      location: '#251, 11th Cross Road, BDA Layout, Opp. Hulimavu Lake, Hulimavu, Bengaluru - 560076',
      duration: 'Present',
      description: 'Outpatient rheumatology care',
      Icon: Stethoscope,
      current: true,
    },
    {
      hospital: 'Fortis Hospital, Bannerghatta Road',
      location: 'Opposite IIM, Bengaluru',
      duration: '',
      description: 'Rheumatology consultation',
      Icon: Building2,
      current: false,
    },
    {
      hospital: 'Sakra World Hospital',
      location: 'Devarabeesanahalli, Varthur Hobli, Bengaluru 560103',
      duration: '2014 – 2019',
      description: 'Associate Consultant – Rheumatology',
      Icon: Building2,
      current: false,
    },
  ];

  const renderExperience = () => (
    <ol className="relative ml-5 space-y-4 border-l-2 border-dashed border-[#047BCA]/30">
      {experience.map(({ hospital, location, duration, description, Icon, current }) => (
        <li key={hospital} className="relative pl-8">
          <span className="absolute -left-[1.3rem] top-4 w-10 h-10 rounded-full bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] ring-4 ring-green-50 flex items-center justify-center shadow-md">
            <Icon className="w-5 h-5 text-white" />
          </span>
          <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 className="text-base lg:text-lg font-bold text-gray-900">{hospital}</h4>
              {duration && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${current ? 'bg-green-100 text-[#1C7E4E]' : 'bg-blue-50 text-[#047BCA]'}`}>
                  {current && <span className="w-1.5 h-1.5 rounded-full bg-[#1C7E4E] animate-pulse" />}
                  {duration}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-[#047BCA] mb-2">{description}</p>
            <p className="text-sm text-gray-600 flex items-start">
              <MapPin className="w-4 h-4 mr-1.5 mt-0.5 text-[#047BCA] flex-shrink-0" />
              {location}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );

  return (
    <section id="about" className="py-6 md:pt-8 md:pb-6 lg:pt-16 lg:pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-3 md:mb-4 lg:mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="block md:inline">Academic Qualifications</span>
            <span className="block md:inline"><span className="hidden md:inline"> </span>&<span className="hidden md:inline"> </span></span>
            <span className="block md:inline bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Professional Journey</span>
          </h2>
          
          {/* <p className="hidden md:block text-sm md:text-2xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed px-4">
            A dedicated specialist with comprehensive education and extensive clinical experience in rheumatology.
          </p> */}
        </div>

        {/* Mobile Toggle Switch - Only visible on mobile */}
        <div className="md:hidden mb-3">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-1 flex border border-gray-200/50 relative z-10">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out flex items-center justify-center relative z-10 cursor-pointer touch-manipulation ${
                activeTab === 'experience'
                  ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-lg'
                  : 'text-gray-700 hover:text-[#047BCA] hover:bg-green-50/50'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Calendar className={`w-4 h-4 mr-2 transition-all duration-300 ${activeTab === 'experience' ? 'rotate-12' : 'rotate-0'}`} />
                Professional
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out flex items-center justify-center relative z-10 cursor-pointer touch-manipulation ${
                activeTab === 'education'
                  ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-lg'
                  : 'text-gray-700 hover:text-[#047BCA] hover:bg-green-50/50'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <GraduationCap className={`w-4 h-4 mr-2 transition-all duration-300 ${activeTab === 'education' ? 'rotate-12' : 'rotate-0'}`} />
              Education
            </button>
          </div>
        </div>

        {/* Mobile-Optimized Content */}
        <div className="bg-green-50/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-100 p-3 md:p-4 lg:p-8">
          
          {/* Mobile: Single Column (toggled), Desktop: Two Columns */}
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 lg:gap-8 md:space-y-0">
            
            {/* Mobile: Dynamic Single Section, Desktop: Education Section */}
            <div className="space-y-2 md:space-y-3 lg:space-y-6 flex flex-col">
              <div className="text-center">
                <div className={`inline-flex items-center px-2 py-1 md:px-2 md:py-1 lg:px-4 lg:py-2 text-white rounded-lg md:rounded-xl text-xs md:text-sm lg:text-base xl:text-lg font-bold mb-1 md:mb-2 lg:mb-4 transition-all duration-500 ease-in-out transform ${
                  activeTab === 'education' 
                    ? 'bg-black scale-105' 
                    : 'bg-black scale-105'
                }`}>
                  <div className="transition-all duration-500 ease-in-out">
                    {activeTab === 'education' ? (
                      <GraduationCap className="w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 mr-1 md:mr-1 lg:mr-2 animate-pulse" />
                    ) : (
                      <>
                        <Calendar className="w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 mr-1 md:mr-1 lg:mr-2 md:hidden animate-pulse" />
                        <GraduationCap className="hidden md:block w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 mr-1 lg:mr-2 animate-pulse" />
                      </>
                    )}
                  </div>
                  <span className="transition-all duration-500 ease-in-out">
                    {activeTab === 'education' ? 'Educational Journey' : (
                      <>
                        <span className="md:hidden">Professional Journey</span>
                        <span className="hidden md:block">Educational Journey</span>
                      </>
                    )}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3 transition-all duration-500 ease-in-out">
                  {activeTab === 'education' ? 'Academic Qualifications' : (
                    <>
                      <span className="md:hidden">Clinical Experience</span>
                      <span className="hidden md:block">Academic Qualifications</span>
                    </>
                  )}
                </h3>
              </div>

              {/* Dynamic Content Timeline */}
              <div className="space-y-2 md:space-y-2 lg:space-y-4 flex-1">
                {/* Education Content - Mobile: Conditional, Desktop: Always show */}
                <div className={`transition-all duration-500 ease-in-out opacity-100 translate-y-0 md:block ${activeTab === 'education' ? 'block' : 'hidden md:block'}`}>
                    {education.map((edu, index) => (
                      <div 
                        key={`edu-${index}`} 
                        className="bg-white backdrop-blur-sm rounded-xl p-2 md:p-2 lg:p-4 border border-[#047BCA]/20/50 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-lg mb-1 md:mb-2 lg:mb-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="mb-1">
                          <h4 className="text-base lg:text-lg font-bold text-gray-900 transition-all duration-300">{edu.degree}</h4>
                        </div>
                        <h5 className="text-sm font-medium text-[#047BCA] mb-1.5 transition-all duration-300">
                          {edu.institution}
                        </h5>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-[#047BCA] flex-shrink-0 transition-all duration-300" />
                          {edu.location}
                        </p>
                      </div>
                    ))}
                  </div>
                
                {/* Experience Content - Mobile: Conditional, Desktop: Hidden */}
                {activeTab === 'experience' && (
                  <div className="md:hidden pt-1">
                    {renderExperience()}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Only: Experience Section */}
            <div className="hidden md:block space-y-2 md:space-y-3 lg:space-y-9 flex flex-col">
              <div className="text-center">
                <div className="inline-flex items-center px-2 py-1 md:px-2 md:py-1 lg:px-4 lg:py-2 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white rounded-lg md:rounded-xl text-xs md:text-sm lg:text-base xl:text-lg font-bold mb-1 md:mb-2 lg:mb-4">
                  <Calendar className="w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 mr-1 md:mr-1 lg:mr-2" />
                  Professional Journey
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3">Clinical Experience</h3>
              </div>

              {/* Experience Timeline for Desktop */}
              <div className="flex-1">
                {renderExperience()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
