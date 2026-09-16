from rest_framework import viewsets, permissions
from .models import FAQ
from .serializers import FAQSerializer

class FAQViewSet(viewsets.ModelViewSet):
    serializer_class = FAQSerializer

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return FAQ.objects.all().order_by('display_order', 'id')
        return FAQ.objects.filter(is_active=True).order_by('display_order', 'id')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
