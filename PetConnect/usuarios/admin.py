from django.contrib import admin
from .models import Usuario, PerfilProtectora, PerfilUsuario

# Register your models here.
admin.site.register(Usuario)
admin.site.register(PerfilUsuario)
admin.site.register(PerfilProtectora)