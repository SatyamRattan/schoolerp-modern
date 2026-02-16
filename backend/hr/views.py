from rest_framework import viewsets
from .models import Staff, Department, Leave
from .serializers import StaffSerializer, DepartmentSerializer, LeaveSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    filterset_fields = ['department', 'is_active']

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    filterset_fields = ['staff', 'status']
