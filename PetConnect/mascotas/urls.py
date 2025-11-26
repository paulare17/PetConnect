# from django.urls import path
# from . import views

# app_name = 'mascotas'

# urlpatterns = [
#     # Vista pública para ver todas las mascotas disponibles
#     path('', views.listar_mascotas, name='listado'),
#     path('listar/', views.listar_mascotas, name='listar_mascotas'),
    
#     # Vista de detalle de una mascota
#     path('<int:mascota_id>/', views.detalle_mascota, name='detalle'),
    
#     # Vistas para protectoras (requieren autenticación)
#     path('subir/', views.subir_mascota, name='subir_mascota'),
#     path('mis-mascotas/', views.mis_mascotas, name='mis_mascotas'),
#     path('eliminar/<int:mascota_id>/', views.eliminar_mascota, name='eliminar_mascota'),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# 1. Configuración del Router para el ViewSet
# El router genera automáticamente las rutas: 
# /api/mascotas/mascota/ (GET, POST)
# /api/mascotas/mascota/{pk}/ (GET, PUT, PATCH, DELETE)
# /api/mascotas/mascota/mis_mascotas/ (GET)
router = DefaultRouter()
# Registramos el ViewSet principal
router.register(r'mascota', views.MascotaViewSet) 

app_name = 'mascotas'

urlpatterns = [
    # --- RUTAS DE DRF GENERADAS POR EL ROUTER ---
    # Esto incluye el CRUD básico y la acción 'mis_mascotas'
    path('api/', include(router.urls)),
    
    # --- RUTAS DE SWIPE (TINDER) Y FEED ---
    # Estas son las API Views que implementamos
    path('api/feed/next-card/', views.get_next_card, name='api_get_next_card'), # [GET] Próxima tarjeta
    path('api/swipe/action/', views.swipe_action, name='api_swipe_action'),     # [POST] Registrar Like/Dislike
    
    # --- RUTAS DE DRF MANUALES ---
    # Usamos la vista 'subir_mascota' si sigue siendo un @api_view
    path('api/upload/', views.subir_mascota, name='api_subir_mascota'),

    # --- (OPCIONAL) RUTAS DE VISTAS TRADICIONALES ---
    # Si estas vistas aún existen y no usan DRF, las mantenemos. 
    # Si has migrado todo a DRF, deberías eliminarlas.
    
    # path('', views.listar_mascotas, name='listado'),
    # path('listar/', views.listar_mascotas, name='listar_mascotas'),
    # path('<int:mascota_id>/', views.detalle_mascota, name='detalle'),
    # path('eliminar/<int:mascota_id>/', views.eliminar_mascota, name='eliminar_mascota'),
    # path('mis-mascotas/', views.mis_mascotas, name='mis_mascotas'), # Ya cubierta por /api/mascota/mis_mascotas/
]