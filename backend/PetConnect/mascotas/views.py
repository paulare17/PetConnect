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

# Importaciones de DRF
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

# Importaciones de modelos y serializadores (Asegúrate de que Mascota, Interaccion, Usuario y MascotaSerializer estén disponibles)
from .models import Mascota, Interaccion 
from usuarios.models import Usuario
from .models import Mascota
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
    [POST] /api/swipe/action/ o /api/tinderpet/action/
    Registra la acción (Like 'L' o Dislike 'D') de un usuario sobre una mascota.
    Si es LIKE, crea automáticamente un chat entre el adoptante y la protectora.
    Espera JSON: { "mascota_id": 123, "action": "L" } o { "animal_id": 123, "action": "like" }
    """
    user = request.user
    try:
        # Compatibilidad: aceptar tanto 'mascota_id' como 'animal_id'
        mascota_id = request.data.get('mascota_id') or request.data.get('animal_id')
        action_val = request.data.get('action')
        
        # Normalizar la acción: 'like'/'dislike' (frontend) -> 'L'/'D' (backend)
        if action_val:
            action_val = action_val.upper()
            if action_val == 'LIKE':
                action_val = 'L'
            elif action_val == 'DISLIKE':
                action_val = 'D'
        
        if not mascota_id:
            return Response({'detail': 'Se requiere mascota_id o animal_id.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if action_val not in [Interaccion.LIKE, Interaccion.DISLIKE]:
            return Response({'detail': 'Acción no válida. Use "L"/"like" o "D"/"dislike".'}, status=status.HTTP_400_BAD_REQUEST)

        mascota = get_object_or_404(Mascota, id=mascota_id)

        # Registra o actualiza la interacción (maneja la restricción de unicidad)
        interaccion, created = Interaccion.objects.update_or_create(
            usuario=user,
            mascota=mascota,
            defaults={'accion': action_val}
        )
        
        is_like = (action_val == Interaccion.LIKE)
        chat_id = None
        
        # Si es LIKE, crear o recuperar el chat automáticamente
        if is_like:
            from chat.models import Chat
            chat, chat_created = Chat.objects.get_or_create(
                mascota=mascota,
                adoptante=user,
                defaults={'protectora': mascota.protectora, 'activo': True}
            )
            chat_id = chat.id
        
        return Response(
            {
                'status': 'ok', 
                'is_like': is_like, 
                'chat_id': chat_id,
                'message': 'Interacción registrada con éxito.' + (' Chat creado.' if is_like and chat_created else '')
            }, 
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    except Mascota.DoesNotExist:
        return Response({'detail': 'Mascota no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- VIEWS ET MODELVIEWSET ---

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


# ======================================================================
# Vista para generar/regenerar descripción con IA
# ======================================================================
from ai_service.description_generator import DescriptionGenerator
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def get_form_choices(request):
    """
    Endpoint para obtener todas las opciones de los campos del formulario.
    GET /api/mascotas/form-choices/
    
    Response:
    {
        "especies": [{"value": "perro", "label": "Perro"}, ...],
        "generos": [...],
        "razas_perros": [...],
        "razas_gatos": [...],
        "tamanos": [...],
        "caracteres": [...],
        "convivencia_animales": [...],
        "colores": [...]
    }
    """
    from .models import Mascota
    
    # Colores definidos en el frontend (podrías moverlos al modelo si quieres)
    COLORES = [
        ('negro', 'Negro'),
        ('blanco', 'Blanco'),
        ('marrón', 'Marrón'),
        ('gris', 'Gris'),
        ('naranja', 'Naranja/Atigrado'),
        ('dorado', 'Dorado'),
        ('crema', 'Crema'),
        ('bicolor', 'Bicolor'),
        ('tricolor', 'Tricolor'),
        ('manchado', 'Manchado'),
    ]
    
    choices = {
        "especies": [{"value": val, "label": lbl} for val, lbl in Mascota.ESPECIES],
        "generos": [{"value": val, "label": lbl} for val, lbl in Mascota.GENERO],
        "razas_perros": [{"value": val, "label": lbl} for val, lbl in Mascota.RAZAS_PERROS],
        "razas_gatos": [{"value": val, "label": lbl} for val, lbl in Mascota.RAZAS_GATOS],
        "tamanos": [{"value": val, "label": lbl} for val, lbl in Mascota.TAMAÑO],
        "caracteres": [{"value": val, "label": lbl} for val, lbl in Mascota.CARACTER],
        "convivencia_animales": [{"value": val, "label": lbl} for val, lbl in Mascota.CONVIVENCIA_ANIMALES],
        "colores": [{"value": val, "label": lbl} for val, lbl in COLORES],
        "convivencia_ninos": [{"value": True, "label": "Sí"}, {"value": False, "label": "No"}]
    }
    
    return Response(choices, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_description(request):
    """
    Endpoint para generar una descripción de mascota usando IA.
    POST /api/mascotas/generate-description/
    
    Body (JSON):
    {
        "nombre": "Luna",
        "especie": "gato",
        "raza_gato": "Siamés",
        "edad": 2,
        "genero": "hembra",
        "tamaño": "mediano",
        "caracter": "jugueton",
        "convivencia_ninos": true,
        "convivencia_animales": "cualquier_especie",
        "descripcion_necesidades": ""
    }
    
    Response:
    {
        "descripcion": "¡Conoce a Luna, una preciosa gato Siamés!..."
    }
    """
    try:
        print("📥 Datos recibidos en generate_description:", request.data)
        generator = DescriptionGenerator()
        descripcion = generator.generate_description(request.data)
        print("✅ Descripción generada:", descripcion[:100] + "...")
        return Response({
            "descripcion": descripcion,
            "success": True
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print("❌ Error en generate_description:", str(e))
        import traceback
        traceback.print_exc()
        return Response({
            "error": str(e),
            "success": False
        }, status=status.HTTP_400_BAD_REQUEST)
