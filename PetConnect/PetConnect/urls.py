from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from usuarios.views import UsuarioViewSet, PerfilUsuarioViewSet, PerfilProtectoraViewSet
from mascotas.views import MascotaViewSet

router = DefaultRouter()
# Registra aquí tots els viewsets de totes les apps
router.register(r'usuario', UsuarioViewSet, basename='usuario')
router.register(r'perfil-usuario', PerfilUsuarioViewSet, basename='perfil-usuario')
router.register(r'perfil-protectora', PerfilProtectoraViewSet, basename='perfil-protectora')
router.register(r'mascota', MascotaViewSet, basename='mascota')

urlpatterns = [
    path('admin/', admin.site.urls),
    # Prefix opcional, per exemple '/api/' → /api/usuario/, /api/mascota/, ...
    path('api/', include(router.urls)),
]