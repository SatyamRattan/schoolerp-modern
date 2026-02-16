from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Period, TeacherAllocation, TimeTableEntry
from .serializers import (
    PeriodSerializer, TeacherAllocationSerializer, TimeTableEntrySerializer
)

class PeriodViewSet(viewsets.ModelViewSet):
    queryset = Period.objects.all().order_by('start_time')
    serializer_class = PeriodSerializer

class TeacherAllocationViewSet(viewsets.ModelViewSet):
    queryset = TeacherAllocation.objects.all()
    serializer_class = TeacherAllocationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['teacher__full_name', 'subject__name', 'class_obj__name']

class TimeTableViewSet(viewsets.ModelViewSet):
    queryset = TimeTableEntry.objects.all()
    serializer_class = TimeTableEntrySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['class_obj__name', 'section__name']

    def get_queryset(self):
        queryset = super().get_queryset()
        class_id = self.request.query_params.get('class_id')
        section_id = self.request.query_params.get('section_id')
        teacher_id = self.request.query_params.get('teacher_id')

        if class_id and section_id:
            queryset = queryset.filter(class_obj_id=class_id, section_id=section_id)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        
        return queryset.order_by('day', 'period__start_time')

    @action(detail=False, methods=['post'])
    def bulk_create_entries(self, request):
        entries = request.data.get('entries', [])
        created_count = 0
        errors = []
        
        for entry_data in entries:
            serializer = self.get_serializer(data=entry_data)
            if serializer.is_valid():
                # Basic conflict check: Teacher already booked?
                teacher_id = entry_data.get('teacher')
                day = entry_data.get('day')
                period_id = entry_data.get('period')
                
                if teacher_id and TimeTableEntry.objects.filter(teacher_id=teacher_id, day=day, period_id=period_id).exists():
                    errors.append(f"Teacher clash for Period {period_id} on Day {day}")
                    continue

                serializer.save()
                created_count += 1
            else:
                errors.append(serializer.errors)
        
        return Response({
            'created': created_count,
            'errors': errors
        }, status=status.HTTP_201_CREATED if created_count > 0 else status.HTTP_400_BAD_REQUEST)
