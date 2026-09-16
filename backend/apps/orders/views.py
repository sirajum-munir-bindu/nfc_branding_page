from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from .models import Order
from .serializers import OrderDetailSerializer, OrderCreateSerializer

class OrderViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['order_number', 'customer_name', 'customer_email', 'customer_phone']
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Order.objects.all().prefetch_related('items')
        status_param = self.request.query_params.get('status')
        if status_param and status_param != 'All':
            queryset = queryset.filter(status__iexact=status_param)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderDetailSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        output_serializer = OrderDetailSerializer(order)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
