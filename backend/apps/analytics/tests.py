from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.orders.models import Order
from apps.products.models import Product

User = get_user_model()

class AnalyticsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email='admin@tapcard.test',
            password='AdminPassword123!'
        )
        self.regular_user = User.objects.create_user(
            email='user@tapcard.test',
            password='UserPassword123!'
        )
        Product.objects.create(name='Test Card', price=599.00, is_active=True)
        Order.objects.create(
            order_number='TC-AN01',
            customer_name='Alex',
            customer_email='alex@example.com',
            customer_phone='017000',
            shipping_address='Dhaka',
            total_amount=599.00,
            status='Confirmed'
        )

    def test_analytics_dashboard_stats_forbidden_for_anonymous(self):
        response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_analytics_dashboard_stats_forbidden_for_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_analytics_dashboard_stats_success_for_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overview', response.data)
        self.assertIn('sales_chart', response.data)
        self.assertIn('status_breakdown', response.data)
        self.assertEqual(response.data['overview']['total_orders'], 1)
        self.assertEqual(float(response.data['overview']['total_revenue']), 599.00)
