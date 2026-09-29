'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '@/lib/faqs';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-20">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about rheumatology care and visiting the clinic
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div
                key={faq.question}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
                  isOpen ? 'border-[#047BCA]/30 shadow-xl' : 'border-gray-100 shadow-md hover:shadow-lg'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center gap-4 px-5 md:px-6 py-4 md:py-5 text-left"
                  >
                    <span
                      className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white' : 'bg-gradient-to-br from-green-50 to-blue-50 text-[#047BCA]'
                      }`}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </span>
                    <span className={`flex-1 font-semibold text-base md:text-lg ${isOpen ? 'text-[#047BCA]' : 'text-gray-900'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#047BCA]' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 md:pl-[4.75rem] text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-600 mb-4">Have another question? Ask the doctor during your consultation.</p>
          <Link
            href="/appointment"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] hover:from-[#145C38] hover:to-[#0369A1] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Book Appointment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
