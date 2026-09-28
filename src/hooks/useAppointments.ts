/**
 * Custom hook for managing appointment-related operations
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, AppointmentFormData, AvailableDate, handleApiError } from '@/lib/api';

export interface UseAppointmentsReturn {
  // State
  availableDates: AvailableDate[];
  datesLoading: boolean;
  availableSlots: string[];
  loading: boolean;
  error: string | null;
  bookingLoading: boolean;
  bookingError: string | null;
  bookingSuccess: boolean;
  
  // Actions
  fetchAvailableDates: () => Promise<void>;
  fetchAvailableSlots: (date: string) => Promise<void>;
  bookAppointment: (formData: AppointmentFormData) => Promise<boolean>;
  clearBookingState: () => void;
  clearError: () => void;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fetchAvailableDates = useCallback(async () => {
    setDatesLoading(true);
    const response = await apiClient.getAvailableDates(14);
    if (response.success && response.data) {
      setAvailableDates(response.data.dates);
      setError(null);
    } else {
      setAvailableDates([]);
      setError('Online booking is temporarily unavailable. Please try again shortly.');
    }
    setDatesLoading(false);
  }, []);

  const fetchAvailableSlots = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.getAvailableSlots(date);
    if (response.success && response.data) {
      setAvailableSlots(response.data.available_slots.filter(slot => slot.available).map(slot => slot.time));
    } else {
      setAvailableSlots([]);
      setError(handleApiError(response.error || 'Could not load time slots.'));
    }
    setLoading(false);
  }, []);

  const bookAppointment = useCallback(async (formData: AppointmentFormData): Promise<boolean> => {
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      const response = await apiClient.bookAppointment(formData);
      if (response.success && response.data) {
        setBookingSuccess(true);
        return true;
      }
      setBookingError(handleApiError(response.error || 'Failed to book appointment'));
      await fetchAvailableSlots(formData.date);
      return false;
    } catch (err) {
      setBookingError(handleApiError('Network error'));
      return false;
    } finally {
      setBookingLoading(false);
    }
  }, [fetchAvailableSlots]);

  const clearBookingState = useCallback(() => {
    setBookingLoading(false);
    setBookingError(null);
    setBookingSuccess(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setBookingError(null);
  }, []);

  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates]);

  return {
    availableDates,
    datesLoading,
    availableSlots,
    loading,
    error,
    bookingLoading,
    bookingError,
    bookingSuccess,
    fetchAvailableDates,
    fetchAvailableSlots,
    bookAppointment,
    clearBookingState,
    clearError,
  };
};
