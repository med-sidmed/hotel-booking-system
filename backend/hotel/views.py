"""Vues API pour l'app hotel."""
from decimal import Decimal
from django.utils import timezone
from django.db import models
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from .models import Hotel, Room, Booking, Promotion, Review, BookingStatus, PricingRule, Transaction, Favorite
from accounts.models import Notification
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
    PricingRuleSerializer,
    TransactionSerializer,
    FavoriteSerializer
)
from .permissions import IsHotelOwnerOrAdmin, IsOwnerOrAdmin, IsAdminOrReadOnly, is_admin


 

class HotelViewSet(viewsets.ModelViewSet):
  
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
        is_mine = self.request.query_params.get('mine')
        if city:
            qs = qs.filter(location__icontains=city)
        if is_mine and self.request.user.is_authenticated:
            qs = qs.filter(owner=self.request.user)
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
        if not is_admin(request.user):
            return Response(
                {'detail': 'Seul un administrateur peut supprimer un hôtel.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


 

class HotelRoomListCreateView(generics.ListCreateAPIView):
 
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
            if hotel.owner_id != request.user.pk and not is_admin(request.user):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied('Vous n\'êtes pas le propriétaire de cet hôtel.')


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):

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
        booking = serializer.save(user=self.request.user, total_price=total, status=BookingStatus.PENDING)
        
        # Notify the client
        Notification.objects.create(
            user=self.request.user,
            type=Notification.NotificationType.BOOKING_CONFIRMED,
            title="Nouvelle réservation",
            message=f"Votre réservation pour {room.type} à {room.hotel.name} a été enregistrée.",
            action_url=f"/profile/bookings"
        )

        # Notify the Owner
        Notification.objects.create(
            user=room.hotel.owner,
            type=Notification.NotificationType.BOOKING_CONFIRMED,
            title="Nouvelle réservation reçue",
            message=f"Une nouvelle réservation a été effectuée pour {room.type} par {self.request.user.name}.",
            action_url="/owner/bookings"
        )


class OwnerBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        my_hotel_ids = Hotel.objects.filter(owner=self.request.user).values_list('pk', flat=True)
        return Booking.objects.filter(room__hotel_id__in=my_hotel_ids).select_related(
            'user', 'room', 'room__hotel', 'promotion'
        )


class BookingDetailView(generics.RetrieveAPIView):
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
        
        # Notify the client
        Notification.objects.create(
            user=booking.user,
            type=Notification.NotificationType.BOOKING_CANCELLED,
            title="Réservation annulée",
            message=f"Votre réservation pour {booking.room.type} a été annulée.",
            action_url="/profile/bookings"
        )

        # Notify the Owner
        Notification.objects.create(
            user=booking.room.hotel.owner,
            type=Notification.NotificationType.BOOKING_CANCELLED,
            title="Réservation annulée par le client",
            message=f"Le client {booking.user.name} a annulé sa réservation pour {booking.room.type}.",
            action_url="/owner/bookings"
        )
        return Response(BookingSerializer(booking).data)


class BookingStatusView(generics.GenericAPIView):
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

        # Notify the client
        notif_title = "Réservation confirmée" if new_status == BookingStatus.CONFIRMED else "Séjour terminé"
        notif_msg = f"Votre séjour à {booking.room.hotel.name} est confirmé !" if new_status == BookingStatus.CONFIRMED else f"Nous espérons que vous avez apprécié votre séjour à {booking.room.hotel.name}. N'hésitez pas à laisser un avis !"
        notif_type = Notification.NotificationType.BOOKING_CONFIRMED if new_status == BookingStatus.CONFIRMED else Notification.NotificationType.REVIEW_REQUEST
        
        Notification.objects.create(
            user=booking.user,
            type=notif_type,
            title=notif_title,
            message=notif_msg,
            action_url="/profile/bookings"
        )

        return Response(BookingSerializer(booking).data)


 

class HotelReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Review.objects.filter(hotel_id=self.kwargs['hotel_id']).select_related('user')


class MyReviewListView(generics.ListAPIView):
    """
    GET /api/reviews/mine/ → Liste des avis laissés par l'utilisateur connecté
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).select_related('hotel', 'user')


class ReviewCreateFromBookingView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_booking(self):
        from rest_framework.exceptions import NotFound, PermissionDenied
        booking = Booking.objects.filter(pk=self.kwargs['id']).select_related('room', 'room__hotel').first()
        if not booking:
            raise NotFound('Réservation non trouvée.')
        if booking.user_id != self.request.user.pk:
            raise PermissionDenied('Cette réservation ne vous appartient pas.')
        if booking.status not in (BookingStatus.COMPLETED, BookingStatus.CONFIRMED):
            raise PermissionDenied('Vous ne pouvez noter qu\'une réservation confirmée ou terminée.')
        return booking

    def post(self, request, *args, **kwargs):
        booking = self.get_booking()
        data = {**(request.data or {}), 'hotel': booking.room.hotel_id}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewReplyView(generics.GenericAPIView):
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


class PromotionListCreateView(generics.ListCreateAPIView):
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

class PricingRuleViewSet(viewsets.ModelViewSet):
    queryset = PricingRule.objects.all()
    serializer_class = PricingRuleSerializer
    permission_classes = [IsHotelOwnerOrAdmin]

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from .permissions import is_admin
        if is_admin(self.request.user):
            return Transaction.objects.all()
        return Transaction.objects.filter(user=self.request.user)
class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Sum, Count, Q
        from django.db.models.functions import TruncMonth
        from datetime import timedelta
        from .permissions import is_admin, is_owner
        
        user = request.user
        if not (is_admin(user) or is_owner(user)):
            return Response({'detail': 'Accès refusé.'}, status=status.HTTP_403_FORBIDDEN)

        # Base Filters
        transaction_qs = Transaction.objects.all()
        booking_qs = Booking.objects.all()
        hotel_qs = Hotel.objects.all()
        room_qs = Room.objects.all()

        if not is_admin(user):
            my_hotel_ids = Hotel.objects.filter(owner=user).values_list('pk', flat=True)
            transaction_qs = transaction_qs.filter(booking__room__hotel_id__in=my_hotel_ids)
            booking_qs = booking_qs.filter(room__hotel_id__in=my_hotel_ids)
            hotel_qs = hotel_qs.filter(owner=user)
            room_qs = room_qs.filter(hotel_id__in=my_hotel_ids)

        # 1. KPI Calculations
        agg_rev = transaction_qs.filter(status='COMPLETED').aggregate(total=Sum('amount'))
        total_revenue = float(agg_rev['total'] or 0)
        
        total_bookings = booking_qs.count()
        total_rooms = room_qs.count()
        occupied_rooms = booking_qs.filter(status='CONFIRMED').count()
        
        occupancy_rate = (occupied_rooms / total_rooms * 100) if total_rooms > 0 else 0
        adr = (total_revenue / total_bookings) if total_bookings > 0 else 0
        rev_par = (total_revenue / total_rooms) if total_rooms > 0 else 0
        
        # 2. Monthly Revenue (Last 6 months)
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_raw = (
            transaction_qs.filter(status='COMPLETED', created_at__gte=six_months_ago)
            .annotate(month_date=TruncMonth('created_at'))
            .values('month_date')
            .annotate(revenue=Sum('amount'), count=Count('id'))
            .order_by('month_date')
        )
        
        monthly_data = []
        for d in monthly_raw:
            m_date = d.get('month_date')
            m_str = m_date.strftime('%b') if m_date and hasattr(m_date, 'strftime') else str(m_date)
            monthly_data.append({
                'month': m_str,
                'revenue': float(d.get('revenue') or 0),
                'bookings': d.get('count') or 0
            })
        
        # 3. Top Hotels
        # Fixed: check if status='CONFIRMED' value is correct (BookingStatus.CONFIRMED.value or just 'CONFIRMED')
        top_hotels_raw = (
            hotel_qs.annotate(
                bookings_count=Count('rooms__bookings'),
                total_rev=Sum('rooms__bookings__total_price', filter=Q(rooms__bookings__status='CONFIRMED'))
            )
            .order_by('-total_rev')[:10]
        )
        
        top_hotels = []
        for h in top_hotels_raw:
            top_hotels.append({
                'name': h.name,
                'bookings': getattr(h, 'bookings_count', 0),
                'revenue': float(getattr(h, 'total_rev', 0) or 0)
            })
        
        # 4. Status Distribution
        status_raw = booking_qs.values('status').annotate(count=Count('id'))
        status_distribution = list(status_raw)
        
        return Response({
            'kpis': {
                'total_revenue': total_revenue,
                'occupancy_rate': round(occupancy_rate, 1),
                'adr': round(adr, 0),
                'rev_par': round(rev_par, 0),
                'total_rooms': total_rooms,
                'occupied_rooms': occupied_rooms
            },
            'monthly_data': monthly_data,
            'top_hotels': top_hotels,
            'status_distribution': status_distribution
        })


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    Gestion des favoris :
    - GET    /api/favorites/ → mes favoris
    - POST   /api/favorites/ → ajouter un favori
    - DELETE /api/favorites/{id}/ → supprimer un favori
    """
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('hotel')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
