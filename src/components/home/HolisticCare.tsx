import { Activity, ArrowRight, FlaskConical, Pill, Stethoscope } from 'lucide-react';
import { RcButton, bodyText, container, leadHeading } from './ui';

const services = [
  { name: 'Rheumatologist', description: 'Specialist consultation, diagnosis and a treatment plan made for you', Icon: Stethoscope },
  { name: 'Physiotherapy', description: 'Guided joint and muscle rehabilitation to restore movement', Icon: Activity },
  { name: 'Pharmacy', description: 'Prescribed medicines available on site', Icon: Pill },
  { name: 'Lab', description: 'Blood tests and investigations without running around', Icon: FlaskConical },
];

export function HolisticCare() {
  return (
    <section className="bg-rc-mist py-[clamp(80px,8.333vw,120px)]">
      <div className={`${container} grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16`}>
        <div>
          <h2 className={leadHeading}>
            A holistic approach
            <br />
            <span className="text-rc-teal">to joint pain</span>
          </h2>
          <p className={`${bodyText} mt-5 max-w-md`}>
            A dedicated set of services that caters to your unique needs — from diagnosis and tests to medicines and
            rehabilitation, all under one roof.
          </p>
          <RcButton href="/services" className="mt-8" icon={<ArrowRight className="h-4 w-4" />}>
            Explore services
          </RcButton>
        </div>

        <ul className="grid grid-cols-2 gap-3 md:gap-5">
          {services.map(({ name, description, Icon }, index) => (
            <li
              key={name}
              className={`rounded-[24px] bg-rc-offwhite p-5 transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(122,186,178,0.35)] md:p-8 ${
                index % 2 === 1 ? 'md:translate-y-8' : ''
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rc-teal text-rc-lemon md:h-20 md:w-20">
                <Icon className="h-6 w-6 md:h-9 md:w-9" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-rc-ink md:mt-8 md:text-xl">{name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-rc-muted md:text-sm">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
