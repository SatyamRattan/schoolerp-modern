from django.contrib import admin
from .models import FeesHeadGroup, FeesHead, FeesPlanCategory, FeesPlan

admin.site.register(FeesHeadGroup)
admin.site.register(FeesHead)
admin.site.register(FeesPlanCategory)
admin.site.register(FeesPlan)
