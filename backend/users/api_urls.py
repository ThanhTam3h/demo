from django.urls import path

from .api_views import LoginAPIView, RegisterAPIView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='api_auth_login'),
    path('register/', RegisterAPIView.as_view(), name='api_auth_register'),
]
