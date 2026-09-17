from rest_framework import serializers
from .models import Product, CardDesign

class ProductSerializer(serializers.ModelSerializer):
    effective_price = serializers.SerializerMethodField()
    has_discount = serializers.SerializerMethodField()
    name = serializers.CharField(required=True)
    edition = serializers.CharField(required=False, allow_blank=True, default='Standard Edition')
    description = serializers.CharField(required=False, allow_blank=True, default='')
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    regular_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    vip_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    discount_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    image_url = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='')
    back_image_url = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='')
    finish = serializers.CharField(required=False, allow_blank=True, default='Matte Brushed')
    badge_text = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='')
    features = serializers.ListField(child=serializers.CharField(allow_blank=True), required=False, default=list)
    stock = serializers.IntegerField(required=False, default=100)
    is_active = serializers.BooleanField(required=False, default=True)
    color_hex = serializers.CharField(required=False, allow_blank=True, default='#0f172a')
    display_order = serializers.IntegerField(required=False, default=0)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'edition', 'description', 
            'price', 'regular_price', 'vip_price', 'discount_price', 'effective_price', 'has_discount',
            'image', 'image_url', 'back_image', 'back_image_url',
            'stock', 'is_active', 'color_hex',
            'finish', 'badge_text', 'features', 'display_order',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'read_only': True, 'required': False},
            'image': {'required': False, 'allow_null': True},
            'back_image': {'required': False, 'allow_null': True},
        }

    def validate(self, data):
        from decimal import Decimal
        # Sync regular_price and price
        regular_val = data.get('regular_price') or data.get('price') or Decimal('599.00')
        if not isinstance(regular_val, Decimal):
            regular_val = Decimal(str(regular_val))
        data['regular_price'] = regular_val
        data['price'] = regular_val

        # Auto-compute vip_price if not provided
        if not data.get('vip_price'):
            data['vip_price'] = regular_val + Decimal('300.00')
        elif not isinstance(data.get('vip_price'), Decimal):
            data['vip_price'] = Decimal(str(data.get('vip_price')))

        return data

    def get_effective_price(self, obj):
        if obj.discount_price and obj.discount_price > 0:
            return float(obj.discount_price)
        if obj.regular_price and obj.regular_price > 0:
            return float(obj.regular_price)
        return float(obj.price) if obj.price else 0.0

    def get_has_discount(self, obj):
        base = obj.regular_price or obj.price
        return bool(obj.discount_price and obj.discount_price > 0 and base and obj.discount_price < base)

class CardDesignSerializer(serializers.ModelSerializer):
    edition_code = serializers.CharField(required=False, allow_blank=True, default='')
    description = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = CardDesign
        fields = '__all__'
        extra_kwargs = {
            'edition_code': {'required': False},
            'preview_image': {'required': False, 'allow_null': True},
        }
