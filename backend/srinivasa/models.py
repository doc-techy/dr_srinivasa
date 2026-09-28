from django.db import models
from django.db.models import F, Q


DAY_CHOICES = [
    ('monday', 'Monday'),
    ('tuesday', 'Tuesday'),
    ('wednesday', 'Wednesday'),
    ('thursday', 'Thursday'),
    ('friday', 'Friday'),
    ('saturday', 'Saturday'),
    ('sunday', 'Sunday'),
]

DAY_NAMES = [value for value, _ in DAY_CHOICES]

ACTIVE_STATUSES = ('pending', 'confirmed')


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    message = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'srinivasa_appointments'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['date', 'time'],
                condition=Q(status__in=ACTIVE_STATUSES),
                name='srinivasa_unique_active_slot',
            ),
        ]
        indexes = [models.Index(fields=['date', 'status'], name='srinivasa_appt_date_status')]

    def __str__(self):
        return f"{self.name} - {self.date} {self.time:%H:%M}"


class Availability(models.Model):
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_duration = models.PositiveIntegerField(default=15, help_text='Minutes per appointment slot')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'srinivasa_availability'
        ordering = ['day_of_week', 'start_time']
        verbose_name_plural = 'Availability'
        constraints = [
            models.CheckConstraint(
                condition=Q(start_time__lt=F('end_time')),
                name='srinivasa_availability_start_before_end',
            ),
            models.CheckConstraint(
                condition=Q(slot_duration__gte=5) & Q(slot_duration__lte=240),
                name='srinivasa_availability_slot_duration_range',
            ),
        ]

    def __str__(self):
        return f"{self.get_day_of_week_display()} {self.start_time:%H:%M}-{self.end_time:%H:%M}"


class BlockedSlot(models.Model):
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    reason = models.CharField(max_length=200, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'srinivasa_blocked_slots'
        ordering = ['date', 'start_time']
        constraints = [
            models.CheckConstraint(
                condition=Q(start_time__lt=F('end_time')),
                name='srinivasa_blocked_start_before_end',
            ),
        ]
        indexes = [models.Index(fields=['date'], name='srinivasa_blocked_date')]

    def __str__(self):
        return f"{self.date} {self.start_time:%H:%M}-{self.end_time:%H:%M} {self.reason}".strip()
