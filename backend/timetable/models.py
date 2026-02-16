from django.db import models
from students.models import Class, Section, Subject
from school_admin.models import Teacher

class Period(models.Model):
    name = models.CharField(max_length=50) # e.g. "Period 1"
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_break = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')})"

class TeacherAllocation(models.Model):
    """
    Allocates a teacher to a subject for a specific class-section.
    Basically says: "Mr. Smith teaches Math to Class 10-A"
    """
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE, verbose_name="Class")
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('teacher', 'subject', 'class_obj', 'section')

    def __str__(self):
        return f"{self.teacher} - {self.subject} ({self.class_obj} {self.section})"

class TimeTableEntry(models.Model):
    DAYS_OF_WEEK = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )

    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE, verbose_name="Class")
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    day = models.IntegerField(choices=DAYS_OF_WEEK)
    period = models.ForeignKey(Period, on_delete=models.CASCADE)
    
    # Ideally, we pick from allocations, but for flexibility we link directly too
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        unique_together = ('class_obj', 'section', 'day', 'period')
        verbose_name_plural = "Time Table Entries"

    def __str__(self):
        return f"{self.get_day_display()} - {self.period} - {self.subject}"
