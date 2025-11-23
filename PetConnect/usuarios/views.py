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

class UsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de usuarios"""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Cada usuario solo ve su propio perfil"""
        return PerfilUsuario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """Asociar el perfil al usuario actual"""
        serializer.save(usuario=self.request.user)

class PerfilProtectoraViewSet(viewsets.ModelViewSet):
    """ViewSet para perfiles de protectora"""
    queryset = PerfilProtectora.objects.all()
    serializer_class = PerfilProtectoraSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Solo protectoras pueden acceder a estos perfiles"""
        if self.request.user.role == 'protectora':
            return PerfilProtectora.objects.filter(usuario=self.request.user)
        return PerfilProtectora.objects.none()

    def perform_create(self, serializer):
        """Asociar el perfil al usuario actual"""
        if self.request.user.role == 'protectora':
            serializer.save(usuario=self.request.user)