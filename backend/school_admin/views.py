from rest_framework import viewsets
from .models import OrganisationInfo, AdminAccount, Owner, ContactUs, Feedback, Terms, Route, RoutePlan
from .serializers import (
    OrganisationInfoSerializer, AdminAccountSerializer, OwnerSerializer, 
    ContactUsSerializer, FeedbackSerializer, TermsSerializer, 
    RouteSerializer, RoutePlanSerializer
)

class OrganisationInfoViewSet(viewsets.ModelViewSet):
    queryset = OrganisationInfo.objects.all()
    serializer_class = OrganisationInfoSerializer

class AdminAccountViewSet(viewsets.ModelViewSet):
    queryset = AdminAccount.objects.all()
    serializer_class = AdminAccountSerializer

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer

class ContactUsViewSet(viewsets.ModelViewSet):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class TermsViewSet(viewsets.ModelViewSet):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class RoutePlanViewSet(viewsets.ModelViewSet):
    queryset = RoutePlan.objects.all()
    serializer_class = RoutePlanSerializer
