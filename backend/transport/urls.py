from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, RouteViewSet, StopViewSet, TransportAllocationViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'stops', StopViewSet)
router.register(r'allocations', TransportAllocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
