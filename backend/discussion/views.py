from rest_framework import viewsets, filters, permissions
from .models import Thread, Reply
from .serializers import ThreadSerializer, ReplySerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all().order_by('-created_at')
    serializer_class = ThreadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'author__username']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        thread = self.get_object()
        thread.views_count += 1
        thread.save()
        return Response({'status': 'view counted'})

class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all().order_by('created_at')
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['content', 'author__username']

    def get_queryset(self):
        queryset = super().get_queryset()
        thread_id = self.request.query_params.get('thread_id')
        if thread_id:
            queryset = queryset.filter(thread_id=thread_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
