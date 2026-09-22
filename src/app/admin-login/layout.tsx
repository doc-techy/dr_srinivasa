import React from 'react';
import ClientProviders from '@/components/providers/ClientProviders';

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Admin Login - Dr. Vivek Shetty</title>
        <meta name="description" content="Admin login for Dr. Vivek Shetty appointment management system" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
