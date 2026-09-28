import logging
import threading

from decouple import Csv, config
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

CLINIC_NAME = 'Dr. Srinivasa C - Rheumatology Clinic'
CLINIC_ADDRESS = (
    '#251, 11th Cross Road, Muthurayya Swamy Layout, '
    'Opposite Hulimavu Lake Road, Hulimavu, Bangalore 560076'
)
ADMIN_EMAILS = config('SRINIVASA_ADMIN_EMAILS', default='', cast=Csv())


def _from_email():
    sender = getattr(settings, 'EMAIL_HOST_USER', '') or 'no-reply@localhost'
    return f'{CLINIC_NAME} <{sender}>'


def _send(subject, template, context, recipients):
    recipients = [r for r in recipients if r]
    if not recipients:
        return
    context = {**context, 'clinic_name': CLINIC_NAME, 'clinic_address': CLINIC_ADDRESS}
    try:
        body = render_to_string(f'srinivasa/emails/{template}.txt', context)
        send_mail(subject, body, _from_email(), recipients, fail_silently=False)
    except Exception:
        logger.exception('Srinivasa email "%s" to %s failed', subject, recipients)


def _send_async(*args):
    threading.Thread(target=_send, args=args, daemon=True).start()


def notify_booking(appointment):
    context = {'appointment': appointment}
    _send_async('Appointment request received - Dr. Srinivasa C', 'patient_booking', context, [appointment.email])
    _send_async(f'New appointment request - {appointment.name}', 'admin_booking', context, ADMIN_EMAILS)


def notify_status_change(appointment):
    if appointment.status not in ('confirmed', 'cancelled'):
        return
    subject = f'Your appointment is {appointment.status} - Dr. Srinivasa C'
    _send_async(subject, 'patient_status', {'appointment': appointment}, [appointment.email])
