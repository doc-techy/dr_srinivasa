from datetime import time

from django.db import migrations

CLINIC_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
CLINIC_SESSIONS = [(time(9, 0), time(12, 0)), (time(16, 0), time(19, 30))]


def seed(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Availability = apps.get_model('srinivasa', 'Availability')

    Group.objects.get_or_create(name='srinivasa_admin')
    if Availability.objects.exists():
        return
    Availability.objects.bulk_create([
        Availability(day_of_week=day, start_time=start, end_time=end, slot_duration=15, is_active=True)
        for day in CLINIC_DAYS
        for start, end in CLINIC_SESSIONS
    ])


def unseed(apps, schema_editor):
    apps.get_model('srinivasa', 'Availability').objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('srinivasa', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
