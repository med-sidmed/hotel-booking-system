from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'owner'

class IsHotelOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.role == 'admin':
            return True
        # Check if the user is the owner of the hotel
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'hotel'):
            return obj.hotel.owner == request.user
        return False

class IsBookingOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.user == request.user or obj.room.hotel.owner == request.user
