from rest_framework import serializers
from .models import (
    Student, Class, Section, Caste, Category, House, Family, 
    GatePass, StudentLeavingCertificate, Assessment, Subject, Term
)

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class CasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caste
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = '__all__'

class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class AdmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'id', 'student_first_name', 'student_last_name', 'student_dob', 'gender',
            'student_class', 'student_section', 
            'fathers_first_name', 'f_mobile', 'mothers_first_name', 'm_mobile',
            'house_no', 'street_name', 'city', 'state', 'zip_code', 'country',
            'caste', 'category', 'house', 'year', 'admission_form_no',
            'status_adm', 'student_photo'
        ]
        read_only_fields = ['status_adm', 'student_photo'] # Photo upload later?

    def create(self, validated_data):
        # Set defaults for required fields not in form
        validated_data['status_adm'] = 'APPLIED'
        validated_data['status'] = 'INACTIVE' # Assuming status means active student
        validated_data['marks'] = 0
        validated_data['vl'] = 0
        validated_data['vr'] = 0
        validated_data['height'] = 0
        validated_data['weight'] = 0
        validated_data['ledger_balance'] = 0
        validated_data['fees_balance'] = 0
        
        # Temp values for required fields
        # These should ideally be generated or handled better
        if 'student_roll_no' not in validated_data:
            validated_data['student_roll_no'] = 0 
        if 'admission_no' not in validated_data:
            import random
            validated_data['admission_no'] = random.randint(10000, 99999) # Temporary
        if 'date_admission' not in validated_data:
            from django.utils import timezone
            validated_data['date_admission'] = timezone.now().date()
            
        return super().create(validated_data)

class GatePassSerializer(serializers.ModelSerializer):
    class Meta:
        model = GatePass
        fields = '__all__'

class StudentLeavingCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLeavingCertificate
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        fields = '__all__'
