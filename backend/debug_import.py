
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hotelbooking.settings')
django.setup()

try:
    from accounts.models import Invitation
    print("Invitation model imported successfully")
except Exception as e:
    print(f"Error importing Invitation model: {e}")
    import traceback
    traceback.print_exc()
