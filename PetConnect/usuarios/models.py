from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractUser
from multiselectfield import MultiSelectField
# Hace falta instalar django-multiselectfield para poder seleccionar múltiples opciones en un campo

class Usuario(AbstractUser):

    # AbstractUser ya incluye id, password y username (pero username lo dejo)
    # REGISTRO RÁPIDO
    # user_id = models.AutoField(primary_key=True)
    # password = models.CharField(max_length=128)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    # city = models.CharField(max_length=100)

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('usuario', 'Usuario'),
        ('protectora', 'Protectora')
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='usuario')
    USERNAME_FIELD = 'username'
    
    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_usuario')

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

    # Especie de interés (gato / perro)
    ESPECIE_CHOICES = [
        ('perro', 'Perro'),
        ('gato', 'Gato'),
    ]
    especie = models.CharField(max_length=10, choices=ESPECIE_CHOICES, blank=True, null=True)

    # Necesidades y experiencia
    necesidades_especiales = models.BooleanField(default=False)
    mascota_previa = models.BooleanField(default=False)

    # Vivienda y niños
    CASA_CHOICES = [
        ('apartamento', 'Apartamento'),
        ('casa_pequeña', 'Casa pequeña'),
        ('casa_grande', 'Casa grande'),
        ('casa_con_jardin', 'Casa con jardín'),
        ('finca', 'Finca/Casa rural')
    ]
    tipo_vivienda = models.CharField(max_length=20, choices=CASA_CHOICES, blank=True, null=True)
    tiene_ninos = models.BooleanField(default=False)

    # Actividad familiar / preferencias para mascota
    ACTIVIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta')
    ]
    nivel_actividad_familiar = models.CharField(max_length=10, choices=ACTIVIDAD_CHOICES, blank=True, null=True)

    TAMANO_CHOICES = [
        ('pequeno', 'Pequeño'),
        ('mediano', 'Mediano'),
        ('grande', 'Grande'),
    ]
    preferencias_tamano = MultiSelectField(choices=TAMANO_CHOICES, blank=True)

    EDAD_CHOICES = [
        ('cachorro', 'Cachorro'),
        ('joven', 'Joven'),
        ('adulto', 'Adulto'),
        ('senior', 'Senior'),
    ]
    preferencias_edad = MultiSelectField(choices=EDAD_CHOICES, blank=True)

    SEXO_CHOICES = [
        ('macho', 'Macho'),
        ('hembra', 'Hembra'),
    ]
    preferencias_sexo = MultiSelectField(choices=SEXO_CHOICES, blank=True)

    # Campos específicos
    deporte_ofrecible = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Deportes/actividades que se le pueden ofrecer (solo para perros)"
    )
    tiempo_en_casa_para_gatos = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Tiempo que pasa en casa (útil para gatos)"
    )

    class Meta:
        db_table = 'perfil_usuario'
        verbose_name = 'Perfil Usuario'
        verbose_name_plural = 'Perfiles Usuarios'

    def __str__(self):
        return self.usuario.username


class PerfilProtectora(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_protectora')
    
    # Información básica
    nombre_protectora = models.CharField(max_length=200, blank=True, null=True)
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
        return self.nombre_protectora or self.usuario.username
        
        


