import { MapPin } from 'lucide-react';
import { bodyText, container, leadHeading } from './ui';

const stats = [
  { value: '16+', label: 'Years in rheumatology' },
  { value: 'DM', label: 'Rheumatology & Immunology, NIMS Hyderabad' },
  { value: '10', label: 'Specialised condition areas treated' },
  { value: '4', label: 'Languages: English, Hindi, Kannada, Telugu' },
];

const RIPPLE_DELAYS = ['0s', '0.9s', '1.8s', '2.7s'];

export function TrustBand() {
  return (
    <section className="bg-rc-mist py-[clamp(70px,5.556vw,80px)]">
      <div className={container}>
        <div className="mx-auto max-w-[700px] text-center">
          <div aria-hidden className="relative mx-auto h-36 w-36">
            {RIPPLE_DELAYS.map(delay => (
              <span
                key={delay}
                className="absolute inset-0 animate-ripple rounded-full border border-rc-teal/50 bg-rc-teal/5 motion-reduce:hidden"
                style={{ animationDelay: delay }}
              />
            ))}
            <span className="absolute inset-[30%] rounded-full border border-rc-rule bg-white" />
            <span className="absolute inset-[38%] flex items-center justify-center rounded-full bg-rc-teal text-white shadow-[0_4px_24px_rgba(122,186,178,0.6)]">
              <MapPin className="h-5 w-5" />
            </span>
          </div>

          <h2 className={`${leadHeading} mt-10`}>
            Trusted rheumatology care in <span className="text-rc-teal">South Bangalore</span>
          </h2>
          <p className={`${bodyText} mt-4`}>
            Bringing specialist care for joints, bones, muscles and the immune system within easy reach — at Artho
            Rheuma Care, Hulimavu.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px border-y border-rc-rule bg-rc-rule md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={value} className="bg-rc-mist px-4 py-6 md:px-6 md:py-8">
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="block text-[2rem] font-normal leading-none tracking-[-0.02em] text-rc-ink md:text-[2.5rem]">
                  {value}
                </span>
                <span className="mt-2.5 block text-xs leading-snug text-rc-muted md:text-sm">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
