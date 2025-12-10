# from django.contrib import admin
# from django.contrib import admin
# from .models import Mascota

# @admin.register(Mascota)
# class MascotaAdmin(admin.ModelAdmin):
#     list_display = ('nombre', 'especie', 'genero', 'edad', 'tamaño', 'fecha_creacion')
#     list_filter = ('especie', 'genero', 'tamaño', 'necesidades_especiales', 'convivencia_animales', 'convivencia_ninos', 'fecha_creacion')
#     search_fields = ('nombre', 'descripcion', 'color', 'ubicacion', 'propietario__username')
#     readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    
#     fieldsets = (
#         ('Información Básica', {
#             'fields': ('nombre', 'especie', 'genero', 'edad', 'foto')
#         }),
#         ('Características Físicas', {
#             'fields': ('tamaño', 'peso', 'color')
#         }),
#         ('Personalidad y Comportamiento', {
#             'fields': ('caracter', 'convivencia_animales', 'convivencia_ninos')
#         }),
#         ('Necesidades Especiales', {
#             'fields': ('necesidades_especiales', 'descripcion_necesidades')
#         }),
#         ('Información Adicional', {
#             'fields': ('descripcion', 'ubicacion', 'propietario')
#         }),
#         ('Fechas', {
#             'fields': ('fecha_creacion', 'fecha_actualizacion'),
#             'classes': ('collapse',)
#         }),
#     )

from django.contrib import admin
from .models import Mascota, Interaccion

# Register your models here.
admin.site.register(Mascota)
admin.site.register(Interaccion)