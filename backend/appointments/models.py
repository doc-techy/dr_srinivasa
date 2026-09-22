"""
Models for appointment management system
"""

from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
import uuid


class DoctorAvailability(models.Model):
    """Model for doctor's availability schedule"""
    
    DAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    availability_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Recurring availability (for weekly schedule)
    is_recurring = models.BooleanField(default=False)
    day_of_week = models.IntegerField(choices=DAY_CHOICES, null=True, blank=True)
    
    # Specific date availability (for one-time changes)
    date = models.DateField(null=True, blank=True)
    
    # Time slots
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_duration = models.IntegerField(default=30, help_text="Duration in minutes")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['day_of_week', 'start_time', 'date']
        verbose_name_plural = "Doctor Availabilities"
    
    def __str__(self):
        if self.is_recurring:
            return f"{self.get_day_of_week_display()} {self.start_time}-{self.end_time}"
        return f"{self.date} {self.start_time}-{self.end_time}"


class Appointment(models.Model):
    """Model for patient appointments"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('no_show', 'No Show'),
    ]
    
    REASON_CHOICES = [
        ('initial_consultation', 'Initial Consultation'),
        ('follow_up', 'Follow-up Visit'),
        ('second_opinion', 'Second Opinion'),
        ('treatment_planning', 'Treatment Planning'),
        ('post_surgery', 'Post-surgery Checkup'),
        ('emergency', 'Emergency Consultation'),
        ('other', 'Other'),
    ]
    
    appointment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Patient information
    patient_name = models.CharField(max_length=100)
    patient_email = models.EmailField()
    patient_phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(
            regex=r'^[6-9]\d{9}$',
            message='Enter a valid 10-digit Indian phone number'
        )]
    )
    
    # Appointment details
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    notes = models.TextField(blank=True, null=True)
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Doctor reference (if multiple doctors in future)
    doctor = models.ForeignKey(
        'DoctorProfile',
        on_delete=models.CASCADE,
        related_name='appointments',
        null=True,
        blank=True
    )
    
    class Meta:
        ordering = ['appointment_date', 'appointment_time']
        unique_together = ['appointment_date', 'appointment_time', 'doctor']
    
    def __str__(self):
        return f"{self.patient_name} - {self.appointment_date} {self.appointment_time}"
    
    @property
    def is_past(self):
        """Check if appointment is in the past"""
        now = timezone.now()
        appointment_datetime = timezone.datetime.combine(
            self.appointment_date,
            self.appointment_time
        )
        return appointment_datetime < now.replace(tzinfo=None)


class DoctorProfile(models.Model):
    """Model for doctor profile information"""
    
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    experience_years = models.IntegerField()
    qualifications = models.TextField()
    bio = models.TextField()
    profile_picture = models.ImageField(upload_to='doctor_profiles/', null=True, blank=True)
    
    # Contact information
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    
    # Professional details
    languages = models.JSONField(default=list)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Dr. {self.name} - {self.specialization}"


class ContactInquiry(models.Model):
    """Model for contact form inquiries"""
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    inquiry_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Contact information
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


class NewsletterSubscription(models.Model):
    """Model for newsletter subscriptions"""
    
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.email
