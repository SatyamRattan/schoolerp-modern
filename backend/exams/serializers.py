from rest_framework import serializers
from .models import ExamType, Grade, Exam, ExamSchedule, Marks, StudentExamRegistration
from students.serializers import StudentSerializer, SectionSerializer, SubjectSerializer
from students.models import Term
from school_admin.models import AcademicYear

class ExamTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamType
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    exam_type_name = serializers.CharField(source='exam_type.name', read_only=True)
    academic_year_name = serializers.CharField(source='academic_year.name', read_only=True)
    term_name = serializers.CharField(source='term.term_name', read_only=True)

    class Meta:
        model = Exam
        fields = '__all__'

class ExamScheduleSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    section_name = serializers.CharField(source='section.section_name', read_only=True)

    class Meta:
        model = ExamSchedule
        fields = '__all__'

class MarksSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    roll_no = serializers.IntegerField(source='student.student_roll_no', read_only=True)

    class Meta:
        model = Marks
        fields = '__all__'

    def get_student_name(self, obj):
        return f"{obj.student.student_first_name} {obj.student.student_last_name}"

class StudentExamRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentExamRegistration
        fields = '__all__'
