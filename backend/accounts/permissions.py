from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        role = getattr(request.user, 'role', '')
        return request.user.is_superuser or (role and role.upper() == 'ADMIN')

class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        role = getattr(request.user, 'role', '')
        return role and role.upper() == 'OWNER'

class IsHotelOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated: return False
        role = getattr(user, 'role', '')
        if user.is_superuser or (role and role.upper() == 'ADMIN'):
            return True
        
        if hasattr(obj, 'owner'):
            return obj.owner == user
        if hasattr(obj, 'hotel'):
            return obj.hotel.owner == user
        return False

class IsBookingOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated: return False
        role = getattr(user, 'role', '')
        if user.is_superuser or (role and role.upper() == 'ADMIN'):
            return True
        return obj.user == user or (hasattr(obj, 'room') and obj.room.hotel.owner == user)
