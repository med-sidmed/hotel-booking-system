"""URLs API pour l'app hotel."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    HotelViewSet,
    HotelRoomListCreateView,
    RoomDetailView,
    BookingListCreateView,
    OwnerBookingListView,
    BookingDetailView,
    BookingCancelView,
    BookingStatusView,
    HotelReviewListView,
    ReviewCreateFromBookingView,
    ReviewReplyView,
    PromotionListCreateView,
    PromotionValidateView,
    PricingRuleViewSet,
    TransactionViewSet
)

router = DefaultRouter()
router.register(r'hotels', HotelViewSet, basename='hotel')
router.register(r'pricing-rules', PricingRuleViewSet, basename='pricingrule')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    # Chambres
    path('hotels/<uuid:hotel_id>/rooms/', HotelRoomListCreateView.as_view(), name='hotel-rooms'),
    path('rooms/<uuid:id>/', RoomDetailView.as_view(), name='room-detail'),
    # Réservations
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/owner/', OwnerBookingListView.as_view(), name='booking-owner-list'),
    path('bookings/<uuid:id>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<uuid:id>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),
    path('bookings/<uuid:id>/status/', BookingStatusView.as_view(), name='booking-status'),
    # Avis
    path('hotels/<uuid:hotel_id>/reviews/', HotelReviewListView.as_view(), name='hotel-reviews'),
    path('bookings/<uuid:id>/review/', ReviewCreateFromBookingView.as_view(), name='booking-review'),
    path('reviews/<uuid:id>/reply/', ReviewReplyView.as_view(), name='review-reply'),
    # Promotions
    path('promotions/', PromotionListCreateView.as_view(), name='promotion-list-create'),
    path('promotions/validate/', PromotionValidateView.as_view(), name='promotion-validate'),
]
