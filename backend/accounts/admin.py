from django.contrib import admin
from .models import AccountGroup, Account, Journal, Contra, Receipt, Payment, DebitNote, CreditNote, BillSundry

admin.site.register(AccountGroup)
admin.site.register(Account)
admin.site.register(Journal)
admin.site.register(Contra)
admin.site.register(Receipt)
admin.site.register(Payment)
admin.site.register(DebitNote)
admin.site.register(CreditNote)
admin.site.register(BillSundry)
