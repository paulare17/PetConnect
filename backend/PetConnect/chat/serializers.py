from rest_framework import serializers
from .models import Chat, Mensaje 
from usuarios.models import Usuario 

class MensajeSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Mensaje. Usado para el detalle del chat y envío.
    """
    # Campo de solo lectura para exponer el nombre de usuario del remitente
    remitente_username = serializers.CharField(source='remitente.username', read_only=True)

    class Meta:
        model = Mensaje
        # Para GET (lectura): Retornamos el ID, username, contenido y fecha_envio.
        # Para POST (escritura): Solo necesitamos 'contenido'.
        fields = ['id', 'remitente_username', 'contenido', 'fecha_envio']
        
        # Estos campos son de solo lectura y se asignan en la vista
        read_only_fields = ['id', 'remitente_username', 'fecha_envio']

class ChatSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Chat. Usado para la bandeja de entrada (listado).
    """
    
    # Campos de solo lectura para exponer los nombres de usuario
    # Accede a Chat.adoptante.username
    adoptante_username = serializers.CharField(source='adoptante.username', read_only=True)
    # Accede a Chat.protectora.username
    protectora_username = serializers.CharField(source='protectora.username', read_only=True)
    
    # Información de la mascota
    mascota_nombre = serializers.CharField(source='mascota.nombre', read_only=True)
    mascota_foto = serializers.ImageField(source='mascota.foto_principal', read_only=True)
    
    # Camps calculats
    ultimo_mensaje = serializers.SerializerMethodField()
    num_mensajes = serializers.SerializerMethodField()
    num_no_llegits = serializers.SerializerMethodField()
    tiene_mensajes = serializers.SerializerMethodField()
    protectora_info = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        # Retorna el ID del chat, IDs de FKs y los campos calculados
        fields = [
            'id', 'mascota', 'mascota_nombre', 'mascota_foto',
            'adoptante', 'adoptante_username', 
            'protectora', 'protectora_username', 
            'num_mensajes', 'num_no_llegits', 'tiene_mensajes',
            'activo', 'ultimo_mensaje', 'fecha_creacion', 'protectora_info'
        ]
        read_only_fields = fields # Todo en el listado de chats es de solo lectura
        
    def get_num_mensajes(self, obj):
        """Retorna la cantidad total de mensajes en el chat."""
        # obj.mensajes hace referencia al related_name del ForeignKey en Mensaje
        return obj.mensajes.count()
    
    def get_num_no_llegits(self, obj):
        """Retorna el nombre de missatges no llegits per l'usuari actual."""
        request = self.context.get('request')
        if not request or not request.user:
            return 0
        # Missatges no llegits són els que NO ha enviat l'usuari actual i no estan marcats com llegits
        return obj.mensajes.filter(leido=False).exclude(remitente=request.user).count()
    
    def get_tiene_mensajes(self, obj):
        """Retorna True si el chat tiene al menos un mensaje."""
        return obj.tiene_mensajes()
        
    def get_ultimo_mensaje(self, obj):
        """Retorna el contenido y timestamp del último mensaje enviado."""
        last_message = obj.mensajes.order_by('-fecha_envio').first()
        if last_message:
            # Retornamos un diccionario JSON con los datos del último mensaje
            return {
                'contenido': last_message.contenido, 
                'fecha_envio': last_message.fecha_envio,
                'remitente': last_message.remitente.username
            }
        return None

    def get_protectora_info(self, obj):
        """Inclou dades bàsiques de contacte i, si existeix, el camp d'horaris de la protectora."""
        user = obj.protectora
        info = {
            'username': getattr(user, 'username', None),
            'email': getattr(user, 'email', None),
        }
        perfil = getattr(user, 'perfil_protectora', None)
        if perfil:
            info.update({
                'telefono': getattr(perfil, 'telefono', None),
                'telefono_emergencia': getattr(perfil, 'telefono_emergencia', None),
                'web': getattr(perfil, 'web', None),
                'instagram': getattr(perfil, 'instagram', None),
                # Intenta diversos noms comuns per als horaris
                'horaris': getattr(perfil, 'horaris', None) or getattr(perfil, 'horarios', None) or getattr(perfil, 'horari', None),
            })
        return info