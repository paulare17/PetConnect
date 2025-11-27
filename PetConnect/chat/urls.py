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
        Retorna solo los chats en los que el usuario autenticado participa 
        (como adoptante o como protectora).
        """
        user = self.request.user
        
        # Filtra chats donde el usuario es el adoptante O el usuario vinculado a la protectora
        return self.queryset.filter(
            Q(adoptante=user) | Q(protectora__usuario=user) 
        ).order_by('-id')

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
        """ Retorna todos los mensajes de un chat específico. """
        
        # Obtener el chat y asegurar que el usuario autenticado tiene acceso
        chat = get_object_or_404(self.get_queryset(), pk=pk)
        
        # Obtenemos todos los mensajes y los ordenamos por antigüedad
        mensajes = chat.mensajes.all().order_by('timestamp')
        
        # Usamos MensajeSerializer
        serializer = MensajeSerializer(mensajes, many=True, context={'request': request})
        return Response(serializer.data)

    # 3. ENVIAR MENSAJE
    # POST /api/chat/chats/{pk}/enviar_mensaje/
    @action(detail=True, methods=['post'], serializer_class=MensajeSerializer)
    def enviar_mensaje(self, request, pk=None):
        """ Permite a un participante del chat enviar un nuevo mensaje. """
        
        # 1. Obtener el chat y asegurar acceso
        chat = get_object_or_404(self.get_queryset(), pk=pk)
        user = request.user
        
        # 2. Verificar que el usuario sea un participante válido
        es_adoptante = chat.adoptante == user
        es_protectora = chat.protectora.usuario == user # Asume PerfilProtectora.usuario
        
        if not (es_adoptante or es_protectora):
            raise PermissionDenied("Solo los participantes del chat (adoptante o protectora) pueden enviar mensajes.")
            
        # 3. Validar el contenido del mensaje
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 4. Guardar el nuevo mensaje (asignando el chat y el emisor)
        mensaje = serializer.save(chat=chat, emisor=user)
        
        # 5. Retornar el mensaje creado (usando el serializer original para incluir el username)
        return Response(MensajeSerializer(mensaje).data, status=status.HTTP_201_CREATED)