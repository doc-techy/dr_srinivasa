"""
API views for doctor availability management
"""
from datetime import datetime, date
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ValidationError
from django.db import transaction
import json
import logging
import math

from .models import DoctorAvailability, Appointment
from .serializers import (
    DoctorAvailabilitySerializer, 
    RecurringAvailabilityCreateSerializer,
    AvailableSlotsSerializer,
    AppointmentCreateSerializer,
    AppointmentSerializer
)
from .utils import (
    get_available_slots_for_date,
    get_only_available_slots_for_date,
    check_availability_conflict,
    get_availability_for_date,
    send_appointment_confirmation_email,
    send_appointment_status_update_email,
    send_admin_booking_notification
)

logger = logging.getLogger(__name__)


class DoctorAvailabilityView(APIView):
    """Handle CRUD operations for doctor availability"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get availability entries"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)

        # Get query parameters
        date_param = request.GET.get('date')
        recurring_param = request.GET.get('recurring')
        availability_id = request.GET.get('id')

        try:
            if availability_id:
                # Get specific availability entry
                availability = get_object_or_404(DoctorAvailability, availability_id=availability_id)
                serializer = DoctorAvailabilitySerializer(availability)
                return Response({
                    'success': True,
                    'availability': serializer.data
                })

            elif date_param:
                # Get availability for specific date
                target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
                availability = get_availability_for_date(target_date)
                serializer = DoctorAvailabilitySerializer(availability, many=True)
                return Response({
                    'success': True,
                    'date': date_param,
                    'availability': serializer.data
                })

            elif recurring_param == 'true':
                # Get all recurring availability
                availability = DoctorAvailability.objects.filter(is_recurring=True).order_by('day_of_week', 'start_time')
                serializer = DoctorAvailabilitySerializer(availability, many=True)
                return Response({
                    'success': True,
                    'recurring': serializer.data
                })

            else:
                # Get all availability entries
                availability = DoctorAvailability.objects.all().order_by('date', 'day_of_week', 'start_time')
                serializer = DoctorAvailabilitySerializer(availability, many=True)
                return Response({
                    'success': True,
                    'availability': serializer.data
                })

        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error retrieving availability: {str(e)}")
            return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """Create new availability entry"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Check if this is a recurring availability creation
            if 'days' in request.data:
                return self._create_recurring_availability(request)
            else:
                return self._create_single_availability(request)

        except Exception as e:
            logger.error(f"Error creating availability: {str(e)}")
            return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _create_recurring_availability(self, request):
        """Create multiple recurring availability entries"""
        serializer = RecurringAvailabilityCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        created_availability = []

        with transaction.atomic():
            for day in data['days']:
                # Check for conflicts
                availability_data = {
                    'is_recurring': True,
                    'day_of_week': day,
                    'start_time': data['start_time'],
                    'end_time': data['end_time']
                }

                if check_availability_conflict(availability_data):
                    day_name = dict(DoctorAvailability.DAY_CHOICES)[day]
                    return Response({
                        'error': f'Conflict detected for {day_name}. Overlapping availability already exists.'
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Create availability entry
                availability = DoctorAvailability.objects.create(
                    is_recurring=True,
                    day_of_week=day,
                    start_time=data['start_time'],
                    end_time=data['end_time'],
                    slot_duration=data['slot_duration']
                )
                created_availability.append(availability)

        # Serialize response
        serializer = DoctorAvailabilitySerializer(created_availability, many=True)
        return Response({
            'success': True,
            'message': f'Created {len(created_availability)} recurring availability entries',
            'availability': serializer.data
        }, status=status.HTTP_201_CREATED)

    def _create_single_availability(self, request):
        """Create single availability entry"""
        serializer = DoctorAvailabilitySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Check for conflicts
        if check_availability_conflict(serializer.validated_data):
            return Response({
                'error': 'Conflict detected. Overlapping availability already exists.'
            }, status=status.HTTP_400_BAD_REQUEST)

        availability = serializer.save()
        return Response({
            'success': True,
            'message': 'Availability created successfully',
            'availability': DoctorAvailabilitySerializer(availability).data
        }, status=status.HTTP_201_CREATED)

    def put(self, request, availability_id=None):
        """Update existing availability entry"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)

        if not availability_id:
            return Response({'error': 'Availability ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            availability = get_object_or_404(DoctorAvailability, availability_id=availability_id)
            
            # Check if there are existing appointments for this availability
            if not availability.is_recurring and availability.date:
                existing_appointments = Appointment.objects.filter(
                    date=availability.date,
                    status__in=['pending', 'confirmed']
                ).exists()
                
                if existing_appointments:
                    return Response({
                        'error': 'Cannot modify availability with existing appointments. Cancel appointments first.'
                    }, status=status.HTTP_400_BAD_REQUEST)

            serializer = DoctorAvailabilitySerializer(availability, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            # Check for conflicts (excluding current record)
            if check_availability_conflict(serializer.validated_data, exclude_id=availability_id):
                return Response({
                    'error': 'Conflict detected. Overlapping availability already exists.'
                }, status=status.HTTP_400_BAD_REQUEST)

            availability = serializer.save()
            return Response({
                'success': True,
                'message': 'Availability updated successfully',
                'availability': DoctorAvailabilitySerializer(availability).data
            })

        except Exception as e:
            logger.error(f"Error updating availability: {str(e)}")
            return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, availability_id=None):
        """Delete availability entry"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)

        if not availability_id:
            return Response({'error': 'Availability ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            availability = get_object_or_404(DoctorAvailability, availability_id=availability_id)
            
            # Check if there are existing appointments for this availability
            if not availability.is_recurring and availability.date:
                existing_appointments = Appointment.objects.filter(
                    date=availability.date,
                    status__in=['pending', 'confirmed']
                ).count()
                
                if existing_appointments > 0:
                    return Response({
                        'error': f'Cannot delete availability with {existing_appointments} existing appointments. Cancel appointments first.'
                    }, status=status.HTTP_400_BAD_REQUEST)

            availability.delete()
            return Response({
                'success': True,
                'message': 'Availability deleted successfully'
            })

        except Exception as e:
            logger.error(f"Error deleting availability: {str(e)}")
            return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AppointmentCreateView(APIView):
    """Handle creation (POST) and listing (GET) of appointments."""
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method == 'POST':
            # POST (create appointment) - no authentication required
            permission_classes = [AllowAny]
        else:
            # GET (list appointments) - authentication required
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def post(self, request):
        """Send admin notification email only - no booking functionality"""
        try:
            # Parse JSON data
            data = json.loads(request.body)

            # Required fields validation
            required_fields = ['name', 'email', 'phone', 'date', 'time']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            # Validate date format (YYYY-MM-DD)
            try:
                appointment_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

            # COMMENTED OUT: Create Appointment in database
            # appointment = Appointment.objects.create(
            #     name=data['name'],
            #     email=data['email'],
            #     phone=data['phone'],
            #     date=appointment_date,
            #     time=data['time'],
            #     message=data.get('message', '')
            # )

            # COMMENTED OUT: Send confirmation email to user
            # user_email_sent = False
            # try:
            #     from .utils import send_appointment_confirmation_email
            #     user_email_sent = send_appointment_confirmation_email(appointment)
            # except Exception as e:
            #     print(f"Error sending confirmation email: {str(e)}")
            #     # Don't fail the appointment creation if email fails

            # Create a temporary appointment object for email template
            from .models import Appointment
            temp_appointment = Appointment(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                date=appointment_date,
                time=data['time'],
                message=data.get('message', ''),
                status='pending'
            )
            temp_appointment.id = 0  # Temporary ID for email template
            temp_appointment.created_at = datetime.now()

            # Send admin notification email only
            admin_email_sent = False
            try:
                from .utils import send_admin_booking_notification
                admin_email_sent = send_admin_booking_notification(temp_appointment)
            except Exception as e:
                print(f"Error sending admin notification email: {str(e)}")
                # Don't fail if email fails

            return JsonResponse({
                'success': True,
                'message': 'Admin notification sent successfully',
                'appointment_id': None,  # No appointment created
                'user_email_sent': False,  # Always false since we commented out user email
                'admin_email_sent': admin_email_sent,
                'data': {
                    'id': None,
                    'name': data['name'],
                    'email': data['email'],
                    'phone': data['phone'],
                    'date': data['date'],
                    'time': data['time'],
                    'message': data.get('message', ''),
                    'status': 'pending',
                    'created_at': datetime.now().isoformat()
                }
            }, status=200)  # Changed to 200 since no resource created

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

    def get(self, request):
        """Return paginated list of all appointments - requires authentication"""
        # DRF handles JWT authentication automatically via get_permissions()
        # Just check if user is admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)

        # Get pagination parameters from URL
        page = request.GET.get('page', 1)
        limit = request.GET.get('limit', 10)
        
        # Validate pagination parameters
        try:
            page = int(page)
            limit = int(limit)
            
            # Set reasonable limits
            if limit > 100:
                limit = 100
            elif limit < 1:
                limit = 10
                
            if page < 1:
                page = 1
                
        except (ValueError, TypeError):
            page = 1
            limit = 10

        # Get all appointments ordered by creation date (newest first)
        appointments_queryset = Appointment.objects.all().order_by('-created_at')
        
        # Create paginator
        paginator = Paginator(appointments_queryset, limit)
        total_count = paginator.count
        total_pages = paginator.num_pages

        try:
            appointments_page = paginator.page(page)
        except PageNotAnInteger:
            appointments_page = paginator.page(1)
            page = 1
        except EmptyPage:
            appointments_page = paginator.page(total_pages)
            page = total_pages

        # Serialize appointment data
        appointments_data = [
            {
                'id': a.id,
                'name': a.name,
                'email': a.email,
                'phone': a.phone,
                'date': a.date.strftime('%Y-%m-%d'),
                'time': a.time,
                'message': a.message,
                'status': a.status,
                'created_at': a.created_at.isoformat(),
                'updated_at': a.updated_at.isoformat(),
            } for a in appointments_page
        ]

        # Multiple pagination formats as requested
        response_data = {
            'success': True,
            'appointments': appointments_data,
            
            # Standard pagination format
            'pagination': {
                'total': total_count,
                'totalPages': total_pages,
                'currentPage': page,
                'limit': limit,
                'hasNextPage': appointments_page.has_next(),
                'hasPreviousPage': appointments_page.has_previous(),
            },
            
            # Alternative format (count: total)
            'count': total_count,
            
            # Additional metadata
            'page': page,
            'limit': limit,
            'totalPages': total_pages,
        }

        return Response(response_data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail_view(request, appointment_id):
    """Handle individual appointment operations: GET, PUT, DELETE - requires authentication"""
    
    # Check if user is admin
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        appointment = get_object_or_404(Appointment, id=appointment_id)
        
        if request.method == 'GET':
            return Response({
                'success': True,
                'appointment': {
                    'id': appointment.id,
                    'name': appointment.name,
                    'email': appointment.email,
                    'phone': appointment.phone,
                    'date': appointment.date.strftime('%Y-%m-%d'),
                    'time': appointment.time,
                    'message': appointment.message,
                    'status': appointment.status,
                    'created_at': appointment.created_at.isoformat(),
                    'updated_at': appointment.updated_at.isoformat(),
                }
            })
            
        elif request.method == 'PUT':
            data = request.data
            old_status = appointment.status  # Store old status for email notification
            
            # Update fields if provided
            if 'name' in data:
                appointment.name = data['name']
            if 'email' in data:
                appointment.email = data['email']
            if 'phone' in data:
                appointment.phone = data['phone']
            if 'date' in data:
                try:
                    appointment.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
                except ValueError:
                    return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                                 status=status.HTTP_400_BAD_REQUEST)
            if 'time' in data:
                appointment.time = data['time']
            if 'message' in data:
                appointment.message = data['message']
            if 'status' in data:
                if data['status'] not in ['pending', 'confirmed', 'cancelled', 'completed']:
                    return Response({'error': 'Invalid status'}, 
                                 status=status.HTTP_400_BAD_REQUEST)
                appointment.status = data['status']

            appointment.save()
            
            # Send status update email if status changed
            email_sent = False
            if old_status != appointment.status:
                try:
                    email_sent = send_appointment_status_update_email(appointment, old_status)
                except Exception as e:
                    logger.error(f"Error sending status update email: {str(e)}")

            return Response({
                'success': True,
                'message': 'Appointment updated successfully',
                'email_sent': email_sent,
                'appointment': {
                    'id': appointment.id,
                    'name': appointment.name,
                    'email': appointment.email,
                    'phone': appointment.phone,
                    'date': appointment.date.strftime('%Y-%m-%d'),
                    'time': appointment.time,
                    'message': appointment.message,
                    'status': appointment.status,
                    'updated_at': appointment.updated_at.isoformat(),
                }
            })
            
        elif request.method == 'DELETE':
            appointment.delete()
            return Response({
                'success': True,
                'message': 'Appointment deleted successfully'
            })
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointment_stats(request):
    """Get appointment statistics - requires admin authentication."""
    
    # Check if user is admin
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        total_appointments = Appointment.objects.count()
        pending_count = Appointment.objects.filter(status='pending').count()
        confirmed_count = Appointment.objects.filter(status='confirmed').count()
        completed_count = Appointment.objects.filter(status='completed').count()
        cancelled_count = Appointment.objects.filter(status='cancelled').count()

        return Response({
            'success': True,
            'stats': {
                'total': total_appointments,
                'pending': pending_count,
                'confirmed': confirmed_count,
                'completed': completed_count,
                'cancelled': cancelled_count
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def confirm_appointment(request, appointment_id):
    """Confirm appointment - accessible via email link (supports both GET and POST)"""
    
    # Simple security check - verify appointment exists and is pending
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        if appointment.status != 'pending':
            return Response({'error': 'Appointment is not in pending status'}, status=status.HTTP_400_BAD_REQUEST)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        old_status = appointment.status
        
        logger.info(f"Confirming appointment #{appointment_id} from status '{old_status}' to 'confirmed'")
        
        # Update status to confirmed
        appointment.status = 'confirmed'
        appointment.save()
        
        # Send confirmation email to patient
        email_sent = False
        try:
            email_sent = send_appointment_status_update_email(appointment, old_status)
        except Exception as e:
            logger.error(f"Error sending confirmation email: {str(e)}")
        
        return Response({
            'success': True,
            'message': 'Appointment confirmed successfully',
            'email_sent': email_sent,
            'appointment': {
                'id': appointment.id,
                'name': appointment.name,
                'email': appointment.email,
                'status': appointment.status,
                'updated_at': appointment.updated_at.isoformat(),
            }
        })
        
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def cancel_appointment(request, appointment_id):
    """Cancel appointment - accessible via email link (supports both GET and POST)"""
    
    # Simple security check - verify appointment exists and is pending
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        if appointment.status != 'pending':
            return Response({'error': 'Appointment is not in pending status'}, status=status.HTTP_400_BAD_REQUEST)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        old_status = appointment.status
        
        logger.info(f"Cancelling appointment #{appointment_id} from status '{old_status}' to 'cancelled'")
        
        # Update status to cancelled
        appointment.status = 'cancelled'
        appointment.save()
        
        # Send cancellation email to patient
        email_sent = False
        try:
            email_sent = send_appointment_status_update_email(appointment, old_status)
        except Exception as e:
            logger.error(f"Error sending cancellation email: {str(e)}")
        
        return Response({
            'success': True,
            'message': 'Appointment cancelled successfully',
            'email_sent': email_sent,
            'appointment': {
                'id': appointment.id,
                'name': appointment.name,
                'email': appointment.email,
                'status': appointment.status,
                'updated_at': appointment.updated_at.isoformat(),
            }
        })
        
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def appointment_action_page(request):
    """
    Serve the appointment action page that handles confirm/cancel requests invisibly
    """
    return render(request, 'appointment/confirm_appointment.html')


def admin_appointment_action(request, appointment_id, action):
    """
    Handle admin email actions (confirm/cancel) and return a response page
    """
    try:
        appointment = get_object_or_404(Appointment, id=appointment_id)
        
        # Check if appointment is already in the target status
        if action == 'confirm' and appointment.status == 'confirmed':
            context = {
                'success': True,
                'message': f'Appointment #{appointment_id} is already confirmed',
                'appointment': appointment,
                'action': action,
                'already_processed': True
            }
            return render(request, 'appointment/admin_action_response.html', context)
        
        if action == 'cancel' and appointment.status == 'cancelled':
            context = {
                'success': True,
                'message': f'Appointment #{appointment_id} is already cancelled',
                'appointment': appointment,
                'action': action,
                'already_processed': True
            }
            return render(request, 'appointment/admin_action_response.html', context)
        
        # Check if appointment is in pending status
        if appointment.status != 'pending':
            context = {
                'success': False,
                'message': f'Appointment #{appointment_id} is not in pending status (current status: {appointment.status})',
                'appointment': appointment,
                'action': action
            }
            return render(request, 'appointment/admin_action_response.html', context)
        
        old_status = appointment.status
        
        # Update status based on action
        if action == 'confirm':
            appointment.status = 'confirmed'
            success_message = 'Appointment confirmed successfully'
        elif action == 'cancel':
            appointment.status = 'cancelled'
            success_message = 'Appointment cancelled successfully'
        else:
            context = {
                'success': False,
                'message': 'Invalid action specified',
                'appointment': appointment,
                'action': action
            }
            return render(request, 'appointment/admin_action_response.html', context)
        
        appointment.save()
        
        # Send status update email to patient
        email_sent = False
        try:
            email_sent = send_appointment_status_update_email(appointment, old_status)
        except Exception as e:
            logger.error(f"Error sending status update email: {str(e)}")
        
        context = {
            'success': True,
            'message': success_message,
            'appointment': appointment,
            'action': action,
            'email_sent': email_sent
        }
        
        return render(request, 'appointment/admin_action_response.html', context)
        
    except Appointment.DoesNotExist:
        context = {
            'success': False,
            'message': f'Appointment #{appointment_id} not found',
            'appointment': None,
            'action': action
        }
        return render(request, 'appointment/admin_action_response.html', context)
    except Exception as e:
        context = {
            'success': False,
            'message': f'Error processing request: {str(e)}',
            'appointment': None,
            'action': action
        }
        return render(request, 'appointment/admin_action_response.html', context)


@api_view(['GET'])
@permission_classes([])  # Public endpoint for patients
def get_available_slots(request):
    """Get available time slots for the next day"""
    from datetime import timedelta
    
    # Get next day's date
    tomorrow = date.today() + timedelta(days=1)
    target_date = tomorrow
    
    try:
        # Get only available slots for next day (completely excluding booked and blocked slots)
        available_slots = get_only_available_slots_for_date(target_date)
        
        return Response({
            'success': True,
            'date': target_date.strftime('%Y-%m-%d'),
            'available_slots': available_slots,
            'total_available': len(available_slots)
        })

    except Exception as e:
        logger.error(f"Error getting available slots for next day: {str(e)}")
        return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_detailed_slots(request):
    """Get detailed slot information including booked slots (admin only)"""
    # Check if user is admin
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)

    date_param = request.GET.get('date')
    
    if not date_param:
        return Response({'error': 'Date parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        
        # Get all slots with detailed information
        slots_data = get_available_slots_for_date(target_date)
        
        return Response({
            'success': True,
            'date': date_param,
            'slots': slots_data['slots'],
            'summary': {
                'total_slots': slots_data['total_slots'],
                'available_slots': slots_data['available_slots'],
                'booked_slots': slots_data['booked_slots'],
                'blocked_slots': slots_data['blocked_slots']
            }
        })

    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error getting detailed slots: {str(e)}")
        return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([])  # Public endpoint for patients
def book_appointment(request):
    """Book a new appointment"""
    try:
        serializer = AppointmentCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Check if slot is available
        from .utils import is_slot_available
        if not is_slot_available(
            serializer.validated_data['appointment_date'],
            serializer.validated_data['appointment_time']
        ):
            return Response({
                'error': 'This time slot is no longer available. Please select another time.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create appointment
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Appointment booked successfully',
            'appointment': AppointmentSerializer(appointment).data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error booking appointment: {str(e)}")
        return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointments(request):
    """Get appointments (admin only)"""
    # Check if user is admin
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)

    try:
        appointments = Appointment.objects.all().order_by('-created_at')
        serializer = AppointmentSerializer(appointments, many=True)
        
        return Response({
            'success': True,
            'appointments': serializer.data
        })

    except Exception as e:
        logger.error(f"Error getting appointments: {str(e)}")
        return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
