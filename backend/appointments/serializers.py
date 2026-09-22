"""
Serializers for appointment management API
"""

from rest_framework import serializers
from .models import (
    DoctorAvailability, 
    Appointment, 
    DoctorProfile, 
    ContactInquiry, 
    NewsletterSubscription
)


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for doctor availability"""
    
    class Meta:
        model = DoctorAvailability
        fields = [
            'availability_id',
            'is_recurring',
            'day_of_week',
            'date',
            'start_time',
            'end_time',
            'slot_duration',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['availability_id', 'created_at', 'updated_at']


class RecurringAvailabilityCreateSerializer(serializers.Serializer):
    """Serializer for creating recurring availability entries"""
    
    days = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=6),
        allow_empty=False
    )
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    slot_duration = serializers.IntegerField(default=30, min_value=15, max_value=120)
    
    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time")
        return data


class AvailableSlotsSerializer(serializers.Serializer):
    """Serializer for available time slots"""
    
    time = serializers.TimeField()
    available = serializers.BooleanField()
    slot_id = serializers.CharField(required=False)
    duration = serializers.IntegerField(required=False)


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for appointments"""
    
    class Meta:
        model = Appointment
        fields = [
            'appointment_id',
            'patient_name',
            'patient_email',
            'patient_phone',
            'appointment_date',
            'appointment_time',
            'reason',
            'notes',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['appointment_id', 'created_at', 'updated_at']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments"""
    
    class Meta:
        model = Appointment
        fields = [
            'patient_name',
            'patient_email',
            'patient_phone',
            'appointment_date',
            'appointment_time',
            'reason',
            'notes'
        ]
    
    def validate_appointment_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Appointment date cannot be in the past")
        return value


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for doctor profile"""
    
    class Meta:
        model = DoctorProfile
        fields = [
            'name',
            'title',
            'specialization',
            'experience_years',
            'qualifications',
            'bio',
            'profile_picture',
            'email',
            'phone',
            'address',
            'languages',
            'consultation_fee',
            'is_active'
        ]


class ContactInquirySerializer(serializers.ModelSerializer):
    """Serializer for contact inquiries"""
    
    class Meta:
        model = ContactInquiry
        fields = [
            'inquiry_id',
            'name',
            'email',
            'phone',
            'subject',
            'message',
            'status',
            'created_at'
        ]
        read_only_fields = ['inquiry_id', 'status', 'created_at']


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriptions"""
    
    class Meta:
        model = NewsletterSubscription
        fields = ['email', 'is_active', 'subscribed_at']
        read_only_fields = ['is_active', 'subscribed_at']
