from django.db import models
from django.db import models
from django.conf import settings
from usuarios.models import PerfilProtectora

class Mascota(models.Model):
    # Especies
    ESPECIES = [
        ('perro', 'Perro'),
        ('gato', 'Gato'),
    ]
    
    # Género
    GENERO = [
        ('macho', 'Macho'),
        ('hembra', 'Hembra'),
    ]

    # Razas (ejemplos, ampliar)
    RAZAS_PERROS = [
        ('mestizo', 'Mestizo'),
        ('labrador', 'Labrador Retriever'),
        ('pastor_aleman', 'Pastor Alemán'),
        ('bulldog', 'Bulldog Inglés'),
        ('beagle', 'Beagle'),
        ('siames', 'Siamés'),
        ('persa', 'Persa'),
    ]

    RAZAS_GATOS = [
        ('mestizo', 'Mestizo'),
        ('siames', 'Siamés'),
        ('persa', 'Persa'),
    ]
    
    # Tamaño
    TAMAÑO = [
        ('pequeño', 'Pequeño (0-10kg)'),
        ('mediano', 'Mediano (10-25kg)'),
        ('grande', 'Grande (25-45kg)'),
        ('gigante', 'Gigante (+45kg)'),
    ]
    
    # Carácter (ejemplos, ampliar)
    CARACTER = [
        ('cariñoso', 'Cariñoso'),
        ('jugueton', 'Juguetón'),
        ('tranquilo', 'Tranquilo'),
        ('activo', 'Activo'),
        ('sociable', 'Sociable'),
        ('independiente', 'Independiente'),
        ('protector', 'Protector'),
        ('timido', 'Tímido'),
        ('obediente', 'Obediente'),
    ]
    
    # Convivencia con animales
    CONVIVENCIA_ANIMALES = [
        ('no', 'No puede convivir con otros animales'),
        ('misma_especie', 'Solo con animales de su misma especie'),
        ('cualquier_especie', 'Puede convivir con cualquier animal'),
    ]
    
    # Datos básicos
    nombre = models.CharField(max_length=100, help_text="Introduzca el nombre del animal", verbose_name="Nombre")
    foto = models.ImageField(upload_to='animal_pics/', blank=True, null=True)
    especie = models.CharField(max_length=10, choices=ESPECIES, default='gato', verbose_name="Especie")
    raza_perro = models.CharField(max_length=150, choices=RAZAS_PERROS, default='mestizo', verbose_name="Raza")
    raza_gato = models.CharField(max_length=150, choices=RAZAS_GATOS, default='mestizo', verbose_name="Raza")
    genero = models.CharField(max_length=10, choices=GENERO, default='hembra', verbose_name="Género")
    edad = models.PositiveIntegerField(default=0, help_text="Edad en años", verbose_name="Edad")
    # protectoraEncargada = models.ForeignKey(PerfilProtectora, on_delete=models.CASCADE, related_name='mascotas', verbose_name="Protectora Encargada")
    
    # otras características físicas
    color = models.CharField(max_length=100, default='marrón', verbose_name="Color")
    foto = models.ImageField(upload_to='mascotas/', verbose_name="Foto")

    # Carácter
    caracter = models.CharField(max_length=20, choices=CARACTER, default='cariñoso', verbose_name="Carácter")
    
    # Convivencia
    convivencia_animales = models.CharField(max_length=20, choices=CONVIVENCIA_ANIMALES, default='no', verbose_name="¿Puede convivir con otros animales?")
    convivencia_ninos = models.BooleanField(default=False, verbose_name="¿Puede convivir con niños?")
    
    #estado de salud
    desparasitado = models.BooleanField(default=False, help_text="¿Está desparasitado?")
    esterilizado = models.BooleanField(default=False, help_text="¿Está esterilizado?")
    con_microchip = models.BooleanField(default=False, help_text="¿Tiene microchip?")
    vacunado = models.BooleanField(default=False, help_text="¿Está vacunado?")
    

    # Necesidades especiales
    necesidades_especiales = models.BooleanField(default=False, verbose_name="¿Tiene necesidades especiales?")
    descripcion_necesidades = models.TextField(blank=True, null=True, verbose_name="Descripción de necesidades especiales")

    #estado del perfil
    adoptado = models.BooleanField(default=False)
    oculto = models.BooleanField(default=False)

    # Fechas
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    #vinculación con protectora
    protectora = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mascotas'
    )
    
    def __str__(self):
        return f"{self.nombre} ({self.especie})"
    
    def get_caracter_list(self):
        """Retorna el carácter como lista"""
        return [c.strip() for c in self.caracter.split(',') if c.strip()]
    
    class Meta:
        db_table = 'mascotas'
        verbose_name = "Mascota"
        verbose_name_plural = "Mascotas"
        ordering = ['-fecha_creacion']