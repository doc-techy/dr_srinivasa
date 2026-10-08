'use client';

import { useState } from 'react';
import { CONTACT } from '@/lib/site';
import { FAQS } from '@/lib/faqs';
import { bodyText, container, leadHeading } from './ui';

export function FaqRows() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-[clamp(80px,8.333vw,120px)]">
      <div className={`${container} grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16`}>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className={leadHeading}>
            Frequently asked <span className="text-rc-teal">questions</span>
          </h2>
          <p className={`${bodyText} mt-4 max-w-md`}>
            Answers to common questions about rheumatology care and visiting the clinic. Have another question?{' '}
            <a href={CONTACT.phoneHref} className="font-semibold text-rc-teal-dark underline underline-offset-4">
              Call {CONTACT.phone}
            </a>
          </p>
        </div>

        <div className="border-t border-rc-rule">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div key={faq.question} className="border-b border-rc-rule">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex min-h-16 w-full items-center gap-4 py-5 text-left md:py-6"
                  >
                    <span
                      className={`flex-1 text-base font-semibold leading-snug transition-colors md:text-lg ${
                        isOpen ? 'text-rc-teal-dark' : 'text-rc-ink group-hover:text-rc-teal-dark'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      aria-hidden
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-colors ${
                        isOpen ? 'bg-rc-teal text-white' : 'bg-rc-mist text-rc-teal-dark'
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-6 pr-12 text-[15px] leading-[1.65] text-rc-muted">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
