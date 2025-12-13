# chat/views.py

from django.shortcuts import get_object_or_404
from django.db.models import Q

# Importaciones de DRF
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

# Importaciones locales (Modelos y Serializers)
from .models import Chat, Mensaje
from .serializers import ChatSerializer, MensajeSerializer
# Asumiendo que PerfilProtectora es accesible a través de Chat.protectora
# y que PerfilProtectora.usuario es el User.

class ChatViewSet(viewsets.GenericViewSet):
    """
    ViewSet que maneja la lógica de la API de chat: listar, ver mensajes y enviar mensajes.
    Las URLs base son generadas por el router en chat/urls.py: /api/chat/chats/
    """
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    # Solo usuarios autenticados pueden acceder a cualquier endpoint de chat
    permission_classes = [permissions.IsAuthenticated] 

    def get_queryset(self):
        """
        Retorna solo los chats en los que el usuario autenticado participa.
        - Adoptante: ve todos sus chats (incluso sin mensajes)
        - Protectora: solo ve chats que tienen al menos un mensaje
        """
        user = self.request.user
        
        # Filtrar chats donde el usuario participa
        chats = self.queryset.filter(
            Q(adoptante=user) | Q(protectora=user) 
        )
        
        # Si el usuario es protectora, filtrar solo chats con mensajes
        # Verificar si el usuario tiene perfil de protectora
        from usuarios.models import PerfilProtectora
        es_protectora = PerfilProtectora.objects.filter(usuario=user).exists()
        
        if es_protectora:
            # Solo mostrar chats que tienen mensajes
            chats = chats.filter(mensajes__isnull=False).distinct()
        
        return chats.order_by('-fecha_creacion')

    # 1. LISTAR CHATS (Bandeja de entrada)
    # GET /api/chat/chats/
    def list(self, request):
        """ Retorna la lista de chats a los que el usuario tiene acceso (bandeja). """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # 2. VER MENSAJES DE UN CHAT ESPECÍFICO (Detalle)
    # GET /api/chat/chats/{pk}/
    def retrieve(self, request, pk=None):
        """ Retorna todos los mensajes de un chat específico y marca como leídos los del otro usuario. """
        
        # Obtener el chat y asegurar que el usuario autenticado tiene acceso
        # Usar Chat.objects.all() en lugar de get_queryset() para permitir acceso a chats nuevos sin mensajes
        user = self.request.user
        chat = get_object_or_404(
            Chat.objects.filter(Q(adoptante=user) | Q(protectora=user)),
            pk=pk
        )
        
        # Marcar com a llegits tots els missatges que NO són de l'usuari actual
        chat.mensajes.filter(leido=False).exclude(remitente=user).update(leido=True)
        
        # Obtenemos todos los mensajes y los ordenamos por antigüedad
        mensajes = chat.mensajes.all().order_by('fecha_envio')
        
        # Usamos MensajeSerializer
        serializer = MensajeSerializer(mensajes, many=True, context={'request': request})
        return Response(serializer.data)
    
    # 2.1 OBTENER INFORMACIÓN DE UN CHAT ESPECÍFICO
    # GET /api/chat/chats/{pk}/info/
    @action(detail=True, methods=['get'])
    def info(self, request, pk=None):
        """ Retorna la información de un chat específico (sin mensajes). """
        user = self.request.user
        # Permitir acceso a todos los chats donde el usuario participa, incluso sin mensajes
        chat = get_object_or_404(
            Chat.objects.filter(Q(adoptante=user) | Q(protectora=user)),
            pk=pk
        )
        serializer = ChatSerializer(chat)
        return Response(serializer.data)

    # 3. OBTENER O CREAR CHAT PARA UNA MASCOTA
    # POST /api/chat/chats/obtener_o_crear/
    @action(detail=False, methods=['post'])
    def obtener_o_crear(self, request):
        """ 
        Obtiene o crea un chat entre el usuario autenticado y la protectora de una mascota.
        Espera: { "mascota_id": 123 }
        Retorna: El chat existente o recién creado.
        """
        from mascotas.models import Mascota
        
        mascota_id = request.data.get('mascota_id')
        if not mascota_id:
            return Response(
                {'detail': 'Se requiere mascota_id.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        mascota = get_object_or_404(Mascota, id=mascota_id)
        user = request.user
        
        # Crear o recuperar el chat
        chat, created = Chat.objects.get_or_create(
            mascota=mascota,
            adoptante=user,
            defaults={'protectora': mascota.protectora, 'activo': True}
        )
        
        serializer = self.get_serializer(chat)
        return Response(
            {
                'chat': serializer.data,
                'created': created
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    # 4. ENVIAR MENSAJE
    # POST /api/chat/chats/{pk}/enviar_mensaje/
    @action(detail=True, methods=['post'], serializer_class=MensajeSerializer)
    def enviar_mensaje(self, request, pk=None):
        """ Permite a un participante del chat enviar un nuevo mensaje. """
        
        # 1. Obtener el chat y asegurar acceso - usar filtro directo para permitir chats sin mensajes
        user = request.user
        chat = get_object_or_404(
            Chat.objects.filter(Q(adoptante=user) | Q(protectora=user)),
            pk=pk
        )
        
        # 2. Verificar que el usuario sea un participante válido
        es_adoptante = chat.adoptante == user
        es_protectora = chat.protectora == user
        
        if not (es_adoptante or es_protectora):
            raise PermissionDenied("Solo los participantes del chat (adoptante o protectora) pueden enviar mensajes.")
            
        # 3. Validar el contenido del mensaje
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 4. Guardar el nuevo mensaje (asignando el chat y el remitente)
        mensaje = serializer.save(chat=chat, remitente=user)
        
        # 5. Retornar el mensaje creado (usando el serializer original para incluir el username)
        return Response(MensajeSerializer(mensaje).data, status=status.HTTP_201_CREATED)