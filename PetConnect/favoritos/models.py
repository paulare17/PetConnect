from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Favorito(models.Model):
    # ¿Quién lo marcó?
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # ¿Qué tipo de objeto es (Perro o Gato)?
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)

    # ¿Cuál es su ID específica?
    object_id = models.PositiveIntegerField()

    # Interfaz para acceder al objeto real (Perro o Gato)
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        # Clave única para evitar likes duplicados
        unique_together = ('usuario', 'content_type', 'object_id')
        verbose_name_plural = 'Favoritos'