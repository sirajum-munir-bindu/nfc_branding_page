from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.products.models import Product
from .models import Order

User = get_user_model()

class OrdersAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email='admin@tapcard.test',
            password='AdminPassword123!'
        )
        self.product = Product.objects.create(
            name='Standard Smart NFC Card',
            edition='Standard',
            price=599.00,
            regular_price=599.00,
            vip_price=899.00,
            is_active=True
        )

    def test_public_create_order_standard_pricing(self):
        payload = {
            'customer_name': 'John Customer',
            'customer_email': 'john@example.com',
            'customer_phone': '+8801711223344',
            'shipping_address': 'House 12, Road 4, Banani, Dhaka',
            'product_id': self.product.id,
            'quantity': 2,
            'customization_data': {
                'package_tier': 'REGULAR',
                'edition': 'Standard',
                'name': 'John Customer',
                'company': 'Tech Corp',
                'courier_fee': 60.0
            }
        }
        response = self.client.post('/api/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('order_number', response.data)
        # 599 * 2 + 60 = 1258.00
        self.assertEqual(float(response.data['total_amount']), 1258.00)
        self.assertEqual(response.data['customer_email'], 'john@example.com')
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['quantity'], 2)

    def test_public_create_order_vip_pricing(self):
        payload = {
            'customer_name': 'VIP Customer',
            'customer_email': 'vip@example.com',
            'customer_phone': '+8801799887766',
            'shipping_address': 'Gulshan 2, Dhaka',
            'product_id': self.product.id,
            'quantity': 1,
            'customization_data': {
                'package_tier': 'VIP',
                'edition': 'Standard',
                'courier_fee': 60.0
            }
        }
        response = self.client.post('/api/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # 899 * 1 + 60 = 959.00
        self.assertEqual(float(response.data['total_amount']), 959.00)

    def test_anonymous_cannot_list_all_orders(self):
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_list_and_filter_orders(self):
        # Create an order
        Order.objects.create(
            order_number='TC-TEST01',
            customer_name='Alice',
            customer_email='alice@example.com',
            customer_phone='123456',
            shipping_address='Dhaka',
            total_amount=659.00,
            status='Shipped'
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/orders/?status=Shipped')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data if isinstance(response.data, list) else response.data.get('results', [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['order_number'], 'TC-TEST01')
