from rest_framework import viewsets, permissions, filters
from .models import Product, CardDesign
from .serializers import ProductSerializer, CardDesignSerializer

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'edition', 'description']
    ordering_fields = ['price', 'display_order', 'created_at']
    ordering = ['display_order', 'id']

    def get_queryset(self):
        # Admin / staff sees all products; public sees only active products
        if self.request.user and self.request.user.is_staff:
            return Product.objects.all()
        return Product.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class CardDesignViewSet(viewsets.ModelViewSet):
    serializer_class = CardDesignSerializer

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return CardDesign.objects.all()
        return CardDesign.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
