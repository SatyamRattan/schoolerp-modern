from django.db import models

class Attendance(models.Model):
    date = models.DateField()
    class_name = models.CharField(max_length=10) # Should be FK to Class
    section = models.CharField(max_length=5) # Should be FK to Section
    student_id = models.IntegerField() # Should be FK to Student
    status = models.CharField(max_length=10) # e.g., P, A, L
