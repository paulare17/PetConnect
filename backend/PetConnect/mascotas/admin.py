from django.contrib import admin
from .models import Mascota, Interaccion

# Registra los modelos 
admin.site.register(Mascota)
admin.site.register(Interaccion)