from rest_framework import serializers
from .models import Product, CardDesign

class ProductSerializer(serializers.ModelSerializer):
    effective_price = serializers.SerializerMethodField()
    has_discount = serializers.SerializerMethodField()
    description = serializers.CharField(required=False, allow_blank=True, default='')
    image_url = serializers.CharField(required=False, allow_blank=True, default='')
    edition = serializers.CharField(required=False, allow_blank=True, default='Standard Edition')
    finish = serializers.CharField(required=False, allow_blank=True, default='Matte Brushed')
    badge_text = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='')
    features = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'edition', 'description', 
            'price', 'discount_price', 'effective_price', 'has_discount',
            'image', 'image_url', 'stock', 'is_active', 'color_hex',
            'finish', 'badge_text', 'features', 'display_order',
            'created_at', 'updated_at'
        ]

    def get_effective_price(self, obj):
        if obj.discount_price and obj.discount_price > 0:
            return float(obj.discount_price)
        return float(obj.price)

    def get_has_discount(self, obj):
        return bool(obj.discount_price and obj.discount_price > 0 and obj.discount_price < obj.price)

class CardDesignSerializer(serializers.ModelSerializer):
    edition_code = serializers.CharField(required=False, allow_blank=True, default='')
    description = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = CardDesign
        fields = '__all__'
