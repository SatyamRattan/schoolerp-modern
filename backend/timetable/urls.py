from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PeriodViewSet, TeacherAllocationViewSet, TimeTableViewSet

router = DefaultRouter()
router.register(r'periods', PeriodViewSet)
router.register(r'allocations', TeacherAllocationViewSet)
router.register(r'entries', TimeTableViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
