from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.models import Product
from apps.accounts.models import CustomerProfile

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'customization_data', 'total_price']
        read_only_fields = ['id', 'total_price']

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=255)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=30)
    shipping_address = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)
    product_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(default=1, min_value=1)
    customization_data = serializers.DictField(required=False, default=dict)

    def create(self, validated_data):
        customer_name = validated_data.get('customer_name')
        customer_email = validated_data.get('customer_email')
        customer_phone = validated_data.get('customer_phone')
        shipping_address = validated_data.get('shipping_address')
        notes = validated_data.get('notes', '')
        product_id = validated_data.get('product_id')
        quantity = validated_data.get('quantity', 1)
        customization = validated_data.get('customization_data', {})

        unit_price = 599.00
        product = None
        product_name = 'Custom NFC Smart Card'

        if product_id:
            try:
                product = Product.objects.get(id=product_id)
                product_name = product.name
                is_vip = customization.get('package_tier') == 'VIP'
                if is_vip:
                    unit_price = float(product.vip_price if product.vip_price and product.vip_price > 0 else (float(product.regular_price or product.price) + 300))
                else:
                    reg = product.regular_price if product.regular_price and product.regular_price > 0 else product.price
                    unit_price = float(product.discount_price if product.discount_price and product.discount_price > 0 else reg)
            except Product.DoesNotExist:
                pass
        elif customization.get('edition'):
            product_name = f"TapCard {customization.get('edition')} Edition"

        courier_fee = float(customization.get('courier_fee', 60.00))
        total_amount = (unit_price * quantity) + courier_fee

        payment_method = customization.get('payment_method', 'bkash')
        trx_id = customization.get('trx_id', '')
        
        order = Order.objects.create(
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            shipping_address=shipping_address,
            total_amount=total_amount,
            notes=notes,
            status='Pending',
            payment_status='Paid' if (trx_id and len(trx_id) > 4) else 'Pending'
        )

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product_name,
            quantity=quantity,
            unit_price=unit_price,
            customization_data=customization
        )

        # Update or create CustomerProfile
        CustomerProfile.objects.update_or_create(
            email=customer_email,
            defaults={
                'name': customer_name,
                'phone': customer_phone,
                'address': shipping_address,
                'company': customization.get('company', ''),
                'designation': customization.get('designation', '')
            }
        )

        return order

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email',
            'customer_phone', 'shipping_address', 'total_amount',
            'status', 'payment_status', 'notes', 'items',
            'created_at', 'updated_at'
        ]
