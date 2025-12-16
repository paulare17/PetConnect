from django.urls import path
from . import views


urlpatterns = [
    # Estas rutas se montarán BAJO el prefijo 'api/' del archivo principal.
    
    # Rutas de Swipe/Feed (nombres nuevos)
    path('feed/next-card/', views.get_next_card, name='api_get_next_card'), 
    path('swipe/action/', views.swipe_action, name='api_swipe_action'),
    path('preferits/', views.get_user_preferits, name='api_preferits'),
    path('favoritos/', views.favoritos, name='api_favoritos'),  # Endpoint que retorna les mascotes preferides
    # Alias para compatibilidad con frontend (mismo backend, diferentes URLs)
    path('tinderpet/next/', views.get_next_card, name='api_tinderpet_next'),
    path('tinderpet/action/', views.swipe_action, name='api_tinderpet_action'),
    # Rutas PetTinder (usadas por el componente PetTinder.jsx)
    path('petmatch/next/', views.get_next_card, name='api_petmatch_next'),
    path('petmatch/action/', views.swipe_action, name='api_petmatch_action'),
]