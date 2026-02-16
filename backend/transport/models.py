from django.db import models
from students.models import Student

class Vehicle(models.Model):
    registration_number = models.CharField(max_length=20, unique=True)
    driver_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    capacity = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.registration_number} ({self.driver_name})"

class Route(models.Model):
    name = models.CharField(max_length=100)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='routes')
    start_point = models.CharField(max_length=100)
    end_point = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Stop(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='stops')
    name = models.CharField(max_length=100)
    pickup_time = models.TimeField()
    drop_time = models.TimeField(null=True, blank=True)
    fare = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'pickup_time']

    def __str__(self):
        return f"{self.name} ({self.route.name})"

class TransportAllocation(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='transport_allocation')
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name='student_allocations')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student} - {self.stop}"
