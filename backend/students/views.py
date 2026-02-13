from rest_framework import viewsets
from .models import (
    Student, Class, Section, Caste, Category, House, Family, 
    GatePass, StudentLeavingCertificate, Assessment, Subject, Term
)
from .serializers import (
    StudentSerializer, ClassSerializer, SectionSerializer, 
    CasteSerializer, CategorySerializer, HouseSerializer, 
    FamilySerializer, GatePassSerializer, 
    StudentLeavingCertificateSerializer, AssessmentSerializer, 
    SubjectSerializer, TermSerializer
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
