from django.shortcuts import get_object_or_404

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import Mascota, Interaccion
from .serializers import MascotaSerializer
from .permissions import MascotaPermissions
from rest_framework.permissions import IsAuthenticated


class MascotaPagination(PageNumberPagination):
    page_size = 12

# --- VISTAS DEL SWIPE (FUNCIONALIDAD TINDER) ---

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_next_card(request):
    """
    [GET] /api/pettinder/next/
    Retorna la següent Mascota que l'usuari NO ha swipejat.
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
            {'status': 'empty', 'message': 'Has revisat totes les mascotes disponibles!'}, 
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def swipe_action(request):
    """
    [POST] /api/pettinder/action/
    Registra l'acció (Like 'L' o Dislike 'D') d'un usuari sobre una mascota.
    Espera JSON: { "mascota_id": 123, "action": "like" } o { "mascota_id": 123, "action": "dislike" }
    """
    user = request.user
    try:
        mascota_id = request.data.get('animal_id') or request.data.get('mascota_id')
        action_str = request.data.get('action', '').lower()
        
      # Validar acción
        if action_str not in ['like', 'dislike']:
            return Response({'detail': 'Acció no vàlida. Utilitzi "like" o "dislike".'}, status=status.HTTP_400_BAD_REQUEST)

        mascota = get_object_or_404(Mascota, id=mascota_id)

        # Registra o actualitza la interacció (gestiona la restricció d'unicitat)
        interaccion, created = Interaccion.objects.update_or_create(
            usuario=user,
            mascota=mascota,
            defaults={'accion': action_str}
        )
        
        is_like = (action_str == 'like')
        
        return Response(
            {'status': 'ok', 'is_like': is_like, 'message': 'Interacció registrada amb èxit.'}, 
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    except Mascota.DoesNotExist:
        return Response({'detail': 'Mascota no trobada.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': f'Error intern: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MascotaViewSet(viewsets.ModelViewSet):
    """ViewSet para Mascota con solo `list` y `create`.

    - GET list: público (AllowAny)
    - POST create: solo autenticados (IsAuthenticated)
    - Paginación: 12 por página
    - Orden por defecto: -fecha_creacion
    - Filtros básicos por query params: edad rango (edad_min, edad_max), especie, tamaño, convivencia_animales, convivencia_ninos, caracter
    """
    queryset = Mascota.objects.all().order_by('-fecha_creacion')
    serializer_class = MascotaSerializer
    pagination_class = MascotaPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['especie', 'tamaño', 'convivencia_animales', 'convivencia_ninos', 'caracter']
    search_fields = ['nombre', 'descripcion', 'color']
    permission_classes = [MascotaPermissions]

    def get_permissions(self):
        # Mantener la estructura similar a usuarios/views.py: permitir list público y create autenticado
        if self.action == 'list':
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated()]
        # Para otras acciones, usar la clase de permisos principal
        return [p() for p in self.permission_classes]

    def get_queryset(self):
        # Filtrado por rol: público/usuario -> oculto=False y adoptado=False; protectora -> todas
        qs = super().get_queryset()
        user = getattr(self.request, 'user', None)

        role = getattr(user, 'role', None) if user and user.is_authenticated else None

        if role == 'protectora':
            # Protectoras ven todas
            qs = qs
        else:
            # Público y usuarios normales: solo visibles y no adoptadas
            qs = qs.filter(oculto=False, adoptado=False)
        q = self.request.query_params

        # Filtro por rango de edad
        edad_min = q.get('edad_min')
        edad_max = q.get('edad_max')
        try:
            if edad_min is not None:
                qs = qs.filter(edad__gte=int(edad_min))
        except (ValueError, TypeError):
            pass
        try:
            if edad_max is not None:
                qs = qs.filter(edad__lte=int(edad_max))
        except (ValueError, TypeError):
            pass

        # Filtro por rango de edad
        q = self.request.query_params
        edad_min = q.get('edad_min')
        edad_max = q.get('edad_max')
        try:
            if edad_min is not None:
                qs = qs.filter(edad__gte=int(edad_min))
        except (ValueError, TypeError):
            pass
        try:
            if edad_max is not None:
                qs = qs.filter(edad__lte=int(edad_max))
        except (ValueError, TypeError):
            pass

        # Los demás filtros (django-filter los manejará si están en filterset_fields)
        return qs

    def perform_create(self, serializer):
        # Solo protectoras/autenticados pueden crear; el permiso se controla en get_permissions
        serializer.save(protectora=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def ocultar(self, request, pk=None):
        """Acción para ocultar una mascota (solo protectora dueña o admin)."""
        mascota = get_object_or_404(Mascota, pk=pk)
        # permission_classes y MascotaPermissions restringirán quien puede hacerlo
        if not self.check_object_permissions(request, mascota):
            raise PermissionDenied('No tienes permiso para ocultar esta mascota.')
        mascota.oculto = True
        mascota.save()
        return Response(self.get_serializer(mascota).data, status=status.HTTP_200_OK)

