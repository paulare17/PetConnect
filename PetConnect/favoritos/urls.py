from django.urls import path
from . import views

urlpatterns = [
    # Capturamos el tipo de objeto y el ID
    path('toggle/<str:object_type>/<int:object_id>/', 
         views.toggle_like, 
         name='toggle_like'),
]