from rest_framework.routers import DefaultRouter
from . import views 

# Configuración del Router
router = DefaultRouter()

# Registramos el ChatViewSet
# La base es 'chats'. Esto generará: /api/chat/chats/
router.register(r'chats', views.ChatViewSet, basename='chat')

# ¡La corrección clave! Asigna directamente las URLs del router a urlpatterns.
urlpatterns = router.urls