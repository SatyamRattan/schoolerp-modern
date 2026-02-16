from django.db import models
from django.conf import settings

class Event(models.Model):
    EVENT_TYPES = [
        ('holiday', 'Holiday'),
        ('event', 'School Event'),
        ('exam', 'Examination'),
        ('meeting', 'Meeting'),
        ('other', 'Other'),
    ]
    
    AUDIENCE_TYPES = [
        ('all', 'All'),
        ('students', 'Students'),
        ('staff', 'Staff'),
        ('parents', 'Parents'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other')
    audience = models.CharField(max_length=20, choices=AUDIENCE_TYPES, default='all')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='calendar_events')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['start_date']
