from rest_framework import viewsets, permissions, filters
from .models import Event
from .serializers import EventSerializer
from django.db.models import Q

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'end_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        
        if start and end:
            # Overlapping events or within range
            queryset = queryset.filter(
                Q(start_date__range=[start, end]) | 
                Q(end_date__range=[start, end]) |
                Q(start_date__lte=start, end_date__gte=end)
            )
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
