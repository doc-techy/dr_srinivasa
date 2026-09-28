from datetime import date, datetime, time, timedelta

from django.utils import timezone

from .models import ACTIVE_STATUSES, DAY_NAMES, Appointment, Availability, BlockedSlot

BOOKING_WINDOW_DAYS = 30
SAME_DAY_LEAD_MINUTES = 30


def day_name(target_date: date) -> str:
    return DAY_NAMES[target_date.weekday()]


def booking_window():
    today = timezone.localdate()
    return today, today + timedelta(days=BOOKING_WINDOW_DAYS)


def _slot_starts(start: time, end: time, duration: int):
    current = datetime.combine(date.min, start)
    end_dt = datetime.combine(date.min, end)
    step = timedelta(minutes=duration)
    while current + step <= end_dt:
        yield current.time(), (current + step).time()
        current += step


def detailed_slots(target_date: date):
    """Every slot for the date with its status: available, booked, blocked or past."""
    windows = Availability.objects.filter(day_of_week=day_name(target_date), is_active=True).order_by('start_time')
    blocks = list(BlockedSlot.objects.filter(date=target_date))
    booked = {
        appt.time: appt
        for appt in Appointment.objects.filter(date=target_date, status__in=ACTIVE_STATUSES)
    }

    now = timezone.localtime()
    cutoff = (now + timedelta(minutes=SAME_DAY_LEAD_MINUTES)).time() if target_date == now.date() else None
    in_past = target_date < now.date()

    slots = {}
    for window in windows:
        for start, end in _slot_starts(window.start_time, window.end_time, window.slot_duration):
            if start in slots:
                continue
            block = next((b for b in blocks if b.start_time < end and start < b.end_time), None)
            appt = booked.get(start)
            if block:
                state = 'blocked'
            elif appt:
                state = 'booked'
            elif in_past or (cutoff and start < cutoff):
                state = 'past'
            else:
                state = 'available'
            slots[start] = {
                'time': start.strftime('%H:%M'),
                'end_time': end.strftime('%H:%M'),
                'duration': window.slot_duration,
                'status': state,
                'available': state == 'available',
                'appointment_id': appt.id if appt else None,
                'blocked_reason': block.reason if block else None,
            }
    return [slots[key] for key in sorted(slots)]


def available_slots(target_date: date):
    return [slot for slot in detailed_slots(target_date) if slot['available']]


def is_slot_bookable(target_date: date, slot_time: time) -> bool:
    today, last_day = booking_window()
    if not today <= target_date <= last_day:
        return False
    wanted = slot_time.strftime('%H:%M')
    return any(slot['time'] == wanted for slot in available_slots(target_date))
