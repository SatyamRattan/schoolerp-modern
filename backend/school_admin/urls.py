from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganisationInfoViewSet, AdminAccountViewSet, OwnerViewSet, 
    ContactUsViewSet, FeedbackViewSet, TermsViewSet, 
    RouteViewSet, RoutePlanViewSet
)

router = DefaultRouter()
router.register(r'organisation-info', OrganisationInfoViewSet)
router.register(r'admin-accounts', AdminAccountViewSet)
router.register(r'owners', OwnerViewSet)
router.register(r'contact-us', ContactUsViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'terms', TermsViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'route-plans', RoutePlanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
