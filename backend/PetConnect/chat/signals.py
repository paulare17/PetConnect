from django.db.models.signals import post_save
from django.dispatch import receiver
from mascotas.models import Interaccion 
from .models import Chat 

# Signal deshabilitado - El chat se crea directamente en la vista swipe_action
# para tener mejor control del flujo

# @receiver(post_save, sender=Interaccion)
# def crear_chat_automatico(sender, instance, created, **kwargs):
#     """
#     Se ejecuta después de que se guarda un objeto Interaccion.
#     Crea un objeto Chat si la acción fue 'Like' (L).
#     """
#     
#     # 1. Verificar que la interacción sea nueva y sea un LIKE.
#     if created and instance.accion == Interaccion.LIKE:
#         
#         # La mascota tiene directamente el usuario protectora
#         usuario_protectora = instance.mascota.protectora
#         
#         # 2. Solo procede si la mascota tiene una Protectora válida asignada
#         if usuario_protectora:
#             
#             # 3. Creamos el chat (si ya existe para esa mascota/adoptante, lo recupera)
#             Chat.objects.get_or_create(
#                 mascota=instance.mascota,
#                 adoptante=instance.usuario,
#                 defaults={
#                     'protectora': usuario_protectora
#                 }
#             )
#             
#         else:
#             print(f"ALERTA: Mascota ID {instance.mascota.pk} no tiene Protectora asignada. Chat no creado.")