from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Class, Section, Student

class StudentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='admin', password='adminpassword', email='admin@test.com')
        self.client.force_authenticate(user=self.user)
        
        self.cls = Class.objects.create(class_num=1, prefix='A', start_from='2020-01-01', incharge='Teacher')
        self.sec = Section.objects.create(section_name='A')
        self.student = Student.objects.create(
            student_first_name='John',
            student_last_name='Doe',
            student_class='1',
            student_section='A',
            student_roll_no=1,
            admission_no=101,
            gender='Male',
            student_dob='2010-01-01',
            house_no='123',
            street_name='Test St',
            zip_code='123456',
            city='Test City',
            state='Test State',
            country='Test Country',
            fathers_first_name='Father',
            f_mobile='1234567890',
            mothers_first_name='Mother',
            m_mobile='0987654321',
            year='2023-01-01',
            status='active',
            marks=100,
            admission_form_no=1,
            date_admission='2023-01-01'
        )

    def test_get_classes(self):
        url = reverse('class-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_sections(self):
        url = reverse('section-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_students(self):
        url = reverse('student-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['student_first_name'], 'John')
