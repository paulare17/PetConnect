from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Mascota
from usuarios.models import Usuario
from .serializers import MascotaSerializer


def es_protectora(user):
    """Verifica si el usuario té rol 'protectora'."""
    try:
        return getattr(user, 'role', None) == 'protectora'
    except Exception:
        return False


# @login_required
# def subir_mascota(request):
#     """
#     Vista para que las protectoras suban mascotas en adopción.
#     Solo usuarios con rol de Protectora pueden acceder.
#     """
#     if request.method == 'POST':
#         # Verificar que el usuario sea una protectora
#         if not es_protectora(request.user):
#             return JsonResponse({
#                 'success': False,
#                 'error': 'Solo las protectoras pueden publicar mascotas en adopción'
#             }, status=403)
        
#         try:
#             # Datos básicos
#             nombre = request.POST.get('nombre')
#             especie = request.POST.get('especie', 'perro')
#             genero = request.POST.get('genero')
#             edad = request.POST.get('edad')
            
#             # Características físicas
#             tamaño = request.POST.get('tamaño')
#             peso = request.POST.get('peso')  # Opcional
#             color = request.POST.get('color')
#             foto = request.FILES.get('foto')
            
#             # Necesidades especiales
#             necesidades_especiales = request.POST.get('necesidades_especiales') == 'si'
#             descripcion_necesidades = request.POST.get('descripcion_necesidades', '')
            
#             # Convivencia
#             convivencia_animales = request.POST.get('convivencia_animales', 'no')
#             convivencia_ninos = request.POST.get('convivencia_ninos', 'no')
            
#             # Carácter (puede venir como lista desde un multi-select)
#             caracter_list = request.POST.getlist('caracter')
#             caracter = ','.join(caracter_list) if caracter_list else ''
            
#             # Descripción adicional y ubicación
#             descripcion = request.POST.get('descripcion', '')
#             ubicacion = request.POST.get('ubicacion', request.user.city)
            
#             # Validaciones obligatorias
#             errores = []
#             if not nombre:
#                 errores.append('El nombre es obligatorio')
#             if not genero:
#                 errores.append('El género es obligatorio')
#             if not edad:
#                 errores.append('La edad es obligatoria')
#             if not tamaño:
#                 errores.append('El tamaño es obligatorio')
#             if not color:
#                 errores.append('El color es obligatorio')
#             if not foto:
#                 errores.append('Debes subir una foto de la mascota')
#             if not caracter:
#                 errores.append('Debes seleccionar al menos un rasgo de carácter')
#             if necesidades_especiales and not descripcion_necesidades:
#                 errores.append('Debes especificar las necesidades especiales')
            
#             if errores:
#                 return JsonResponse({
#                     'success': False,
#                     'errores': errores
#                 }, status=400)
            
#             # Crear la mascota en adopción
#             mascota = Mascota.objects.create(
#                 nombre=nombre,
#                 especie=especie,
#                 genero=genero,
#                 edad=int(edad),
#                 tamaño=tamaño,
#                 peso=float(peso) if peso else None,
#                 color=color,
#                 foto=foto,
#                 necesidades_especiales=necesidades_especiales,
#                 descripcion_necesidades=descripcion_necesidades if necesidades_especiales else '',
#                 convivencia_animales=convivencia_animales,
#                 convivencia_ninos=convivencia_ninos,
#                 caracter=caracter,
#                 descripcion=descripcion,
#                 ubicacion=ubicacion,
#                 propietario=request.user
#             )
            
#             return JsonResponse({
#                 'success': True,
#                 'mascota_id': mascota.id,
#                 'foto_url': mascota.foto.url,
#                 'message': f'{mascota.nombre} ha sido publicado para adopción'
#             })
            
#         except Exception as e:
#             return JsonResponse({
#                 'success': False,
#                 'error': str(e)
#             }, status=400)
    
#     # GET request - mostrar formulario con opciones
#     context = {
#         'especies': Mascota.ESPECIES,
#         'generos': Mascota.GENERO,
#         'tamaños': Mascota.TAMAÑO,
#         'caracteres': Mascota.CARACTER,
#         'convivencias_animales': Mascota.CONVIVENCIA_ANIMALES,
#         'convivencias_ninos': Mascota.CONVIVENCIA_NINOS,
#     }
#     return render(request, 'mascotas/subir_mascota.html', context)


# def listar_mascotas(request):
#     """
#     Vista pública para que los adoptantes puedan ver todas las mascotas disponibles.
#     Permite filtrar por especie, género, tamaño, ciudad y búsqueda por nombre.
#     """
#     mascotas = Mascota.objects.all().select_related('propietario').order_by('-fecha_creacion')
    
#     # Filtros opcionales
#     especie = request.GET.get('especie')
#     genero = request.GET.get('genero')
#     tamaño = request.GET.get('tamaño')
#     ciudad = request.GET.get('ciudad')
#     busqueda = request.GET.get('busqueda')
    
#     if especie and especie in ['perro', 'gato']:
#         mascotas = mascotas.filter(especie=especie)
    
#     if genero and genero in ['macho', 'hembra']:
#         mascotas = mascotas.filter(genero=genero)
    
#     if tamaño and tamaño in ['pequeño', 'mediano', 'grande', 'gigante']:
#         mascotas = mascotas.filter(tamaño=tamaño)
    
#     if ciudad:
#         mascotas = mascotas.filter(ubicacion__icontains=ciudad)
    
#     if busqueda:
#         mascotas = mascotas.filter(
#             Q(nombre__icontains=busqueda) | 
#             Q(descripcion__icontains=busqueda) |
#             Q(color__icontains=busqueda)
#         )
    
#     mascotas_data = []
#     for mascota in mascotas:
#         mascotas_data.append({
#             'id': mascota.id,
#             'nombre': mascota.nombre,
#             'especie': mascota.get_especie_display(),
#             'genero': mascota.get_genero_display(),
#             'edad': mascota.edad,
#             'tamaño': mascota.get_tamaño_display(),
#             'peso': float(mascota.peso) if mascota.peso else None,
#             'color': mascota.color,
#             'foto_url': mascota.foto.url,
#             'caracter': mascota.get_caracter_list(),
#             'necesidades_especiales': mascota.necesidades_especiales,
#             'convivencia_animales': mascota.get_convivencia_animales_display(),
#             'convivencia_ninos': mascota.get_convivencia_ninos_display(),
#             'descripcion': mascota.descripcion,
#             'ubicacion': mascota.ubicacion,
#             'protectora': mascota.propietario.username,
#             'email_protectora': mascota.propietario.email,
#             'fecha_publicacion': mascota.fecha_creacion.strftime('%d/%m/%Y')
#         })
    
#     if request.headers.get('Accept') == 'application/json':
#         return JsonResponse({
#             'success': True,
#             'total': len(mascotas_data),
#             'mascotas': mascotas_data
#         })
    
#     return render(request, 'mascotas/listado.html', {
#         'mascotas': mascotas,
#         'total': mascotas.count(),
#         'especies': Mascota.ESPECIES,
#         'generos': Mascota.GENERO,
#         'tamaños': Mascota.TAMAÑO,
#     })


# def detalle_mascota(request, mascota_id):
#     """Vista para ver el detalle completo de una mascota en adopción"""
#     mascota = get_object_or_404(Mascota, id=mascota_id)
    
#     if request.headers.get('Accept') == 'application/json':
#         return JsonResponse({
#             'success': True,
#             'mascota': {
#                 'id': mascota.id,
#                 'nombre': mascota.nombre,
#                 'especie': mascota.get_especie_display(),
#                 'genero': mascota.get_genero_display(),
#                 'edad': mascota.edad,
#                 'tamaño': mascota.get_tamaño_display(),
#                 'peso': float(mascota.peso) if mascota.peso else None,
#                 'color': mascota.color,
#                 'foto_url': mascota.foto.url,
#                 'caracter': mascota.get_caracter_list(),
#                 'necesidades_especiales': mascota.necesidades_especiales,
#                 'descripcion_necesidades': mascota.descripcion_necesidades,
#                 'convivencia_animales': mascota.get_convivencia_animales_display(),
#                 'convivencia_ninos': mascota.get_convivencia_ninos_display(),
#                 'descripcion': mascota.descripcion,
#                 'ubicacion': mascota.ubicacion,
#                 'protectora': {
#                     'nombre': mascota.propietario.username,
#                     'email': mascota.propietario.email,
#                     'ciudad': mascota.propietario.city
#                 },
#                 'fecha_publicacion': mascota.fecha_creacion.strftime('%d/%m/%Y')
#             }
#         })
    
#     return render(request, 'mascotas/detalle.html', {'mascota': mascota})


# @login_required
# def mis_mascotas(request):
#     """Vista para que las protectoras vean las mascotas que han publicado"""
#     if not es_protectora(request.user):
#         return JsonResponse({
#             'success': False,
#             'error': 'Acceso denegado'
#         }, status=403)
    
#     mascotas = Mascota.objects.filter(
#         propietario=request.user
#     ).order_by('-fecha_creacion')
    
#     if request.headers.get('Accept') == 'application/json':
#         mascotas_data = [{
#             'id': m.id,
#             'nombre': m.nombre,
#             'especie': m.get_especie_display(),
#             'genero': m.get_genero_display(),
#             'edad': m.edad,
#             'tamaño': m.get_tamaño_display(),
#             'color': m.color,
#             'foto_url': m.foto.url,
#             'caracter': m.get_caracter_list(),
#             'necesidades_especiales': m.necesidades_especiales,
#             'ubicacion': m.ubicacion,
#             'fecha_publicacion': m.fecha_creacion.strftime('%d/%m/%Y')
#         } for m in mascotas]
        
#         return JsonResponse({
#             'success': True,
#             'total': len(mascotas_data),
#             'mascotas': mascotas_data
#         })
    
#     return render(request, 'mascotas/mis_mascotas.html', {
#         'mascotas': mascotas,
#         'total': mascotas.count()
#     })


# @login_required
# def eliminar_mascota(request, mascota_id):
#     """Permite a la protectora eliminar una mascota (por ejemplo, si ya fue adoptada)"""
#     if request.method != 'DELETE' and request.method != 'POST':
#         return JsonResponse({'error': 'Método no permitido'}, status=405)
    
#     mascota = get_object_or_404(Mascota, id=mascota_id)
    
#     # Verificar que el usuario sea el propietario
#     if mascota.propietario != request.user:
#         return JsonResponse({
#             'success': False,
#             'error': 'No tienes permiso para eliminar esta mascota'
#         }, status=403)
    
#     nombre_mascota = mascota.nombre
#     mascota.delete()
    
#     return JsonResponse({
#         'success': True,
#         'message': f'{nombre_mascota} ha sido eliminado del listado'
#     })


def es_protectora_user(user):
    """Comprova si l'usuari té rol 'protectora' — reutilitzable."""
    try:
        return getattr(user, 'role', None) == 'protectora'
    except Exception:
        return False


class IsProtectora(permissions.BasePermission):
    """
    Permís que exigeix usuari autenticat amb rol Protectora.
    Ús: @permission_classes([IsAuthenticated, IsProtectora]) o a ViewSet.
    """
    def has_permission(self, request, view):
        # Permet lectura pública; només requereix ser 'protectora' per operacions d'escriptura
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and es_protectora_user(request.user))


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permís: lectura per a tothom, escripció només pel propietari (si el model té 'propietario').
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # comprovar camp 'propietario' de forma defensiva
        model_fields = [f.name for f in obj._meta.get_fields()]
        if 'propietario' in model_fields:
            return getattr(obj, 'propietario') == request.user
        # si no hi ha propietario, deneguem escriptura per seguretat
        return False


def _model_has_field(model_class, field_name):
    return field_name in [f.name for f in model_class._meta.get_fields()]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsProtectora])
def subir_mascota(request):
    """
    API endpoint per pujar una mascota (multipart/form-data).
    Utilitza el serializer per validar i crear l'objecte.
    Assigna propietario=request.user si el model té aquest camp.
    Retorna 201 amb les dades si va bé, 400 en cas d'errors de validació.
    """
    serializer = MascotaSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Assignar propietari només si el model defineix aquest camp
    if _model_has_field(Mascota, 'propietario'):
        instance = serializer.save(propietario=request.user)
    else:
        instance = serializer.save()

    return Response(MascotaSerializer(instance, context={'request': request}).data, status=status.HTTP_201_CREATED)


class MascotaViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet DRF per a Mascota.
    - list / retrieve / create / update / partial_update / destroy automàtics
    - Afegit action 'mis_mascotas' per obtenir les mascotes de l'usuari autenticat
    """
    queryset = Mascota.objects.all()
    serializer_class = MascotaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        """
        Permet filtres simples via query params:
        ?especie=&genero=&tamaño=&busqueda=
        (només filtra pels camps existents al model)
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
            if _model_has_field(Mascota, 'descripcion'):
                lookups |= Q(descripcion__icontains=busqueda)
            if _model_has_field(Mascota, 'color'):
                lookups |= Q(color__icontains=busqueda)
            if lookups:
                qs = qs.filter(lookups)
        return qs

    def perform_create(self, serializer):
        """
        Assigna propietari si existeix el camp al model; en cas contrari, crea normal.
        """
        # Només permitim crear mascotes si l'usuari és una protectora
        if not (self.request.user and getattr(self.request.user, 'role', None) == 'protectora'):
            raise PermissionDenied('Solo las protectoras pueden crear mascotas.')

        if _model_has_field(Mascota, 'propietario'):
            serializer.save(propietario=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mis_mascotas(self, request):
        """
        /api/mascota/mis_mascotas/ → retorna les mascotes propietat de l'usuari autenticat.
        Només funciona si el model té el camp 'propietario'.
        """
        if not _model_has_field(Mascota, 'propietario'):
            return Response({'detail': 'Campo propietario no definido en el modelo.'}, status=status.HTTP_400_BAD_REQUEST)

        mascotas = self.queryset.filter(propietario=request.user)
        page = self.paginate_queryset(mascotas)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(mascotas, many=True)
        return Response(serializer.data)
