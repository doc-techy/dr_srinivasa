from datetime import datetime, time, timedelta
from unittest import mock

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import Appointment, Availability, BlockedSlot
from .permissions import ADMIN_GROUP

BASE = '/api/srinivasa'


def next_weekday(weekday):
    day = timezone.localdate() + timedelta(days=1)
    while day.weekday() != weekday:
        day += timedelta(days=1)
    return day


@mock.patch('srinivasa.emails._send_async')
class SrinivasaApiTests(APITestCase):
    def setUp(self):
        Availability.objects.all().delete()
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']:
            Availability.objects.create(day_of_week=day, start_time=time(9), end_time=time(12), slot_duration=15)
            Availability.objects.create(day_of_week=day, start_time=time(16), end_time=time(19, 30), slot_duration=15)
        self.monday = next_weekday(0)
        self.sunday = next_weekday(6)

    def book(self, **overrides):
        payload = {'name': 'Test Patient', 'email': 'p@example.com', 'phone': '9876543210',
                   'date': self.monday.isoformat(), 'time': '09:15', 'message': 'Knee pain'}
        payload.update(overrides)
        return self.client.post(f'{BASE}/appointments/', payload, format='json')

    def admin_client(self, in_group=True, staff=False):
        user = get_user_model().objects.create_user('u' + str(get_user_model().objects.count()), password='x', is_staff=staff)
        if in_group:
            user.groups.add(Group.objects.get_or_create(name=ADMIN_GROUP)[0])
        self.client.force_authenticate(user)
        return user

    def test_slots_for_open_and_closed_days(self, _send):
        response = self.client.get(f'{BASE}/available-slots/', {'date': self.monday.isoformat()})
        self.assertEqual(response.status_code, 200)
        times = [s['time'] for s in response.data['available_slots']]
        self.assertEqual(len(times), 12 + 14)
        self.assertEqual(times[0], '09:00')
        self.assertEqual(times[-1], '19:15')
        self.assertNotIn('12:00', times)

        response = self.client.get(f'{BASE}/available-slots/', {'date': self.sunday.isoformat()})
        self.assertEqual(response.data['total_available'], 0)

    def test_booking_removes_slot_and_prevents_double_booking(self, send):
        response = self.book()
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['appointment']['status'], 'pending')
        self.assertEqual(response.data['appointment']['appointment_time'], '09:15')
        self.assertEqual(response.data['appointment']['message'], 'Knee pain')
        self.assertTrue(response.data['message'].startswith('Appointment request received'))
        self.assertEqual(send.call_count, 2)

        times = [s['time'] for s in self.client.get(f'{BASE}/available-slots/', {'date': self.monday.isoformat()}).data['available_slots']]
        self.assertNotIn('09:15', times)

        self.assertEqual(self.book(name='Second').status_code, 409)

    def test_cancelled_slot_can_be_rebooked(self, _send):
        appt_id = self.book().data['id']
        Appointment.objects.filter(pk=appt_id).update(status='cancelled')
        self.assertEqual(self.book(name='Again').status_code, 201)

    def test_rejects_invalid_bookings(self, _send):
        self.assertEqual(self.book(time='09:10').status_code, 409)
        self.assertEqual(self.book(date=self.sunday.isoformat()).status_code, 409)
        self.assertEqual(self.book(phone='12345').status_code, 400)
        self.assertEqual(self.book(date=(timezone.localdate() - timedelta(days=1)).isoformat()).status_code, 400)
        far = timezone.localdate() + timedelta(days=60)
        self.assertEqual(self.book(date=far.isoformat()).status_code, 409)

    def test_blocked_slot_hides_overlapping_slots(self, _send):
        BlockedSlot.objects.create(date=self.monday, start_time=time(10), end_time=time(11), reason='Meeting')
        times = [s['time'] for s in self.client.get(f'{BASE}/available-slots/', {'date': self.monday.isoformat()}).data['available_slots']]
        for blocked in ['10:00', '10:15', '10:30', '10:45']:
            self.assertNotIn(blocked, times)
        self.assertIn('09:45', times)
        self.assertIn('11:00', times)

    def test_admin_endpoints_require_srinivasa_group(self, _send):
        self.assertEqual(self.client.get(f'{BASE}/appointments/').status_code, 401)
        self.admin_client(in_group=False, staff=True)
        self.assertEqual(self.client.get(f'{BASE}/appointments/').status_code, 403)
        self.assertFalse(self.client.post(f'{BASE}/auth/check-admin/').data['is_admin'])

    def test_admin_flow(self, send):
        appt_id = self.book().data['id']
        self.admin_client()
        self.assertTrue(self.client.post(f'{BASE}/auth/check-admin/').data['is_admin'])

        listing = self.client.get(f'{BASE}/appointments/', {'page': 1, 'limit': 10}).data
        self.assertEqual(listing['pagination']['total_count'], 1)
        self.assertEqual(listing['appointments'][0]['patient_name'], 'Test Patient')

        response = self.client.get(f'{BASE}/admin/appointments/{appt_id}/confirm/')
        self.assertEqual(response.data['appointment']['status'], 'confirmed')
        self.assertEqual(self.client.get(f'{BASE}/appointments/stats/').data['stats']['confirmed'], 1)

        response = self.client.post(f'{BASE}/availability/', {'day_of_week': 'sunday', 'start_time': '10:00', 'end_time': '11:00', 'is_active': True}, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        overlap = self.client.post(f'{BASE}/availability/', {'day_of_week': 'sunday', 'start_time': '10:30', 'end_time': '12:00'}, format='json')
        self.assertEqual(overlap.status_code, 400)

        response = self.client.post(f'{BASE}/blocked-slots/', {'date': self.monday.isoformat(), 'start_time': '16:00', 'end_time': '17:00', 'reason': 'Leave'}, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(self.client.get(f'{BASE}/blocked-slots/summary/').data['summary']['upcoming'], 1)

        detailed = self.client.get(f'{BASE}/slots/detailed/', {'date': self.monday.isoformat()}).data
        self.assertEqual(detailed['summary']['booked'], 1)
        self.assertEqual(detailed['summary']['blocked'], 4)

    def test_same_day_past_slots_are_hidden(self, _send):
        now = timezone.localtime()
        fake_now = timezone.make_aware(datetime.combine(self.monday, time(10, 50)), now.tzinfo)
        with mock.patch('django.utils.timezone.now', return_value=fake_now):
            times = [s['time'] for s in self.client.get(f'{BASE}/available-slots/', {'date': self.monday.isoformat()}).data['available_slots']]
        self.assertNotIn('11:00', times)
        self.assertIn('11:30', times)
