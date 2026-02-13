from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FeesHeadViewSet, FeesHeadGroupViewSet, FeesPlanViewSet, 
    FeesPlanCategoryViewSet, FeesReceiptViewSet
)

router = DefaultRouter()
router.register(r'fees-heads', FeesHeadViewSet)
router.register(r'fees-head-groups', FeesHeadGroupViewSet)
router.register(r'fees-plans', FeesPlanViewSet)
router.register(r'fees-plan-categories', FeesPlanCategoryViewSet)
router.register(r'fees-receipts', FeesReceiptViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
