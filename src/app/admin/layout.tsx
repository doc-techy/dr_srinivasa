import React from 'react';
import type { Metadata } from 'next';
import AdminWrapper from '@/components/admin/AdminWrapper';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin | Dr. Srinivasa C',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminWrapper>
      <AdminShell>{children}</AdminShell>
    </AdminWrapper>
  );
}
