from django.contrib.auth.models import User
import sys

username = 'admin'
email = 'admin@example.com'
password = 'admin123'

try:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.save()
    print(f"Password for user '{username}' has been reset to '{password}'.")
except User.DoesNotExist:
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created with password '{password}'.")
except Exception as e:
    print(f"An error occurred: {e}")
    sys.exit(1)
