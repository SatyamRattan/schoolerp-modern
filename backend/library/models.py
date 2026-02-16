from django.db import models
from students.models import Student
from django.utils import timezone
from datetime import timedelta

class BookCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    isbn = models.CharField(max_length=20, blank=True)
    publisher = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(BookCategory, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    available = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    added_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.author})"

class LibraryMember(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='library_member')
    date_joined = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.student)

class BookIssue(models.Model):
    STATUS_CHOICES = (
        ('ISSUED', 'Issued'),
        ('RETURNED', 'Returned'),
        ('OVERDUE', 'Overdue'),
    )
    
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    member = models.ForeignKey(LibraryMember, on_delete=models.CASCADE)
    issue_date = models.DateField(default=timezone.now)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    fine_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ISSUED')
    remarks = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.due_date:
            self.due_date = self.issue_date + timedelta(days=14) # Default 2 weeks
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.book.title} - {self.member.student.student_first_name}"
