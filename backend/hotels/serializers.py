"""Serializers pour l'API hotels."""
from rest_framework import serializers
from .models import (
    Hotel,
    Room,
    PricingRule,
    Booking,
    Transaction,
    Promotion,
    Review,
)


class HotelListSerializer(serializers.ModelSerializer):
    """Liste des hôtels (champs publics)."""

    class Meta:
        model = Hotel
        fields = [
            'id', 'name', 'location', 'description', 'rating', 'reviews_count',
            'images', 'price_per_night', 'amenities', 'phone', 'email', 'website',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'rating', 'reviews_count', 'created_at', 'updated_at']


class HotelDetailSerializer(serializers.ModelSerializer):
    """Détail d'un hôtel (inclut owner en lecture)."""

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
    """Chambre (liste et détail)."""

    class Meta:
        model = Room
        fields = [
            'id', 'hotel', 'type', 'description', 'price', 'capacity',
            'amenities', 'images', 'available', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RoomListSerializer(serializers.ModelSerializer):
    """Chambre en liste (sans hotel pour les listes sous /hotels/{id}/rooms/)."""

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
    """Réservation."""

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'room', 'check_in', 'check_out', 'total_price',
            'status', 'promotion', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'total_price', 'status', 'created_at', 'updated_at']


class BookingCreateSerializer(serializers.ModelSerializer):
    """Création d'une réservation (client : user = request.user)."""

    class Meta:
        model = Booking
        fields = ['id', 'room', 'check_in', 'check_out', 'promotion']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'booking', 'amount', 'currency', 'method',
            'status', 'payment_type', 'invoice_url', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PromotionSerializer(serializers.ModelSerializer):
    """Promotion (liste / détail)."""

    class Meta:
        model = Promotion
        fields = [
            'id', 'code', 'title', 'description', 'discount_type', 'discount_value',
            'valid_from', 'valid_until', 'min_purchase', 'max_discount',
            'usage_limit', 'used_count', 'active', 'created_at',
        ]
        read_only_fields = ['id', 'used_count', 'created_at']


class PromotionValidateSerializer(serializers.Serializer):
    """Payload pour validation d'un code promo."""
    code = serializers.CharField(max_length=50)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)


class ReviewSerializer(serializers.ModelSerializer):
    """Avis sur un hôtel."""

    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'hotel', 'user', 'user_email', 'rating', 'comment', 'photos',
            'owner_response', 'verified', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'owner_response', 'verified', 'created_at', 'updated_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Création d'un avis (après séjour)."""

    class Meta:
        model = Review
        fields = ['id', 'hotel', 'rating', 'comment', 'photos']


class ReviewReplySerializer(serializers.Serializer):
    """Réponse du propriétaire à un avis."""
    text = serializers.CharField(max_length=2000)
