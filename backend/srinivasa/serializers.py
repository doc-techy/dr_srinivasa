import re

from django.utils import timezone
from rest_framework import serializers

from .models import Appointment, Availability, BlockedSlot

TIME_FORMAT = '%H:%M'
TIME_INPUT_FORMATS = ['%H:%M', '%H:%M:%S', '%I:%M %p']


class AppointmentSerializer(serializers.ModelSerializer):
    time = serializers.TimeField(format=TIME_FORMAT, input_formats=TIME_INPUT_FORMATS)
    appointment_id = serializers.IntegerField(source='id', read_only=True)
    patient_name = serializers.CharField(source='name', read_only=True)
    patient_email = serializers.CharField(source='email', read_only=True)
    patient_phone = serializers.CharField(source='phone', read_only=True)
    appointment_date = serializers.DateField(source='date', read_only=True)
    appointment_time = serializers.TimeField(source='time', format=TIME_FORMAT, read_only=True)
    reason = serializers.CharField(source='message', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'name', 'email', 'phone', 'date', 'time', 'message', 'status',
            'created_at', 'updated_at',
            'appointment_id', 'patient_name', 'patient_email', 'patient_phone',
            'appointment_date', 'appointment_time', 'reason',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookingSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, trim_whitespace=True)
    email = serializers.EmailField(required=False, allow_blank=True, default='')
    phone = serializers.CharField(max_length=20)
    date = serializers.DateField()
    time = serializers.TimeField(input_formats=TIME_INPUT_FORMATS)
    message = serializers.CharField(required=False, allow_blank=True, default='', max_length=1000)
    reason = serializers.CharField(required=False, allow_blank=True, default='', max_length=1000)

    def validate_phone(self, value):
        digits = re.sub(r'\D', '', value)
        if digits.startswith('91') and len(digits) == 12:
            digits = digits[2:]
        if not re.fullmatch(r'[6-9]\d{9}', digits):
            raise serializers.ValidationError('Enter a valid 10-digit mobile number.')
        return digits

    def validate_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError('Appointment date cannot be in the past.')
        return value


class AvailabilitySerializer(serializers.ModelSerializer):
    start_time = serializers.TimeField(format=TIME_FORMAT, input_formats=TIME_INPUT_FORMATS)
    end_time = serializers.TimeField(format=TIME_FORMAT, input_formats=TIME_INPUT_FORMATS)

    class Meta:
        model = Availability
        fields = ['id', 'day_of_week', 'start_time', 'end_time', 'slot_duration', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_day_of_week(self, value):
        return value.lower()

    def validate(self, attrs):
        start = attrs.get('start_time', getattr(self.instance, 'start_time', None))
        end = attrs.get('end_time', getattr(self.instance, 'end_time', None))
        if start and end and start >= end:
            raise serializers.ValidationError('Start time must be before end time.')
        duration = attrs.get('slot_duration', getattr(self.instance, 'slot_duration', 15))
        if not 5 <= duration <= 240:
            raise serializers.ValidationError('Slot duration must be between 5 and 240 minutes.')

        day = attrs.get('day_of_week', getattr(self.instance, 'day_of_week', None))
        overlapping = Availability.objects.filter(day_of_week=day, start_time__lt=end, end_time__gt=start)
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        if overlapping.exists():
            raise serializers.ValidationError('This overlaps an existing availability window for that day.')
        return attrs


class BlockedSlotSerializer(serializers.ModelSerializer):
    start_time = serializers.TimeField(format=TIME_FORMAT, input_formats=TIME_INPUT_FORMATS)
    end_time = serializers.TimeField(format=TIME_FORMAT, input_formats=TIME_INPUT_FORMATS)

    class Meta:
        model = BlockedSlot
        fields = ['id', 'date', 'start_time', 'end_time', 'reason', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        start = attrs.get('start_time', getattr(self.instance, 'start_time', None))
        end = attrs.get('end_time', getattr(self.instance, 'end_time', None))
        if start and end and start >= end:
            raise serializers.ValidationError('Start time must be before end time.')
        block_date = attrs.get('date')
        if block_date and block_date < timezone.localdate():
            raise serializers.ValidationError('Block date cannot be in the past.')
        return attrs
