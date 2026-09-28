from django.contrib import admin

from .models import Appointment, Availability, BlockedSlot


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'date', 'time', 'status', 'created_at')
    list_filter = ('status', 'date')
    search_fields = ('name', 'phone', 'email')
    date_hierarchy = 'date'


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'start_time', 'end_time', 'slot_duration', 'is_active')
    list_filter = ('day_of_week', 'is_active')


@admin.register(BlockedSlot)
class BlockedSlotAdmin(admin.ModelAdmin):
    list_display = ('date', 'start_time', 'end_time', 'reason')
    date_hierarchy = 'date'
