'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminWrapperProps {
  children: React.ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  const { user, tokens, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log('🔐 AdminWrapper: Auth state check', { 
      loading, 
      hasTokens: !!tokens?.access, 
      hasUser: !!user, 
      isAdmin, 
      isRedirecting,
      pathname
    });

    // Only redirect if we're not already redirecting and not on login page
    // Add a small delay to prevent rapid redirects
    if (!loading && !isRedirecting && pathname !== '/admin-login') {
      if (!tokens?.access || !user || !isAdmin) {
        console.log('🔐 AdminWrapper: Redirecting to login - no valid admin session');
        setIsRedirecting(true);
        // Use setTimeout to prevent immediate redirect loops
        setTimeout(() => {
          router.replace('/admin-login');
        }, 100);
      }
    }
  }, [loading, tokens, user, isAdmin, router, isRedirecting, pathname]);

  // Reset redirecting state when auth state changes
  useEffect(() => {
    if (tokens?.access && user && isAdmin) {
      setIsRedirecting(false);
    }
  }, [tokens, user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!tokens?.access || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
