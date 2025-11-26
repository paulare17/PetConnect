# from django.shortcuts import get_object_or_404
# from django.db.models import Q

# from rest_framework import viewsets, permissions, status
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.response import Response
# from rest_framework.exceptions import PermissionDenied

# from .models import Mascota
# from usuarios.models import Usuario
# from .serializers import MascotaSerializer


# def es_protectora(user):
#     """Verifica si el usuario té rol 'protectora'."""
#     try:
#         return getattr(user, 'role', None) == 'protectora'
#     except Exception:
#         return False

# def es_protectora_user(user):
#     """Comprova si l'usuari té rol 'protectora' — reutilitzable."""
#     try:
#         return getattr(user, 'role', None) == 'protectora'
#     except Exception:
#         return False


# class IsProtectora(permissions.BasePermission):
#     """
#     Permís que exigeix usuari autenticat amb rol Protectora.
#     Ús: @permission_classes([IsAuthenticated, IsProtectora]) o a ViewSet.
#     """
#     def has_permission(self, request, view):
#         # Permet lectura pública; només requereix ser 'protectora' per operacions d'escriptura
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return bool(request.user and request.user.is_authenticated and es_protectora_user(request.user))


# class IsOwnerOrReadOnly(permissions.BasePermission):
#     """
#     Permís: lectura per a tothom, escripció només pel propietari (si el model té 'propietario').
#     """
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         # comprovar camp 'propietario' de forma defensiva
#         model_fields = [f.name for f in obj._meta.get_fields()]
#         if 'propietario' in model_fields:
#             return getattr(obj, 'propietario') == request.user
#         # si no hi ha propietario, deneguem escriptura per seguretat
#         return False


# def _model_has_field(model_class, field_name):
#     return field_name in [f.name for f in model_class._meta.get_fields()]


# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated, IsProtectora])
# def subir_mascota(request):
#     """
#     API endpoint per pujar una mascota (multipart/form-data).
#     Utilitza el serializer per validar i crear l'objecte.
#     Assigna propietario=request.user si el model té aquest camp.
#     Retorna 201 amb les dades si va bé, 400 en cas d'errors de validació.
#     """
#     serializer = MascotaSerializer(data=request.data, context={'request': request})
#     if not serializer.is_valid():
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Assignar propietari només si el model defineix aquest camp
#     if _model_has_field(Mascota, 'propietario'):
#         instance = serializer.save(propietario=request.user)
#     else:
#         instance = serializer.save()

#     return Response(MascotaSerializer(instance, context={'request': request}).data, status=status.HTTP_201_CREATED)


# class MascotaViewSet(viewsets.ModelViewSet):
#     """
#     ModelViewSet DRF per a Mascota.
#     - list / retrieve / create / update / partial_update / destroy automàtics
#     - Afegit action 'mis_mascotas' per obtenir les mascotes de l'usuari autenticat
#     """
#     queryset = Mascota.objects.all()
#     serializer_class = MascotaSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

#     def get_queryset(self):
#         """
#         Permet filtres simples via query params:
#         ?especie=&genero=&tamaño=&busqueda=
#         (només filtra pels camps existents al model)
#         """
#         qs = super().get_queryset()
#         qparams = self.request.query_params

#         especie = qparams.get('especie')
#         genero = qparams.get('genero')
#         tamaño = qparams.get('tamaño')
#         busqueda = qparams.get('busqueda')

#         if especie and _model_has_field(Mascota, 'especie'):
#             qs = qs.filter(especie=especie)
#         if genero and _model_has_field(Mascota, 'genero'):
#             qs = qs.filter(genero=genero)
#         if tamaño and _model_has_field(Mascota, 'tamaño'):
#             qs = qs.filter(**{'tamaño': tamaño})
#         if busqueda:
#             lookups = Q()
#             if _model_has_field(Mascota, 'nombre'):
#                 lookups |= Q(nombre__icontains=busqueda)
#             if _model_has_field(Mascota, 'descripcion'):
#                 lookups |= Q(descripcion__icontains=busqueda)
#             if _model_has_field(Mascota, 'color'):
#                 lookups |= Q(color__icontains=busqueda)
#             if lookups:
#                 qs = qs.filter(lookups)
#         return qs

#     def perform_create(self, serializer):
#         """
#         Assigna propietari si existeix el camp al model; en cas contrari, crea normal.
#         """
#         # Només permitim crear mascotes si l'usuari és una protectora
#         if not (self.request.user and getattr(self.request.user, 'role', None) == 'protectora'):
#             raise PermissionDenied('Solo las protectoras pueden crear mascotas.')

#         if _model_has_field(Mascota, 'propietario'):
#             serializer.save(propietario=self.request.user)
#         else:
#             serializer.save()

#     @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
#     def mis_mascotas(self, request):
#         """
#         /api/mascota/mis_mascotas/ → retorna les mascotes propietat de l'usuari autenticat.
#         Només funciona si el model té el camp 'propietario'.
#         """
#         if not _model_has_field(Mascota, 'propietario'):
#             return Response({'detail': 'Campo propietario no definido en el modelo.'}, status=status.HTTP_400_BAD_REQUEST)

#         mascotas = self.queryset.filter(propietario=request.user)
#         page = self.paginate_queryset(mascotas)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
#         serializer = self.get_serializer(mascotas, many=True)
#         return Response(serializer.data)

import json
from django.shortcuts import get_object_or_404
from django.db.models import Q

# Importaciones de DRF
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

# Importaciones de modelos y serializadores (Asegúrate de que Mascota, Interaccion, Usuario y MascotaSerializer estén disponibles)
from .models import Mascota, Interaccion 
from usuarios.models import Usuario
from .serializers import MascotaSerializer


# --- FUNCIONES DE VERIFICACIÓN DE ROL ---
def es_protectora(user):
    """Verifica si el usuario tiene el rol 'protectora'."""
    try:
        return getattr(user, 'role', None) == 'protectora'
    except Exception:
        return False

def es_protectora_user(user):
    """Comprueba si el usuario tiene el rol 'protectora' — reutilizable."""
    try:
        return getattr(user, 'role', None) == 'protectora'
    except Exception:
        return False

def _model_has_field(model_class, field_name):
    """Comprueba si un modelo tiene un campo específico."""
    return field_name in [f.name for f in model_class._meta.get_fields()]


# --- PERMISOS DRF ---
class IsProtectora(permissions.BasePermission):
    """
    Permiso que exige usuario autenticado con rol Protectora.
    Permite lectura pública, solo requiere ser 'protectora' para escrituras.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and es_protectora_user(request.user))


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso: lectura para todos, escritura solo para el propietario/protectora.
    AHORA REVISA EL CAMPO 'protectoraEncargada'.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        model_fields = [f.name for f in obj._meta.get_fields()]
        # Usamos el campo 'protectoraEncargada'
        if 'protectoraEncargada' in model_fields: 
            return getattr(obj, 'protectoraEncargada') == request.user
        return False 


# --- VISTAS DE UPLOAD ---
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsProtectora])
def subir_mascota(request):
    """
    API endpoint para subir una mascota (multipart/form-data).
    """
    serializer = MascotaSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Asignar protectora encargada
    if _model_has_field(Mascota, 'protectoraEncargada'):
        instance = serializer.save(protectoraEncargada=request.user)
    else:
        instance = serializer.save()

    return Response(MascotaSerializer(instance, context={'request': request}).data, status=status.HTTP_201_CREATED)


# --- VISTAS DEL SWIPE (FUNCIONALIDAD TINDER) ---

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_next_card(request):
    """
    [GET] /api/feed/next-card/
    Retorna la siguiente Mascota que el usuario NO ha swipeado.
    """
    user = request.user
    
    # Obtener IDs de mascotas con las que el usuario ya interactuó
    swiped_ids = Interaccion.objects.filter(usuario=user).values_list('mascota_id', flat=True)
    
    # Filtrar: no adoptadas, no ocultas, y excluir ya swipeadas.
    next_animal = Mascota.objects.filter(
        adoptado=False, 
        oculto=False
    ).exclude(
        id__in=swiped_ids
    ).order_by('?').first() # '?' para orden aleatorio

    if next_animal:
        # Usamos el Serializer para obtener los datos
        serializer = MascotaSerializer(next_animal, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(
            {'status': 'empty', 'message': '¡Has revisado a todas las mascotas disponibles!'}, 
            status=status.HTTP_204_NO_CONTENT # 204 No Content si no hay datos que devolver
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def swipe_action(request):
    """
    [POST] /api/swipe/action/
    Registra la acción (Like 'L' o Dislike 'D') de un usuario sobre una mascota.
    Espera JSON: { "mascota_id": 123, "action": "L" }
    """
    user = request.user
    try:
        mascota_id = request.data.get('mascota_id')
        action_val = request.data.get('action') 
        
        if action_val not in [Interaccion.LIKE, Interaccion.DISLIKE]:
            return Response({'detail': 'Acción no válida. Use "L" o "D".'}, status=status.HTTP_400_BAD_REQUEST)

        mascota = get_object_or_404(Mascota, id=mascota_id)

        # Registra o actualiza la interacción (maneja la restricción de unicidad)
        interaccion, created = Interaccion.objects.update_or_create(
            usuario=user,
            mascota=mascota,
            defaults={'accion': action_val}
        )
        
        is_like = (action_val == Interaccion.LIKE)
        
        return Response(
            {'status': 'ok', 'is_like': is_like, 'message': 'Interacción registrada con éxito.'}, 
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    except Mascota.DoesNotExist:
        return Response({'detail': 'Mascota no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- VIEWS ET MODELVIEWSET ---

class MascotaViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet DRF para Mascota.
    """
    queryset = Mascota.objects.all()
    serializer_class = MascotaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        """
        Permite filtros simples y búsqueda de texto.
        """
        qs = super().get_queryset()
        qparams = self.request.query_params

        especie = qparams.get('especie')
        genero = qparams.get('genero')
        tamaño = qparams.get('tamaño')
        busqueda = qparams.get('busqueda')

        if especie and _model_has_field(Mascota, 'especie'):
            qs = qs.filter(especie=especie)
        if genero and _model_has_field(Mascota, 'genero'):
            qs = qs.filter(genero=genero)
        if tamaño and _model_has_field(Mascota, 'tamaño'):
            qs = qs.filter(**{'tamaño': tamaño})
        if busqueda:
            lookups = Q()
            if _model_has_field(Mascota, 'nombre'):
                lookups |= Q(nombre__icontains=busqueda)
            if _model_has_field(Mascota, 'color'):
                lookups |= Q(color__icontains=busqueda)
            if lookups:
                qs = qs.filter(lookups)
        return qs

    def perform_create(self, serializer):
        """
        Asigna la protectora encargada (el usuario autenticado) al crear la mascota.
        """
        if not es_protectora_user(self.request.user):
            raise PermissionDenied('Solo las protectoras pueden crear mascotas.')

        # Usa el campo 'protectoraEncargada'
        if _model_has_field(Mascota, 'protectoraEncargada'):
            serializer.save(protectoraEncargada=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mis_mascotas(self, request):
        """
        /api/mascota/mis_mascotas/ → retorna las mascotas de la protectora autenticada.
        """
        # Filtra por el campo 'protectoraEncargada'
        if not _model_has_field(Mascota, 'protectoraEncargada'):
            return Response({'detail': 'Campo protectoraEncargada no definido en el modelo.'}, status=status.HTTP_400_BAD_REQUEST)

        mascotas = self.queryset.filter(protectoraEncargada=request.user)
        page = self.paginate_queryset(mascotas)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(mascotas, many=True)
        return Response(serializer.data)