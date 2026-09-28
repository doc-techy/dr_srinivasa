'use client';

import { Star, Quote } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function TestimonialsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Add real patient reviews here (e.g. from the clinic's Google Business profile).
  // The section stays hidden while this list is empty.
  const testimonials: { name: string; role: string; content: string; rating: number; treatment: string }[] = [];

  // Create duplicated testimonials for infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number | null = null;
    let scrollPosition = 0;
    const scrollSpeed = 0.8;

    const animate = () => {
      if (!scrollContainer) return;
      
      scrollPosition += scrollSpeed;
      scrollContainer.scrollLeft = scrollPosition;

      // Reset scroll position when we've scrolled through one set of testimonials
      const singleSetWidth = scrollContainer.scrollWidth / 3;
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
        scrollContainer.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(animate);
    };

    // Start animation after a delay to ensure container is ready
    const startAnimation = () => {
      if (!scrollContainer) return;
      
      // Ensure container has proper dimensions
      if (scrollContainer.scrollWidth > 0) {
        animate();
      } else {
        // Retry if container isn't ready
        setTimeout(startAnimation, 100);
      }
    };

    const timeoutId = setTimeout(startAnimation, 1000);

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="pb-20">
      {/* Header with container */}
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Patient <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Testimonials and Reviews</span>
          </h2>
        </div>
      </div>

      {/* Edge-to-edge Infinite Scrolling Testimonials */}
      <div className="relative overflow-hidden w-full">
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-7 scroll-animation pl-3 md:pl-7"
          style={{
            width: 'max-content',
            scrollBehavior: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 md:p-4 hover:shadow-xl transition-all duration-300 border border-white/20 flex-shrink-0 w-48 md:w-72"
            >
              <div className="flex items-center mb-1 md:mb-2">
                <Quote className="w-3 h-3 md:w-5 md:h-5 text-primary-600 mr-1 md:mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-2 h-2 md:w-3 md:h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-1 md:mb-2 italic text-xs md:text-sm leading-tight">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-gray-200 pt-1 md:pt-2">
                <h4 className="font-semibold text-gray-900 text-xs md:text-sm">{testimonial.name}</h4>
                <p className="text-xs text-gray-600">{testimonial.role}</p>
                <p className="text-xs text-primary-600 font-medium mt-0.5">
                  {testimonial.treatment}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .scroll-animation {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
