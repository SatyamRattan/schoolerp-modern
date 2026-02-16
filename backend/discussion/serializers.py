from rest_framework import serializers
from .models import Thread, Reply
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ReplySerializer(serializers.ModelSerializer):
    author_details = AuthorSerializer(source='author', read_only=True)

    class Meta:
        model = Reply
        fields = ['id', 'thread', 'content', 'author', 'author_details', 'created_at', 'updated_at', 'is_active']
        read_only_fields = ['author', 'created_at', 'updated_at']

class ThreadSerializer(serializers.ModelSerializer):
    author_details = AuthorSerializer(source='author', read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    reply_count = serializers.IntegerField(source='replies.count', read_only=True)

    class Meta:
        model = Thread
        fields = ['id', 'title', 'content', 'author', 'author_details', 'created_at', 'updated_at', 'is_active', 'views_count', 'replies', 'reply_count']
        read_only_fields = ['author', 'created_at', 'updated_at', 'views_count']
