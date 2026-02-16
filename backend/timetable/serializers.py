from rest_framework import serializers
from .models import Period, TeacherAllocation, TimeTableEntry

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = '__all__'

class TeacherAllocationSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class_name = serializers.CharField(source='class_obj.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)

    class Meta:
        model = TeacherAllocation
        fields = '__all__'

class TimeTableEntrySerializer(serializers.ModelSerializer):
    period_detail = PeriodSerializer(source='period', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    day_name = serializers.SerializerMethodField()

    class Meta:
        model = TimeTableEntry
        fields = '__all__'

    def get_day_name(self, obj):
        return obj.get_day_display()
