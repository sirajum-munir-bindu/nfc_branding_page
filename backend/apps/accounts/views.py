from rest_framework import views, status, permissions
from rest_framework.response import Response
from .serializers import LoginSerializer, UserSerializer, CustomerProfileSerializer
from .models import CustomerProfile, User, SiteSetting

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

class AdminCustomerDetailView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            customer = CustomerProfile.objects.get(pk=pk)
            user = customer.user
            customer.delete()
            if user and user.role == 'CUSTOMER':
                user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

class SiteSettingView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        settings_dict = {}
        for s in SiteSetting.objects.all():
            settings_dict[s.key] = s.value
        if 'showcase_video_url' not in settings_dict or not settings_dict['showcase_video_url']:
            settings_dict['showcase_video_url'] = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        return Response(settings_dict)

    def post(self, request):
        key = request.data.get('key', '').strip()
        value = request.data.get('value', '').strip()
        if not key:
            return Response({'error': 'Key is required'}, status=status.HTTP_400_BAD_REQUEST)
        setting, _ = SiteSetting.objects.update_or_create(key=key, defaults={'value': value})
        return Response({'key': setting.key, 'value': setting.value, 'message': 'Setting saved successfully'})

class ChangePasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password', '').strip()
        new_password = request.data.get('new_password', '').strip()
        confirm_password = request.data.get('confirm_password', '').strip()

        if not old_password:
            return Response({'error': 'Current password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        if not new_password:
            return Response({'error': 'New password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({'error': 'New password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'New password and confirmation do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully!'}, status=status.HTTP_200_OK)

