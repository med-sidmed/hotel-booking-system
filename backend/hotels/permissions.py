"""Permissions RBAC pour l'app hotels (Owner / Admin)."""
from rest_framework import permissions


def is_admin(user):
    """Admin = is_staff ou role == 'ADMIN' si le modèle User a un champ role."""
    if user.is_staff:
        return True
    return getattr(user, 'role', None) == 'ADMIN'


def is_owner(user):
    """Propriétaire = role == 'OWNER' (si champ role existe)."""
    return getattr(user, 'role', None) == 'OWNER'


def is_hotel_owner(user, hotel):
    """Vérifie si l'utilisateur est le propriétaire de l'hôtel."""
    return hotel.owner_id == user.pk


class IsOwnerOrAdmin(permissions.BasePermission):
    """Accès en écriture réservé au propriétaire de l'hôtel ou à l'admin."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        if is_admin(request.user):
            return True
        hotel = getattr(obj, 'hotel', None) or getattr(obj, 'owner', None) or obj
        if hotel and hasattr(hotel, 'owner_id'):
            return hotel.owner_id == request.user.pk
        return False


class IsHotelOwnerOrAdmin(permissions.BasePermission):
    """Pour les vues où l'objet est un Hotel."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        if is_admin(request.user):
            return True
        return obj.owner_id == request.user.pk


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """Lecture pour tous, écriture pour les utilisateurs connectés."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated


class IsAdminOrReadOnly(permissions.BasePermission):
    """Lecture pour tous, création de promotions réservée à l'admin."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and is_admin(request.user)
