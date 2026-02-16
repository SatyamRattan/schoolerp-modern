from rest_framework import serializers
from .models import Event
from django.contrib.auth import get_user_model

User = get_user_model()

class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class EventSerializer(serializers.ModelSerializer):
    created_by_details = UserShortSerializer(source='created_by', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date', 
            'type', 'audience', 'created_at', 'updated_at', 
            'created_by', 'created_by_details'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
