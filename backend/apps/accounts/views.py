from rest_framework import views, status, permissions
from rest_framework.response import Response
from .serializers import LoginSerializer, UserSerializer, CustomerProfileSerializer
from .models import CustomerProfile, User

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class AdminCustomerListView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        queryset = CustomerProfile.objects.all().order_by('-created_at')
        if search:
            queryset = queryset.filter(name__icontains=search) | queryset.filter(email__icontains=search) | queryset.filter(phone__icontains=search)
        
        serializer = CustomerProfileSerializer(queryset, many=True)
        return Response(serializer.data)
