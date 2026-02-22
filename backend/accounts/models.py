import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role='user', **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, password, role='admin', **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class UserRole(models.TextChoices):
        ADMIN = 'admin'
        OWNER = 'owner'
        USER = 'user'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    
    role = models.CharField(
        max_length=10,
        choices=UserRole.choices,
        default=UserRole.USER
    )

    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    preferences = models.JSONField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        BOOKING_CONFIRMED = 'BOOKING_CONFIRMED'
        BOOKING_CANCELLED = 'BOOKING_CANCELLED'
        PAYMENT_SUCCESS = 'PAYMENT_SUCCESS'
        REVIEW_REQUEST = 'REVIEW_REQUEST'
        MESSAGE = 'MESSAGE'
        PROMOTION = 'PROMOTION'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NotificationType.choices)
    title = models.CharField(max_length=255)
    message = models.TextField()
    read = models.BooleanField(default=False)
    action_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(User, related_name='conversations')
    hotel_id = models.UUIDField(blank=True, null=True) 
    unread_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Conversation {self.id}"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    read = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender.email} at {self.created_at}"


class Invitation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=10, choices=User.UserRole.choices, default=User.UserRole.USER)
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def validate(self):
        from django.utils import timezone
        if self.expires_at < timezone.now() or self.used:
            return False
        return True

    def mark_as_used(self):
        self.used = True
        self.save()

    def __str__(self):
        return self.email