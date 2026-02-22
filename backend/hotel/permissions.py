from rest_framework import permissions


def is_admin(user):
    if user.is_staff:
        return True
    return getattr(user, 'role', None) == 'ADMIN'


def is_owner(user):
    return getattr(user, 'role', None) == 'OWNER'


def is_hotel_owner(user, hotel):
    return hotel.owner_id == user.pk


class IsOwnerOrAdmin(permissions.BasePermission):

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

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        if is_admin(request.user):
            return True
        return obj.owner_id == request.user.pk


class IsAuthenticatedOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated


class IsAdminOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and is_admin(request.user)
