from django.contrib import admin
from .models import ExamType, Grade, Exam, ExamSchedule, Marks, StudentExamRegistration
from school_admin.models import AcademicYear

@admin.register(ExamType)
class ExamTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('name', 'min_marks', 'max_marks', 'grade_point')

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('name', 'exam_type', 'academic_year', 'start_date', 'end_date', 'is_active')
    list_filter = ('exam_type', 'academic_year', 'is_active')

@admin.register(ExamSchedule)
class ExamScheduleAdmin(admin.ModelAdmin):
    list_display = ('exam', 'subject', 'section', 'date', 'start_time', 'end_time')
    list_filter = ('exam', 'subject', 'date')

@admin.register(Marks)
class MarksAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam_schedule', 'marks_obtained', 'is_absent')
    list_filter = ('exam_schedule__exam', 'is_absent')
    search_fields = ('student__student_first_name', 'student__admission_no')

@admin.register(StudentExamRegistration)
class StudentExamRegistrationAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'roll_number')

# Register AcademicYear in school_admin if not already registered (it might be in school_admin/admin.py)
# Check school_admin/admin.py first? Or just register it here temporarily or check if it throws error.
# Better to checking school_admin/admin.py first.
