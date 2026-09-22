/**
 * Mock API Service for Development
 * Provides mock data when backend is not available
 */

import { AvailableSlotsResponse, AppointmentFormData, BookedAppointment } from './api';

// Mock data
const MOCK_AVAILABLE_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30'
];

const MOCK_BOOKED_APPOINTMENTS: BookedAppointment[] = [
  {
    appointment_id: 'apt_001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_phone: '‪9886432371‬',
    appointment_date: '2024-01-15',
    appointment_time: '10:00',
    reason: 'Follow-up consultation',
    status: 'confirmed',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    appointment_id: 'apt_002',
    patient_name: 'Jane Smith',
    patient_email: 'jane@example.com',
    patient_phone: '9876543211',
    appointment_date: '2024-01-15',
    appointment_time: '14:30',
    reason: 'Initial consultation',
    status: 'pending',
    created_at: '2024-01-11T14:30:00Z',
    updated_at: '2024-01-11T14:30:00Z',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApi = {
  // Get available slots
  async getAvailableSlots(): Promise<{ success: boolean; data?: AvailableSlotsResponse; error?: string }> {
    await delay(1000); // Simulate network delay
    
    // Simulate some slots being booked
    const bookedSlots = ['10:00', '14:30', '16:00'];
    const availableSlots = MOCK_AVAILABLE_SLOTS
      .filter(slot => !bookedSlots.includes(slot))
      .map(time => ({
        time,
        available: true,
        slot_id: `slot_${time.replace(':', '')}`,
        duration: 30,
      }));

    return {
      success: true,
      data: {
        success: true,
        date: new Date().toISOString().split('T')[0],
        available_slots: availableSlots,
        total_available: availableSlots.length,
      },
    };
  },

  // Book appointment
  async bookAppointment(formData: AppointmentFormData): Promise<{ success: boolean; data?: BookedAppointment; error?: string }> {
    await delay(1500); // Simulate network delay
    
    // Simulate validation
    if (!formData.name || !formData.email || !formData.phone) {
      return {
        success: false,
        error: 'Please fill in all required fields',
      };
    }

    if (!formData.date || !formData.time) {
      return {
        success: false,
        error: 'Please select an appointment date and time',
      };
    }

    // Check if slot is still available
    const availableResponse = await this.getAvailableSlots();
    if (availableResponse.success && availableResponse.data) {
      const isSlotAvailable = availableResponse.data.available_slots.some(
        slot => slot.time === formData.time && slot.available
      );

      if (!isSlotAvailable) {
        return {
          success: false,
          error: 'This time slot is no longer available. Please select another time.',
        };
      }
    }

    // Create mock appointment
    const newAppointment: BookedAppointment = {
      appointment_id: `apt_${Date.now()}`,
      patient_name: formData.name,
      patient_email: formData.email,
      patient_phone: formData.phone,
      appointment_date: formData.date,
      appointment_time: formData.time,
      reason: formData.reason,
      status: 'pending',
      notes: formData.message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mock database
    MOCK_BOOKED_APPOINTMENTS.push(newAppointment);

    return {
      success: true,
      data: newAppointment,
    };
  },

  // Get appointments
  async getAppointments(): Promise<{ success: boolean; data?: { appointments: BookedAppointment[]; pagination: any }; error?: string }> {
    await delay(800);
    
    return {
      success: true,
      data: {
        appointments: MOCK_BOOKED_APPOINTMENTS,
        pagination: {
          total: MOCK_BOOKED_APPOINTMENTS.length,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      },
    };
  },

  // Submit contact form
  async submitContactForm(formData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    await delay(1000);
    
    if (!formData.name || !formData.email || !formData.message) {
      return {
        success: false,
        error: 'Please fill in all required fields',
      };
    }

    return {
      success: true,
    };
  },

  // Subscribe to newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
    await delay(500);

    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    return {
      success: true,
    };
  },

  async getDoctorProfile(): Promise<{ success: boolean; data?: any; error?: string }> {
    await delay(300);
    return {
      success: true,
      data: {
        name: 'Dr. Vivek Shetty',
        specialization: 'Head & Neck Oncology',
        experience: '9 years',
        qualifications: ['MBBS', 'MS General Surgery', 'Fellowship in Head and Neck Surgical Oncology'],
        location: 'SPARSH Hospital, Hennur Road',
        languages: ['English', 'Hindi', 'Kannada']
      }
    };
  },

  async getServices(): Promise<{ success: boolean; data?: any; error?: string }> {
    await delay(300);
    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'Head & Neck Surgery',
          description: 'Advanced surgical procedures for head and neck conditions',
          icon: 'surgery'
        },
        {
          id: 2,
          title: 'Oncology Consultation',
          description: 'Comprehensive cancer care and treatment planning',
          icon: 'consultation'
        },
        {
          id: 3,
          title: 'Reconstructive Surgery',
          description: 'Restorative procedures following cancer treatment',
          icon: 'reconstruction'
        }
      ]
    };
  },

  async getTestimonials(): Promise<{ success: boolean; data?: any; error?: string }> {
    await delay(300);
    return {
      success: true,
      data: [
        {
          id: 1,
          name: 'Patient Name',
          rating: 5,
          comment: 'Excellent care and treatment. Highly recommended.',
          date: '2024-01-15'
        }
      ]
    };
  },

  async getVideos(): Promise<{ success: boolean; data?: any; error?: string }> {
    await delay(300);
    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'Educational Video 1',
          description: 'Learn about head and neck surgery procedures',
          thumbnail: 'https://picsum.photos/400/225?random=1',
          duration: '5:30'
        }
      ]
    };
  },
};

// Check if we should use mock API
export const shouldUseMockApi = (): boolean => {
  return process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
};
