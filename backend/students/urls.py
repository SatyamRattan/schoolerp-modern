from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet, ClassViewSet, SectionViewSet, 
    CasteViewSet, CategoryViewSet, HouseViewSet, 
    FamilyViewSet, GatePassViewSet, 
    StudentLeavingCertificateViewSet, AssessmentViewSet, 
    SubjectViewSet, TermViewSet
)
from .pdf_views import TransferCertificatePDFView, CharacterCertificatePDFView

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'castes', CasteViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'houses', HouseViewSet)
router.register(r'families', FamilyViewSet)
router.register(r'gate-pass', GatePassViewSet)
router.register(r'slc', StudentLeavingCertificateViewSet)
router.register(r'assessments', AssessmentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'terms', TermViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('certificates/transfer/', TransferCertificatePDFView.as_view(), name='transfer-certificate'),
    path('certificates/character/', CharacterCertificatePDFView.as_view(), name='character-certificate'),
]
