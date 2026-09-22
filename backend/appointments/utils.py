"""
Utility functions for appointment management
"""

from datetime import datetime, date, time, timedelta
from django.db.models import Q
from .models import DoctorAvailability, Appointment


def get_availability_for_date(target_date):
    """Get all availability entries for a specific date"""
    # Get recurring availability for the day of week
    day_of_week = target_date.weekday()
    recurring_availability = DoctorAvailability.objects.filter(
        is_recurring=True,
        day_of_week=day_of_week,
        is_active=True
    )
    
    # Get specific date availability
    specific_availability = DoctorAvailability.objects.filter(
        is_recurring=False,
        date=target_date,
        is_active=True
    )
    
    # Combine and return
    return list(recurring_availability) + list(specific_availability)


def get_available_slots_for_date(target_date):
    """Get all slots (available and booked) for a specific date"""
    availability = get_availability_for_date(target_date)
    slots_data = {
        'slots': [],
        'total_slots': 0,
        'available_slots': 0,
        'booked_slots': 0,
        'blocked_slots': 0
    }
    
    for avail in availability:
        # Generate time slots for this availability
        time_slots = generate_time_slots(
            avail.start_time,
            avail.end_time,
            avail.slot_duration
        )
        
        for slot_time in time_slots:
            slot_id = f"{avail.availability_id}_{slot_time.strftime('%H%M')}"
            
            # Check if slot is booked
            is_booked = Appointment.objects.filter(
                appointment_date=target_date,
                appointment_time=slot_time,
                status__in=['pending', 'confirmed']
            ).exists()
            
            slot_data = {
                'time': slot_time.strftime('%H:%M'),
                'available': not is_booked,
                'slot_id': slot_id,
                'duration': avail.slot_duration,
                'booked': is_booked
            }
            
            slots_data['slots'].append(slot_data)
            slots_data['total_slots'] += 1
            
            if is_booked:
                slots_data['booked_slots'] += 1
            else:
                slots_data['available_slots'] += 1
    
    return slots_data


def get_only_available_slots_for_date(target_date):
    """Get only available slots for a specific date (excludes booked slots)"""
    availability = get_availability_for_date(target_date)
    available_slots = []
    
    for avail in availability:
        # Generate time slots for this availability
        time_slots = generate_time_slots(
            avail.start_time,
            avail.end_time,
            avail.slot_duration
        )
        
        for slot_time in time_slots:
            # Check if slot is booked
            is_booked = Appointment.objects.filter(
                appointment_date=target_date,
                appointment_time=slot_time,
                status__in=['pending', 'confirmed']
            ).exists()
            
            if not is_booked:
                available_slots.append({
                    'time': slot_time.strftime('%H:%M'),
                    'available': True,
                    'slot_id': f"{avail.availability_id}_{slot_time.strftime('%H%M')}",
                    'duration': avail.slot_duration
                })
    
    return available_slots


def generate_time_slots(start_time, end_time, duration_minutes):
    """Generate time slots between start and end time"""
    slots = []
    current_time = datetime.combine(date.today(), start_time)
    end_datetime = datetime.combine(date.today(), end_time)
    
    while current_time < end_datetime:
        slots.append(current_time.time())
        current_time += timedelta(minutes=duration_minutes)
    
    return slots


def check_availability_conflict(availability_data, exclude_id=None):
    """Check if there's a conflict with existing availability"""
    start_time = availability_data['start_time']
    end_time = availability_data['end_time']
    
    # Build query
    query = Q(
        start_time__lt=end_time,
        end_time__gt=start_time,
        is_active=True
    )
    
    # Exclude specific ID if provided
    if exclude_id:
        query &= ~Q(availability_id=exclude_id)
    
    # Check for recurring availability conflicts
    if availability_data.get('is_recurring', False):
        day_of_week = availability_data['day_of_week']
        query &= Q(is_recurring=True, day_of_week=day_of_week)
    else:
        # Check for specific date conflicts
        specific_date = availability_data.get('date')
        if specific_date:
            query &= Q(is_recurring=False, date=specific_date)
        else:
            return False  # No date specified for non-recurring
    
    return DoctorAvailability.objects.filter(query).exists()


def get_next_available_date():
    """Get the next available date for appointments"""
    today = date.today()
    current_date = today
    
    # Look for availability in the next 30 days
    for _ in range(30):
        current_date += timedelta(days=1)
        availability = get_availability_for_date(current_date)
        if availability:
            return current_date
    
    return None


def is_slot_available(appointment_date, appointment_time):
    """Check if a specific slot is available"""
    # Check if there's availability for this date and time
    availability = get_availability_for_date(appointment_date)
    
    for avail in availability:
        time_slots = generate_time_slots(
            avail.start_time,
            avail.end_time,
            avail.slot_duration
        )
        
        if appointment_time in time_slots:
            # Check if slot is booked
            is_booked = Appointment.objects.filter(
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                status__in=['pending', 'confirmed']
            ).exists()
            
            return not is_booked
    
    return False


def get_appointment_statistics(start_date, end_date):
    """Get appointment statistics for a date range"""
    appointments = Appointment.objects.filter(
        appointment_date__range=[start_date, end_date]
    )
    
    stats = {
        'total_appointments': appointments.count(),
        'pending': appointments.filter(status='pending').count(),
        'confirmed': appointments.filter(status='confirmed').count(),
        'cancelled': appointments.filter(status='cancelled').count(),
        'completed': appointments.filter(status='completed').count(),
        'no_show': appointments.filter(status='no_show').count(),
    }
    
    return stats
