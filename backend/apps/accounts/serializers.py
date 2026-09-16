from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, CustomerProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'role', 'full_name', 'is_staff', 'is_superuser', 'created_at')
        read_only_fields = ('id', 'created_at')

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                # Try finding user by username/email directly
                try:
                    u = User.objects.get(email__iexact=email)
                    if u.check_password(password):
                        user = u
                except User.DoesNotExist:
                    pass

            if not user:
                raise serializers.ValidationError('Invalid email or password.')

            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')

            refresh = RefreshToken.for_user(user)
            return {
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        raise serializers.ValidationError('Both email and password are required.')

class CustomerProfileSerializer(serializers.ModelSerializer):
    total_orders = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = ('id', 'name', 'email', 'phone', 'company', 'designation', 'address', 'total_orders', 'total_spent', 'created_at')

    def get_total_orders(self, obj):
        from apps.orders.models import Order
        return Order.objects.filter(customer_email__iexact=obj.email).count()

    def get_total_spent(self, obj):
        from apps.orders.models import Order
        from django.db.models import Sum
        spent = Order.objects.filter(customer_email__iexact=obj.email).exclude(status='Cancelled').aggregate(Sum('total_amount'))['total_amount__sum']
        return spent or 0.00
