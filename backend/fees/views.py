from rest_framework import viewsets
from .models import FeesHead, FeesHeadGroup, FeesPlan, FeesPlanCategory, FeesReceipt
from .serializers import (
    FeesHeadSerializer, FeesHeadGroupSerializer, FeesPlanSerializer, 
    FeesPlanCategorySerializer, FeesReceiptSerializer
)

class FeesHeadGroupViewSet(viewsets.ModelViewSet):
    queryset = FeesHeadGroup.objects.all()
    serializer_class = FeesHeadGroupSerializer

class FeesHeadViewSet(viewsets.ModelViewSet):
    queryset = FeesHead.objects.all()
    serializer_class = FeesHeadSerializer

class FeesPlanCategoryViewSet(viewsets.ModelViewSet):
    queryset = FeesPlanCategory.objects.all()
    serializer_class = FeesPlanCategorySerializer

class FeesPlanViewSet(viewsets.ModelViewSet):
    queryset = FeesPlan.objects.all()
    serializer_class = FeesPlanSerializer

class FeesReceiptViewSet(viewsets.ModelViewSet):
    queryset = FeesReceipt.objects.all()
    serializer_class = FeesReceiptSerializer
