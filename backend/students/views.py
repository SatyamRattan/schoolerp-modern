from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import (
    Student, Class, Section, Caste, Category, House, Family, 
    GatePass, StudentLeavingCertificate, Assessment, Subject, Term
)
from .serializers import (
    StudentSerializer, ClassSerializer, SectionSerializer, 
    CasteSerializer, CategorySerializer, HouseSerializer, 
    FamilySerializer, GatePassSerializer, 
    StudentLeavingCertificateSerializer, AssessmentSerializer, 
    SubjectSerializer, TermSerializer, AdmissionSerializer
)

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class CasteViewSet(viewsets.ModelViewSet):
    queryset = Caste.objects.all()
    serializer_class = CasteSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class HouseViewSet(viewsets.ModelViewSet):
    queryset = House.objects.all()
    serializer_class = HouseSerializer

class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        student_class = self.request.query_params.get('student_class')
        student_section = self.request.query_params.get('student_section')
        if student_class:
            queryset = queryset.filter(student_class=student_class)
        if student_section:
            queryset = queryset.filter(student_section=student_section)
        return queryset

class GatePassViewSet(viewsets.ModelViewSet):
    queryset = GatePass.objects.all()
    serializer_class = GatePassSerializer

class StudentLeavingCertificateViewSet(viewsets.ModelViewSet):
    queryset = StudentLeavingCertificate.objects.all()
    serializer_class = StudentLeavingCertificateSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class TermViewSet(viewsets.ModelViewSet):
    queryset = Term.objects.all()
    serializer_class = TermSerializer

class AdmissionViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.exclude(status_adm='ADMITTED')
    serializer_class = AdmissionSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        student = self.get_object()
        student.status_adm = 'ADMITTED'
        student.status = 'ACTIVE'
        # Generate other required fields if needed
        student.save()
        return Response({'status': 'admitted'})
