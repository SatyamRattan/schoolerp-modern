from django.contrib import admin
from .models import OrganisationInfo, AdminAccount, Owner, ContactUs, Feedback, Terms, Route, RoutePlan, AcademicYear

admin.site.register(AcademicYear)

admin.site.register(OrganisationInfo)
admin.site.register(AdminAccount)
admin.site.register(Owner)
admin.site.register(ContactUs)
admin.site.register(Feedback)
admin.site.register(Terms)
admin.site.register(Route)
admin.site.register(RoutePlan)
