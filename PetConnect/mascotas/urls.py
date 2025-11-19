from django.urls import path
from . import views

app_name = 'mascotas'

urlpatterns = [
    # Vista pública para ver todas las mascotas disponibles
    path('', views.listar_mascotas, name='listado'),
    path('listar/', views.listar_mascotas, name='listar_mascotas'),
    
    # Vista de detalle de una mascota
    path('<int:mascota_id>/', views.detalle_mascota, name='detalle'),
    
    # Vistas para protectoras (requieren autenticación)
    path('subir/', views.subir_mascota, name='subir_mascota'),
    path('mis-mascotas/', views.mis_mascotas, name='mis_mascotas'),
    path('eliminar/<int:mascota_id>/', views.eliminar_mascota, name='eliminar_mascota'),
]