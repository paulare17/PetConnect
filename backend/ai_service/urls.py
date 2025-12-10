from django.urls import path
from . import views

urlpatterns = [
    # IA 3 (Generador de Bio)
    # Aquí se configurarán tus vistas de IA. 
    # Esta es la URL que usará Xavi para el endpoint /api/ia/generar-bio
    path('generar-bio/', views.GenerarBioIAView.as_view(), name='generar_bio'),
    # --- NUEVA RUTA PARA IA 1 (CHATBOT) ---
    path('chat/', views.ChatbotFAQView.as_view(), name='chatbot_faq'),
    # ---------------------------------------
    # --- NUEVA RUTA PARA IA 2 (RECOMENDACIÓN) ---
    path('recomendacion/', views.RecomendacionIAView.as_view(), name='recomendacion_ia'),
    # ---------------------------------------------
    # RUTA DE DEPURACIÓN (Solo para el equipo)
    path('debug-keys/', views.DebugKeysIAView.as_view(), name='debug_ia_keys'),
]