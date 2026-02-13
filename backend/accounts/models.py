from django.db import models

class AccountGroup(models.Model):
    account_group_name = models.CharField(max_length=35)

    def __str__(self):
        return self.account_group_name

class Account(models.Model):
    account_name = models.CharField(max_length=20)
    print_name = models.TextField()
    group_acc = models.CharField(max_length=15) # This should ideally be a ForeignKey to AccountGroup
    op_bal = models.IntegerField()
    dr_cr = models.CharField(max_length=20)
    address = models.TextField()
    address1 = models.TextField()
    city = models.CharField(max_length=15)
    state = models.CharField(max_length=25)
    email = models.EmailField(max_length=60)
    phone = models.CharField(max_length=15) # Changed from int to CharField
    mobile = models.CharField(max_length=15) # Changed from int to CharField
    contact_per = models.CharField(max_length=20)
    birthday_on = models.DateField(null=True, blank=True)
    anniv_on = models.DateField(null=True, blank=True)
    bank_name = models.TextField()
    bank_acc_no = models.CharField(max_length=20) # Changed from int to CharField
    cheque_p_name = models.TextField()

    def __str__(self):
        return self.account_name

class Journal(models.Model):
    date = models.DateField()
    voucher_no = models.IntegerField()
    d_c = models.CharField(max_length=5)
    account_name = models.CharField(max_length=50)
    amount = models.IntegerField()
    short_narration = models.TextField()

class Contra(models.Model):
    date = models.DateField()
    voucher_no = models.IntegerField()
    d_c = models.CharField(max_length=5)
    account_name = models.CharField(max_length=50)
    amount = models.IntegerField()
    short_narration = models.TextField()

class Receipt(models.Model):
    date = models.DateField()
    vch_no = models.IntegerField()
    d_c = models.CharField(max_length=5)
    account_name = models.CharField(max_length=20)
    amount = models.IntegerField()
    short_narration = models.TextField()

class Payment(models.Model):
    date = models.DateField()
    vch_no = models.IntegerField()
    d_c = models.IntegerField()
    account_name = models.CharField(max_length=50)
    amount = models.IntegerField()
    short_narration = models.TextField()

class DebitNote(models.Model):
    date = models.DateField()
    voucher_no = models.IntegerField()
    d_c = models.CharField(max_length=5)
    account_name = models.CharField(max_length=100)
    amount = models.IntegerField()
    short_narration = models.TextField()

class CreditNote(models.Model):
    date = models.DateField()
    voucher_no = models.IntegerField()
    d_c = models.CharField(max_length=5)
    account_name = models.CharField(max_length=100)
    amount = models.IntegerField()
    short_narration = models.TextField()

class BillSundry(models.Model):
    charge_head = models.CharField(max_length=100)
    account = models.CharField(max_length=100)
    type = models.CharField(max_length=10)

    def __str__(self):
        return self.charge_head
