'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function FullScreenMessage({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#047BCA] mx-auto mb-3" />
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { user, tokens, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasSession = !!tokens?.access && !!user && isAdmin;

  useEffect(() => {
    if (!loading && !hasSession && !isRedirecting) {
      setIsRedirecting(true);
      router.replace('/admin-login');
    }
    if (hasSession) setIsRedirecting(false);
  }, [loading, hasSession, isRedirecting, router]);

  if (loading) return <FullScreenMessage text="Loading admin…" />;
  if (!hasSession) return <FullScreenMessage text="Redirecting to login…" />;
  return <>{children}</>;
}
