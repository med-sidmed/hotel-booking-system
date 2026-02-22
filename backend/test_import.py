import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hotelbooking.settings')
try:
    django.setup()
    from accounts.models import User
    print("User import success")
except Exception:
    traceback.print_exc()
