from django.db import models

class FeesHeadGroup(models.Model):
    fees_head_group_name = models.CharField(max_length=25)

    def __str__(self):
        return self.fees_head_group_name

class FeesHead(models.Model):
    fees_heading = models.TextField()
    group_name = models.CharField(max_length=100) # Should be FK to FeesHeadGroup
    account_name = models.CharField(max_length=100) # Should be FK to Account
    frequency = models.CharField(max_length=20)
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
        return self.fees_heading

class FeesPlanCategory(models.Model):
    category_name = models.CharField(max_length=50)

    def __str__(self):
        return self.category_name

class FeesPlan(models.Model):
    fees_heading = models.CharField(max_length=50, null=True, blank=True)
    value = models.IntegerField(null=True, blank=True)
    category = models.CharField(max_length=50, null=True, blank=True)
    class_name = models.CharField(max_length=50, null=True, blank=True)

class FeesReceipt(models.Model):
    date = models.DateField()
    receipt_no = models.IntegerField()
    admission_no = models.IntegerField()
    jan = models.IntegerField(default=0)
    feb = models.IntegerField(default=0)
    mar = models.IntegerField(default=0)
    apr = models.IntegerField(default=0)
    may = models.IntegerField(default=0)
    jun = models.IntegerField(default=0)
    jul = models.IntegerField(default=0)
    aug = models.IntegerField(default=0)
    sep = models.IntegerField(default=0)
    oct = models.IntegerField(default=0)
    nov = models.IntegerField(default=0)
    dece = models.IntegerField(default=0)
