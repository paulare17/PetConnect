from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Usuario, PerfilUsuario, PerfilProtectora
from .serializers import (
    UsuarioSerializer,
    UsuarioCreateSerializer,
    PerfilUsuarioSerializer,
    PerfilProtectoraSerializer,
    LoginSerializer
)
from .permissions import (
    UsuarioPermissions,
    IsUsuario,
    IsProtectora,
    get_queryset_by_role,
)

class UsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de usuarios"""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        """Filtrar usuarios según el rol del request.user usando la utilidad centralizada."""
        user = self.request.user
        if not user or not user.is_authenticated:
            return Usuario.objects.none()
        return get_queryset_by_role(user, Usuario)

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioSerializer

    def get_permissions(self):
        # create y login són accessibles sense autenticar; la resta requereix autenticació
        if self.action in ['create', 'login']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UsuarioSerializer(user).data
                })

            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Espera: {'refresh': '<refresh_token>'}
        Blacklist del refresh token (requereix rest_framework_simplejwt.token_blacklist a INSTALLED_APPS)
        """
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Obtener perfil del usuario actual"""
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

class PerfilUsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para perfiles de usuario"""
    queryset = PerfilUsuario.objects.all()
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [IsAuthenticated, UsuarioPermissions]

    def get_queryset(self):
        """Filtrar perfiles de usuario según rol.
        - admin: todos
        - usuario: solo su perfil
        - protectora: todos (para consulta)
        """
        user = self.request.user
        if not user or not user.is_authenticated:
            return PerfilUsuario.objects.none()
        if user.role == 'admin':
            return PerfilUsuario.objects.all()
        if user.role == 'usuario':
            return PerfilUsuario.objects.filter(usuario=user)
        if user.role == 'protectora':
            return PerfilUsuario.objects.all()
        return PerfilUsuario.objects.none()

    def perform_create(self, serializer):
        """Forzar la asociación al request.user y guardar role sincronizado."""
        serializer.save(usuario=self.request.user, role=self.request.user.role)

class PerfilProtectoraViewSet(viewsets.ModelViewSet):
    """ViewSet para perfiles de protectora"""
    queryset = PerfilProtectora.objects.all()
    serializer_class = PerfilProtectoraSerializer
    permission_classes = [IsAuthenticated, UsuarioPermissions]

    def get_queryset(self):
        """Filtrar perfiles de protectora según rol.
        - admin: todos
        - protectora: su propio perfil
        - usuario: puede ver todas las protectoras (lista)
        """
        user = self.request.user
        if not user or not user.is_authenticated:
            return PerfilProtectora.objects.none()
        if user.role == 'admin':
            return PerfilProtectora.objects.all()
        if user.role == 'protectora':
            return PerfilProtectora.objects.filter(usuario=user)
        if user.role == 'usuario':
            return PerfilProtectora.objects.all()
        return PerfilProtectora.objects.none()

    def perform_create(self, serializer):
        """Forzar la asociación al request.user y role."""
        if self.request.user.role == 'protectora':
            serializer.save(usuario=self.request.user, role=self.request.user.role)
        else:
            # Seguridad adicional: impedir creación por otros roles
            raise PermissionError('Sólo usuarios con rol protectora pueden crear este perfil.')