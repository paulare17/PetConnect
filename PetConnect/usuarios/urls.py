from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, PerfilUsuarioViewSet, PerfilProtectoraViewSet


router = DefaultRouter()
router.register(r'usuario', UsuarioViewSet)
router.register(r'perfil-usuario', PerfilUsuarioViewSet)
router.register(r'perfil-protectora', PerfilProtectoraViewSet)

urlpatterns = [
    path("", include(router.urls))
 ]



""""

===  ===
GET       /api/usuarios/                          → Llistar usuaris (segons permisos)
POST      /api/usuarios/                          → Registrar usuari nou
GET       /api/usuarios/{id}/                     → Obtenir usuari específic
PUT       /api/usuarios/{id}/                     → Actualitzar usuari complet
PATCH     /api/usuarios/{id}/                     → Actualitzar camps específics
DELETE    /api/usuarios/{id}/                     → Eliminar usuari
POST      /api/usuarios/login/                    → Login (retorna token)
POST      /api/usuarios/logout/                   → Logout
GET       /api/usuarios/profile/                  → Perfil usuari actual
POST      /api/usuarios/{id}/change-password/     → Canviar contrasenya

"""