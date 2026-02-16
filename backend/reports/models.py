from django.db import models
from students.models import Student

class CertificateTemplate(models.Model):
    CERTIFICATE_TYPES = [
        ('bonafide', 'Bonafide Certificate'),
        ('transfer', 'Transfer Certificate'),
        ('character', 'Character Certificate'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CERTIFICATE_TYPES)
    template_content = models.TextField(help_text="HTML content with placeholders like {{student_name}}")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

class IssuedCertificate(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='certificates')
    template = models.ForeignKey(CertificateTemplate, on_delete=models.PROTECT)
    issued_date = models.DateField(auto_now_add=True)
    certificate_number = models.CharField(max_length=50, unique=True)
    generated_file = models.FileField(upload_to='certificates/', blank=True, null=True)

    def __str__(self):
        return f"{self.certificate_number} - {self.student}"
