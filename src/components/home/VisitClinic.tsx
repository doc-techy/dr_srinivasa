import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { CLINIC_NAME, CONTACT } from '@/lib/site';
import { RcButton, bodyText, container, leadHeading } from './ui';

const CLINIC_QUERY = encodeURIComponent('251 11th Cross Road Muthurayya Swamy Layout Hulimavu Bangalore 560076');
const FORTIS_QUERY = encodeURIComponent('Fortis Hospital Bannerghatta Road Bengaluru');
const directions = (query: string) => `https://www.google.com/maps/search/?api=1&query=${query}`;

const locations = [
  {
    name: `${CLINIC_NAME}, Hulimavu`,
    address: '#251, 11th Cross Road, Muthurayya Swamy Layout, Opp. Hulimavu Lake Road, Bangalore 560076',
    timings: ['Mon – Sat · 9:00 AM – 12:00 noon', 'Mon – Sat · 4:00 PM – 7:30 PM', 'Sunday holiday'],
    query: CLINIC_QUERY,
  },
  {
    name: 'Fortis Hospital, Bannerghatta Road',
    address: 'Opposite IIM, Bannerghatta Road, Bengaluru',
    timings: ['Rheumatology consultation', 'Call the clinic to confirm timings'],
    query: FORTIS_QUERY,
  },
];

export function VisitClinic() {
  return (
    <section className="pb-[clamp(80px,8.333vw,120px)]">
      <div className={container}>
        <div className="max-w-2xl">
          <h2 className={leadHeading}>
            Choose your care <span className="text-rc-teal">closest to you</span>
          </h2>
          <p className={`${bodyText} mt-4`}>
            Consult Dr. Srinivasa C at the clinic in Hulimavu or at Fortis Hospital, Bannerghatta Road.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[1fr_1.1fr]">
          <ul className="border-t border-rc-rule">
            {locations.map(({ name, address, timings, query }) => (
              <li key={name} className="border-b border-rc-rule py-6 md:py-8">
                <h3 className="text-lg font-semibold text-rc-ink md:text-xl">{name}</h3>
                <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-rc-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rc-teal" />
                  {address}
                </p>
                <div className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-rc-muted">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rc-teal" />
                  <span>
                    {timings.map(line => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <RcButton href={directions(query)} external variant="outlineDark" className="min-h-[2.875rem] px-5 py-3" icon={<Navigation className="h-4 w-4" />}>
                    Directions
                  </RcButton>
                  <RcButton href={CONTACT.phoneHref} className="min-h-[2.875rem] px-5 py-3" icon={<Phone className="h-4 w-4" />}>
                    {CONTACT.phone}
                  </RcButton>
                </div>
              </li>
            ))}
          </ul>

          <div className="overflow-hidden rounded-[24px] bg-rc-mist">
            <iframe
              title={`Map to ${CLINIC_NAME}, Hulimavu`}
              src={`https://www.google.com/maps?q=${CLINIC_QUERY}&output=embed`}
              className="h-80 w-full border-0 lg:h-full lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
