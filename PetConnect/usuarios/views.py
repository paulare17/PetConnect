from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario, PerfilUsuario, PerfilProtectora
from .serializers import (
    UsuarioSerializer,
    UsuarioCreateSerializer,
    PerfilUsuarioSerializer,
    PerfilProtectoraSerializer,
    LoginSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de usuarios con JWT"""
    queryset = Usuario.objects.all()
    
    def get_queryset(self):
        """Filtrado por rol - admin ve todo, otros solo su usuario"""
        if not self.request.user.is_authenticated:
            return Usuario.objects.none()
        
        if self.request.user.role == 'admin':
            return Usuario.objects.all()
        return Usuario.objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        return UsuarioCreateSerializer if self.action == 'create' else UsuarioSerializer

    def get_permissions(self):
        if self.action in ['create', 'login']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def _get_token_response(self, user):
        """Genera respuesta estandarizada con tokens JWT"""
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UsuarioSerializer(user, context={'request': self.request}).data
        }

    def create(self, request, *args, **kwargs):
        """Registro de usuario con retorno inmediato de tokens"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            self._get_token_response(user), 
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Login con email/username y password"""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        
        if not user:
            return Response(
                {'error': 'Credenciales inválidas'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        return Response(self._get_token_response(user))

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Obtener datos del usuario actual"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Logout - cliente debe eliminar tokens.
        Para revocación real, necesitarías blacklist.
        """
        return Response(
            {'detail': 'Sesión cerrada. Elimina los tokens del cliente.'}, 
            status=status.HTTP_200_OK
        )

# ViewSets unificados para perfiles
class BasePerfilViewSet(viewsets.ModelViewSet):
    """ViewSet base para perfiles con autenticación JWT"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return self.queryset.all()
        elif user.role == self.allowed_role:
            return self.queryset.filter(usuario=user)
        # Usuarios pueden ver perfiles de protectoras y viceversa
        return self.queryset.all()

    def perform_create(self, serializer):
        """Solo usuarios del rol específico pueden crear su perfil"""
        if self.request.user.role != self.allowed_role:
            raise PermissionDenied('No tienes permisos para crear este perfil')
        serializer.save(usuario=self.request.user, role=self.request.user.role)

class PerfilUsuarioViewSet(BasePerfilViewSet):
    queryset = PerfilUsuario.objects.all()
    serializer_class = PerfilUsuarioSerializer
    allowed_role = 'usuario'

class PerfilProtectoraViewSet(BasePerfilViewSet):
    queryset = PerfilProtectora.objects.all()
    serializer_class = PerfilProtectoraSerializer
    allowed_role = 'protectora'