from django.contrib.auth.models import User
import sys

# User 1: admin / admin123
try:
    user = User.objects.get(username='admin')
    user.set_password('admin123')
    user.is_active = True
    user.save()
    print("User 'admin' updated with password 'admin123'")
except User.DoesNotExist:
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("User 'admin' created with password 'admin123'")

# User 2: test / test123
try:
    user = User.objects.get(username='test')
    user.set_password('test123')
    user.is_active = True
    user.save()
    print("User 'test' updated with password 'test123'")
except User.DoesNotExist:
    User.objects.create_user('test', 'test@example.com', 'test123')
    print("User 'test' created with password 'test123'")
