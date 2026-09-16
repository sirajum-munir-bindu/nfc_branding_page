import uuid
from django.db import models
from apps.products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    PAYMENT_STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Manual', 'Manual/COD'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
    )

    order_number = models.CharField(max_length=50, unique=True, editable=False)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=30)
    shipping_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    payment_status = models.CharField(max_length=30, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            short_id = uuid.uuid4().hex[:6].upper()
            self.order_number = f"TC-{short_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_number} - {self.customer_name} (৳{self.total_amount})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product_name = models.CharField(max_length=255, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    customization_data = models.JSONField(default=dict, blank=True, help_text="Stored customization attributes: name, role, company, color, etc.")

    def save(self, *args, **kwargs):
        if self.product and not self.product_name:
            self.product_name = self.product.name
        super().save(*args, **kwargs)

    @property
    def total_price(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.quantity}x {self.product_name} in {self.order.order_number}"

