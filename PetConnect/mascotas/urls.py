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


from django.urls import path
from . import views

# ELIMINAMOS el router.register(r'mascota', ...) aquí.

# app_name = 'mascotas'

urlpatterns = [
    # Estas rutas se montarán BAJO el prefijo 'api/' del archivo principal.
    
    # Rutas de Swipe/Feed (nombres nuevos)
    path('feed/next-card/', views.get_next_card, name='api_get_next_card'), 
    path('swipe/action/', views.swipe_action, name='api_swipe_action'),
    
    # Alias para compatibilidad con frontend (mismo backend, diferentes URLs)
    path('tinderpet/next/', views.get_next_card, name='api_tinderpet_next'),
    path('tinderpet/action/', views.swipe_action, name='api_tinderpet_action'),
    
    # Endpoint para obtener opciones del formulario desde el modelo
    path('form-choices/', views.get_form_choices, name='get_form_choices'),
    
    # Endpoint para generar descripción con IA
    path('generate-description/', views.generate_description, name='generate_description'),
    
    # path('upload/', views.subir_mascota, name='api_subir_mascota'),  # Comentado porque la función no existe
]