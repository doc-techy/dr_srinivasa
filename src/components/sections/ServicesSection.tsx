'use client';

import { 
  Brain, 
  Microscope, 
  Shield, 
  Heart, 
  Zap, 
  Activity, 
  Users, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Scissors,
  Eye,
  Layers,
  Target,
  Sparkles,
  Wrench
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPageMobile = 2; // 2x1 grid for mobile (top and bottom)
  const itemsPerPageDesktop = 6; // 2x3 grid for desktop


  const services = [
    {
      id: 1,
      category: 'rheumatology',
      icon: Activity,
      title: 'Joint Pains and Arthritis',
      subtitle: '',
      description: '',
      features: [
        'Evaluation of joint pain, swelling, and stiffness',
        'Care for inflammatory and degenerative arthritis',
        'Treatment planned around diagnosis and disease activity',
        'Focus on protecting joints and daily function'
      ],
    },
    {
      id: 2,
      category: 'rheumatology',
      icon: Shield,
      title: 'Autoimmune Diseases',
      subtitle: '',
      description: '',
      features: [
        'Lupus and related autoimmune conditions',
        'Care guided by symptoms and immunology tests',
        'Long-term monitoring of disease activity',
        'Treatment aimed at control with fewer complications'
      ],
    },
    {
      id: 3,
      category: 'rheumatology',
      icon: Layers,
      title: 'Back and Spine Problems',
      subtitle: '',
      description: '',
      features: [
        'Inflammatory and mechanical back pain',
        'Assessment of stiffness and mobility',
        'Care for spondyloarthritis when indicated',
        'Plans to improve comfort and function'
      ],
    },
    {
      id: 4,
      category: 'rheumatology',
      icon: Heart,
      title: 'Blood Vessel Inflammation (Vasculitis)',
      subtitle: '',
      description: '',
      features: [
        'Inflammation of blood vessels of different sizes',
        'Early recognition of organ involvement',
        'Investigation matched to the clinical picture',
        'Structured follow-up after treatment'
      ],
    },
    {
      id: 5,
      category: 'rheumatology',
      icon: Zap,
      title: 'Gout and Uric Acid Problems',
      subtitle: '',
      description: '',
      features: [
        'Acute gout flares and chronic uric acid disease',
        'Diagnosis of crystal arthritis',
        'Urate-lowering therapy when needed',
        'Advice to reduce repeat attacks'
      ],
    },
    {
      id: 6,
      category: 'rheumatology',
      icon: Activity,
      title: 'Muscle Pain and Weakness',
      subtitle: '',
      description: '',
      features: [
        'Evaluation of muscle pain and weakness',
        'Assessment for inflammatory myopathies',
        'Investigation matched to clinical findings',
        'Treatment and rehabilitation guidance'
      ],
    },
    {
      id: 7,
      category: 'rheumatology',
      icon: Target,
      title: 'Bone and Calcium Problems (Osteoporosis)',
      subtitle: '',
      description: '',
      features: [
        'Osteoporosis and metabolic bone disorders',
        'Fracture-risk assessment',
        'Advice on bone strength and falls',
        'Medical treatment when indicated'
      ],
    },
    {
      id: 8,
      category: 'rheumatology',
      icon: Stethoscope,
      title: 'Soft Tissue and Tendon Pain',
      subtitle: '',
      description: '',
      features: [
        'Tendon, ligament, and soft-tissue pain',
        'Assessment of bursitis and enthesitis',
        'Conservative care and targeted therapy',
        'Support for return to daily activity'
      ],
    },
    {
      id: 9,
      category: 'rheumatology',
      icon: Sparkles,
      title: 'Body Pain and Fatigue (Fibromyalgia)',
      subtitle: '',
      description: '',
      features: [
        'Widespread body pain and fatigue',
        'Fibromyalgia evaluation and counselling',
        'Sleep, activity, and symptom strategies',
        'Multimodal care for better day-to-day comfort'
      ],
    },
    {
      id: 10,
      category: 'rheumatology',
      icon: Users,
      title: 'Joint Problems in Children (JIA)',
      subtitle: '',
      description: '',
      features: [
        'Juvenile idiopathic arthritis (JIA)',
        'Child-focused assessment of joint symptoms',
        'Monitoring growth and disease activity',
        'Family-centred treatment planning'
      ],
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const itemsPerPage = isMobile ? itemsPerPageMobile : itemsPerPageDesktop;
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToPage = (pageIndex: number) => {
    if (isTransitioning || pageIndex === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(pageIndex);
    setTimeout(() => setIsTransitioning(false), 700);
  };


  return (
    <section id="services" className="pb-6 md:pb-12">
      <div className="container-custom">
        {/* Modern Header */}
        <div className="text-center mb-4 pb-0 md:mb-16 md:pb-0">
          {/* Background Decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-96 h-96 bg-gradient-to-r from-[#1C7E4E]/40 to-[#047BCA]/40 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            {/* Subtitle Badge */}
            {/* <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-[#047BCA]/20/50 mb-6 shadow-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-semibold bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">
                Expert Medical Services
              </span>
            </div> */}
            
            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Specialized Services & <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Expertise</span>
            </h2>
            
            {/* Description */}
            <p className="hidden md:block text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Rheumatology care for joint pain, arthritis, autoimmune disease, vasculitis, osteoporosis, and related conditions
            </p>
            
            {/* Stats */}
            {/* <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                  13+
                </div>
                <p className="text-sm text-gray-500 font-medium">Specialized Services</p>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                  11+
                </div>
                <p className="text-sm text-gray-500 font-medium">Years Experience</p>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                  500+
                </div>
                <p className="text-sm text-gray-500 font-medium">Successful Cases</p>
              </div>
            </div> */}
          </div>
        </div>


        {/* Services Carousel */}
        <div className="relative mb-8 bg-transparent shadow-none">
          {/* Services Container with Side Arrows */}
          <div className="relative flex items-center">
            {/* Left Arrow */}
            <button
              onClick={goToPrev}
              disabled={isTransitioning}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white hover:from-[#145C38] hover:to-[#0369A1] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed will-change-transform"
              aria-label="Previous services"
            >
              <ChevronLeft className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 ${isTransitioning ? 'animate-pulse' : ''}`} />
            </button>

            {/* Services Grid */}
            <div className="flex-1 mx-12 md:mx-16">
              <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
                {services.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage).map((service, index) => {
                  const Icon = service.icon;
                  const isHovered = hoveredIndex === index;
                  
                  return (
                    <div
                      key={`${service.id}-${currentIndex}`}
                      className="group relative"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{ 
                        animation: `fastFlipIn 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) both`,
                        animationDelay: `${index * 0.08}s`
                      }}
                    >
                      {/* Card Container */}
                      <div className="relative h-full bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-102 border border-gray-100 group-hover:border-[#047BCA]/20 transform-gpu will-change-transform">
                        {/* Subtle Top Border Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA]"></div>
                        
                        {/* Content */}
                        <div className="relative p-4 md:p-6">
                          {/* Icon - Hidden on mobile */}
                          {/* <div className="mb-2 md:mb-3 hidden md:block">
                            <div className={`
                              w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gray-100 group-hover:bg-green-50
                              flex items-center justify-center shadow-sm
                              transform transition-all duration-200 ease-out will-change-transform
                              ${isHovered ? 'scale-105' : ''}
                            `}>
                              <Icon className="w-4 h-4 md:w-6 md:h-6 text-gray-600 group-hover:text-[#047BCA]" />
                            </div>
                          </div> */}

                          {/* Title */}
                          <div className="mb-3 md:mb-4">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight group-hover:text-[#047BCA] transition-colors duration-300">
                              {service.title}
                            </h3>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] mt-2 group-hover:w-12 transition-all duration-300"></div>
                          </div>

                          {/* Features */}
                          <div className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className={`
                                  w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#1C7E4E] group-hover:bg-[#047BCA]
                                  mt-1.5 mr-3 flex-shrink-0
                                  transform transition-all duration-150 ease-out
                                  ${isHovered ? 'scale-105' : ''}
                                `}>
                                </div>
                                <span className="text-xs md:text-sm leading-relaxed text-gray-600 group-hover:text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white hover:from-[#145C38] hover:to-[#0369A1] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed will-change-transform"
              aria-label="Next services"
            >
              <ChevronRight className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 ${isTransitioning ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* Page Indicators - Centered below */}
          <div className="flex justify-center items-center mt-6">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-500 hover:scale-125 active:scale-90 disabled:cursor-not-allowed ${
                    index === currentIndex 
                      ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fastFlipIn {
          0% {
            transform: perspective(800px) rotateY(-60deg) scale(0.9);
            opacity: 0;
          }
          50% {
            transform: perspective(800px) rotateY(-15deg) scale(0.95);
            opacity: 0.7;
          }
          80% {
            transform: perspective(800px) rotateY(2deg) scale(1.01);
            opacity: 0.95;
          }
          100% {
            transform: perspective(800px) rotateY(0deg) scale(1);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          @keyframes fastFlipIn {
            0% {
              transform: perspective(600px) rotateY(-45deg) scale(0.92);
              opacity: 0;
            }
            60% {
              transform: perspective(600px) rotateY(-8deg) scale(0.98);
              opacity: 0.8;
            }
            100% {
              transform: perspective(600px) rotateY(0deg) scale(1);
              opacity: 1;
            }
          }
        }

        .group:hover .group-hover\\:animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Smooth entrance for the entire grid */
        .services-grid {
          animation: fadeInGrid 0.6s ease-out;
        }

        @keyframes fadeInGrid {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

