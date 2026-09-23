import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundPattern } from "@/components/common/BackgroundPattern";
import ClientProviders from "@/components/providers/ClientProviders";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "Dr. Srinivasa C | Rheumatologist in Bangalore",
    template: "%s | Dr. Srinivasa C"
  },
  description: "Dr. Srinivasa C is a Consultant Rheumatologist in Hulimavu, Bangalore. MBBS, MD (General Medicine), DM (Rheumatology). Clinic hours Mon–Sat, Sunday holiday.",
  keywords: ["Dr. Srinivasa C", "Rheumatologist Bangalore", "Hulimavu", "DM Rheumatology", "Joint pain", "Fortis Bannerghatta Road"],
  authors: [{ name: "Dr. Srinivasa C" }],
  creator: "Dr. Srinivasa C",
  publisher: "Dr. Srinivasa C",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ]
  },
  openGraph: {
    title: "Dr. Srinivasa C | Head & Neck Surgical Oncologist",
    description: "Rheumatology consultation with Dr. Srinivasa C at Hulimavu, Bangalore.",
    url: 'http://localhost:3001',
    siteName: 'Dr. Srinivasa C',
    images: [
      {
        url: '/images/doctor-profile.png', // Ensure this image is high quality
        width: 1000,
        height: 1000,
        alt: 'Dr. Srinivasa C',
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Srinivasa C - Rheumatologist",
    description: "Consultant Rheumatologist in Hulimavu, Bangalore.",
    images: ['/images/doctor-profile.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // User needs to replace this
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dr. Srinivasa C" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 relative overflow-x-hidden">
        <BackgroundPattern />
        
        <div className="relative z-10">
          <ClientProviders>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ClientProviders>
        </div>
      </body>
    </html>
  );
}
