"""Vues API pour l'app hotels."""
from decimal import Decimal
from django.utils import timezone
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Hotel, Room, Booking, Promotion, Review, BookingStatus
from .serializers import (
    HotelListSerializer,
    HotelDetailSerializer,
    RoomSerializer,
    RoomListSerializer,
    BookingSerializer,
    BookingCreateSerializer,
    PromotionSerializer,
    PromotionValidateSerializer,
    ReviewSerializer,
    ReviewCreateSerializer,
    ReviewReplySerializer,
)
from .permissions import IsHotelOwnerOrAdmin, IsOwnerOrAdmin, IsAdminOrReadOnly


# ----- Hotels -----


class HotelViewSet(viewsets.ModelViewSet):
    """
    GET    /api/hotels/          → liste (filtres: city, price_min, price_max, rating, amenities)
    GET    /api/hotels/{id}/     → détail
    POST   /api/hotels/          → créer (Owner/Admin)
    PUT    /api/hotels/{id}/     → modifier (Owner/Admin)
    DELETE /api/hotels/{id}/     → supprimer (Admin)
    """
    queryset = Hotel.objects.all().select_related('owner')

    def get_serializer_class(self):
        if self.action == 'list':
            return HotelListSerializer
        return HotelDetailSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated(), IsHotelOwnerOrAdmin()]

    def get_queryset(self):
        qs = super().get_queryset()
        city = self.request.query_params.get('city')
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        rating = self.request.query_params.get('rating')
        amenities = self.request.query_params.get('amenities')
        if city:
            qs = qs.filter(location__icontains=city)
        if price_min is not None:
            try:
                qs = qs.filter(price_per_night__gte=Decimal(price_min))
            except (ValueError, TypeError):
                pass
        if price_max is not None:
            try:
                qs = qs.filter(price_per_night__lte=Decimal(price_max))
            except (ValueError, TypeError):
                pass
        if rating is not None:
            try:
                qs = qs.filter(rating__gte=float(rating))
            except (ValueError, TypeError):
                pass
        if amenities:
            for a in amenities.split(','):
                a = a.strip()
                if a:
                    qs = qs.filter(amenities__contains=[a])
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        from .permissions import is_admin
        if not is_admin(request.user):
            return Response(
                {'detail': 'Seul un administrateur peut supprimer un hôtel.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


# ----- Rooms (nested + by id) -----


class HotelRoomListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/hotels/{hotel_id}/rooms/  → liste des chambres (public)
    POST /api/hotels/{hotel_id}/rooms/  → ajouter une chambre (Owner)
    """
    permission_classes = []  # géré dans get_permissions

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Room.objects.filter(hotel_id=self.kwargs['hotel_id']).select_related('hotel')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RoomSerializer
        return RoomListSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['hotel_id'] = self.kwargs['hotel_id']
        return ctx

    def get_serializer(self, *args, **kwargs):
        if self.request.method == 'POST':
            kwargs['data'] = {**(kwargs.get('data') or {}), 'hotel': self.kwargs['hotel_id']}
        return super().get_serializer(*args, **kwargs)

    def check_permissions(self, request):
        super().check_permissions(request)
        if request.method != 'GET' and request.user.is_authenticated:
            hotel = Hotel.objects.filter(pk=self.kwargs['hotel_id']).first()
            if not hotel:
                from rest_framework.exceptions import NotFound
                raise NotFound('Hôtel non trouvé.')
            if hotel.owner_id != request.user.pk and not getattr(request.user, 'is_staff', False):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied('Vous n\'êtes pas le propriétaire de cet hôtel.')


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/rooms/{id}/  → détail
    PUT    /api/rooms/{id}/  → modifier (Owner)
    DELETE /api/rooms/{id}/  → supprimer (Owner)
    """
    queryset = Room.objects.all().select_related('hotel')
    serializer_class = RoomSerializer
    permission_classes = [AllowAny]  # GET public
    lookup_url_kwarg = 'id'

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrAdmin()]


# ----- Bookings -----


class BookingListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/bookings/   → mes réservations (Client) ou toutes (Admin)
    POST /api/bookings/   → créer une réservation (Client)
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        return BookingSerializer

    def get_queryset(self):
        from .permissions import is_admin
        qs = Booking.objects.filter(user=self.request.user).select_related('room', 'room__hotel', 'promotion')
        if is_admin(self.request.user):
            qs = Booking.objects.all().select_related('user', 'room', 'room__hotel', 'promotion')
        return qs

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']
        promotion = serializer.validated_data.get('promotion')
        nights = (check_out - check_in).days
        if nights <= 0:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'check_out': 'La date de sortie doit être après la date d\'entrée.'})
        total = room.price * nights
        if promotion and promotion.active:
            now = timezone.now()
            if promotion.valid_from <= now <= promotion.valid_until:
                if (promotion.usage_limit is None or promotion.used_count < promotion.usage_limit):
                    if total >= promotion.min_purchase:
                        if promotion.discount_type == 'PERCENTAGE':
                            discount = total * (promotion.discount_value / 100)
                            if promotion.max_discount:
                                discount = min(discount, promotion.max_discount)
                        else:
                            discount = promotion.discount_value
                        total = max(Decimal('0'), total - discount)
        serializer.save(user=self.request.user, total_price=total, status=BookingStatus.PENDING)


class OwnerBookingListView(generics.ListAPIView):
    """
    GET /api/bookings/owner/  → réservations des hôtels dont je suis propriétaire (Owner)
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        my_hotel_ids = Hotel.objects.filter(owner=self.request.user).values_list('pk', flat=True)
        return Booking.objects.filter(room__hotel_id__in=my_hotel_ids).select_related(
            'user', 'room', 'room__hotel', 'promotion'
        )


class BookingDetailView(generics.RetrieveAPIView):
    """GET /api/bookings/{id}/  → détail d'une réservation."""
    queryset = Booking.objects.all().select_related('user', 'room', 'room__hotel', 'promotion')
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        from .permissions import is_admin
        qs = super().get_queryset()
        if is_admin(self.request.user):
            return qs
        my_hotel_ids = Hotel.objects.filter(owner=self.request.user).values_list('pk', flat=True)
        return qs.filter(user=self.request.user) | qs.filter(room__hotel_id__in=my_hotel_ids)


class BookingCancelView(generics.GenericAPIView):
    """PATCH /api/bookings/{id}/cancel/  → annuler une réservation."""
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        from .permissions import is_admin
        qs = Booking.objects.all().select_related('room', 'room__hotel')
        if is_admin(self.request.user):
            return qs
        return qs.filter(user=self.request.user)

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.user_id != request.user.pk:
            from .permissions import is_admin
            if not is_admin(request.user):
                return Response({'detail': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)
        if booking.status == BookingStatus.CANCELLED:
            return Response({'detail': 'Réservation déjà annulée.'}, status=status.HTTP_400_BAD_REQUEST)
        booking.status = BookingStatus.CANCELLED
        booking.save(update_fields=['status', 'updated_at'])
        return Response(BookingSerializer(booking).data)


class BookingStatusView(generics.GenericAPIView):
    """PATCH /api/bookings/{id}/status/  → changer statut (Confirmé / Check-in / Out) — Owner/Admin."""
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        from .permissions import is_admin
        qs = Booking.objects.all().select_related('room', 'room__hotel')
        if is_admin(self.request.user):
            return qs
        my_hotel_ids = Hotel.objects.filter(owner=self.request.user).values_list('pk', flat=True)
        return qs.filter(room__hotel_id__in=my_hotel_ids)

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        from .permissions import is_admin
        if booking.room.hotel.owner_id != request.user.pk and not is_admin(request.user):
            return Response({'detail': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)
        new_status = request.data.get('status')
        if new_status not in (BookingStatus.CONFIRMED, BookingStatus.COMPLETED):
            return Response(
                {'detail': 'Statut invalide. Utilisez CONFIRMED ou COMPLETED.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.status = new_status
        booking.save(update_fields=['status', 'updated_at'])
        return Response(BookingSerializer(booking).data)


# ----- Reviews -----


class HotelReviewListView(generics.ListAPIView):
    """GET /api/hotels/{hotel_id}/reviews/  → avis d'un hôtel."""
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Review.objects.filter(hotel_id=self.kwargs['hotel_id']).select_related('user')


class ReviewCreateFromBookingView(generics.CreateAPIView):
    """POST /api/bookings/{id}/review/  → laisser un avis après séjour (Client)."""
    serializer_class = ReviewCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_booking(self):
        from rest_framework.exceptions import NotFound, PermissionDenied
        booking = Booking.objects.filter(pk=self.kwargs['id']).select_related('room', 'room__hotel').first()
        if not booking:
            raise NotFound('Réservation non trouvée.')
        if booking.user_id != self.request.user.pk:
            raise PermissionDenied('Cette réservation ne vous appartient pas.')
        if booking.status != BookingStatus.COMPLETED:
            raise PermissionDenied('Vous ne pouvez noter qu\'après un séjour terminé.')
        return booking

    def post(self, request, *args, **kwargs):
        booking = self.get_booking()
        data = {**(request.data or {}), 'hotel': booking.room.hotel_id}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewReplyView(generics.GenericAPIView):
    """POST /api/reviews/{id}/reply/  → répondre à un avis (Owner)."""
    queryset = Review.objects.all().select_related('hotel')
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'id'

    def post(self, request, *args, **kwargs):
        review = self.get_object()
        if review.hotel.owner_id != request.user.pk:
            return Response({'detail': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)
        ser = ReviewReplySerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        review.owner_response = {
            'text': ser.validated_data['text'],
            'created_at': timezone.now().isoformat(),
        }
        review.save(update_fields=['owner_response', 'updated_at'])
        return Response(ReviewSerializer(review).data)


# ----- Promotions -----


class PromotionListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/promotions/  → promos actives (tout le monde)
    POST /api/promotions/  → créer une promo (Admin)
    """
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.method == 'GET':
            now = timezone.now()
            qs = qs.filter(active=True, valid_from__lte=now, valid_until__gte=now)
        return qs


class PromotionValidateView(generics.GenericAPIView):
    """POST /api/promotions/validate/  → vérifier un code promo (Client)."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = PromotionValidateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        code = ser.validated_data['code'].strip().upper()
        amount = ser.validated_data.get('amount') or Decimal('0')
        now = timezone.now()
        promo = Promotion.objects.filter(
            code__iexact=code, active=True,
            valid_from__lte=now, valid_until__gte=now,
        ).first()
        if not promo:
            return Response(
                {'valid': False, 'detail': 'Code invalide ou expiré.'},
                status=status.HTTP_200_OK,
            )
        if promo.usage_limit is not None and promo.used_count >= promo.usage_limit:
            return Response(
                {'valid': False, 'detail': 'Code épuisé.'},
                status=status.HTTP_200_OK,
            )
        if amount < promo.min_purchase:
            return Response(
                {'valid': False, 'detail': f'Montant minimum: {promo.min_purchase}.'},
                status=status.HTTP_200_OK,
            )
        if promo.discount_type == 'PERCENTAGE':
            discount = amount * (promo.discount_value / 100)
            if promo.max_discount:
                discount = min(discount, promo.max_discount)
        else:
            discount = promo.discount_value
        return Response({
            'valid': True,
            'promotion_id': str(promo.id),
            'code': promo.code,
            'discount': float(discount),
            'discount_type': promo.discount_type,
        }, status=status.HTTP_200_OK)
