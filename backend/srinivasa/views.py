import logging
from datetime import datetime, timedelta

from django.core.paginator import EmptyPage, Paginator
from django.db import IntegrityError, transaction
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from . import emails
from .models import Appointment, Availability, BlockedSlot
from .permissions import IsSrinivasaAdmin, is_srinivasa_admin
from .serializers import (
    AppointmentSerializer,
    AvailabilitySerializer,
    BlockedSlotSerializer,
    BookingSerializer,
)
from .slots import BOOKING_WINDOW_DAYS, available_slots, booking_window, detailed_slots, is_slot_bookable

logger = logging.getLogger(__name__)


class BookingThrottle(AnonRateThrottle):
    rate = '10/hour'


def _error(message, code=status.HTTP_400_BAD_REQUEST):
    return Response({'success': False, 'error': message}, status=code)


def _first_error(errors):
    for field, messages in errors.items():
        message = messages[0] if isinstance(messages, list) else messages
        return str(message) if field == 'non_field_errors' else f'{field}: {message}'
    return 'Invalid data provided.'


def _parse_date(value):
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        return None


# ---------------------------------------------------------------- public ----

@api_view(['GET'])
@permission_classes([AllowAny])
def available_slots_view(request):
    today, last_day = booking_window()
    target = _parse_date(request.GET.get('date')) if request.GET.get('date') else today
    if target is None:
        return _error('Invalid date format. Use YYYY-MM-DD.')
    if not today <= target <= last_day:
        return _error(f'Appointments can be booked from today up to {BOOKING_WINDOW_DAYS} days ahead.')

    slots = available_slots(target)
    return Response({
        'success': True,
        'date': target.isoformat(),
        'available_slots': [
            {'time': s['time'], 'end_time': s['end_time'], 'available': True, 'duration': s['duration']}
            for s in slots
        ],
        'total_available': len(slots),
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def available_dates_view(request):
    today, last_day = booking_window()
    try:
        days = max(1, min(int(request.GET.get('days', 14)), BOOKING_WINDOW_DAYS + 1))
    except ValueError:
        days = 14
    dates = []
    for offset in range(days):
        day = today + timedelta(days=offset)
        if day > last_day:
            break
        dates.append({'date': day.isoformat(), 'available_count': len(available_slots(day))})
    return Response({'success': True, 'dates': dates})


class AppointmentListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsSrinivasaAdmin()]

    def get_throttles(self):
        if self.request.method == 'POST':
            return [BookingThrottle()]
        return []

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if not serializer.is_valid():
            return _error(_first_error(serializer.errors))
        data = serializer.validated_data

        if not is_slot_bookable(data['date'], data['time']):
            return _error('Slot not available', status.HTTP_409_CONFLICT)

        try:
            with transaction.atomic():
                appointment = Appointment.objects.create(
                    name=data['name'],
                    email=data.get('email', ''),
                    phone=data['phone'],
                    date=data['date'],
                    time=data['time'],
                    message=data.get('message') or data.get('reason', ''),
                )
        except IntegrityError:
            return _error('Slot not available', status.HTTP_409_CONFLICT)

        emails.notify_booking(appointment)
        payload = AppointmentSerializer(appointment).data
        return Response({
            **payload,
            'success': True,
            'message': 'Appointment request received. The clinic will confirm shortly.',
            'appointment': payload,
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        queryset = Appointment.objects.all().order_by('-date', '-time')
        if request.GET.get('status'):
            queryset = queryset.filter(status=request.GET['status'])
        if request.GET.get('date'):
            target = _parse_date(request.GET['date'])
            if target is None:
                return _error('Invalid date format. Use YYYY-MM-DD.')
            queryset = queryset.filter(date=target)

        try:
            per_page = max(1, min(int(request.GET.get('limit') or request.GET.get('per_page') or 20), 100))
            page_number = int(request.GET.get('page', 1))
        except ValueError:
            per_page, page_number = 20, 1

        paginator = Paginator(queryset, per_page)
        try:
            page = paginator.page(page_number)
        except EmptyPage:
            page = paginator.page(paginator.num_pages or 1)

        return Response({
            'success': True,
            'appointments': AppointmentSerializer(page.object_list, many=True).data,
            'pagination': {
                'current_page': page.number,
                'total_pages': paginator.num_pages,
                'total_count': paginator.count,
                'has_next': page.has_next(),
                'has_previous': page.has_previous(),
            },
        })


# ----------------------------------------------------------------- admin ----

def _set_status(appointment, new_status):
    old_status = appointment.status
    appointment.status = new_status
    try:
        appointment.save()
    except IntegrityError:
        return False
    if old_status != new_status:
        emails.notify_status_change(appointment)
    return True


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsSrinivasaAdmin])
def appointment_detail_view(request, appointment_id):
    appointment = get_object_or_404(Appointment, pk=appointment_id)

    if request.method == 'GET':
        return Response({'success': True, 'appointment': AppointmentSerializer(appointment).data})

    if request.method == 'DELETE':
        appointment.delete()
        return Response({'success': True, 'message': 'Appointment deleted'})

    old_status = appointment.status
    serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
    if not serializer.is_valid():
        return _error(_first_error(serializer.errors))
    try:
        appointment = serializer.save()
    except IntegrityError:
        return _error('Another active appointment already uses that slot.', status.HTTP_409_CONFLICT)
    if old_status != appointment.status:
        emails.notify_status_change(appointment)
    return Response({'success': True, 'message': 'Appointment updated', 'appointment': AppointmentSerializer(appointment).data})


ACTIONS = {'confirm': 'confirmed', 'cancel': 'cancelled', 'complete': 'completed'}


@api_view(['GET', 'POST'])
@permission_classes([IsSrinivasaAdmin])
def appointment_action_view(request, appointment_id, action):
    new_status = ACTIONS.get(action)
    if not new_status:
        return _error('Invalid action.')
    appointment = get_object_or_404(Appointment, pk=appointment_id)
    if appointment.status == new_status:
        return Response({'success': True, 'message': f'Appointment already {new_status}', 'appointment': AppointmentSerializer(appointment).data})
    if not _set_status(appointment, new_status):
        return _error('Another active appointment already uses that slot.', status.HTTP_409_CONFLICT)
    return Response({'success': True, 'message': f'Appointment {new_status}', 'appointment': AppointmentSerializer(appointment).data})


@api_view(['GET'])
@permission_classes([IsSrinivasaAdmin])
def appointment_stats_view(request):
    today = timezone.localdate()
    counts = Appointment.objects.aggregate(
        total=Count('id'),
        pending=Count('id', filter=Q(status='pending')),
        confirmed=Count('id', filter=Q(status='confirmed')),
        completed=Count('id', filter=Q(status='completed')),
        cancelled=Count('id', filter=Q(status='cancelled')),
        today=Count('id', filter=Q(date=today, status__in=['pending', 'confirmed'])),
        upcoming=Count('id', filter=Q(date__gte=today, status__in=['pending', 'confirmed'])),
    )
    return Response({'success': True, 'stats': counts})


@api_view(['GET'])
@permission_classes([IsSrinivasaAdmin])
def detailed_slots_view(request):
    target = _parse_date(request.GET.get('date'))
    if target is None:
        return _error('date query parameter is required (YYYY-MM-DD).')
    slots = detailed_slots(target)
    summary = {state: sum(1 for s in slots if s['status'] == state) for state in ('available', 'booked', 'blocked', 'past')}
    return Response({'success': True, 'date': target.isoformat(), 'slots': slots, 'summary': {'total_slots': len(slots), **summary}})


class _AdminCrudView(APIView):
    permission_classes = [IsSrinivasaAdmin]
    model = None
    serializer_class = None
    list_key = ''
    item_key = ''

    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, pk=None):
        if pk is not None:
            obj = get_object_or_404(self.model, pk=pk)
            return Response({'success': True, self.item_key: self.serializer_class(obj).data})
        return Response({'success': True, self.list_key: self.serializer_class(self.get_queryset(), many=True).data})

    def post(self, request, pk=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return _error(_first_error(serializer.errors))
        obj = serializer.save()
        return Response({'success': True, self.item_key: self.serializer_class(obj).data}, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        if pk is None:
            return _error('ID is required.')
        obj = get_object_or_404(self.model, pk=pk)
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        if not serializer.is_valid():
            return _error(_first_error(serializer.errors))
        obj = serializer.save()
        return Response({'success': True, self.item_key: self.serializer_class(obj).data})

    patch = put

    def delete(self, request, pk=None):
        if pk is None:
            return _error('ID is required.')
        get_object_or_404(self.model, pk=pk).delete()
        return Response({'success': True, 'message': 'Deleted'})


DAY_ORDER = {day: index for index, day in enumerate(
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])}


class AvailabilityView(_AdminCrudView):
    model = Availability
    serializer_class = AvailabilitySerializer
    list_key = 'availability'
    item_key = 'availability'

    def get_queryset(self):
        return sorted(Availability.objects.all(), key=lambda a: (DAY_ORDER[a.day_of_week], a.start_time))


class BlockedSlotView(_AdminCrudView):
    model = BlockedSlot
    serializer_class = BlockedSlotSerializer
    list_key = 'blocked_slots'
    item_key = 'blocked_slot'

    def get_queryset(self):
        queryset = BlockedSlot.objects.all()
        if self.request.GET.get('upcoming') == 'true':
            queryset = queryset.filter(date__gte=timezone.localdate())
        return queryset.order_by('date', 'start_time')


@api_view(['GET'])
@permission_classes([IsSrinivasaAdmin])
def blocked_slots_summary_view(request):
    today = timezone.localdate()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    summary = BlockedSlot.objects.aggregate(
        total_blocked=Count('id'),
        this_week=Count('id', filter=Q(date__range=(week_start, week_end))),
        this_month=Count('id', filter=Q(date__year=today.year, date__month=today.month)),
        upcoming=Count('id', filter=Q(date__gte=today)),
    )
    return Response({'success': True, 'summary': summary})


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def check_admin_view(request):
    is_admin = is_srinivasa_admin(request.user)
    return Response({
        'success': True,
        'is_admin': is_admin,
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser,
        'permissions': {
            'can_access_admin': is_admin,
            'can_manage_appointments': is_admin,
            'can_manage_users': request.user.is_superuser,
        },
    })
