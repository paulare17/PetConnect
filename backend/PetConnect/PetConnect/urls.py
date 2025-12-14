from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from usuarios.views import UsuarioViewSet, PerfilUsuarioViewSet, PerfilProtectoraViewSet
from mascotas.views import MascotaViewSet, get_next_card, swipe_action

# Configuración del Router (rutas DRF automáticas)
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'perfil-usuario', PerfilUsuarioViewSet, basename='perfil-usuario')
router.register(r'perfil-protectora', PerfilProtectoraViewSet, basename='perfil-protectora')
router.register(r'mascota', MascotaViewSet, basename='mascota')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rutas API: Router (CRUD básico y /mascota/mis_mascotas/)
    path('', include(router.urls)),
    path('api/', include(router.urls)),
    
    path('ia/', include('ai_service.urls')),
    path('api/ia/', include('ai_service.urls')),
    # Rutas API: Manuales de la aplicación 'mascotas' (Swipe/Feed/Upload)
    path('', include('mascotas.urls')), 
    path('api/', include('mascotas.urls')), 
    
    # Rutas API: Chat
    path('chat/', include('chat.urls')),
    path('api/chat/', include('chat.urls')), 
       
    # Rutas de Autenticación JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Rutes de PetTinder
    path('api/petmatch/next/', get_next_card, name='petmatch-next'),
    path('api/petmatch/action/', swipe_action, name='petmatch-action'),
]

# Servir arxius media en desenvolupament (fotos de mascotes)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)