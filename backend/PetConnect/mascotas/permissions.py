from rest_framework.permissions import BasePermission


class MascotaPermissions(BasePermission):
    def has_permission(self, request, view):
        # list y retrieve son públicos
        if view.action in ['list', 'retrieve']:
            return True

        # create solo para protectoras autenticadas
        if view.action == 'create':
            return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'protectora')

        # Para otras acciones (update, delete, custom actions) se requiere autenticación
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Soporta acceso público para métodos seguros
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Admin puede todo
        if getattr(user, 'role', None) == 'admin':
            return True

        # Sólo la protectora dueña puede modificar/borrar/ocultar
        owner = getattr(obj, 'protectora', None) or getattr(obj, 'propietario', None)
        return owner == user
