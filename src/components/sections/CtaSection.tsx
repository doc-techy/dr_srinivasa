import { Award, Microscope, Heart, Users } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-6 md:pt-10 md:pb-16 flex flex-col items-center">
      <div className="w-full px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center mb-8 md:mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 md:whitespace-nowrap">
              <span className="block md:inline">Ready to Schedule</span>
              <span className="block md:inline bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent"><span className="hidden md:inline"> </span>Your Consultation?</span>
            </h2>
          </div>
        </div>
      </div>
        
      {/* Why Choose Dr. Srinivasa C Section - Same Width as Below Components */}
      <div className="w-full px-4">
        <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-2xl p-3 md:p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 animate-pulse" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-2 md:mb-6">
                  <div className="inline-flex items-center px-2 md:px-4 py-1 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-1 md:mb-3">
                    <span className="text-xs md:text-base lg:text-lg font-semibold text-green-100">Why Choose Dr. Srinivasa C?</span>
                  </div>
                  <p className="text-xs md:text-sm text-white/80 max-w-3xl mx-auto hidden md:block">
                    Leading expertise with exceptional patient outcomes and compassionate care
                  </p>
                </div>

                {/* Key Points Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-16 lg:gap-20">
                  <div className="text-center group hover:scale-105 transition-all duration-500">
                    <div className="relative mb-1 md:mb-3">
                      <div className="w-6 h-6 md:w-12 md:h-12 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <Award className="w-3 h-3 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xs md:text-sm lg:text-base font-bold text-white mb-0.5 md:mb-1 group-hover:text-white transition-colors duration-300">
                      16+ Years in Rheumatology
                    </h4>
                    <p className="text-white/80 group-hover:text-white transition-colors duration-300 text-xs lg:text-sm leading-tight">
                      Focused practice in joint, autoimmune, and bone disease
                    </p>
                  </div>
                  
                  <div className="text-center group hover:scale-105 transition-all duration-500">
                    <div className="relative mb-1 md:mb-3">
                      <div className="w-6 h-6 md:w-12 md:h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <Microscope className="w-3 h-3 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xs md:text-sm lg:text-base font-bold text-white mb-0.5 md:mb-1 group-hover:text-white transition-colors duration-300">
                      DM Rheumatology
                    </h4>
                    <p className="text-white/80 group-hover:text-white transition-colors duration-300 text-xs lg:text-sm leading-tight">
                      Trained at Nizam's Institute of Medical Sciences, Hyderabad
                    </p>
                  </div>
                  
                  <div className="text-center group hover:scale-105 transition-all duration-500">
                    <div className="relative mb-1 md:mb-3">
                      <div className="w-6 h-6 md:w-12 md:h-12 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <Heart className="w-3 h-3 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xs md:text-sm lg:text-base font-bold text-white mb-0.5 md:mb-1 group-hover:text-white transition-colors duration-300">
                      Patient-Centered Care
                    </h4>
                    <p className="text-white/80 group-hover:text-white transition-colors duration-300 text-xs lg:text-sm leading-tight">
                      Compassionate approach with quality of life focus
                    </p>
                  </div>
                  
                  <div className="text-center group hover:scale-105 transition-all duration-500">
                    <div className="relative mb-1 md:mb-3">
                      <div className="w-6 h-6 md:w-12 md:h-12 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <Users className="w-3 h-3 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xs md:text-sm lg:text-base font-bold text-white mb-0.5 md:mb-1 group-hover:text-white transition-colors duration-300">
                      Multilingual Support
                    </h4>
                    <p className="text-white/80 group-hover:text-white transition-colors duration-300 text-xs lg:text-sm leading-tight">
                      Clear explanations and planned follow-up
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
