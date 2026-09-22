/**
 * API Configuration and Client
 * Centralized API management for the Dr. Vivek Shetty website
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://techy.zapto.org:8000/api',
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/auth/login/',
      LOGOUT: '/auth/logout/',
      TOKEN: '/auth/token/',
      REFRESH: '/auth/refresh/',
      VERIFY: '/auth/token/verify/',
      USER_PROFILE: '/auth/profile/',
      CHECK_ADMIN: '/auth/check-admin/',
    },
    
    // Appointment related endpoints
    APPOINTMENTS: '/appointments/',
    APPOINTMENT_DETAIL: '/appointment/',
    APPOINTMENT_STATS: '/appointments/stats/',
    CONFIRM_APPOINTMENT: '/appointments/',
    CANCEL_APPOINTMENT: '/appointments/',
    ADMIN_APPOINTMENT_ACTION: '/admin/appointments/',
    APPOINTMENT_ACTION_PAGE: '/appointment-action/',
    
    // Available slots (public endpoints)
    AVAILABLE_SLOTS: '/available-slots/',
    DETAILED_SLOTS: '/slots/detailed/',
    
    // Doctor availability endpoints (admin only)
    AVAILABILITY: '/availability/',
    
    // Blocked slots management (admin only)
    BLOCKED_SLOTS: '/blocked-slots/',
    BLOCKED_SLOTS_SUMMARY: '/blocked-slots/summary/',
    
    // Email template management (admin only)
    // EMAIL_TEMPLATES: '/email-templates/',
    // EMAIL_TEMPLATES_TEST: '/email-templates/test/',
    // EMAIL_TEMPLATES_VALIDATE: '/email-templates/validate/',
    // EMAIL_TEMPLATES_PREVIEW: '/email-templates/preview/',
    // EMAIL_TEMPLATES_STATS: '/email-templates/statistics/',
  }
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AvailableSlot {
  time: string;
  available: boolean;
  slot_id?: string;
  duration?: number;
}

export interface AvailableSlotsResponse {
  success: boolean;
  date: string;
  available_slots: AvailableSlot[];
  total_available: number;
}

export interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  reason?: string;
}

export interface BookedAppointment {
  appointment_id: string;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Import mock API
import { mockApi, shouldUseMockApi } from './mockApi';

// API Client Class
export class ApiClient {
  private baseUrl: string;
  private useMock: boolean;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    this.useMock = false; // Force to use real API instead of mock
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log('🌐 Making API request to:', url);
      console.log('🌐 Request config:', {
        method: config.method || 'GET',
        headers: config.headers
      });
      
      const response = await fetch(url, config);
      console.log('🌐 Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('🌐 Response data:', data);

      if (!response.ok) {
        console.log('❌ API request failed:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        // Provide more specific error messages
        let errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status === 500) {
          errorMessage = 'Server error. Please try again later or contact support.';
        } else if (response.status === 404) {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (response.status === 401) {
          errorMessage = 'Authentication required. Please refresh the page and try again.';
        } else if (response.status === 400) {
          errorMessage = data.error || 'Invalid data provided. Please check your information and try again.';
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      console.log('✅ API request successful');
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('💥 API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Appointment APIs
  async getAvailableSlots(): Promise<ApiResponse<AvailableSlotsResponse>> {
    if (this.useMock) {
      return mockApi.getAvailableSlots();
    }
    return this.request<AvailableSlotsResponse>(API_CONFIG.ENDPOINTS.AVAILABLE_SLOTS);
  }

  async bookAppointment(appointmentData: AppointmentFormData): Promise<ApiResponse<BookedAppointment>> {
    if (this.useMock) {
      return mockApi.bookAppointment(appointmentData);
    }
    return this.request<BookedAppointment>(API_CONFIG.ENDPOINTS.APPOINTMENTS, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async getAppointments(page: number = 1, limit: number = 10, accessToken?: string): Promise<ApiResponse<{ appointments: BookedAppointment[]; pagination: any }>> {
    if (this.useMock) {
      return mockApi.getAppointments();
    }
    
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return this.request<{ appointments: BookedAppointment[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}?page=${page}&limit=${limit}`, {
      headers,
    });
  }

  async getAppointmentDetail(appointmentId: number, accessToken: string): Promise<ApiResponse<{ appointment: BookedAppointment }>> {
    return this.request<{ appointment: BookedAppointment }>(`${API_CONFIG.ENDPOINTS.APPOINTMENT_DETAIL}${appointmentId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async updateAppointment(appointmentId: number, appointmentData: Partial<AppointmentFormData>, accessToken: string): Promise<ApiResponse<{ appointment: BookedAppointment }>> {
    return this.request<{ appointment: BookedAppointment }>(`${API_CONFIG.ENDPOINTS.APPOINTMENT_DETAIL}${appointmentId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(appointmentId: number, accessToken: string): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.APPOINTMENT_DETAIL}${appointmentId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async getAppointmentStats(accessToken: string): Promise<ApiResponse<{ stats: any }>> {
    return this.request<{ stats: any }>(API_CONFIG.ENDPOINTS.APPOINTMENT_STATS, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async confirmAppointment(appointmentId: number): Promise<ApiResponse<{ appointment: BookedAppointment }>> {
    return this.request<{ appointment: BookedAppointment }>(`${API_CONFIG.ENDPOINTS.CONFIRM_APPOINTMENT}${appointmentId}/confirm/`, {
      method: 'POST',
    });
  }

  async cancelAppointment(appointmentId: number): Promise<ApiResponse<{ appointment: BookedAppointment }>> {
    return this.request<{ appointment: BookedAppointment }>(`${API_CONFIG.ENDPOINTS.CANCEL_APPOINTMENT}${appointmentId}/cancel/`, {
      method: 'POST',
    });
  }

  // Admin appointment action method
  async adminAppointmentAction(appointmentId: number, action: 'confirm' | 'cancel', accessToken: string): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_APPOINTMENT_ACTION}${appointmentId}/${action}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }


  // Authentication APIs
  async login(username: string, password: string): Promise<ApiResponse<{ tokens: { access: string; refresh: string }; user: any }>> {
    return this.request<{ tokens: { access: string; refresh: string }; user: any }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(refreshToken: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async getUserProfile(accessToken: string): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>(API_CONFIG.ENDPOINTS.AUTH.USER_PROFILE, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async getToken(username: string, password: string): Promise<ApiResponse<{ access: string; refresh: string; user: any }>> {
    return this.request<{ access: string; refresh: string; user: any }>(API_CONFIG.ENDPOINTS.AUTH.TOKEN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ access: string }>> {
    return this.request<{ access: string }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async verifyToken(accessToken: string): Promise<ApiResponse<{ valid: boolean; user: any }>> {
    return this.request<{ valid: boolean; user: any }>(API_CONFIG.ENDPOINTS.AUTH.VERIFY, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async checkAdmin(accessToken: string): Promise<ApiResponse<{ is_admin: boolean; permissions: any }>> {
    return this.request<{ is_admin: boolean; permissions: any }>(API_CONFIG.ENDPOINTS.AUTH.CHECK_ADMIN, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }


  // Contact APIs (using mock for now)
  async submitContactForm(formData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse> {
    if (this.useMock) {
      return mockApi.submitContactForm(formData);
    }
    // TODO: Implement real contact API endpoint
    return mockApi.submitContactForm(formData);
  }

  async subscribeNewsletter(email: string): Promise<ApiResponse> {
    if (this.useMock) {
      return mockApi.subscribeNewsletter(email);
    }
    // TODO: Implement real newsletter API endpoint
    return mockApi.subscribeNewsletter(email);
  }

  // Doctor Profile APIs (using mock for now)
  async getDoctorProfile(): Promise<ApiResponse> {
    // TODO: Implement real doctor profile API endpoint
    return mockApi.getDoctorProfile();
  }

  async getServices(): Promise<ApiResponse> {
    // TODO: Implement real services API endpoint
    return mockApi.getServices();
  }

  async getTestimonials(): Promise<ApiResponse> {
    // TODO: Implement real testimonials API endpoint
    return mockApi.getTestimonials();
  }

  async getVideos(): Promise<ApiResponse> {
    // TODO: Implement real videos API endpoint
    return mockApi.getVideos();
  }

  // Blocked Slots Management (Admin Only)
  async createBlockedSlot(blockedSlotData: {
    date: string;
    start_time: string;
    end_time: string;
    reason?: string;
  }, accessToken: string): Promise<ApiResponse<{ blocked_slot: any }>> {
    return this.request<{ blocked_slot: any }>(API_CONFIG.ENDPOINTS.BLOCKED_SLOTS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(blockedSlotData),
    });
  }

  async getBlockedSlotsSummary(accessToken: string): Promise<ApiResponse<{ summary: any }>> {
    return this.request<{ summary: any }>(API_CONFIG.ENDPOINTS.BLOCKED_SLOTS_SUMMARY, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  // Additional methods needed for new admin pages
  async getBlockedSlots(accessToken: string): Promise<ApiResponse<{ blocked_slots: any[] }>> {
    return this.request<{ blocked_slots: any[] }>(API_CONFIG.ENDPOINTS.BLOCKED_SLOTS, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async updateBlockedSlot(blockedId: number, data: any, accessToken: string): Promise<ApiResponse<{ blocked_slot: any }>> {
    return this.request<{ blocked_slot: any }>(`${API_CONFIG.ENDPOINTS.BLOCKED_SLOTS}${blockedId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  async deleteBlockedSlot(blockedId: number, accessToken: string): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.BLOCKED_SLOTS}${blockedId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async getDoctorAvailability(accessToken: string): Promise<ApiResponse<{ availability: any[] }>> {
    return this.request<{ availability: any[] }>(API_CONFIG.ENDPOINTS.AVAILABILITY, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async createDoctorAvailability(data: any, accessToken: string): Promise<ApiResponse<{ availability: any }>> {
    return this.request<{ availability: any }>(API_CONFIG.ENDPOINTS.AVAILABILITY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updateDoctorAvailability(availabilityId: number, data: any, accessToken: string): Promise<ApiResponse<{ availability: any }>> {
    return this.request<{ availability: any }>(`${API_CONFIG.ENDPOINTS.AVAILABILITY}${availabilityId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  async deleteDoctorAvailability(availabilityId: number, accessToken: string): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.AVAILABILITY}${availabilityId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  // Email Template Management (Admin Only)
  // async getEmailTemplates(accessToken: string): Promise<ApiResponse<{ templates: any }>> {
  //   return this.request<{ templates: any }>(API_CONFIG.ENDPOINTS.EMAIL_TEMPLATES, {
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //     },
  //   });
  // }

  // async updateEmailTemplate(templateData: {
  //   template_type: string;
  //   subject: string;
  //   body: string;
  // }, accessToken: string): Promise<ApiResponse<{ template: any }>> {
  //   return this.request<{ template: any }>(API_CONFIG.ENDPOINTS.EMAIL_TEMPLATES, {
  //     method: 'PUT',
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //     },
  //     body: JSON.stringify(templateData),
  //   });
  // }

  // async testEmailTemplate(templateType: string, accessToken: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
  //   return this.request<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.EMAIL_TEMPLATES_TEST, {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //     },
  //     body: JSON.stringify({ template_type: templateType }),
  //   });
  // }

  // async validateEmailTemplate(templateData: {
  //   template_type: string;
  //   subject: string;
  //   body: string;
  // }, accessToken: string): Promise<ApiResponse<{ valid: boolean; errors: string[] }>> {
  //   return this.request<{ valid: boolean; errors: string[] }>(API_CONFIG.ENDPOINTS.EMAIL_TEMPLATES_VALIDATE, {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //     },
  //     body: JSON.stringify(templateData),
  //   });
  // }

  // async getEmailTemplatePreview(templateType: string, accessToken: string): Promise<ApiResponse<{ preview: string }>> {
  //   return this.request<{ preview: string }>(`${API_CONFIG.ENDPOINTS.EMAIL_TEMPLATES_PREVIEW}?template_type=${templateType}`, {
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //     },
  //   });
  // }

  // async getEmailStatistics(accessToken: string): Promise<ApiResponse<{ statistics: any }>> {
  //   return this.request<{ statistics: any }>(API_CONFIG.ENDPOINTS.EMAIL_TEMPLATES_STATS, {
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //     },
  //   });
  // }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Utility functions for common API operations
export const apiUtils = {
  // Format time for display
  formatTime: (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  },

  // Format date for display
  formatDate: (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Indian format)
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  // Generate time slots based on availability
  generateTimeSlots: (startTime: string, endTime: string, duration: number = 30): string[] => {
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    while (start < end) {
      slots.push(start.toTimeString().slice(0, 5));
      start.setMinutes(start.getMinutes() + duration);
    }
    
    return slots;
  },
};

// Error handling utilities
export const handleApiError = (error: string): string => {
  const errorMessages: Record<string, string> = {
    'Network error': 'Unable to connect to the server. Please check your internet connection.',
    'Invalid email': 'Please enter a valid email address.',
    'Invalid phone': 'Please enter a valid 10-digit phone number.',
    'Slot not available': 'This time slot is no longer available. Please select another time.',
    'Appointment conflict': 'You already have an appointment at this time.',
  };

  return errorMessages[error] || 'An unexpected error occurred. Please try again.';
};

// Enhanced error handling for API responses
export const handleApiResponseError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `Bad Request: ${data.error || 'Invalid data provided'}`;
      case 401:
        return 'Unauthorized: Please login again';
      case 403:
        return 'Forbidden: You do not have permission to perform this action';
      case 404:
        return 'Not Found: The requested resource was not found';
      case 500:
        return 'Server Error: Please try again later';
      default:
        return data.error || 'An unexpected error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network Error: Please check your internet connection';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

// Token refresh utility
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const storedTokens = localStorage.getItem('admin_tokens');
    if (!storedTokens) {
      return null;
    }

    const parsedTokens = JSON.parse(storedTokens);
    const refreshToken = parsedTokens.refresh;
    
    if (!refreshToken) {
      return null;
    }

    const apiClient = new ApiClient();
    const response = await apiClient.refreshToken(refreshToken);
    
    if (response.success && response.data) {
      const newTokens = {
        access: response.data.access,
        refresh: parsedTokens.refresh
      };
      localStorage.setItem('admin_tokens', JSON.stringify(newTokens));
      return response.data.access;
    } else {
      // Clear invalid tokens
      localStorage.removeItem('admin_tokens');
      return null;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear invalid tokens
    localStorage.removeItem('admin_tokens');
    return null;
  }
};

// Auto-retry with token refresh
export const apiRequestWithRetry = async <T>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 1
): Promise<ApiResponse<T>> => {
  try {
    return await requestFn();
  } catch (error: any) {
    if (error.response?.status === 401 && maxRetries > 0) {
      // Try to refresh token and retry
      const newToken = await refreshAccessToken();
      if (newToken) {
        return apiRequestWithRetry(requestFn, maxRetries - 1);
      }
    }
    throw error;
  }
}