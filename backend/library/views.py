from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import BookCategory, Book, LibraryMember, BookIssue
from .serializers import (
    BookCategorySerializer, BookSerializer, 
    LibraryMemberSerializer, BookIssueSerializer
)
from students.models import Student

class BookCategoryViewSet(viewsets.ModelViewSet):
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author', 'isbn']

class LibraryMemberViewSet(viewsets.ModelViewSet):
    queryset = LibraryMember.objects.all()
    serializer_class = LibraryMemberSerializer

    @action(detail=False, methods=['post'])
    def sync_students(self, request):
        """Syncs all students to library members"""
        students = Student.objects.all()
        count = 0
        for student in students:
            obj, created = LibraryMember.objects.get_or_create(student=student)
            if created:
                count += 1
        return Response({'status': 'synced', 'added': count})

class BookIssueViewSet(viewsets.ModelViewSet):
    queryset = BookIssue.objects.all()
    serializer_class = BookIssueSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['book__title', 'member__student__student_first_name', 'member__student__admission_no']

    def perform_create(self, serializer):
        book = serializer.validated_data['book']
        book.available -= 1
        book.save()
        serializer.save()

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        issue = self.get_object()
        if issue.status == 'RETURNED':
            return Response({'error': 'Book already returned'}, status=status.HTTP_400_BAD_REQUEST)
        
        issue.return_date = timezone.now().date()
        issue.status = 'RETURNED'
        
        # Calculate Fine (e.g., 5 per day)
        if issue.return_date > issue.due_date:
            overdue_days = (issue.return_date - issue.due_date).days
            issue.fine_amount = overdue_days * 5 # Fixed fine rate for now
            issue.status = 'RETURNED' # Or 'OVERDUE' if fine not paid? Keeping simple.

        issue.save()
        
        # Increase stock
        issue.book.available += 1
        issue.book.save()
        
        return Response(BookIssueSerializer(issue).data)
