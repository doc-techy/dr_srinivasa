'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Navigation, Loader2, AlertCircle, Sun, Moon, Phone, RefreshCw } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { apiUtils } from '@/lib/api';
import { CLINIC_NAME, CLINIC_TAGLINE, CONTACT } from '@/lib/site';

interface AppointmentBookingProps {
  className?: string;
}

const CLINIC = {
  name: `${CLINIC_NAME} (${CLINIC_TAGLINE})`,
  address: '#251, 11th Cross Road, Muthurayya Swamy Layout, Opposite Hulimavu Lake Road, Hulimavu, Bangalore 560076',
  hours: 'Mon–Sat: 9:00 AM – 12:00 PM and 4:00 PM – 7:30 PM. Sunday holiday.',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=251+11th+Cross+Road+Muthurayya+Swamy+Layout+Hulimavu+Bangalore+560076',
};

const emptyForm = { name: '', phone: '', email: '', message: '' };

const parseDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function AppointmentBooking({ className = '' }: AppointmentBookingProps) {
  const {
    availableDates,
    datesLoading,
    datesError,
    availableSlots,
    loading: slotsLoading,
    error,
    bookingLoading,
    bookingError,
    bookingSuccess,
    fetchAvailableDates,
    fetchAvailableSlots,
    bookAppointment,
    clearBookingState,
  } = useAppointments();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [booked, setBooked] = useState<{ date: string; time: string; name: string } | null>(null);

  useEffect(() => {
    if (!selectedDate && availableDates.length) {
      const firstOpen = availableDates.find(d => d.available_count > 0);
      if (firstOpen) setSelectedDate(firstOpen.date);
    }
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedTime('');
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, fetchAvailableSlots]);

  useEffect(() => {
    if (bookingError) setSelectedTime('');
  }, [bookingError]);

  const slotGroups = useMemo(() => ({
    morning: availableSlots.filter(time => time < '12:00'),
    evening: availableSlots.filter(time => time >= '12:00'),
  }), [availableSlots]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!selectedDate || !selectedTime) return setFormError('Please choose a date and time.');
    if (form.name.trim().length < 2) return setFormError('Please enter the patient name.');
    if (!apiUtils.isValidPhone(form.phone)) return setFormError('Please enter a valid 10-digit mobile number.');
    if (form.email && !apiUtils.isValidEmail(form.email)) return setFormError('Please enter a valid email address.');

    const ok = await bookAppointment({
      name: form.name.trim(),
      phone: form.phone,
      email: form.email.trim(),
      message: form.message.trim(),
      date: selectedDate,
      time: selectedTime,
    });
    if (ok) {
      setBooked({ date: selectedDate, time: selectedTime, name: form.name.trim() });
      setForm(emptyForm);
    }
  };

  const startOver = () => {
    clearBookingState();
    setBooked(null);
    setSelectedDate('');
    setSelectedTime('');
    fetchAvailableDates();
  };

  const inputClass = 'w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-[#047BCA] focus:outline-none focus:ring-2 focus:ring-[#047BCA]/20';

  const renderSlots = (label: string, Icon: typeof Sun, slots: string[]) => slots.length > 0 && (
    <div>
      <p className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <Icon className="w-4 h-4 mr-2 text-[#047BCA]" />
        {label}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 min-w-0">
        {slots.map(time => (
          <button
            key={time}
            type="button"
            onClick={() => setSelectedTime(time)}
            className={`min-w-0 rounded-lg border px-1 py-2.5 text-xs sm:text-sm font-medium leading-tight transition-all duration-200 ${
              selectedTime === time
                ? 'border-transparent bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#047BCA] hover:text-[#047BCA]'
            }`}
          >
            {apiUtils.formatTime(time)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-8 min-w-0 max-w-full overflow-hidden ${className}`}>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Book an Appointment</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Pick a convenient slot at the Hulimavu clinic. The clinic will confirm your request.
        </p>
      </div>

      {booked && bookingSuccess ? (
        <div className="text-center rounded-2xl border border-[#1C7E4E]/20 bg-green-50 p-8">
          <CheckCircle className="w-14 h-14 mx-auto mb-4 text-[#1C7E4E]" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Request received</h3>
          <p className="text-gray-700 mb-1">
            Thank you, {booked.name}. Your appointment request for
          </p>
          <p className="text-lg font-semibold text-[#047BCA] mb-4">
            {apiUtils.formatDate(booked.date)} at {apiUtils.formatTime(booked.time)}
          </p>
          <p className="text-sm text-gray-600 mb-6">The clinic will confirm your appointment shortly.</p>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white font-semibold rounded-xl hover:from-[#145C38] hover:to-[#0369A1] transition-all duration-300 shadow-lg"
          >
            Book another appointment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 min-w-0">
          <section>
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
              <Calendar className="w-5 h-5 mr-2 text-[#047BCA]" />
              1. Choose a date
            </h3>
            {datesLoading ? (
              <div className="flex items-center text-gray-500"><Loader2 className="w-5 h-5 mr-2 animate-spin" />Loading dates…</div>
            ) : datesError || availableDates.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="flex items-start mb-3">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {datesError || 'No appointment dates are open right now.'} You can also call the clinic to book.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={fetchAvailableDates}
                    className="inline-flex items-center rounded-lg bg-white border border-amber-300 px-4 py-2 font-semibold text-amber-800 hover:bg-amber-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try again
                  </button>
                  <a
                    href={CONTACT.phoneHref}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-4 py-2 font-semibold text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call {CONTACT.phone}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-2 snap-x">
                {availableDates.map(({ date, available_count }) => {
                  const day = parseDate(date);
                  const disabled = available_count === 0;
                  const active = date === selectedDate;
                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 snap-start w-[4.25rem] sm:w-[4.5rem] rounded-xl border px-2 py-3 text-center transition-all duration-200 ${
                        active
                          ? 'border-transparent bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] text-white shadow-md'
                          : disabled
                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#047BCA]'
                      }`}
                    >
                      <span className="block text-xs font-medium uppercase">{day.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                      <span className="block text-xl font-bold">{day.getDate()}</span>
                      <span className="block text-xs">{disabled ? 'Closed' : day.toLocaleDateString('en-IN', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
              <Clock className="w-5 h-5 mr-2 text-[#047BCA]" />
              2. Choose a time
            </h3>
            {slotsLoading ? (
              <div className="flex items-center text-gray-500"><Loader2 className="w-5 h-5 mr-2 animate-spin" />Loading slots…</div>
            ) : !selectedDate ? (
              <p className="text-gray-500 text-sm">Select a date to see open slots.</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-gray-500 text-sm">No slots left on this day. Please choose another date.</p>
            ) : (
              <div className="space-y-4">
                {renderSlots('Morning', Sun, slotGroups.morning)}
                {renderSlots('Evening', Moon, slotGroups.evening)}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">3. Patient details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className={inputClass} placeholder="Patient name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              <input className={inputClass} placeholder="Mobile number *" inputMode="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
              <input className={`${inputClass} sm:col-span-2`} placeholder="Email (optional, for confirmation)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              <textarea className={`${inputClass} sm:col-span-2`} rows={3} placeholder="Reason for visit (optional)" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
          </section>

          {(formError || bookingError || error) && (
            <div className="flex items-start rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {formError || bookingError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={bookingLoading || !selectedTime}
            className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-4 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white text-base sm:text-lg font-semibold rounded-xl hover:from-[#145C38] hover:to-[#0369A1] focus:ring-4 focus:ring-[#047BCA]/30 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {bookingLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Calendar className="w-5 h-5 mr-2" />}
            {selectedTime ? `Request ${apiUtils.formatTime(selectedTime)} appointment` : 'Select a time slot'}
          </button>
        </form>
      )}

      <div className="mt-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="flex items-start space-x-3 mb-3">
          <MapPin className="w-5 h-5 text-[#047BCA] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">{CLINIC.name}</h4>
            <p className="text-gray-600 text-sm">{CLINIC.address}</p>
            <a href={CLINIC.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#047BCA] text-sm font-medium mt-1">
              <Navigation className="w-3 h-3 mr-1" />
              Get Directions
            </a>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-[#047BCA] mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-sm">{CLINIC.hours}</p>
        </div>
      </div>

      <div className="mt-6 p-6 bg-green-50 rounded-2xl">
        <h3 className="text-lg font-semibold text-[#1C7E4E] mb-4 text-center">Important Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-[#047BCA]">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Please arrive 15 minutes before your scheduled appointment time
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Bring a valid ID and any relevant medical reports
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-[#047BCA]">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Cancellations must be made at least 24 hours in advance
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#047BCA] flex-shrink-0" />
              Emergency cases will be given priority
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
