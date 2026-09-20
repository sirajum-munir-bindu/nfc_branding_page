from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, CardDesign

User = get_user_model()

class ProductsAPITests(TestCase):
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
        self.product = Product.objects.create(
            name='Matte Black NFC Card',
            edition='Black Edition',
            description='Premium matte black finish',
            price=699.00,
            regular_price=699.00,
            vip_price=999.00,
            is_active=True
        )
        self.inactive_product = Product.objects.create(
            name='Prototype Card',
            edition='Beta Edition',
            price=199.00,
            is_active=False
        )
        self.card_design = CardDesign.objects.create(
            name='Midnight Purple',
            edition_code='purple',
            price=799.00,
            is_active=True
        )

    def test_public_can_list_active_products(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only list active products for unauthenticated users
        results = response.data if isinstance(response.data, list) else response.data.get('results', [])
        names = [p['name'] for p in results]
        self.assertIn('Matte Black NFC Card', names)
        self.assertNotIn('Prototype Card', names)

    def test_admin_can_see_inactive_products(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data if isinstance(response.data, list) else response.data.get('results', [])
        names = [p['name'] for p in results]
        self.assertIn('Prototype Card', names)

    def test_anonymous_cannot_create_product(self):
        response = self.client.post('/api/products/', {
            'name': 'Hacker Edition',
            'edition': 'Stealth',
            'price': 1200.00
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cannot_create_product(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post('/api/products/', {
            'name': 'Hacker Edition',
            'edition': 'Stealth',
            'price': 1200.00
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_product(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/products/', {
            'name': 'Gold NFC VIP',
            'edition': 'Gold VIP Edition',
            'price': 1500.00,
            'regular_price': 1500.00,
            'vip_price': 1800.00,
            'is_active': True
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Gold NFC VIP')
