from django.db import models
from django.conf import settings
from mascotas.models import Mascota 

class Chat(models.Model):
    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, related_name='chats')
    adoptante = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chats_como_adoptante')
    protectora = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chats_como_protectora')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ('mascota', 'adoptante')
        verbose_name = "Sala de Chat"
        verbose_name_plural = "Salas de Chat"
    
    def tiene_mensajes(self):
        """Retorna True si el chat tiene al menos un mensaje."""
        return self.mensajes.exists()
    
    def __str__(self):
        return f"Chat: {self.adoptante.username} - {self.mascota.nombre} ({self.protectora.username})"

class Mensaje(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='mensajes')
    remitente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contenido = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['fecha_envio']