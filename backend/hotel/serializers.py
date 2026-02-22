from rest_framework import serializers
from .models import Hotel, Room, Booking, Review, PricingRule, Promotion, Transaction
from accounts.serializers import UserSerializer

class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

class RoomSerializer(serializers.ModelSerializer):
    pricing_rules = PricingRuleSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'verified')

class HotelSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Hotel
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'rating', 'reviews_count')

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    room_details = RoomSerializer(source='room', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'total_price')

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'used_count')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('id', 'created_at')
