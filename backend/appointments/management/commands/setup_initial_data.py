"""
Management command to set up initial data for the appointment system
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from appointments.models import DoctorProfile, DoctorAvailability
from datetime import time


class Command(BaseCommand):
    help = 'Set up initial data for the appointment system'

    def handle(self, *args, **options):
        self.stdout.write('Setting up initial data...')

        # Create superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@drvivekshetty.com',
                password='admin123'
            )
            self.stdout.write(
                self.style.SUCCESS('Created superuser: admin/admin123')
            )

        # Create doctor profile
        doctor, created = DoctorProfile.objects.get_or_create(
            name='Vivek Shetty',
            defaults={
                'title': 'Senior Consultant',
                'specialization': 'Head & Neck Oncology',
                'experience_years': 9,
                'qualifications': 'MBBS, MS General Surgery, Fellowship in Head and Neck Surgical Oncology and Reconstructive Surgery (RGUHS)',
                'bio': 'Dr. Vivek Shetty is a Senior Consultant in Head & Neck Oncology with over 9 years of experience. He specializes in surgical oncology and reconstructive surgery.',
                'email': 'vivekshetty.headneck@gmail.com',
                'phone': '+91 9886432371',
                'address': 'SPARSH Hospital, Hennur Road, Bangalore',
                'languages': ['English', 'Hindi', 'Kannada'],
                'consultation_fee': 1500.00,
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS('Created doctor profile for Dr. Vivek Shetty')
            )
        else:
            self.stdout.write('Doctor profile already exists')

        # Create recurring availability (Monday to Friday)
        weekdays = [0, 1, 2, 3, 4]  # Monday to Friday
        for day in weekdays:
            availability, created = DoctorAvailability.objects.get_or_create(
                is_recurring=True,
                day_of_week=day,
                start_time=time(9, 0),  # 9:00 AM
                end_time=time(18, 0),   # 6:00 PM
                defaults={
                    'slot_duration': 30,
                    'is_active': True
                }
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created recurring availability for day {day}')
                )

        # Create Saturday availability
        saturday_availability, created = DoctorAvailability.objects.get_or_create(
            is_recurring=True,
            day_of_week=5,  # Saturday
            start_time=time(9, 0),  # 9:00 AM
            end_time=time(14, 0),   # 2:00 PM
            defaults={
                'slot_duration': 30,
                'is_active': True
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS('Created Saturday availability')
            )

        self.stdout.write(
            self.style.SUCCESS('Initial data setup completed successfully!')
        )
