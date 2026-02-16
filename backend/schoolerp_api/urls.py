"""
URL configuration for schoolerp_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('accounts.urls')),
    path('api/students/', include('students.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/fees/', include('fees.urls')),
    path('api/school-admin/', include('school_admin.urls')),
    path('api/exams/', include('exams.urls')),
    path('api/library/', include('library.urls')),
    path('api/timetable/', include('timetable.urls')),
    path('api/lms/', include('lms.urls')),
    path('api/transport/', include('transport.urls')),
    path('api/hr/', include('hr.urls')),
    path('api/enquiry/', include('enquiry.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/discussion/', include('discussion.urls')),
    path('api/calendar/', include('school_calendar.urls')),
]
