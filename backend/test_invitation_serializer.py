
import os
import django
from rest_framework import serializers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hotelbooking.settings')
django.setup()

from accounts.serializers import InvitationSerializer
from accounts.models import Invitation

data = {
    "email": "test_invite@example.com",
    "role": "owner",
    "expires_at": "2026-12-31T23:59:59Z"
}

serializer = InvitationSerializer(data=data)
if serializer.is_valid():
    print("Serializer is valid")
else:
    print(f"Serializer errors: {serializer.errors}")
