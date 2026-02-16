from django.db import models
from students.models import Student, Section, Subject, Term
from school_admin.models import AcademicYear

class ExamType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Grade(models.Model):
    name = models.CharField(max_length=50)  # A+, A, B
    min_marks = models.DecimalField(max_digits=5, decimal_places=2)
    max_marks = models.DecimalField(max_digits=5, decimal_places=2)
    grade_point = models.DecimalField(max_digits=4, decimal_places=2)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.min_marks}-{self.max_marks})"

class Exam(models.Model):
    name = models.CharField(max_length=200)
    exam_type = models.ForeignKey(ExamType, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    result_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.academic_year})"

class ExamSchedule(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='schedules')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE) # Or Class/Grade level? Usually exams are per class/section or just class. Let's link to Section for granularity, or maybe Class if all sections have same exam.
    # Actually, simpler to link to Class (StudentClass or similar).
    # But Section links to Class.
    # Let's check Student model relations.
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_marks = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    passing_marks = models.DecimalField(max_digits=5, decimal_places=2, default=33.00)
    room_no = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.exam.name} - {self.subject.name} ({self.date})"

class StudentExamRegistration(models.Model):
    """
    Optional: If students need to register for exams.
    Otherwise, all students in the section are assumed to take it.
    Use this for hall tickets or specific enrollment.
    """
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=50, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['exam', 'student']

class Marks(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='exam_marks')
    exam_schedule = models.ForeignKey(ExamSchedule, on_delete=models.CASCADE, related_name='marks')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    is_absent = models.BooleanField(default=False)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'exam_schedule']
        verbose_name_plural = "Marks"

    def __str__(self):
        return f"{self.student} - {self.exam_schedule} : {self.marks_obtained}"
