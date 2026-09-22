'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Check if current path is the blogs page
  const isBlogsPage = pathname === '/blogs';
  
  if (isAdminRoute) {
    // For admin routes, only render children without header and footer
    return <>{children}</>;
  }
  
  if (isBlogsPage) {
    // For blogs page, render with header but without footer
    return (
      <>
        <Header />
        <main>{children}</main>
      </>
    );
  }
  
  // For all other routes, render with header and footer
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
