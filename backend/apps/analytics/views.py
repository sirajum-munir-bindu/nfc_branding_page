from rest_framework import views, permissions
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from apps.orders.models import Order, OrderItem
from apps.products.models import Product
from apps.accounts.models import CustomerProfile
from apps.contact.models import ContactMessage
from apps.orders.serializers import OrderDetailSerializer

class AdminDashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        revenue_data = Order.objects.exclude(status='Cancelled').aggregate(Sum('total_amount'))
        total_revenue = revenue_data['total_amount__sum'] or 0.00
        total_customers = CustomerProfile.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        pending_orders = Order.objects.filter(status='Pending').count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()

        # Orders & revenue trends for last 7 days
        today = timezone.now().date()
        sales_chart = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_orders = Order.objects.filter(created_at__date=day)
            day_rev = day_orders.exclude(status='Cancelled').aggregate(Sum('total_amount'))['total_amount__sum'] or 0.00
            sales_chart.append({
                'date': day.strftime('%b %d'),
                'revenue': float(day_rev),
                'orders': day_orders.count()
            })

        # Order status breakdown
        status_counts = Order.objects.values('status').annotate(count=Count('id'))
        status_breakdown = {item['status']: item['count'] for item in status_counts}

        # Popular products
        popular_items = (
            OrderItem.objects.values('product_name')
            .annotate(sales_count=Sum('quantity'), total_sales=Sum('unit_price'))
            .order_by('-sales_count')[:5]
        )

        # Recent orders
        recent_orders = Order.objects.all().order_by('-created_at')[:5]
        recent_orders_data = OrderDetailSerializer(recent_orders, many=True).data

        return Response({
            'overview': {
                'total_orders': total_orders,
                'total_revenue': float(total_revenue),
                'total_customers': total_customers,
                'active_products': active_products,
                'pending_orders': pending_orders,
                'unread_messages': unread_messages,
            },
            'sales_chart': sales_chart,
            'status_breakdown': status_breakdown,
            'popular_products': list(popular_items),
            'recent_orders': recent_orders_data,
        })
