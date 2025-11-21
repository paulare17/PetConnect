from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from usuario.views import UsuarioViewSet, PerfilUsuarioViewSet, PerfilProtectoraViewSet

router = DefaultRouter()
router.register(r'users', UsuarioViewSet)
router.register(r'user-profiles', PerfilUsuarioViewSet)
router.register(r'protectora-profiles', PerfilProtectoraViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('usuario/', include('usuario.urls')),
    path('mascotas/', include('mascotas.urls')), 
]
