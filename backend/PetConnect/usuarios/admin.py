from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, PerfilUsuario, PerfilProtectora


class UsuarioAdmin(UserAdmin):
    """Admin personalitzat per Usuario que hasheja contrasenyes correctament"""
    model = Usuario
    
    # Camps a mostrar a la llista d'usuaris
    list_display = ('username', 'email', 'role', 'city', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active', 'city')
    search_fields = ('username', 'email', 'city')
    ordering = ('username',)
    
    # Camps al formulari d'edició
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informació personal', {'fields': ('email', 'city')}),
        ('Rol', {'fields': ('role',)}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Camps al formulari de creació (nou usuari)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'city'),
        }),
    )


admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(PerfilUsuario)
admin.site.register(PerfilProtectora)