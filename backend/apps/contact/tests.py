from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import ContactMessage

User = get_user_model()

class ContactAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email='admin@tapcard.test',
            password='AdminPassword123!'
        )

    def test_public_can_submit_contact_message(self):
        payload = {
            'name': 'Sarah Connor',
            'email': 'sarah@example.com',
            'phone': '+8801812345678',
            'message': 'Interested in bulk orders for 50 cards.'
        }
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.first().name, 'Sarah Connor')

    def test_anonymous_cannot_view_messages(self):
        response = self.client.get('/api/contact/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_mark_message_read(self):
        msg = ContactMessage.objects.create(
            name='Mark Tester',
            email='mark@example.com',
            message='Test message'
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(f'/api/contact/{msg.id}/mark_read/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg.refresh_from_db()
        self.assertTrue(msg.is_read)
