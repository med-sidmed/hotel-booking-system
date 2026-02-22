from rest_framework import permissions


def is_admin(user):
    if user.is_staff or user.is_superuser:
        return True
    role = getattr(user, 'role', '')
    return role.upper() == 'ADMIN' if role else False


def is_owner(user):
    role = getattr(user, 'role', '')
    return role.upper() == 'OWNER' if role else False


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
        
        # Check owner_id if exists (Hotel)
        if hasattr(obj, 'owner_id'):
            return obj.owner_id == request.user.pk
        
        # Check hotel.owner_id if exists (Room, PricingRule)
        hotel = getattr(obj, 'hotel', None)
        if not hotel and hasattr(obj, 'room'):
            hotel = obj.room.hotel
            
        if hotel and hasattr(hotel, 'owner_id'):
            return hotel.owner_id == request.user.pk
            
        return False


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
