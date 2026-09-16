from django.contrib import admin
from apps.accounts.models import User, CustomerProfile
from apps.products.models import Product, CardDesign
from apps.orders.models import Order, OrderItem
from apps.testimonials.models import Testimonial
from apps.faq.models import FAQ
from apps.contact.models import ContactMessage

admin.site.register(User)
admin.site.register(CustomerProfile)
admin.site.register(Product)
admin.site.register(CardDesign)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ('order_number', 'customer_name', 'total_amount', 'status', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status')
    search_fields = ('order_number', 'customer_name', 'customer_email')

admin.site.register(Testimonial)
admin.site.register(FAQ)
admin.site.register(ContactMessage)
