from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Mascota
from .models import Usuario
import json


def es_protectora(user):
    """Verifica si el usuario tiene rol de protectora"""
    return Usuario.objects.filter(
        user_id=user, 
        role__role_name='Protectora'
    ).exists()


@login_required
def subir_mascota(request):
    """
    Vista para que las protectoras suban mascotas en adopción.
    Solo usuarios con rol de Protectora pueden acceder.
    """
    if request.method == 'POST':
        # Verificar que el usuario sea una protectora
        if not es_protectora(request.user):
            return JsonResponse({
                'success': False,
                'error': 'Solo las protectoras pueden publicar mascotas en adopción'
            }, status=403)
        
        try:
            # Datos básicos
            nombre = request.POST.get('nombre')
            especie = request.POST.get('especie', 'perro')
            genero = request.POST.get('genero')
            edad = request.POST.get('edad')
            
            # Características físicas
            tamaño = request.POST.get('tamaño')
            peso = request.POST.get('peso')  # Opcional
            color = request.POST.get('color')
            foto = request.FILES.get('foto')
            
            # Necesidades especiales
            necesidades_especiales = request.POST.get('necesidades_especiales') == 'si'
            descripcion_necesidades = request.POST.get('descripcion_necesidades', '')
            
            # Convivencia
            convivencia_animales = request.POST.get('convivencia_animales', 'no')
            convivencia_ninos = request.POST.get('convivencia_ninos', 'no')
            
            # Carácter (puede venir como lista desde un multi-select)
            caracter_list = request.POST.getlist('caracter')
            caracter = ','.join(caracter_list) if caracter_list else ''
            
            # Descripción adicional y ubicación
            descripcion = request.POST.get('descripcion', '')
            ubicacion = request.POST.get('ubicacion', request.user.city)
            
            # Validaciones obligatorias
            errores = []
            if not nombre:
                errores.append('El nombre es obligatorio')
            if not genero:
                errores.append('El género es obligatorio')
            if not edad:
                errores.append('La edad es obligatoria')
            if not tamaño:
                errores.append('El tamaño es obligatorio')
            if not color:
                errores.append('El color es obligatorio')
            if not foto:
                errores.append('Debes subir una foto de la mascota')
            if not caracter:
                errores.append('Debes seleccionar al menos un rasgo de carácter')
            if necesidades_especiales and not descripcion_necesidades:
                errores.append('Debes especificar las necesidades especiales')
            
            if errores:
                return JsonResponse({
                    'success': False,
                    'errores': errores
                }, status=400)
            
            # Crear la mascota en adopción
            mascota = Mascota.objects.create(
                nombre=nombre,
                especie=especie,
                genero=genero,
                edad=int(edad),
                tamaño=tamaño,
                peso=float(peso) if peso else None,
                color=color,
                foto=foto,
                necesidades_especiales=necesidades_especiales,
                descripcion_necesidades=descripcion_necesidades if necesidades_especiales else '',
                convivencia_animales=convivencia_animales,
                convivencia_ninos=convivencia_ninos,
                caracter=caracter,
                descripcion=descripcion,
                ubicacion=ubicacion,
                protectoraEncargada=request.user
            )
            
            return JsonResponse({
                'success': True,
                'mascota_id': mascota.id,
                'foto_url': mascota.foto.url,
                'message': f'{mascota.nombre} ha sido publicado para adopción'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    # GET request - mostrar formulario con opciones
    context = {
        'especies': Mascota.ESPECIES,
        'generos': Mascota.GENERO,
        'tamaños': Mascota.TAMAÑO,
        'caracteres': Mascota.CARACTER,
        'convivencias_animales': Mascota.CONVIVENCIA_ANIMALES,
        'convivencias_ninos': Mascota.CONVIVENCIA_NINOS,
    }
    return render(request, 'mascotas/subir_mascota.html', context)


def listar_mascotas(request):
    """
    Vista pública para que los adoptantes puedan ver todas las mascotas disponibles.
    Permite filtrar por especie, género, tamaño, ciudad y búsqueda por nombre.
    """
    mascotas = Mascota.objects.all().select_related('protectoraEncargada').order_by('-fecha_creacion')
    
    # Filtros opcionales
    especie = request.GET.get('especie')
    genero = request.GET.get('genero')
    tamaño = request.GET.get('tamaño')
    ciudad = request.GET.get('ciudad')
    busqueda = request.GET.get('busqueda')
    
    if especie and especie in ['perro', 'gato']:
        mascotas = mascotas.filter(especie=especie)
    
    if genero and genero in ['macho', 'hembra']:
        mascotas = mascotas.filter(genero=genero)
    
    if tamaño and tamaño in ['pequeño', 'mediano', 'grande', 'gigante']:
        mascotas = mascotas.filter(tamaño=tamaño)
    
    if ciudad:
        mascotas = mascotas.filter(ubicacion__icontains=ciudad)
    
    if busqueda:
        mascotas = mascotas.filter(
            Q(nombre__icontains=busqueda) | 
            Q(descripcion__icontains=busqueda) |
            Q(color__icontains=busqueda)
        )
    
    mascotas_data = []
    for mascota in mascotas:
        mascotas_data.append({
            'id': mascota.id,
            'nombre': mascota.nombre,
            'especie': mascota.get_especie_display(),
            'genero': mascota.get_genero_display(),
            'edad': mascota.edad,
            'tamaño': mascota.get_tamaño_display(),
            'peso': float(mascota.peso) if mascota.peso else None,
            'color': mascota.color,
            'foto_url': mascota.foto.url,
            'caracter': mascota.get_caracter_list(),
            'necesidades_especiales': mascota.necesidades_especiales,
            'convivencia_animales': mascota.get_convivencia_animales_display(),
            'convivencia_ninos': mascota.get_convivencia_ninos_display(),
            'descripcion': mascota.descripcion,
            'ubicacion': mascota.ubicacion,
            'protectora': mascota.protectoraEncargada.username,
            'email_protectora': mascota.protectoraEncargada.email,
            'fecha_publicacion': mascota.fecha_creacion.strftime('%d/%m/%Y')
        })
    
    if request.headers.get('Accept') == 'application/json':
        return JsonResponse({
            'success': True,
            'total': len(mascotas_data),
            'mascotas': mascotas_data
        })
    
    return render(request, 'mascotas/listado.html', {
        'mascotas': mascotas,
        'total': mascotas.count(),
        'especies': Mascota.ESPECIES,
        'generos': Mascota.GENERO,
        'tamaños': Mascota.TAMAÑO,
    })


def detalle_mascota(request, mascota_id):
    """Vista para ver el detalle completo de una mascota en adopción"""
    mascota = get_object_or_404(Mascota, id=mascota_id)
    
    if request.headers.get('Accept') == 'application/json':
        return JsonResponse({
            'success': True,
            'mascota': {
                'id': mascota.id,
                'nombre': mascota.nombre,
                'especie': mascota.get_especie_display(),
                'genero': mascota.get_genero_display(),
                'edad': mascota.edad,
                'tamaño': mascota.get_tamaño_display(),
                'peso': float(mascota.peso) if mascota.peso else None,
                'color': mascota.color,
                'foto_url': mascota.foto.url,
                'caracter': mascota.get_caracter_list(),
                'necesidades_especiales': mascota.necesidades_especiales,
                'descripcion_necesidades': mascota.descripcion_necesidades,
                'convivencia_animales': mascota.get_convivencia_animales_display(),
                'convivencia_ninos': mascota.get_convivencia_ninos_display(),
                'descripcion': mascota.descripcion,
                'ubicacion': mascota.ubicacion,
                'protectora': {
                    'nombre': mascota.protectoraEncargada.username,
                    'email': mascota.protectoraEncargada.email,
                    'ciudad': mascota.protectoraEncargada.city
                },
                'fecha_publicacion': mascota.fecha_creacion.strftime('%d/%m/%Y')
            }
        })
    
    return render(request, 'mascotas/detalle.html', {'mascota': mascota})


@login_required
def mis_mascotas(request):
    """Vista para que las protectoras vean las mascotas que han publicado"""
    if not es_protectora(request.user):
        return JsonResponse({
            'success': False,
            'error': 'Acceso denegado'
        }, status=403)
    
    mascotas = Mascota.objects.filter(
        propietario=request.user
    ).order_by('-fecha_creacion')
    
    if request.headers.get('Accept') == 'application/json':
        mascotas_data = [{
            'id': m.id,
            'nombre': m.nombre,
            'especie': m.get_especie_display(),
            'genero': m.get_genero_display(),
            'edad': m.edad,
            'tamaño': m.get_tamaño_display(),
            'color': m.color,
            'foto_url': m.foto.url,
            'caracter': m.get_caracter_list(),
            'necesidades_especiales': m.necesidades_especiales,
            'ubicacion': m.ubicacion,
            'fecha_publicacion': m.fecha_creacion.strftime('%d/%m/%Y')
        } for m in mascotas]
        
        return JsonResponse({
            'success': True,
            'total': len(mascotas_data),
            'mascotas': mascotas_data
        })
    
    return render(request, 'mascotas/mis_mascotas.html', {
        'mascotas': mascotas,
        'total': mascotas.count()
    })


@login_required
def eliminar_mascota(request, mascota_id):
    """Permite a la protectora eliminar una mascota (por ejemplo, si ya fue adoptada)"""
 
    if request.method != 'DELETE' and request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    mascota = get_object_or_404(Mascota, id=mascota_id)
    
    # Verificar que el usuario sea el propietario
    if mascota.protectoraEncargada != request.user:
        return JsonResponse({
            'success': False,
            'error': 'No tienes permiso para eliminar esta mascota'
        }, status=403)
    
    nombre_mascota = mascota.nombre
    mascota.delete()
    
    return JsonResponse({
        'success': True,
        'message': f'{nombre_mascota} ha sido eliminado del listado'
    })

@login_required
def modificar_mascota(request, mascota_id):
    """Permite a la protectora modificar una mascota existente con un JSON de datos."""
    
    # 1. Verificación de Método HTTP
    # Usamos PUT o PATCH, que son los verbos REST para modificar
    if request.method not in ['PUT', 'PATCH']:
        return JsonResponse({'error': 'Método no permitido. Usa PUT o PATCH'}, status=405)
    
    mascota = get_object_or_404(Mascota, id=mascota_id)
    
    # 2. Verificación de Permisos (Propietario)
    if mascota.protectoraEncargada != request.user:
        return JsonResponse({
            'success': False,
            'error': 'No tienes permiso para modificar esta mascota'
        }, status=403)
    
    # 3. Lectura y parsing del JSON
    try:
        # Convierte el texto JSON crudo a un diccionario de Python
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Formato JSON inválido en la petición'}, status=400)
    
    # 4. Definición de Campos Bloqueados por Seguridad
    # Estos campos NUNCA deben poder modificarse dinámicamente con datos del usuario.
    CAMPOS_BLOQUEADOS = ['id', 'protectoraEncargada', 'fecha_creacion'] 
    
    # 5. Aplicación de la Modificación GENÉRICA y Segura
    for key, value in data.items():
        # Comprueba que el campo existe Y que NO es un campo bloqueado.
        if hasattr(mascota, key) and key not in CAMPOS_BLOQUEADOS: 
            setattr(mascota, key, value) # Aplica el valor dinámicamente
    
    # 6. Guardar los cambios y responder
    mascota.save()
    
    return JsonResponse({
        'success': True,
        'message': f'{mascota.nombre} ha sido modificada con éxito.'
    })