import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings


class Hotel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    rating = models.FloatField(default=0.0, blank=True)
    reviews_count = models.PositiveIntegerField(default=0)
    images = models.JSONField(default=list, blank=True)   
    price_per_night = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal('0.00')
    )
    amenities = models.JSONField(default=list, blank=True)  
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_hotels',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Hôtel'
        verbose_name_plural = 'Hôtels'

    def __str__(self):
        return self.name


class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name='rooms',
    )
    type = models.CharField(max_length=100)  
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    capacity = models.PositiveIntegerField(default=1)
    amenities = models.JSONField(default=list, blank=True)
    images = models.JSONField(default=list, blank=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['hotel', 'type']
        verbose_name = 'Chambre'
        verbose_name_plural = 'Chambres'

    def __str__(self):
        return f"{self.hotel.name} — {self.type}"


class SeasonType(models.TextChoices):
    LOW = 'LOW', 'Basse'
    NORMAL = 'NORMAL', 'Normale'
    HIGH = 'HIGH', 'Haute'
    PEAK = 'PEAK', 'Pic'


class PricingRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='pricing_rules',
    )
    season_type = models.CharField(
        max_length=20,
        choices=SeasonType.choices,
        default=SeasonType.NORMAL,
    )
    start_date = models.DateField()
    end_date = models.DateField()
    price_modifier = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text='Modificateur (ex: 1.20 pour +20%, 0.80 pour -20%)',
    )
    day_of_week = models.JSONField(
        default=list,
        blank=True,
        help_text='Jours concernés (0=Dim, 6=Sam). Vide = tous les jours.',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['room', 'start_date']
        verbose_name = 'Règle tarifaire'
        verbose_name_plural = 'Règles tarifaires'

    def __str__(self):
        return f"{self.room} — {self.get_season_type_display()} ({self.start_date} / {self.end_date})"


class BookingStatus(models.TextChoices):
    PENDING = 'PENDING', 'En attente'
    CONFIRMED = 'CONFIRMED', 'Confirmée'
    CANCELLED = 'CANCELLED', 'Annulée'
    COMPLETED = 'COMPLETED', 'Terminée'


class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    check_in = models.DateField()
    check_out = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING,
    )
    promotion = models.ForeignKey(
        'Promotion',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bookings',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Réservation'
        verbose_name_plural = 'Réservations'

    def __str__(self):
        return f"{self.room} — {self.user} ({self.check_in} → {self.check_out})"


class Currency(models.TextChoices):
    MRU = 'MRU', 'Ouguiya'
    EUR = 'EUR', 'Euro'
    USD = 'USD', 'Dollar'


class PaymentMethod(models.TextChoices):
    CARD = 'CARD', 'Carte'
    CASH = 'CASH', 'Espèces'
    BANK_TRANSFER = 'BANK_TRANSFER', 'Virement'


class TransactionStatus(models.TextChoices):
    PENDING = 'PENDING', 'En attente'
    COMPLETED = 'COMPLETED', 'Terminée'
    FAILED = 'FAILED', 'Échouée'
    REFUNDED = 'REFUNDED', 'Remboursée'


class PaymentType(models.TextChoices):
    DEPOSIT = 'DEPOSIT', 'Acompte'
    FULL_PAYMENT = 'FULL_PAYMENT', 'Paiement total'


class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions',
    )
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='transactions',
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(
        max_length=10,
        choices=Currency.choices,
        default=Currency.MRU,
    )
    method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
    )
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
    )
    payment_type = models.CharField(
        max_length=20,
        choices=PaymentType.choices,
    )
    invoice_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'

    def __str__(self):
        return f"{self.booking_id} — {self.amount} {self.currency} ({self.status})"


class DiscountType(models.TextChoices):
    PERCENTAGE = 'PERCENTAGE', 'Pourcentage'
    FIXED = 'FIXED', 'Montant fixe'


class Promotion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices,
    )
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    min_purchase = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        blank=True,
    )
    max_discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Plafond de réduction (pour %).',
    )
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-valid_from']
        verbose_name = 'Promotion'
        verbose_name_plural = 'Promotions'

    def __str__(self):
        return f"{self.code} — {self.get_discount_type_display()}"


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    rating = models.PositiveSmallIntegerField()  
    comment = models.TextField(blank=True)
    photos = models.JSONField(default=list, blank=True)  
    owner_response = models.JSONField(
        default=dict,
        blank=True,
        help_text='Réponse du propriétaire (ex: {"text": "...", "created_at": "..."})',
    )
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Avis'
        verbose_name_plural = 'Avis'
        constraints = [
            models.CheckConstraint(
                condition=models.Q(rating__gte=1) & models.Q(rating__lte=5),
                name='review_rating_1_to_5',
            ),
        ]

    def __str__(self):
        return f"{self.hotel.name} — {self.user} ({self.rating}/5)"
