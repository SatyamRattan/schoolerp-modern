from django.db import models

class OrganisationInfo(models.Model):
    name = models.CharField(max_length=100)
    # ...

class AcademicYear(models.Model):
    name = models.CharField(max_length=20) # e.g. 2023-2024
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    address_1 = models.CharField(max_length=100)
    address_2 = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=25)
    phone_no = models.CharField(max_length=15)
    fax_no = models.CharField(max_length=15, blank=True)
    mobile = models.CharField(max_length=15)
    email = models.EmailField(max_length=50)
    password = models.TextField() # Should be hashed
    website = models.URLField(max_length=50, blank=True)
    contact_person = models.CharField(max_length=50)
    pan_no = models.CharField(max_length=15, blank=True)
    affiliation = models.TextField(blank=True)
    license_no = models.CharField(max_length=20, blank=True)
    service_tax_no = models.CharField(max_length=20, blank=True)
    session_start = models.DateField()
    session_end = models.DateField()
    dise_code = models.IntegerField(null=True, blank=True)
    school_code = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

class AdminAccount(models.Model):
    admin_email = models.EmailField(max_length=100, unique=True)
    admin_password = models.CharField(max_length=255)
    admin_name = models.TextField()

    def __str__(self):
        return self.admin_name

class Owner(models.Model):
    owner_email = models.EmailField(max_length=50, unique=True)
    owner_pass = models.CharField(max_length=255)

    def __str__(self):
        return self.owner_email

class ContactUs(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    mobile = models.CharField(max_length=15)
    message = models.TextField()

    def __str__(self):
        return self.name

class Feedback(models.Model):
    name = models.CharField(max_length=20)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name

class Terms(models.Model):
    # The SQL for terms was minimal, I'll assume it's for school terms/policies
    term_text = models.TextField()

class Route(models.Model):
    route_name = models.TextField()
    freq = models.CharField(max_length=20)
    january = models.IntegerField(null=True, blank=True)
    february = models.IntegerField(null=True, blank=True)
    march = models.IntegerField(null=True, blank=True)
    april = models.IntegerField(null=True, blank=True)
    may = models.IntegerField(null=True, blank=True)
    june = models.IntegerField(null=True, blank=True)
    july = models.IntegerField(null=True, blank=True)
    august = models.IntegerField(null=True, blank=True)
    september = models.IntegerField(null=True, blank=True)
    october = models.IntegerField(null=True, blank=True)
    november = models.IntegerField(null=True, blank=True)
    december = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.route_name

class RoutePlan(models.Model):
    route_name = models.CharField(max_length=50)
    value = models.IntegerField()

class Teacher(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    qualification = models.CharField(max_length=100, blank=True)
    joining_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name
