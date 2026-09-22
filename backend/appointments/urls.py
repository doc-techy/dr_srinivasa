"""
URL configuration for appointments app
"""

from django.urls import path
from . import views

app_name = 'appointments'

urlpatterns = [
    # Main appointment endpoints
    path('appointments/', views.AppointmentCreateView.as_view(), name='appointments'),
    path('appointments/<int:appointment_id>/', views.appointment_detail_view, name='appointment_detail'),
    
    # Admin action endpoints (for email buttons)
    path('appointments/<int:appointment_id>/confirm/', views.confirm_appointment, name='confirm_appointment'),
    path('appointments/<int:appointment_id>/cancel/', views.cancel_appointment, name='cancel_appointment'),
    
    # Admin email action endpoints (new)
    path('admin/appointments/<int:appointment_id>/<str:action>/', views.admin_appointment_action, name='admin_appointment_action'),
    
    # Invisible action page for email buttons
    path('appointment-action/', views.appointment_action_page, name='appointment_action_page'),
    
    # Statistics endpoint
    path('appointments/stats/', views.get_appointment_stats, name='appointment_stats'),
    
    # Doctor availability management endpoints (admin only)
    path('availability/', views.DoctorAvailabilityView.as_view(), name='doctor_availability'),
    path('availability/<str:availability_id>/', views.DoctorAvailabilityView.as_view(), name='doctor_availability_detail'),
    
    # Available slots endpoints
    path('available-slots/', views.get_available_slots, name='available_slots'),  # Public endpoint for patients
    path('slots/detailed/', views.get_detailed_slots, name='detailed_slots'),  # Admin endpoint with full slot info
]
