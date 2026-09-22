# Dr. Vivek Shetty - API Integration Guide

This guide explains how to integrate the appointment booking system with the Django backend API.

## 🏗️ System Architecture

```
Frontend (Next.js) ←→ API Client ←→ Backend (Django REST API)
     ↓                    ↓              ↓
Mock API (Dev)      Real API (Prod)   Database (SQLite/PostgreSQL)
```

## 📁 Project Structure

```
dr_vivek_shetty/
├── src/
│   ├── lib/
│   │   ├── api.ts              # API client and configuration
│   │   └── mockApi.ts          # Mock API for development
│   ├── hooks/
│   │   └── useAppointments.ts  # Custom hook for appointments
│   └── components/
│       └── sections/
│           └── AppointmentBooking.tsx  # Enhanced booking component
├── backend/
│   ├── appointments/
│   │   ├── models.py           # Django models
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # Data serializers
│   │   ├── utils.py            # Utility functions
│   │   └── urls.py             # URL routing
│   └── dr_vivek_shetty/
│       ├── settings.py         # Django settings
│       └── urls.py             # Main URL config
└── requirements.txt            # Backend dependencies
```

## 🚀 Quick Start

### 1. Frontend Setup (Already Done)

The frontend is already configured with:
- ✅ API client with mock/real API switching
- ✅ Custom hooks for appointment management
- ✅ Enhanced appointment booking component
- ✅ Form validation and error handling

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
echo "SECRET_KEY=your-secret-key-here" > .env
echo "DEBUG=True" >> .env
echo "ALLOWED_HOSTS=localhost,127.0.0.1" >> .env

# Run database migrations
python manage.py migrate

# Set up initial data
python manage.py setup_initial_data

# Create superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

### 3. Frontend-Backend Integration

```bash
# In the main project directory
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start the frontend
npm run dev
```

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login/` | Login and get JWT tokens + user info |
| `POST` | `/api/auth/logout/` | Logout and blacklist refresh token |
| `GET` | `/api/auth/profile/` | Get current user profile |
| `POST` | `/api/auth/token/` | Get JWT tokens (access + refresh) |
| `POST` | `/api/auth/refresh/` | Refresh access token |
| `GET` | `/api/auth/token/verify/` | Verify token validity |
| `POST` | `/api/auth/check-admin/` | Check admin permissions |

### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/available-slots/` | Get available time slots for next day |
| `POST` | `/api/appointments/book/` | Book a new appointment |

### Admin Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/availability/` | Get all availability entries |
| `POST` | `/api/availability/` | Create availability entry |
| `PUT` | `/api/availability/{id}/` | Update availability entry |
| `DELETE` | `/api/availability/{id}/` | Delete availability entry |
| `GET` | `/api/availability/detailed-slots/` | Get detailed slot info |
| `GET` | `/api/appointments/` | Get all appointments |

## 📝 API Usage Examples

### 1. Authentication

#### Login
```javascript
// Using the API client
const response = await apiClient.login('admin', 'admin123');
if (response.success) {
  console.log('Access Token:', response.data.tokens.access);
  console.log('Refresh Token:', response.data.tokens.refresh);
  console.log('User:', response.data.user);
}
```

**Response:**
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
    "first_name": "",
    "last_name": "",
    "is_staff": true,
    "is_superuser": true
  }
}
```

#### Get User Profile
```javascript
// Using the API client
const response = await apiClient.getUserProfile(accessToken);
if (response.success) {
  console.log('User profile:', response.data.user);
}
```

#### Refresh Token
```javascript
// Using the API client
const response = await apiClient.refreshToken(refreshToken);
if (response.success) {
  console.log('New access token:', response.data.access);
}
```

#### Verify Token
```javascript
// Using the API client
const response = await apiClient.verifyToken(accessToken);
if (response.success) {
  console.log('Token valid:', response.data.valid);
  console.log('User:', response.data.user);
}
```

#### Check Admin
```javascript
// Using the API client
const response = await apiClient.checkAdmin(accessToken);
if (response.success) {
  console.log('Is admin:', response.data.is_admin);
  console.log('Permissions:', response.data.permissions);
}
```

#### Logout
```javascript
// Using the API client
const response = await apiClient.logout(refreshToken);
if (response.success) {
  console.log('Logged out successfully');
}
```

### 2. Get Available Slots

```javascript
// Using the API client
const response = await apiClient.getAvailableSlots();
if (response.success) {
  console.log('Available slots:', response.data.available_slots);
}
```

**Response:**
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
    },
    {
      "time": "09:30",
      "available": true,
      "slot_id": "uuid_0930",
      "duration": 30
    }
  ],
  "total_available": 18
}
```

### 2. Book Appointment

```javascript
// Using the API client
const appointmentData = {
  patient_name: "John Doe",
  patient_email: "john@example.com",
  patient_phone: "‪9886432371‬",
  appointment_date: "2024-01-15",
  appointment_time: "09:00",
  reason: "initial_consultation",
  notes: "First time consultation"
};

const response = await apiClient.bookAppointment(appointmentData);
if (response.success) {
  console.log('Appointment booked:', response.data);
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "appointment_id": "apt_12345678-1234-1234-1234-123456789012",
    "patient_name": "John Doe",
    "patient_email": "john@example.com",
    "patient_phone": "‪9886432371‬",
    "appointment_date": "2024-01-15",
    "appointment_time": "09:00",
    "reason": "initial_consultation",
    "status": "pending",
    "created_at": "2024-01-10T10:00:00Z"
  }
}
```

### 3. Create Recurring Availability (Admin)

```javascript
// Using fetch directly (admin endpoint)
const response = await fetch('http://localhost:8000/api/availability/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Token your-token-here'
  },
  body: JSON.stringify({
    days: [0, 1, 2, 3, 4], // Monday to Friday
    start_time: "09:00",
    end_time: "18:00",
    slot_duration: 30
  })
});
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend (.env):**
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### API Client Configuration

The API client automatically switches between mock and real API based on environment:

```typescript
// src/lib/api.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  // ... other config
};

// Mock API is used when NEXT_PUBLIC_API_URL is not set
export const shouldUseMockApi = (): boolean => {
  return process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
};
```

## 🎯 Frontend Integration

### Using the Custom Hook

```typescript
import { useAppointments } from '@/hooks/useAppointments';

function AppointmentForm() {
  const {
    availableSlots,
    loading,
    error,
    bookingLoading,
    bookingError,
    bookingSuccess,
    fetchAvailableSlots,
    bookAppointment,
    clearBookingState,
  } = useAppointments();

  // Use the hook in your component
  // ...
}
```

### Using the API Client Directly

```typescript
import { apiClient } from '@/lib/api';

// Get available slots
const slots = await apiClient.getAvailableSlots();

// Book appointment
const appointment = await apiClient.bookAppointment(formData);

// Subscribe to newsletter
const newsletter = await apiClient.subscribeNewsletter(email);
```

## 🗄️ Database Models

### DoctorAvailability
- `availability_id`: UUID primary key
- `is_recurring`: Boolean for weekly schedule
- `day_of_week`: Integer (0-6) for recurring
- `date`: Date for specific availability
- `start_time`: Time field
- `end_time`: Time field
- `slot_duration`: Integer in minutes
- `is_active`: Boolean status

### Appointment
- `appointment_id`: UUID primary key
- `patient_name`: CharField
- `patient_email`: EmailField
- `patient_phone`: CharField with validation
- `appointment_date`: DateField
- `appointment_time`: TimeField
- `reason`: CharField with choices
- `notes`: TextField (optional)
- `status`: CharField with choices
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

## 🔒 Authentication

### Admin Authentication

For admin endpoints, use Django's token authentication:

```javascript
const token = 'your-django-token-here';
const response = await fetch('/api/availability/', {
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Getting Admin Token

```bash
# Create superuser
python manage.py createsuperuser

# Get token via Django shell
python manage.py shell
>>> from rest_framework.authtoken.models import Token
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username='admin')
>>> token = Token.objects.create(user=user)
>>> print(token.key)
```

## 🚨 Error Handling

### Frontend Error Handling

```typescript
try {
  const response = await apiClient.bookAppointment(formData);
  if (response.success) {
    // Handle success
  } else {
    // Handle API error
    console.error('API Error:', response.error);
  }
} catch (error) {
  // Handle network error
  console.error('Network Error:', error);
}
```

### Backend Error Responses

```json
{
  "success": false,
  "error": "This time slot is no longer available. Please select another time."
}
```

## 🧪 Testing

### Frontend Testing

```bash
# Run frontend tests
npm test

# Run with coverage
npm run test:coverage
```

### Backend Testing

```bash
# Run backend tests
python manage.py test

# Run specific app tests
python manage.py test appointments
```

## 🚀 Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

### Backend Deployment

```bash
# Install production dependencies
pip install gunicorn psycopg2-binary

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Start with Gunicorn
gunicorn dr_vivek_shetty.wsgi:application
```

## 📊 Monitoring

### Logging

Backend logs are stored in `backend/logs/django.log`:

```python
# In views.py
logger.error(f"Error booking appointment: {str(e)}")
```

### Health Checks

```bash
# Check API health
curl http://localhost:8000/api/available-slots/

# Check admin endpoints
curl -H "Authorization: Token your-token" http://localhost:8000/api/availability/
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add your frontend domain to `CORS_ALLOWED_ORIGINS` in settings.py

2. **Database Errors**
   - Run `python manage.py migrate`
   - Check database connection

3. **Authentication Errors**
   - Verify token is correct
   - Check user permissions

4. **Slot Conflicts**
   - Check for overlapping availability entries
   - Verify appointment status

### Debug Mode

```python
# In settings.py
DEBUG = True
LOGGING['loggers']['appointments']['level'] = 'DEBUG'
```

## 📚 Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Support

For issues or questions:
1. Check the logs in `backend/logs/django.log`
2. Verify environment variables
3. Test API endpoints with curl/Postman
4. Check browser console for frontend errors
