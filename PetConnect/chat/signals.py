from django.db.models.signals import post_save
from django.dispatch import receiver
from mascotas.models import Interaccion 
from .models import Chat 

@receiver(post_save, sender=Interaccion)
def crear_chat_automatico(sender, instance, created, **kwargs):
    """
    Se ejecuta después de que se guarda un objeto Interaccion.
    Crea un objeto Chat si la acción fue 'Like' (L).
    """
    
    # 1. Verificar que la interacción sea nueva y sea un LIKE.
    if created and instance.accion == Interaccion.LIKE:
        
        # Obtenemos la instancia de PerfilProtectora. 
        # Puede ser None si el campo es NULL.
        protectora_encargada = instance.mascota.protectoraEncargada

        # 2. Solo procede si la mascota tiene una Protectora válida asignada (no es None)
        if protectora_encargada:
            
            # Obtenemos el objeto User vinculado al perfil de la protectora.
            usuario_protectora = protectora_encargada.usuario 
            
            # 3. Creamos el chat (si ya existe para esa mascota/adoptante, lo recupera)
            Chat.objects.get_or_create(
                mascota=instance.mascota,
                adoptante=instance.usuario,
                defaults={
                    'protectora': usuario_protectora
                }
            )
            
        else:
            # Opcional: Mensaje para indicar por qué no se creó el chat
            print(f"ALERTA: Mascota ID {instance.mascota.pk} no tiene Protectora asignada. Chat no creado.")