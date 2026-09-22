import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminWrapper from '@/components/admin/AdminWrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminWrapper>
  );
}
