/**
 * Custom hook for managing appointment-related operations
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, AvailableSlotsResponse, AppointmentFormData, BookedAppointment, handleApiError } from '@/lib/api';

export interface UseAppointmentsReturn {
  // State
  availableSlots: string[];
  loading: boolean;
  error: string | null;
  bookingLoading: boolean;
  bookingError: string | null;
  bookingSuccess: boolean;
  
  // Actions
  fetchAvailableSlots: () => Promise<void>;
  bookAppointment: (formData: AppointmentFormData) => Promise<boolean>;
  clearBookingState: () => void;
  clearError: () => void;
}

export const useAppointments = (): UseAppointmentsReturn => {
  // State management
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch available slots
  const fetchAvailableSlots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getAvailableSlots();
      
      if (response.success && response.data) {
        // Extract time slots from the response
        const slots = response.data.available_slots
          .filter(slot => slot.available)
          .map(slot => slot.time);
        setAvailableSlots(slots);
      } else {
        console.warn('Available slots API failed, using fallback slots');
        // Fallback to default time slots if API fails
        setAvailableSlots([
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ]);
        setError(null); // Don't show error for fallback
      }
    } catch (err) {
      console.warn('Available slots API error, using fallback slots:', err);
      // Fallback to default time slots if API fails
      setAvailableSlots([
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ]);
      setError(null); // Don't show error for fallback
    } finally {
      setLoading(false);
    }
  }, []);

  // Book appointment
  const bookAppointment = useCallback(async (formData: AppointmentFormData): Promise<boolean> => {
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      console.log('📅 Attempting to book appointment:', formData);
      const response = await apiClient.bookAppointment(formData);
      
      if (response.success && response.data) {
        console.log('✅ Appointment booked successfully:', response.data);
        setBookingSuccess(true);
        // Refresh available slots after successful booking
        await fetchAvailableSlots();
        return true;
      } else {
        console.error('❌ Appointment booking failed:', response.error);
        setBookingError(handleApiError(response.error || 'Failed to book appointment'));
        return false;
      }
    } catch (err) {
      console.error('💥 Appointment booking error:', err);
      setBookingError(handleApiError('Network error. Please check your connection and try again.'));
      return false;
    } finally {
      setBookingLoading(false);
    }
  }, [fetchAvailableSlots]);

  // Clear booking state
  const clearBookingState = useCallback(() => {
    setBookingLoading(false);
    setBookingError(null);
    setBookingSuccess(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    setBookingError(null);
  }, []);

  // Auto-fetch available slots on mount
  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  return {
    // State
    availableSlots,
    loading,
    error,
    bookingLoading,
    bookingError,
    bookingSuccess,
    
    // Actions
    fetchAvailableSlots,
    bookAppointment,
    clearBookingState,
    clearError,
  };
};
