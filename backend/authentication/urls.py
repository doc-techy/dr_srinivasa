"""
URL configuration for authentication app
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    logout_view,
    verify_token,
    user_profile,
    check_admin,
    refresh_token_view,
    CustomTokenObtainPairView,
)

app_name = 'authentication'

urlpatterns = [
    # Authentication endpoints
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', verify_token, name='verify_token'),
    
    # User endpoints
    path('profile/', user_profile, name='user_profile'),
    path('check-admin/', check_admin, name='check_admin'),
    
    # Custom refresh endpoint
    path('refresh/', refresh_token_view, name='refresh_token'),
]
