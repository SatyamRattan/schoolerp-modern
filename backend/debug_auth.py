from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import django

django.setup()

try:
    user = User.objects.get(username='admin')
    is_active = user.is_active
    auth_result = authenticate(username='admin', password='admin123')
    print(f"User: {user.username}")
    print(f"Is Active: {is_active}")
    print(f"Password Check: {'SUCCESS' if auth_result else 'FAILED'}")
    
    if not auth_result:
        print("Detailed Check:")
        print(f"Has usable password: {user.has_usable_password()}")
        # Check if there are other users
        all_users = User.objects.all().values_list('username', flat=True)
        print(f"Existing Users: {list(all_users)}")
except User.DoesNotExist:
    print("User 'admin' does not exist!")
except Exception as e:
    print(f"An error occurred: {e}")
