'use client';

import { GraduationCap, Calendar, CheckCircle, Award, Users, MapPin, Languages } from 'lucide-react';
import { useState } from 'react';

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<'education' | 'experience'>('experience');
  const education = [
    {
      degree: 'DM (Rheumatology)',
      institution: "Nizam's Institute of Medical Sciences",
      location: 'Hyderabad',
      description: 'Super-speciality training in rheumatology'
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
      title: 'Consultant Rheumatologist',
      position: 'Clinic practice',
      hospital: 'Hulimavu',
      location: '#251, 11th Cross, Muthurayya Swamy Layout, Bangalore 560076',
      duration: 'Present',
      description: 'Outpatient rheumatology care',
      isEmpty: false
    },
    {
      title: 'Consultant Rheumatology',
      position: 'Hospital practice',
      hospital: 'Fortis Hospital, Bannerghatta Road',
      location: 'Opposite IIM, Bengaluru',
      duration: '10+ years',
      description: 'Rheumatology consultation',
      isEmpty: false
    },
  ];

  return (
    <section id="about" className="pt-4 pb-4 md:pt-8 md:pb-6 lg:pt-16 lg:pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-3 md:mb-4 lg:mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="block md:inline">Academic Qualifications</span>
            <span className="block md:inline"><span className="hidden md:inline"> </span>&<span className="hidden md:inline"> </span></span>
            <span className="block md:inline bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Professional Journey</span>
          </h2>
          
          {/* <p className="hidden md:block text-sm md:text-2xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed px-4">
            A dedicated specialist with comprehensive education and extensive clinical experience in head and neck oncology.
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
                  <div className="transition-all duration-500 ease-in-out opacity-100 translate-y-0 md:hidden">
                    {experience.map((exp, index) => (
                      <div 
                        key={`exp-${index}`} 
                        className={`backdrop-blur-sm rounded-xl p-2 md:p-2 lg:p-4 border transition-all duration-500 ease-in-out transform mb-1 md:mb-2 lg:mb-4 ${
                          exp.isEmpty 
                            ? 'bg-gray-100/50 border-gray-200/30 opacity-40' 
                            : 'bg-white border-[#047BCA]/20/50 hover:scale-[1.02] hover:shadow-lg'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {exp.isEmpty ? (
                          <div className="h-16 md:h-20 lg:h-24 bg-gradient-to-b from-white via-white to-gray-100 rounded-lg flex items-center justify-center">
                            {/* <div className="text-gray-400 text-xs md:text-sm font-medium">Coming Soon</div> */}
                          </div>
                        ) : (
                          <>
                            {exp.title && (
                              <div className="text-sm font-semibold text-[#047BCA] mb-1 transition-all duration-300">
                                {exp.title}
                              </div>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                              <h4 className="text-base lg:text-lg font-bold text-gray-900 transition-all duration-300 flex-1 min-w-0">{exp.position}</h4>
                              <div className="bg-gradient-to-r from-green-50 to-blue-50 text-[#047BCA] px-2.5 py-1 rounded-lg text-xs font-semibold mt-1 sm:mt-0 w-fit transition-all duration-300 hover:from-green-100 hover:to-blue-100">
                                {exp.duration}
                              </div>
                            </div>
                            <h5 className="text-sm font-medium bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent mb-1.5 transition-all duration-300">
                              {exp.hospital}
                            </h5>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-[#047BCA] flex-shrink-0 transition-all duration-300" />
                              {exp.location}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
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
              <div className="space-y-2 md:space-y-2 lg:space-y-4 flex-1">
                {experience.map((exp, index) => (
                  <div key={index} className={`backdrop-blur-sm rounded-xl p-2 md:p-2 lg:p-4 border transition-all duration-500 ease-in-out transform mb-1 md:mb-2 lg:mb-4 ${
                    exp.isEmpty 
                      ? 'bg-gray-100/50 border-gray-200/30 opacity-40' 
                      : 'bg-white border-[#047BCA]/20/50 hover:scale-[1.02] hover:shadow-lg'
                  }`}>
                    {exp.isEmpty ? (
                      <div className="h-16 md:h-20 lg:h-24 bg-gradient-to-b from-white via-white to-gray-100 rounded-lg flex items-center justify-center">
                        {/* <div className="text-gray-400 text-xs md:text-sm font-medium">Coming Soon</div> */}
                      </div>
                    ) : (
                      <>
                        {exp.title && (
                          <div className="text-sm font-semibold text-[#047BCA] mb-1 transition-all duration-300">
                            {exp.title}
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                          <h4 className="text-base lg:text-lg font-bold text-gray-900 transition-all duration-300 flex-1 min-w-0">{exp.position}</h4>
                          <div className="bg-green-50 text-[#047BCA] px-2.5 py-1 rounded-lg text-xs font-semibold mt-1 sm:mt-0 w-fit transition-all duration-300 hover:bg-green-100">
                            {exp.duration}
                          </div>
                        </div>
                        <h5 className="text-sm font-medium text-[#047BCA] mb-1.5 transition-all duration-300">
                          {exp.hospital}
                        </h5>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-[#047BCA] flex-shrink-0 transition-all duration-300" />
                          {exp.location}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
