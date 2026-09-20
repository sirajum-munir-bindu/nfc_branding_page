from rest_framework import viewsets, permissions, filters
from django.conf import settings
from .models import Product, CardDesign
from .serializers import ProductSerializer, CardDesignSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allows public read access (GET, HEAD, OPTIONS) but requires
    authenticated Admin/Staff credentials for write operations (POST, PUT, PATCH, DELETE).
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or getattr(request.user, 'role', '') in ['ADMIN', 'STAFF'])
        )

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'edition', 'description']
    ordering_fields = ['price', 'display_order', 'created_at']
    ordering = ['display_order', 'id']
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and (user.is_staff or getattr(user, 'role', '') in ['ADMIN', 'STAFF']):
            return Product.objects.all()
        return Product.objects.filter(is_active=True)

class CardDesignViewSet(viewsets.ModelViewSet):
    serializer_class = CardDesignSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and (user.is_staff or getattr(user, 'role', '') in ['ADMIN', 'STAFF']):
            return CardDesign.objects.all()
        return CardDesign.objects.filter(is_active=True)
