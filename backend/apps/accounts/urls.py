from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, MeView, AdminCustomerListView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('admin/customers/', AdminCustomerListView.as_view(), name='admin-customers'),
]
