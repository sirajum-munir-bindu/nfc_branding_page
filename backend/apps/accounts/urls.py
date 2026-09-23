from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, MeView, AdminCustomerListView, AdminCustomerDetailView, SiteSettingView, ChangePasswordView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
    path('admin/customers/', AdminCustomerListView.as_view(), name='admin-customers'),
    path('admin/customers/<int:pk>/', AdminCustomerDetailView.as_view(), name='admin-customer-detail'),
    path('settings/', SiteSettingView.as_view(), name='site-settings'),
]

