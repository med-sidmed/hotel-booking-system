from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Notification, Conversation, Message, Invitation
from .serializers import (
    UserSerializer, RegisterSerializer, 
    NotificationSerializer, ConversationSerializer, MessageSerializer,
    InvitationSerializer, AuditLogSerializer, SettingSerializer
)
from .models import User, Notification, Conversation, Message, Invitation, AuditLog, Setting
from .permissions import IsAdmin

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        return {
            'token': data['access'],
            'refresh': data['refresh']
        }

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Successfully logged out from DB"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token or already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().filter(read=False).update(read=True)
        return Response({'status': 'all notifications marked as read'})

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Conversation.objects.all()
        return Conversation.objects.filter(participants=user)

    def perform_create(self, serializer):
        participants_ids = self.request.data.get('participants_ids', [])
        # Ensure the current user is a participant
        if self.request.user.id not in participants_ids:
            participants_ids.append(self.request.user.id)
        instance = serializer.save()
        instance.participants.add(*participants_ids)

    @action(detail=True, methods=['post'])
    def mark_all_read(self, request, pk=None):
        conversation = self.get_object()
        conversation.messages.exclude(sender=request.user).update(read=True)
        return Response({'status': 'all messages marked as read'})

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(conversation__participants=self.request.user)

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        # Update conversation timestamp to float it to the top
        message.conversation.save()
        
        # Create notification for other participants
        other_participants = message.conversation.participants.exclude(id=self.request.user.id)
        for participant in other_participants:
            Notification.objects.create(
                user=participant,
                type=Notification.NotificationType.MESSAGE,
                title=f"Nouveau message de {self.request.user.name}",
                message=message.content[:100],
                action_url=f"/profile/messages?conversation={message.conversation.id}"
            )

    @action(detail=True, methods=['patch'])
    def read(self, request, pk=None):
        message = self.get_object()
        if message.sender != self.request.user:
            message.read = True
            message.save()
            return Response({'status': 'message marked as read'})
        return Response({'status': 'cannot mark own message as read'}, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        # Allow filtering by role if needed
        role = self.request.query_params.get('role')
        if role:
            return self.queryset.filter(role=role)
        return self.queryset

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAdmin]

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def validate(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Token requis'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            invitation = Invitation.objects.get(token=token, used=False)
            if invitation.expires_at and invitation.expires_at < timezone.now():
                return Response({'error': 'Invitation expirée'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(InvitationSerializer(invitation).data)
        except (Invitation.DoesNotExist, ValueError, ValidationError):
            return Response({'error': 'Invitation invalide ou déjà utilisée'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def mark_used(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token requis'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            invitation = Invitation.objects.get(token=token, used=False)
            invitation.mark_as_used()
            return Response({'status': 'invitation marquée comme utilisée'})
        except (Invitation.DoesNotExist, ValueError):
            return Response({'error': 'Invitation invalide'}, status=status.HTTP_404_NOT_FOUND)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        if category:
            return self.queryset.filter(category=category)
        return self.queryset


class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'key'


