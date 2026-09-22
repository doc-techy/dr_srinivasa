import Image from 'next/image';

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-200/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-orange-200/10 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-8 mb-8">
          
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg overflow-hidden">
                <Image
                  src="/images/doctor-profile.png"
                  alt="Dr. Srinivasa C"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Dr. Srinivasa C</h3>
                <p className="text-primary-300 text-sm font-medium">Consultant Rheumatologist</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Consultant Rheumatologist in Hulimavu, Bangalore. MBBS (VIMS, Bellary), MD General Medicine (Sri Devaraj Urs Medical College, Kolar), and DM Rheumatology (Nizam&apos;s Institute of Medical Sciences, Hyderabad).
            </p>
            <p className="text-gray-400 text-sm">
              Mon–Sat: 9:00 AM – 12:00 noon and 4:00 PM – 7:30 PM. Sunday holiday.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-3 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span className="text-sm">By appointment</span>
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-3 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="text-sm">Mon–Sat · Sunday holiday</span>
              </div>
              <div className="flex items-start text-gray-300">
                <svg className="w-4 h-4 mr-3 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="text-sm">#251, 11th Cross Road, Muthurayya Swamy Layout, Opposite Hulimavu Lake Road, Hulimavu, Bangalore 560076</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:contents">
            <div className="md:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2.5">
                <li><a href="#home" className="text-gray-300 hover:text-primary-300 transition-colors duration-200 text-sm">Home</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-primary-300 transition-colors duration-200 text-sm">About Dr. Srinivasa C</a></li>
                <li><a href="#services" className="text-gray-300 hover:text-primary-300 transition-colors duration-200 text-sm">Services</a></li>
                <li><a href="/appointment" className="text-gray-300 hover:text-primary-300 transition-colors duration-200 text-sm">Book Appointment</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 mb-6">
                <li className="text-gray-300 text-sm">Inflammatory joint disease</li>
                <li className="text-gray-300 text-sm">Connective tissue disorders</li>
                <li className="text-gray-300 text-sm">Vasculitis</li>
                <li className="text-gray-300 text-sm">Osteoporosis and bone health</li>
                <li className="text-gray-300 text-sm">Joint injections</li>
                <li className="text-gray-300 text-sm">Musculoskeletal ultrasound</li>
              </ul>
            </div>
          </div>
        </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs leading-relaxed max-w-4xl mx-auto">
            © 2026 Dr. Srinivasa C. All rights reserved.
            </p>
          </div>
      </div>
    </footer>
  );
}
