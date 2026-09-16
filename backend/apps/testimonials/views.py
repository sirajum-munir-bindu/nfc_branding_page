from rest_framework import viewsets, permissions
from .models import Testimonial
from .serializers import TestimonialSerializer

class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Testimonial.objects.all().order_by('display_order', '-created_at')
        return Testimonial.objects.filter(is_active=True).order_by('display_order', '-created_at')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
