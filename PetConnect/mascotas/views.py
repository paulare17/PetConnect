from django.shortcuts import get_object_or_404

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import Mascota
from .serializers import MascotaSerializer
from .permissions import MascotaPermissions
from rest_framework.permissions import IsAuthenticated


class MascotaPagination(PageNumberPagination):
    page_size = 12


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

