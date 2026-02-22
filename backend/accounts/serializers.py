from rest_framework import serializers
from .models import User, Notification, Conversation, Message, Invitation, AuditLog, Setting

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'name', 'role', 'phone', 
            'address', 'avatar', 'dob', 'preferences',
            'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'email', 'role', 'is_active', 'created_at', 'updated_at')

    def get_role(self, obj):
        return obj.role.upper() if obj.role else None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'name', 'password', 'role', 'invitation_token')
        extra_kwargs = {'invitation_token': {'write_only': True, 'required': False}}

    invitation_token = serializers.CharField(write_only=True, required=False)

    def create(self, validated_data):
        print(f"Registration creation attempt: {validated_data}")
        token = validated_data.pop('invitation_token', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data.get('role', User.UserRole.USER)
        )
        
        if token and user.role == 'owner':
            try:
                invitation = Invitation.objects.get(token=token, used=False)
                if invitation.hotel_name:
                    from hotel.models import Hotel
                    Hotel.objects.create(
                        name=invitation.hotel_name,
                        owner=user,
                        location="À définir"
                    )
            except Exception as e:
                print(f"Failed to create hotel for new owner: {e}")
                
        return user

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'sender_name', 'content', 'read', 'created_at')
        read_only_fields = ('id', 'created_at', 'sender')

class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    participants = UserSerializer(many=True, read_only=True)
    unread_count = serializers.SerializerMethodField()
    hotel_details = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ('id', 'participants', 'hotel_id', 'hotel_details', 'last_message', 'unread_count', 'created_at', 'updated_at')

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'id': last_msg.id,
                'content': last_msg.content,
                'sender_id': last_msg.sender_id,
                'sender_name': last_msg.sender.name,
                'created_at': last_msg.created_at
            }
        return None

    def get_unread_count(self, obj):
        user = self.context['request'].user
        if user.is_anonymous: return 0
        return obj.messages.filter(read=False).exclude(sender=user).count()

    def get_hotel_details(self, obj):
        if not obj.hotel_id:
            return None
        from hotel.models import Hotel
        try:
            hotel = Hotel.objects.get(id=obj.hotel_id)
            return {
                'id': hotel.id,
                'name': hotel.name,
                'location': hotel.location,
                'image': hotel.images[0] if hotel.images else None
            }
        except:
            return None

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ('id', 'email', 'token', 'role', 'used', 'created_at', 'expires_at', 'hotel_name')
        read_only_fields = ('id', 'token', 'created_at', 'used')


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ['key', 'value', 'description', 'updated_at']


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'user_name', 'user_role',
            'action', 'category', 'details', 'ip_address', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


