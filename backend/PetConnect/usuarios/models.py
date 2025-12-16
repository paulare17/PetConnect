from django.db import models
from django.contrib.auth.models import AbstractUser
from multiselectfield import MultiSelectField
from django.db.models.signals import post_save
from django.dispatch import receiver
from mascotas.constants import (
    TAMANO_CHOICES,
    EDAD_CHOICES,
    SEXO_CHOICES,
    APTO_CON_CHOICES,
    ESTADO_LEGAL_SALUD_CHOICES,
    ESPECIE_CHOICES,
    NINOS_CHOICES,
    COMPANIA_ANIMAL_CHOICES,
    NIVEL_EXPERIENCIA_CHOICES,
)


ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('usuario', 'Usuario'),
        ('protectora', 'Protectora')
    ]

class Usuario(AbstractUser):

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=100, default="Barcelona")
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='usuario')
    USERNAME_FIELD = 'username'
    
    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_usuario')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='usuario', editable=False)

    # Contacto / ubicación
    telefono = models.CharField(max_length=15, blank=True, null=True)
    barrio = models.CharField(max_length=100, blank=True, null=True)  

    # Datos personales
    fecha_nacimiento = models.DateField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    foto_perfil = models.ImageField(upload_to='perfils/', blank=True, null=True)

    # Género usuario
    GENERO_CHOICES = [
        ('M', 'Masculí'),
        ('F', 'Femení'),
        ('O', 'Altres'),
        ('N', 'Preferisc no dir-ho')
    ]
    genero = models.CharField(max_length=1, choices=GENERO_CHOICES, blank=True, null=True)


    # Composición del hogar
    tiene_ninos = models.BooleanField(
        default=False,
        verbose_name="¿Tiene niños en casa?",
        help_text="Marque si hay menores de edad en el hogar"
    )
    tiene_perros = models.BooleanField(
        default=False,
        verbose_name="¿Tiene perros actualmente?",
        help_text="Marque si ya tiene perros en casa"
    )
    tiene_gatos = models.BooleanField(
        default=False,
        verbose_name="¿Tiene gatos actualmente?",
        help_text="Marque si ya tiene gatos en casa"
    )
    tiene_otros_animales = models.BooleanField(
        default=False,
        verbose_name="¿Tiene otros animales?",
        help_text="Conejos, pájaros, roedores, etc."
    )
    
    # Experiencia con mascotas
    es_primerizo = models.BooleanField(
        default=True,
        verbose_name="¿Es su primera mascota?",
        help_text="Marque si nunca ha tenido mascotas antes"
    )
    tiene_licencia_ppp = models.BooleanField(
        default=False,
        verbose_name="¿Tiene licencia PPP?",
        help_text="Licencia para Perros Potencialmente Peligrosos"
    )
    
    # Ubicacion detallada
    codigo_postal = models.CharField(
        max_length=10, 
        blank=True, 
        null=True,
        verbose_name="Código Postal",
        help_text="Para buscar mascotas cercanas"
    )

    # Preferencias de adopción
    preferencias_especie = MultiSelectField(
        choices=ESPECIE_CHOICES, 
        blank=True, 
        verbose_name="Especie(s) Preferida(s)",
        help_text="Selecciona si prefieres perro, gato o ambos"
    )
    preferencias_tamano = MultiSelectField(choices=TAMANO_CHOICES, blank=True, verbose_name="Tamaño(s) Preferido(s)")
    preferencias_edad = MultiSelectField(choices=EDAD_CHOICES, blank=True, verbose_name="Edad(es) Preferida(s)")
    preferencias_sexo = MultiSelectField(choices=SEXO_CHOICES, blank=True, verbose_name="Sexo Preferido")
    
    # Ya no se usa para matching, se calcula automáticamente con los campos de situación personal
    preferencias_convivencia = MultiSelectField(
        choices=APTO_CON_CHOICES, 
        max_length=200, 
        blank=True,
        verbose_name="[LEGACY] Apto para Convivir con (Búsqueda)"
    )
    preferencias_estado_basico = MultiSelectField(
        choices=ESTADO_LEGAL_SALUD_CHOICES, 
        max_length=100, 
        blank=True,
        verbose_name="Estado de Salud/Legal Mínimo"
    )
    acepta_condicion_especial = models.BooleanField(
        default=False,
        verbose_name="¿Acepta mascotas con condiciones o necesidades especiales?",
        help_text="Marque 'Sí' si está dispuesto a adoptar una mascota que requiera cuidados extra (medicación, dieta especial, o condición crónica)."
    )

    class Meta:
        db_table = 'perfil_usuario'
        verbose_name = 'Perfil Usuario'
        verbose_name_plural = 'Perfiles Usuarios'

    def __str__(self):
        return self.usuario.username


class PerfilProtectora(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_protectora')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='protectora', editable=False)
    # Información básica
    cif = models.CharField(max_length=20, unique=True, blank=True, null=True)
    num_registro_asociacion = models.CharField(max_length=100, blank=True, null=True)
    ENTIDAD_CHOICES = [
        ('asociacion', 'Asociación'),
        ('fundacion', 'Fundación'),
    ]
    tipo_entidad_juridica = models.CharField(max_length=20, choices=ENTIDAD_CHOICES, blank=True, null=True)
     
    # Direcciones
    direccion_juridica = models.TextField(blank=True, null=True)
    calle_juridica = models.CharField(max_length=200, blank=True, null=True)
    numero_juridica = models.CharField(max_length=10, blank=True, null=True)
    poblacion_juridica = models.CharField(max_length=100, blank=True, null=True)
    codigo_postal_juridica = models.CharField(max_length=10, blank=True, null=True)
    
    direccion_refugio = models.TextField(blank=True, null=True)
    calle_refugio = models.CharField(max_length=200, blank=True, null=True)
    numero_refugio = models.CharField(max_length=10, blank=True, null=True)
    poblacion_refugio = models.CharField(max_length=100, blank=True, null=True)
    codigo_postal_refugio = models.CharField(max_length=10, blank=True, null=True)
    
    # Contacto
    web = models.URLField(blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    telefono_emergencia = models.CharField(max_length=15, blank=True, null=True)
    
    # Información sobre animales
    
    capacidad_maxima_animales = models.IntegerField(blank=True, null=True)
    ANIMAL_CHOICES = [
        ('perro', 'Perro'),
        ('gato', 'Gato'),
    ]

    tipo_animal = models.CharField(max_length=10, choices=ANIMAL_CHOICES, blank=True, null=True)
    
    # Información organizativa
    ano_fundacion = models.IntegerField(blank=True, null=True)
    nucleo_zoologico = models.CharField(max_length=50, blank=True, null=True)
    ambito_geografico = models.CharField(max_length=200, blank=True, null=True)
    
    # Servicios y procesos
    requisitos_adopcion = models.TextField(blank=True, null=True)
    proceso_adopcion = models.TextField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    SERVICIOS_CHOICES = [
        ('recogida', 'Recogida de animales abandonados'),
        ('alojamiento', 'Alojamiento'),
        ('esterilizacion', 'Esterilización'),
        ('localizacion', 'Localización de propietarios'),
        ('adopcion', 'Adopción'),
    ]

    servicios = MultiSelectField(choices=SERVICIOS_CHOICES, blank=True)

    class Meta:
        db_table = 'perfil_protectora'
        verbose_name = 'Protectora'
        verbose_name_plural = 'Protectoras'
    
    def __str__(self):
        return self.usuario.username
        
        

@receiver(post_save, sender=Usuario)
def create_or_sync_profile(sender, instance, created, **kwargs):
    
    # Crear el perfil correspondiente al rol en la creación
    if created:
        if instance.role == 'protectora':
            PerfilProtectora.objects.get_or_create(usuario=instance, defaults={'role': instance.role})
        else:
            PerfilUsuario.objects.get_or_create(usuario=instance, defaults={'role': instance.role})
        return

    # Sincronizar roles si ya existen perfiles
    if hasattr(instance, 'perfil_usuario'):
        p = instance.perfil_usuario
        if p.role != instance.role:
            p.role = instance.role
            p.save(update_fields=['role'])
    if hasattr(instance, 'perfil_protectora'):
        p = instance.perfil_protectora
        if p.role != instance.role:
            p.role = instance.role
            p.save(update_fields=['role'])
