import { Activity, FlaskConical, Pill, Stethoscope } from 'lucide-react';

const services = [
  { name: 'Consultation', description: 'Specialist rheumatology care', Icon: Stethoscope },
  { name: 'Physiotherapy', description: 'Guided joint and muscle rehab', Icon: Activity },
  { name: 'Pharmacy', description: 'Prescribed medicines on site', Icon: Pill },
  { name: 'Lab', description: 'Blood tests and investigations', Icon: FlaskConical },
];

export function ServicesOfferedSection() {
  return (
    <section className="py-6 md:py-12">
      <div className="container-custom">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 md:mb-8">
          Services <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Offered</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
          {services.map(({ name, description, Icon }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center shadow-md">
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">{name}</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
