from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExamTypeViewSet, GradeViewSet, ExamViewSet, 
    ExamScheduleViewSet, MarksViewSet, StudentExamRegistrationViewSet,
    GenerateReportCardView
)

router = DefaultRouter()
router.register(r'exam-types', ExamTypeViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'schedules', ExamScheduleViewSet)
router.register(r'marks', MarksViewSet)
router.register(r'registrations', StudentExamRegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('report-card/<int:student_id>/<int:exam_id>/', GenerateReportCardView.as_view(), name='generate-report-card'),
]
