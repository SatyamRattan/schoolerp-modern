from rest_framework import viewsets
from .models import Vehicle, Route, Stop, TransportAllocation
from .serializers import VehicleSerializer, RouteSerializer, StopSerializer, TransportAllocationSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    filterset_fields = ['route']

class TransportAllocationViewSet(viewsets.ModelViewSet):
    queryset = TransportAllocation.objects.all()
    serializer_class = TransportAllocationSerializer
    filterset_fields = ['student', 'stop', 'is_active']
