from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CardDesignViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'card-designs', CardDesignViewSet, basename='card-design')

urlpatterns = [
    path('', include(router.urls)),
]
