import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-[#047BCA]/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-[#1C7E4E]/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 h-1 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/images/doctor-profile.png"
                  alt="Dr. Srinivasa C"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-bold leading-tight">Dr. Srinivasa C</h3>
                <p className="text-[#7dd3a0] text-xs sm:text-sm font-medium">Consultant Rheumatologist</p>
              </div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Consultant Rheumatologist in Hulimavu, Bangalore. MBBS (VIMS, Bellary), MD General Medicine (Sri Devaraj Urs Medical College, Kolar), and DM Rheumatology (Nizam&apos;s Institute of Medical Sciences, Hyderabad).
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Contact Info</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start text-gray-300">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-[#047BCA] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-xs sm:text-sm leading-relaxed">
                  #251, 11th Cross Road, Muthurayya Swamy Layout, Opposite Hulimavu Lake Road, Hulimavu, Bangalore 560076
                </span>
              </li>
              <li className="flex items-start text-gray-300">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-[#047BCA] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <div className="text-xs sm:text-sm leading-relaxed">
                  <p className="font-medium text-white">Mon–Sat</p>
                  <p>Morning 9:00 AM – 12:00 PM</p>
                  <p>Evening 4:00 PM – 7:30 PM</p>
                </div>
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-[#047BCA] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span className="text-xs sm:text-sm">By appointment</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  About Dr. Srinivasa C
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Services
                </a>
              </li>
              <li>
                <Link href="/appointment" className="text-gray-300 hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Services</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li className="text-gray-300 text-xs sm:text-sm">Joint Pains and Arthritis</li>
              <li className="text-gray-300 text-xs sm:text-sm">Autoimmune Diseases</li>
              <li className="text-gray-300 text-xs sm:text-sm">Back and Spine Problems</li>
              <li className="text-gray-300 text-xs sm:text-sm">Blood Vessel Inflammation (Vasculitis)</li>
              <li className="text-gray-300 text-xs sm:text-sm">Gout and Uric Acid Problems</li>
              <li className="text-gray-300 text-xs sm:text-sm">Muscle Pain and Weakness</li>
              <li className="text-gray-300 text-xs sm:text-sm">Bone and Calcium Problems (Osteoporosis)</li>
              <li className="text-gray-300 text-xs sm:text-sm">Soft Tissue and Tendon Pain</li>
              <li className="text-gray-300 text-xs sm:text-sm">Body Pain and Fatigue (Fibromyalgia)</li>
              <li className="text-gray-300 text-xs sm:text-sm">Joint Problems in Children (JIA)</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">© 2026 Dr. Srinivasa C. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
