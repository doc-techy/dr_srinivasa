from django.urls import path

from . import views

app_name = 'srinivasa'

urlpatterns = [
    path('available-slots/', views.available_slots_view, name='available-slots'),
    path('available-dates/', views.available_dates_view, name='available-dates'),
    path('appointments/', views.AppointmentListCreateView.as_view(), name='appointments'),
    path('appointments/stats/', views.appointment_stats_view, name='appointment-stats'),
    path('appointments/<int:appointment_id>/', views.appointment_detail_view, name='appointment-detail'),
    path('admin/appointments/<int:appointment_id>/<str:action>/', views.appointment_action_view, name='appointment-action'),
    path('slots/detailed/', views.detailed_slots_view, name='detailed-slots'),
    path('availability/', views.AvailabilityView.as_view(), name='availability'),
    path('availability/<int:pk>/', views.AvailabilityView.as_view(), name='availability-detail'),
    path('blocked-slots/', views.BlockedSlotView.as_view(), name='blocked-slots'),
    path('blocked-slots/summary/', views.blocked_slots_summary_view, name='blocked-slots-summary'),
    path('blocked-slots/<int:pk>/', views.BlockedSlotView.as_view(), name='blocked-slot-detail'),
    path('auth/check-admin/', views.check_admin_view, name='check-admin'),
]
