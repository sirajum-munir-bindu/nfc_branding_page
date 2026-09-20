from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import CustomerProfile, SiteSetting

User = get_user_model()

class AccountsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            email='admin@tapcard.test',
            password='AdminPassword123!',
            first_name='Super',
            last_name='Admin'
        )
        self.regular_user = User.objects.create_user(
            email='user@tapcard.test',
            password='UserPassword123!',
            first_name='Regular',
            last_name='User'
        )
        self.customer = CustomerProfile.objects.create(
            name='Jane Doe',
            email='jane@example.com',
            phone='+8801700000000',
            company='Acme Corp',
            designation='CTO',
            address='Dhaka, Bangladesh'
        )

    def test_user_login_success(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'admin@tapcard.test',
            'password': 'AdminPassword123!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], 'admin@tapcard.test')

    def test_user_login_invalid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'admin@tapcard.test',
            'password': 'WrongPassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_endpoint_requires_auth(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_authenticated(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'admin@tapcard.test')

    def test_admin_customer_list_forbidden_for_anonymous(self):
        response = self.client.get('/api/admin/customers/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_customer_list_success_for_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/customers/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['email'], 'jane@example.com')

    def test_site_settings_public_read(self):
        SiteSetting.objects.create(key='custom_hero_title', value='Next-Gen Cards')
        response = self.client.get('/api/settings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('custom_hero_title', response.data)

    def test_site_settings_write_requires_admin(self):
        # Anonymous write
        response = self.client.post('/api/settings/', {'key': 'site_name', 'value': 'TapCard Pro'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Admin write
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/settings/', {'key': 'site_name', 'value': 'TapCard Pro'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['value'], 'TapCard Pro')
