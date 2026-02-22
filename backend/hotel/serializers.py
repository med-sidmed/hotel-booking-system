from rest_framework import serializers
from .models import (
    Hotel,
    Room,
    PricingRule,
    Booking,
    Transaction,
    Promotion,
    Review,
    Favorite,
)


class HotelListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hotel
        fields = [
            'id', 'name', 'location', 'description', 'rating', 'reviews_count',
            'images', 'price_per_night', 'amenities', 'phone', 'email', 'website',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'rating', 'reviews_count', 'created_at', 'updated_at']


class HotelDetailSerializer(serializers.ModelSerializer):

    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Hotel
        fields = [
            'id', 'name', 'location', 'description', 'rating', 'reviews_count',
            'images', 'price_per_night', 'amenities', 'phone', 'email', 'website',
            'owner', 'owner_email', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'rating', 'reviews_count', 'created_at', 'updated_at']


class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = [
            'id', 'hotel', 'type', 'description', 'price', 'capacity',
            'amenities', 'images', 'available', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RoomListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = [
            'id', 'type', 'description', 'price', 'capacity',
            'amenities', 'images', 'available', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = [
            'id', 'room', 'season_type', 'start_date', 'end_date',
            'price_modifier', 'day_of_week', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class BookingSerializer(serializers.ModelSerializer):
    guest_name = serializers.SerializerMethodField()
    hotel_name = serializers.SerializerMethodField()
    room_type_name = serializers.SerializerMethodField()

    hotel_id = serializers.ReadOnlyField(source='room.hotel_id')

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'guest_name', 'room', 'hotel_id', 'hotel_name', 'room_type_name',
            'check_in', 'check_out', 'total_price',
            'status', 'payment_status', 'transaction_id', 'promotion', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'total_price', 'status', 'created_at', 'updated_at']

    def get_guest_name(self, obj):
        try:
            return obj.user.name if obj.user else "N/A"
        except:
            return "N/A"

    def get_hotel_name(self, obj):
        try:
            return obj.room.hotel.name if obj.room and obj.room.hotel else "N/A"
        except:
            return "N/A"

    def get_room_type_name(self, obj):
        try:
            return obj.room.type if obj.room else "N/A"
        except:
            return "N/A"


class BookingCreateSerializer(serializers.ModelSerializer):
    promotion = serializers.SlugRelatedField(
        slug_field='code',
        queryset=Promotion.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Booking
        fields = ['id', 'room', 'check_in', 'check_out', 'promotion', 'payment_status', 'transaction_id']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'booking', 'amount', 'currency', 'method',
            'status', 'payment_type', 'invoice_url', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PromotionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion
        fields = [
            'id', 'code', 'title', 'description', 'discount_type', 'discount_value',
            'valid_from', 'valid_until', 'min_purchase', 'max_discount',
            'usage_limit', 'used_count', 'active', 'created_at',
        ]
        read_only_fields = ['id', 'used_count', 'created_at']


class PromotionValidateSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)


class ReviewSerializer(serializers.ModelSerializer):

    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Review
        fields = [
            'id', 'hotel', 'user', 'user_name', 'user_email', 'rating', 'comment', 'photos',
            'owner_response', 'verified', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'owner_response', 'verified', 'created_at', 'updated_at']


class ReviewCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = ['id', 'hotel', 'rating', 'comment', 'photos']


class ReviewReplySerializer(serializers.Serializer):
    text = serializers.CharField(max_length=2000)


class FavoriteSerializer(serializers.ModelSerializer):
    hotel_details = HotelListSerializer(source='hotel', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'hotel', 'hotel_details', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
