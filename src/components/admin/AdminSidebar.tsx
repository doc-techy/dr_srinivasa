'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Shield,
  TrendingUp
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { name: 'Pending', href: '/admin/appointments?status=pending', icon: Clock },
  { name: 'Confirmed', href: '/admin/appointments?status=confirmed', icon: CheckCircle },
  { name: 'Cancelled', href: '/admin/appointments?status=cancelled', icon: XCircle },
  { name: 'Availability', href: '/admin/availability', icon: Settings },
  { name: 'Blocked Slots', href: '/admin/blocked-slots', icon: Shield },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href.includes('appointments') && pathname.startsWith('/admin/appointments'));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 mt-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Stats
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Today's Appointments</span>
            <span className="font-medium text-gray-900">12</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Pending</span>
            <span className="font-medium text-yellow-600">5</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Confirmed</span>
            <span className="font-medium text-green-600">7</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
