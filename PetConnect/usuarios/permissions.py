from rest_framework.permissions import BasePermission
from django.db import models

#hablar con xavi: qué puede ver la gente? 
#los usuarios sólo pueden ver su propio usuario
#los usuarios pueden ver todas las protectoras
#las protectoras pueden ver todos los usuarios??????
#las protectoras pueden ver otras protectoras
#cada uno se edita lo suyo

class UsuarioPermissions(BasePermission):
    """
    Permisos personalizados para usuarios según rol
    """
    
    def has_permission(self, request, view):
        # Registro y login son públicos
        if view.action in ['create', 'login']:
            return True
        
        # El resto necesita autenticación
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Admin puede hacer todo
        if user.role == 'admin':
            return True
        
        # Para ver perfiles (GET)
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            # Usuarios solo pueden ver:
            if user.role == 'usuario':
                # - Su propio perfil
                if obj == user:
                    return True
                # - Perfiles de protectoras
                if obj.role == 'protectora':
                    return True
                # - NO otros usuarios
                return False
            
            # Protectoras pueden ver:
            elif user.role == 'protectora':
                # - Su propio perfil
                if obj == user:
                    return True
                # - Otras protectoras
                if obj.role == 'protectora':
                    return True
                # - Usuarios (para adopciones)
                if obj.role == 'usuario':
                    return True
                # - NO admins (excepto el suyo propio si fuera admin)
                return False
        
        # Para editar/eliminar (PUT, PATCH, DELETE)
        else:
            # Admin puede editar cualquiera
            if user.role == 'admin':
                return True
            # Todos los demás solo pueden editarse a sí mismos
            return obj == user

class IsAdmin(BasePermission):
    """Permiso solo para administradores"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsUsuario(BasePermission):
    """Permiso solo para usuarios"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'usuario'

class IsProtectora(BasePermission):
    """Permiso solo para protectoras"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'protectora'

class IsOwnerOrReadOnly(BasePermission):
    """
    Permiso que permite editar solo al propietario del objeto
    """
    
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para cualquier request
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Permisos de escritura solo para el propietario del objeto
        return obj.usuario == request.user

# Funciones de utilidad para filtrar queryset según rol
def get_queryset_by_role(user, model):
    """
    Filtra el queryset según los permisos del usuario
    """
    if not user.is_authenticated:
        return model.objects.none()
    
    # Admin ve todos los usuarios
    if user.role == 'admin':
        return model.objects.all()
    
    # Usuarios ven:
    elif user.role == 'usuario':
        # - Él mismo + todas las protectoras
        return model.objects.filter(
            models.Q(id=user.id) | 
            models.Q(role='protectora')
        )
    
    # Protectoras ven:
    elif user.role == 'protectora':
        # - Ella misma + otras protectoras + usuarios
        return model.objects.filter(
            models.Q(id=user.id) | 
            models.Q(role='protectora') | 
            models.Q(role='usuario')
        )
    
    return model.objects.none()