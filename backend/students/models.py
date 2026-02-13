from django.db import models

class Class(models.Model):
    class_num = models.IntegerField() # 'class' is a reserved keyword in Python
    prefix = models.CharField(max_length=5, blank=True)
    start_from = models.DateField()
    incharge = models.CharField(max_length=25, blank=True)

    def __str__(self):
        return str(self.class_num)

class Section(models.Model):
    section_name = models.CharField(max_length=5)

    def __str__(self):
        return self.section_name

class Caste(models.Model):
    caste_name = models.CharField(max_length=20)

    def __str__(self):
        return self.caste_name

class Category(models.Model):
    category_name = models.CharField(max_length=10)

    def __str__(self):
        return self.category_name

class House(models.Model):
    house_name = models.CharField(max_length=30)

    def __str__(self):
        return self.house_name

class Family(models.Model):
    family_name = models.CharField(max_length=20)

    def __str__(self):
        return self.family_name

class Student(models.Model):
    student_first_name = models.CharField(max_length=20)
    student_middle_name = models.CharField(max_length=20, blank=True)
    student_last_name = models.CharField(max_length=20, blank=True)
    student_class = models.CharField(max_length=10) # Should be FK to Class
    student_section = models.CharField(max_length=5) # Should be FK to Section
    student_roll_no = models.IntegerField()
    route = models.CharField(max_length=20, null=True, blank=True)
    caste = models.CharField(max_length=10) # Should be FK to Caste
    category = models.CharField(max_length=10) # Should be FK to Category
    house = models.CharField(max_length=10) # Should be FK to House
    student_photo = models.ImageField(upload_to='students/', null=True, blank=True)
    admission_no = models.IntegerField()
    gender = models.CharField(max_length=10)
    student_dob = models.DateField()
    house_no = models.CharField(max_length=10)
    street_name = models.CharField(max_length=50)
    other_info = models.CharField(max_length=60, blank=True)
    zip_code = models.CharField(max_length=10)
    city = models.CharField(max_length=20)
    state = models.CharField(max_length=20)
    country = models.CharField(max_length=20)
    fathers_first_name = models.CharField(max_length=20)
    fathers_middle_name = models.CharField(max_length=20, blank=True)
    fathers_last_name = models.CharField(max_length=25, blank=True)
    f_mobile = models.CharField(max_length=15)
    f_qual = models.CharField(max_length=15, blank=True)
    f_occu = models.CharField(max_length=15, blank=True)
    f_dob = models.DateField(null=True, blank=True)
    f_photo = models.ImageField(upload_to='fathers/', null=True, blank=True)
    mothers_first_name = models.CharField(max_length=20)
    mothers_middle_name = models.CharField(max_length=15, blank=True)
    mothers_last_name = models.CharField(max_length=20, blank=True)
    m_mobile = models.CharField(max_length=15)
    m_qual = models.CharField(max_length=15, blank=True)
    m_occu = models.CharField(max_length=15, blank=True)
    m_dob = models.DateField(null=True, blank=True)
    m_photo = models.ImageField(upload_to='mothers/', null=True, blank=True)
    parents_wedding_date = models.DateField(null=True, blank=True)
    las = models.CharField(max_length=50, blank=True) # Last School attended?
    remarks = models.CharField(max_length=30, blank=True)
    last_exam_given = models.CharField(max_length=20, blank=True)
    year = models.DateField()
    status = models.CharField(max_length=10)
    marks = models.IntegerField()
    board = models.CharField(max_length=10, blank=True)
    bg = models.CharField(max_length=5, blank=True) # Blood Group
    vl = models.IntegerField(default=0)
    vr = models.IntegerField(default=0)
    height = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)
    dental_hy = models.CharField(max_length=20, blank=True)
    tc = models.BooleanField(default=False)
    cc = models.BooleanField(default=False)
    report_cc = models.BooleanField(default=False)
    dob_certificate = models.BooleanField(default=False)
    admission_form_no = models.IntegerField()
    date_admission = models.DateField()
    ledger_balance = models.IntegerField(default=0)
    fees_balance = models.IntegerField(default=0)
    comments = models.CharField(max_length=50, blank=True)
    hostel_room_no = models.CharField(max_length=5, blank=True)
    bed_no = models.IntegerField(default=0)
    scholarship_no = models.IntegerField(default=0)
    aadhar_uid = models.CharField(max_length=20, blank=True)
    family = models.CharField(max_length=20, blank=True)
    status_adm = models.CharField(max_length=10, blank=True)
    discontinue_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.student_first_name} {self.student_last_name} ({self.admission_no})"

class GatePass(models.Model):
    name = models.CharField(max_length=30)
    photo = models.ImageField(upload_to='gatepass/', null=True, blank=True)
    profession = models.CharField(max_length=30)
    address = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=15)
    purpose = models.TextField()
    date_of_visit = models.DateField()
    time_of_visit = models.DateTimeField(auto_now_add=True)
    expected_return_date = models.DateField()
    expected_return_time = models.DateTimeField()
    proof_of_identity = models.TextField()
    items_retained = models.TextField()

class StudentLeavingCertificate(models.Model):
    name = models.CharField(max_length=50)
    f_name = models.CharField(max_length=50)
    m_name = models.CharField(max_length=50)
    # Adding more fields if needed based on SQL, but the SQL snippet was truncated.
    # I'll keep it basic for now or check the full schema.

class Assessment(models.Model):
    assessment_name = models.CharField(max_length=200)

    def __str__(self):
        return self.assessment_name

class Subject(models.Model):
    subject_name = models.CharField(max_length=100)

    def __str__(self):
        return self.subject_name

class Term(models.Model):
    term_name = models.CharField(max_length=50)

    def __str__(self):
        return self.term_name
