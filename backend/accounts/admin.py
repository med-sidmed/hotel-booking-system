from django.contrib import admin
from .models import User, Notification, Conversation, Message, Invitation

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active')
    search_fields = ('email', 'name')
    readonly_fields = ('id', 'created_at', 'updated_at')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'read', 'created_at')
    list_filter = ('type', 'read')
    raw_id_fields = ('user',)

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'updated_at')
    filter_horizontal = ('participants',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'created_at')
    raw_id_fields = ('sender', 'conversation')

@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('email', 'role', 'used', 'expires_at', 'created_at')
    list_filter = ('role', 'used')
    search_fields = ('email',)

