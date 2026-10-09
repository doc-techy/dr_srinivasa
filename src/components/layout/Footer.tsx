import Link from 'next/link';
import { Instagram, MessageCircle, Phone } from 'lucide-react';
import { CLINIC_NAME, CLINIC_TAGLINE, CONTACT } from '@/lib/site';

const socials = [
  { name: 'Instagram', href: CONTACT.instagramHref, Icon: Instagram },
  { name: 'WhatsApp', href: CONTACT.whatsappHref, Icon: MessageCircle },
  { name: 'Call', href: CONTACT.phoneHref, Icon: Phone },
];

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Educational Videos', href: '/videos' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'Contact', href: '/contact' },
];

const linkClass = 'block cursor-pointer text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300';

export function Footer() {
  return (
    <footer className="relative z-10 bg-gray-900 text-white py-12">
      {/* Top accent bar */}
      <div className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] h-1"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Contact Info */}
          <div className="flex-1">
            <img
              src="/logo-transparent.png?v=2"
              alt="Artho Rheuma Care — Care, Relief, Mobility"
              className="h-36 sm:h-44 w-auto mb-5"
            />
            <h3 className="text-xl font-bold mb-4 text-white">Dr. Srinivasa C</h3>
            <p className="text-[#047BCA] mb-4 font-medium">Consultant Rheumatologist</p>
            <div className="space-y-1 text-gray-300">
              <p>🏥 {CLINIC_NAME} ({CLINIC_TAGLINE})</p>
              <p>📍 #251, 11th Cross Road, Muthurayya Swamy Layout, Opposite Hulimavu Lake Road, Hulimavu, Bengaluru 560076</p>
              <p>🕘 Mon – Sat · 09:00 am – 12:00 noon · 04:00 pm – 07:30 pm</p>
              <p className="pt-3">🌐 Languages: English, Hindi, Kannada, Telugu</p>
              <p>📞 <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a></p>
            </div>
            <div className="flex gap-3 mt-5">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[#1C7E4E] hover:to-[#047BCA] flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Specialities */}
          <div className="lg:w-1/4">
            <h3 className="text-xl font-bold mb-4 text-white">Specialities</h3>
            <div className="space-y-1 text-gray-300">
              <p>• Rheumatoid Arthritis & Joint Pain</p>
              <p>• Autoimmune Diseases (Lupus, Sjögren’s)</p>
              <p>• Vasculitis</p>
              <p>• Gout & Uric Acid Disorders</p>
              <p>• Osteoporosis & Bone Health</p>
              <p className="text-[#047BCA] mt-2">DM Rheumatology – NIMS, Hyderabad</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:w-1/4">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.map(link => (
                <Link key={link.name} href={link.href} className={linkClass}>
                  {link.name}
                </Link>
              ))}
              <Link
                href="/appointment"
                className="block cursor-pointer text-[#047BCA] hover:text-white transition-colors hover:translate-x-1 duration-300 font-semibold mt-2"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dr. Srinivasa C - Consultant Rheumatologist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
