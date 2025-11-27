from rest_framework import serializers
from .models import Chat, Mensaje 
from usuarios.models import Usuario 

class MensajeSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Mensaje. Usado para el detalle del chat y envío.
    """
    # Campo de solo lectura para exponer el nombre de usuario del emisor
    # Accede a Mensaje.emisor.username
    emisor_username = serializers.CharField(source='emisor.username', read_only=True)

    class Meta:
        model = Mensaje
        # Para GET (lectura): Retornamos el ID, username, contenido y timestamp.
        # Para POST (escritura): Solo necesitamos 'contenido'.
        fields = ['id', 'emisor_username', 'contenido', 'timestamp']
        
        # Estos campos son de solo lectura y se asignan en la vista
        read_only_fields = ['id', 'emisor_username', 'timestamp']

class ChatSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Chat. Usado para la bandeja de entrada (listado).
    """
    
    # Campos de solo lectura para exponer los nombres de usuario
    # Accede a Chat.adoptante.username
    adoptante_username = serializers.CharField(source='adoptante.username', read_only=True)
    # Accede a Chat.protectora.usuario.username
    protectora_username = serializers.CharField(source='protectora.usuario.username', read_only=True)
    
    # Campos calculados
    ultimo_mensaje = serializers.SerializerMethodField()
    num_mensajes = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        # Retorna el ID del chat, IDs de FKs y los campos calculados
        fields = [
            'id', 'mascota', 'adoptante', 'adoptante_username', 
            'protectora', 'protectora_username', 'num_mensajes', 
            'activo', 'ultimo_mensaje'
        ]
        read_only_fields = fields # Todo en el listado de chats es de solo lectura
        
    def get_num_mensajes(self, obj):
        """Retorna la cantidad total de mensajes en el chat."""
        # obj.mensajes hace referencia al related_name del ForeignKey en Mensaje
        return obj.mensajes.count()
        
    def get_ultimo_mensaje(self, obj):
        """Retorna el contenido y timestamp del último mensaje enviado."""
        last_message = obj.mensajes.order_by('-timestamp').first()
        if last_message:
            # Retornamos un diccionario JSON con los datos del último mensaje
            return {
                'contenido': last_message.contenido, 
                'timestamp': last_message.timestamp
            }
        return None