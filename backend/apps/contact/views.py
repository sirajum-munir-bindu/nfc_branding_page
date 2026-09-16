from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all().order_by('-created_at')

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def mark_read(self, request, pk=None):
        msg = self.get_object()
        msg.is_read = True
        msg.save()
        return Response({'status': 'Message marked as read', 'is_read': True})
