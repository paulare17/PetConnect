from django.db.models.signals import post_save
from django.dispatch import receiver
from mascotas.models import Interaccion 
from .models import Chat 

@receiver(post_save, sender=Interaccion)
def crear_chat_automatico(sender, instance, created, **kwargs):
    
    if created and instance.accion == Interaccion.LIKE:
        
        # 1. Obtenemos el usuario de la protectora usando la cadena de FKs
        try:
            # Mascota -> PerfilProtectora -> Usuario
            usuario_protectora = instance.mascota.protectoraEncargada.usuario 
        except AttributeError:
            print("ERROR: La mascota no tiene una protectora asignada o el PerfilProtectora no tiene el campo 'usuario'.")
            return

        # 2. Creamos el chat
        Chat.objects.get_or_create(
            mascota=instance.mascota,
            adoptante=instance.usuario,
            defaults={
                'protectora': usuario_protectora
            }
        )