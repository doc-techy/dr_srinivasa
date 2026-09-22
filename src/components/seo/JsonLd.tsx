export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: 'Dr. Srinivasa C',
    image: '/images/doctor-profile.png',
    description: 'Consultant Rheumatologist in Hulimavu, Bangalore. MBBS, MD (General Medicine), DM (Rheumatology).',
    url: 'https://www.drsrinivasac.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '#251, 11th Cross Road, Muthurayya Swamy Layout, Opposite Hulimavu Lake Road',
      addressLocality: 'Hulimavu, Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560076',
      addressCountry: 'IN'
    },
    medicalSpecialty: ['Rheumatology'],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '12:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '16:00',
        closes: '19:30'
      }
    ],
    sameAs: []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
