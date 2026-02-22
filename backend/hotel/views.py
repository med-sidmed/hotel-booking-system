from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Hotel, Room, Booking, Review, PricingRule, Promotion, Transaction
from .serializers import (
    HotelSerializer, RoomSerializer, BookingSerializer, 
    ReviewSerializer, PricingRuleSerializer, PromotionSerializer, TransactionSerializer
)
from accounts.permissions import IsHotelOwner, IsBookingOwner, IsAdmin, IsOwner

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location', 'rating']
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['price_per_night', 'rating', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action in ['create']:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.IsAuthenticated(), IsHotelOwner()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        hotel_id = self.request.query_params.get('hotel_id')
        if hotel_id:
            return Room.objects.filter(hotel_id=hotel_id)
        return super().get_queryset()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsHotelOwner()]

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        # Owners see bookings for their hotels, users see their own bookings
        if self.request.user.role == 'owner':
            return Booking.objects.filter(room__hotel__owner=self.request.user)
        return Booking.objects.filter(user=self.request.user)

    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsBookingOwner()]

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']
        promo_code = self.request.data.get('promo_code')
        
        # Base Price Calculation
        nights = (check_out - check_in).days
        total_price = room.price * nights
        
        # Apply Promotion if any
        if promo_code:
            try:
                promo = Promotion.objects.get(code=promo_code, active=True, valid_from__lte=timezone.now(), valid_until__gte=timezone.now())
                if promo.discount_type == 'PERCENTAGE':
                    total_price -= (total_price * (promo.discount_value / 100))
                else:
                    total_price -= promo.discount_value
            except Promotion.DoesNotExist:
                pass # Invalid or expired promo
        
        serializer.save(user=self.request.user, total_price=total_price)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        hotel_id = self.request.query_params.get('hotel_id')
        if hotel_id:
            return Review.objects.filter(hotel_id=hotel_id)
        return Review.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        # Only admin or the reviewer can edit/delete
        return [permissions.IsAuthenticated(), IsBookingOwner()] # Reusing logic: user who wrote it

    def perform_create(self, serializer):
        # Auto-verify if user has a completed booking
        user = self.request.user
        hotel = serializer.validated_data['hotel']
        has_stayed = Booking.objects.filter(user=user, room__hotel=hotel, status='COMPLETED').exists()
        serializer.save(user=user, verified=has_stayed)

class PricingRuleViewSet(viewsets.ModelViewSet):
    queryset = PricingRule.objects.all()
    serializer_class = PricingRuleSerializer
    
    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsHotelOwner()]

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdmin()]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Transaction.objects.all()
        return Transaction.objects.filter(user=self.request.user)
    
    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsBookingOwner()]
