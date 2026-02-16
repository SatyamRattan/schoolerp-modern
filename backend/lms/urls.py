from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, TopicViewSet, QuizViewSet, QuizAttemptViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'quiz_attempts', QuizAttemptViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
