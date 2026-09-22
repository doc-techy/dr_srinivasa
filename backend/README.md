# Dr. Vivek Shetty - Backend API

Django REST API backend for the Dr. Vivek Shetty appointment booking system.

## Features

- **Doctor Availability Management**: Create, read, update, delete doctor availability schedules
- **Appointment Booking**: Public API for patients to book appointments
- **Slot Management**: Automatic generation of available time slots
- **Conflict Detection**: Prevents double-booking and scheduling conflicts
- **Admin Interface**: Django admin for managing appointments and availability

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login/` - Login and get JWT tokens + user info
- `POST /api/auth/logout/` - Logout and blacklist refresh token
- `GET /api/auth/profile/` - Get current user profile
- `POST /api/auth/token/` - Get JWT tokens (access + refresh)
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/token/verify/` - Verify token validity
- `POST /api/auth/check-admin/` - Check admin permissions

### Public Endpoints (No Authentication Required)

- `GET /api/available-slots/` - Get available time slots for the next day
- `POST /api/appointments/book/` - Book a new appointment

### Admin Endpoints (Authentication Required)

- `GET /api/availability/` - Get all availability entries
- `POST /api/availability/` - Create new availability entry
- `PUT /api/availability/{id}/` - Update availability entry
- `DELETE /api/availability/{id}/` - Delete availability entry
- `GET /api/availability/detailed-slots/` - Get detailed slot information
- `GET /api/appointments/` - Get all appointments

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3. Database Setup

```bash
python manage.py migrate
python manage.py setup_initial_data
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Usage Examples

### Authentication

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  },
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@drvivekshetty.com",
    "is_staff": true,
    "is_superuser": true
  }
}
```

#### Get User Profile
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer your-access-token-here"
```

#### Refresh Token
```bash
curl -X POST http://localhost:8000/api/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "your-refresh-token-here"}'
```

#### Verify Token
```bash
curl -X GET http://localhost:8000/api/auth/token/verify/ \
  -H "Authorization: Bearer your-access-token-here"
```

#### Check Admin
```bash
curl -X POST http://localhost:8000/api/auth/check-admin/ \
  -H "Authorization: Bearer your-access-token-here"
```

### Get Available Slots

```bash
curl -X GET http://localhost:8000/api/available-slots/
```

Response:
```json
{
  "success": true,
  "date": "2024-01-15",
  "available_slots": [
    {
      "time": "09:00",
      "available": true,
      "slot_id": "uuid_0900",
      "duration": 30
    }
  ],
  "total_available": 18
}
```

### Book Appointment

```bash
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "John Doe",
    "patient_email": "john@example.com",
    "patient_phone": "‪9886432371‬",
    "appointment_date": "2024-01-15",
    "appointment_time": "09:00",
    "reason": "initial_consultation",
    "notes": "First time consultation"
  }'
```

### Create Recurring Availability (Admin)

```bash
curl -X POST http://localhost:8000/api/availability/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token your-token-here" \
  -d '{
    "days": [0, 1, 2, 3, 4],
    "start_time": "09:00",
    "end_time": "18:00",
    "slot_duration": 30
  }'
```

## Models

### DoctorAvailability
- Manages doctor's available time slots
- Supports both recurring (weekly) and specific date availability
- Includes conflict detection

### Appointment
- Stores patient appointment information
- Tracks appointment status and metadata
- Links to doctor profile

### DoctorProfile
- Stores doctor's professional information
- Contact details and qualifications

## Frontend Integration

The frontend uses the API client in `src/lib/api.ts` which automatically switches between:
- Mock API (development without backend)
- Real API (production with backend)

To use the real API, set the environment variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` with your superuser credentials to:
- Manage doctor availability
- View and manage appointments
- Update doctor profile information
- Handle contact inquiries

## Development

### Running Tests

```bash
python manage.py test
```

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Creating New Management Commands

```bash
python manage.py startapp your_app_name
```

## Production Deployment

1. Set `DEBUG=False` in settings
2. Configure proper database (PostgreSQL recommended)
3. Set up static file serving
4. Configure CORS for your domain
5. Set up proper logging
6. Use environment variables for sensitive data

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend domain is in `CORS_ALLOWED_ORIGINS`
2. **Database Errors**: Run migrations and check database connection
3. **Authentication Errors**: Ensure proper token/credentials are provided
4. **Slot Conflicts**: Check for overlapping availability entries

### Logs

Check the logs in `logs/django.log` for detailed error information.
