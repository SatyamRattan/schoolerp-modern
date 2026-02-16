from rest_framework import serializers
from .models import Vehicle, Route, Stop, TransportAllocation
from students.serializers import StudentSerializer

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)

    class Meta:
        model = Route
        fields = '__all__'

class TransportAllocationSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    stop_details = StopSerializer(source='stop', read_only=True)

    class Meta:
        model = TransportAllocation
        fields = '__all__'
