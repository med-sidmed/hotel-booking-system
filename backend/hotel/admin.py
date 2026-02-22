from django.contrib import admin
from .models import (
    Hotel,
    Room,
    PricingRule,
    Booking,
    Transaction,
    Promotion,
    Review,
)


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'owner', 'rating', 'price_per_night', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('name', 'location', 'description')
    raw_id_fields = ('owner',)
    readonly_fields = ('id', 'created_at', 'updated_at')


class RoomInline(admin.TabularInline):
    model = Room
    extra = 0
    show_change_link = True


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('type', 'hotel', 'price', 'capacity', 'available', 'created_at')
    list_filter = ('available', 'hotel')
    search_fields = ('type', 'description')
    raw_id_fields = ('hotel',)
    readonly_fields = ('id', 'created_at', 'updated_at')


class PricingRuleInline(admin.TabularInline):
    model = PricingRule
    extra = 0


@admin.register(PricingRule)
class PricingRuleAdmin(admin.ModelAdmin):
    list_display = ('room', 'season_type', 'start_date', 'end_date', 'price_modifier', 'created_at')
    list_filter = ('season_type',)
    raw_id_fields = ('room',)
    readonly_fields = ('id', 'created_at')


class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0
    readonly_fields = ('id', 'created_at')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('room', 'user', 'check_in', 'check_out', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'room__hotel__name')
    raw_id_fields = ('user', 'room', 'promotion')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = (TransactionInline,)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('booking', 'user', 'amount', 'currency', 'method', 'status', 'payment_type', 'created_at')
    list_filter = ('status', 'currency', 'method', 'payment_type')
    raw_id_fields = ('user', 'booking')
    readonly_fields = ('id', 'created_at')


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'discount_type', 'discount_value', 'valid_from', 'valid_until', 'active', 'used_count')
    list_filter = ('active', 'discount_type')
    search_fields = ('code', 'title')
    readonly_fields = ('id', 'used_count', 'created_at')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'user', 'rating', 'verified', 'created_at')
    list_filter = ('rating', 'verified')
    search_fields = ('comment', 'hotel__name')
    raw_id_fields = ('hotel', 'user')
    readonly_fields = ('id', 'created_at', 'updated_at')
