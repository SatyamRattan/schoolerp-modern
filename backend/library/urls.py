from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookCategoryViewSet, BookViewSet, 
    LibraryMemberViewSet, BookIssueViewSet
)

router = DefaultRouter()
router.register(r'categories', BookCategoryViewSet)
router.register(r'books', BookViewSet)
router.register(r'members', LibraryMemberViewSet)
router.register(r'issues', BookIssueViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
