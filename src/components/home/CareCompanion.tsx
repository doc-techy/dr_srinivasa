import { CalendarCheck, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/site';
import { RcButton, bodyText, container, leadHeading } from './ui';

const chat = [
  { from: 'patient', text: 'My new blood test reports are ready. Should I bring them to my follow-up?' },
  { from: 'clinic', text: 'Yes, please bring them along. The doctor will review them and adjust your plan if needed.' },
  { from: 'patient', text: 'Thank you! See you on Saturday.' },
];

export function CareCompanion() {
  return (
    <section className="py-[clamp(80px,8.333vw,120px)]">
      <div className={container}>
        <div className="grid items-center gap-10 overflow-hidden rounded-[32px] bg-rc-cream px-6 py-10 ring-1 ring-inset ring-rc-lemon md:px-12 md:py-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className={leadHeading}>
              Personal care <span className="text-rc-teal">beyond the clinic</span>
            </h2>
            <p className={`${bodyText} mt-5 max-w-lg`}>
              Your health needs attention between appointments too. Message the clinic on WhatsApp for follow-up
              questions, report updates and appointment changes — and get a clear answer from the team.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RcButton href={CONTACT.whatsappHref} external icon={<MessageCircle className="h-4 w-4" />}>
                Chat on WhatsApp
              </RcButton>
              <RcButton href="/appointment" variant="outlineDark" icon={<CalendarCheck className="h-4 w-4" />}>
                Book Appointment
              </RcButton>
            </div>
          </div>

          <div aria-hidden className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[40px] bg-rc-lemon/50 blur-2xl" />
            <div className="relative rounded-[28px] bg-white p-5 shadow-[0_24px_80px_rgba(44,60,56,0.14)]">
              <div className="flex items-center gap-3 border-b border-rc-line pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rc-teal text-sm font-semibold text-white">AR</span>
                <div>
                  <p className="text-sm font-semibold text-rc-ink">Artho Rheuma Care</p>
                  <p className="text-xs text-rc-teal">online</p>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                {chat.map(({ from, text }) => (
                  <p
                    key={text}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-snug ${
                      from === 'clinic' ? 'rounded-tl-sm bg-rc-mist text-rc-ink' : 'ml-auto rounded-tr-sm bg-rc-teal text-rc-offwhite'
                    }`}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
