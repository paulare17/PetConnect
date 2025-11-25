from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from usuarios.views import UsuarioViewSet, PerfilUsuarioViewSet, PerfilProtectoraViewSet
from mascotas.views import MascotaViewSet

router = DefaultRouter()
# Registra aquí tots els viewsets de totes les apps
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'perfil-usuario', PerfilUsuarioViewSet, basename='perfil-usuario')
router.register(r'perfil-protectora', PerfilProtectoraViewSet, basename='perfil-protectora')
router.register(r'mascota', MascotaViewSet, basename='mascota')

urlpatterns = [
    path('admin/', admin.site.urls),
    # Prefix opcional, per exemple '/api/' → /api/usuario/, /api/mascota/, ...
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   
]