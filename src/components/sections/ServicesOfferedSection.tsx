'use client';

import { LabTestsModal } from '@/components/common/LabTestsModal';
import { ServiceColorModal } from '@/components/common/ServiceColorModal';
import { Activity, FlaskConical, Pill, Stethoscope } from 'lucide-react';
import { useCallback, useState } from 'react';

const LAB_SERVICE_ID = 4;

const services = [
  {
    id: 1,
    name: 'Expert Rheumatologist Consultation',
    description: 'Specialist rheumatology care',
    modalText:
      'In-clinic consultation with Dr. Srinivasa C for joint pain, arthritis, autoimmune disease, vasculitis, osteoporosis, and related conditions, with evaluation and treatment planned around your diagnosis.',
    Icon: Stethoscope,
  },
  {
    id: 2,
    name: 'Physiotherapy',
    description: 'Guided joint and muscle rehab',
    modalText:
      'Our doctors and physiotherapists collaborate to provide the best possible treatment for your condition, with exercises and rehab aimed at mobility, strength, and day-to-day function.',
    Icon: Activity,
  },
  {
    id: 3,
    name: 'Pharmacy',
    description: 'Prescribed medicines on site',
    modalText:
      'Our licensed pharmacist works directly with physicians and patients to educate them on proper use, safety, and efficacy of prescribed medications.',
    Icon: Pill,
  },
  {
    id: LAB_SERVICE_ID,
    name: 'Lab',
    description: 'Blood tests and investigations',
    modalText: '',
    Icon: FlaskConical,
  },
];

export function ServicesOfferedSection() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const closeModal = useCallback(() => setSelectedId(null), []);

  const selected = selectedId ? services.find((s) => s.id === selectedId) ?? null : null;
  const isLabOpen = selectedId === LAB_SERVICE_ID;
  const isColorModalOpen = selected !== null && !isLabOpen;

  return (
    <section id="services-offered" className="py-6 md:py-12 relative z-0">
      <div className="container-custom">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 md:mb-8">
          Services{' '}
          <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">
            Offered
          </span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
          {services.map(({ id, name, description, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedId(id)}
              className="touch-manipulation rounded-2xl p-4 md:p-6 bg-white/45 backdrop-blur-lg border border-white/60 shadow-sm shadow-[#047BCA]/5 hover:bg-white/55 hover:shadow-lg active:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047BCA] focus-visible:ring-offset-2"
              aria-label={`Learn more about ${name}`}
              aria-haspopup="dialog"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center shadow-md pointer-events-none">
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <span className="block text-base md:text-lg font-bold text-gray-900 pointer-events-none">
                {name}
              </span>
              <span className="block text-xs md:text-sm text-gray-800 mt-1 pointer-events-none">
                {description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <ServiceColorModal
        open={isColorModalOpen}
        title={selected?.name ?? ''}
        body={selected?.modalText ?? ''}
        colorIndex={selected ? selected.id - 1 : 0}
        onClose={closeModal}
        titleId="services-offered-modal-title"
      />

      <LabTestsModal open={isLabOpen} onClose={closeModal} />
    </section>
  );
}
