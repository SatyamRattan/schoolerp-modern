from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffViewSet, DepartmentViewSet, LeaveViewSet

router = DefaultRouter()
router.register(r'staff', StaffViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'leaves', LeaveViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
