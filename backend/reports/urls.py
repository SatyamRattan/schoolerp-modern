from django.urls import path
from . import views

urlpatterns = [
    path('certificate/<int:student_id>/<str:type>/', views.generate_certificate, name='generate_certificate'),
]
