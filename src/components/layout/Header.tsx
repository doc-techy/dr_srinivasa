'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#doctor' },
  { name: 'Services', href: '#services' },
  { name: 'Videos', href: '#videos' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '/contact' },
];

const desktopLinkClass = 'text-gray-700 hover:text-[#047BCA] transition-colors font-medium text-xs uppercase tracking-wider relative group py-2';
const mobileLinkClass = 'text-left text-gray-700 hover:text-[#047BCA] hover:bg-gray-100 transition-all duration-300 font-medium text-sm uppercase tracking-wider py-2 px-4 rounded-lg';

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      const headerHeight = (headerRef.current?.offsetHeight ?? 80) - (mobileMenuRef.current?.offsetHeight ?? 0);
      window.scrollTo({ top: element.offsetTop - headerHeight, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const renderLink = (item: (typeof navigation)[number], className: string, underline: boolean) => {
    const content = (
      <>
        {item.name}
        {underline && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] transition-all duration-300 group-hover:w-full"></span>}
      </>
    );
    const isPage = item.href.startsWith('/');
    if (isPage || !isHomepage) {
      return (
        <Link key={item.name} href={isPage ? item.href : `/${item.href}`} className={className} onClick={() => setIsMenuOpen(false)}>
          {content}
        </Link>
      );
    }
    return (
      <button key={item.name} onClick={() => scrollToSection(item.href)} className={className}>
        {content}
      </button>
    );
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-xl border-b-2 border-[#047BCA]/50' : 'bg-white shadow-lg border-b-4 border-[#047BCA]'
      }`}
    >
      {/* Top accent bar */}
      <div className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] h-1"></div>

      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2.5 sm:py-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0" onClick={() => setIsMenuOpen(false)}>
            <img
              src="/logo-mark-transparent.png"
              alt=""
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 shrink-0 object-contain"
            />
            <span className="min-w-0 leading-none">
              <span className="block text-[11px] sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.08em] sm:tracking-[0.14em] whitespace-nowrap">
                <span className="bg-gradient-to-r from-[#1FA97A] to-[#0B6FC2] bg-clip-text text-transparent">ARTHO</span>{' '}
                <span className="text-[#2BB88A]">RHEUMA</span> <span className="text-[#1E90E8]">CARE</span>
              </span>
              <span className="mt-1.5 hidden sm:flex items-center gap-2 text-[9px] md:text-[11px] tracking-[0.22em] text-[#5B6B85]">
                <span className="h-px w-5 md:w-7 bg-[#5B6B85]" />
                CARE · RELIEF · MOBILITY
                <span className="h-px w-5 md:w-7 bg-[#5B6B85]" />
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 2xl:space-x-10">
            {navigation.map(item => renderLink(item, desktopLinkClass, true))}
            <Link
              href="/appointment"
              className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] hover:from-[#145C38] hover:to-[#0369A1] text-white px-8 py-3 font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book Consultation
            </Link>
          </nav>

          <div className="lg:hidden flex items-center shrink-0 ml-2">
            <button
              onClick={() => setIsMenuOpen(open => !open)}
              className="w-10 h-10 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] hover:from-[#145C38] hover:to-[#0369A1] flex items-center justify-center text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
              aria-label="Toggle menu"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div ref={mobileMenuRef} className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`border-t py-6 transition-all duration-500 ${isScrolled ? 'border-gray-300/50 bg-white/60 backdrop-blur-md' : 'border-gray-300 bg-gray-50'}`}>
            <div className={`flex flex-col space-y-6 transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {navigation.map(item => renderLink(item, mobileLinkClass, false))}
              <div className="border-t border-gray-300 pt-4 px-4">
                <Link
                  href="/appointment"
                  className="block bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] hover:from-[#145C38] hover:to-[#0369A1] text-white px-6 py-3 font-semibold text-sm uppercase tracking-wider text-center transition-all duration-300 rounded-lg hover:shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
