'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Ban, CalendarClock, Clock, Mail, MapPin, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, PageHeader } from '@/components/admin/ui';

function Section({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 py-2.5 border-b border-gray-100 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900 break-all">{value}</dd>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Your account and how online booking works." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section icon={User} title="Your account">
          <dl>
            <Row label="Name" value={fullName || '—'} />
            <Row label="Username" value={user?.username} />
            <Row label="Email" value={user?.email || '—'} />
            <Row
              label="Access"
              value={
                <span className="inline-flex items-center gap-1 text-[#1C7E4E]">
                  <ShieldCheck className="w-4 h-4" /> {user?.is_superuser ? 'Super admin' : 'Clinic admin'}
                </span>
              }
            />
          </dl>
          <p className="mt-4 text-xs text-gray-500">To change your password, ask the website administrator to reset it on the server.</p>
        </Section>

        <Section icon={Clock} title="Booking rules">
          <dl>
            <Row label="Booking window" value="Next 30 days" />
            <Row label="Same-day bookings" value="At least 30 min ahead" />
            <Row label="New bookings start as" value="Pending (you confirm)" />
            <Row label="One patient per slot" value="Yes" />
          </dl>
        </Section>

        <Section icon={Mail} title="Email notifications">
          <ul className="space-y-3 text-sm text-gray-600">
            <li>Patients get an email when they book, and again when you confirm or cancel, if they gave an email address.</li>
            <li>Marking a visit as completed does not email the patient.</li>
            <li>Clinic alerts for new bookings go to the addresses configured on the server.</li>
          </ul>
        </Section>

        <Section icon={MapPin} title="Clinic">
          <p className="text-sm text-gray-600 leading-relaxed">
            #251, 11th Cross Road, BDA Layout, Opp. Hulimavu Lake, Hulimavu, Bengaluru - 560076
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/admin/availability" className="group flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:border-[#047BCA] transition-colors">
              <CalendarClock className="w-5 h-5 text-[#1C7E4E]" />
              <span className="flex-1 text-sm font-semibold text-gray-700 group-hover:text-[#047BCA]">Weekly hours</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#047BCA]" />
            </Link>
            <Link href="/admin/blocked-slots" className="group flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:border-[#047BCA] transition-colors">
              <Ban className="w-5 h-5 text-[#1C7E4E]" />
              <span className="flex-1 text-sm font-semibold text-gray-700 group-hover:text-[#047BCA]">Blocked time</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#047BCA]" />
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
