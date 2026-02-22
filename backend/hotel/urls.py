from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HotelViewSet, RoomViewSet, BookingViewSet, 
    ReviewViewSet, PricingRuleViewSet, PromotionViewSet, TransactionViewSet
)

router = DefaultRouter()
router.register(r'hotels', HotelViewSet, basename='hotel')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'pricing-rules', PricingRuleViewSet, basename='pricingrule')
router.register(r'promotions', PromotionViewSet, basename='promotion')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
]
