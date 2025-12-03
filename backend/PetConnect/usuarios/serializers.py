from rest_framework import serializers
from .models import Usuario, PerfilUsuario, PerfilProtectora
import re


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer básico para Usuario"""
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'role', 'city', 'date_joined')
        read_only_fields = ('id', 'date_joined')
        extra_kwargs = {
            'email': {'required': False}  # No obligatorio en actualizaciones
        }

class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Para crear nuevos usuarios"""
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Usuario
        fields = ('username', 'password', 'email', 'role', 'city')
    
    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value
    
    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este username ya está registrado.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    """Serializer para perfil de usuario"""
    usuario = serializers.StringRelatedField(read_only=True)
    usuario_id = serializers.IntegerField(source='usuario.id', read_only=True)
    username = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = PerfilUsuario
        fields = '__all__'
        read_only_fields = ('usuario', 'usuario_id', 'username', 'role')
        
    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Autenticació requerida.")
        if request.user.role != 'usuario':
            raise serializers.ValidationError("Només usuaris amb rol 'usuario' poden crear aquest perfil.")
        # assignar el perfil al usuari autenticat
        return PerfilUsuario.objects.create(usuario=request.user, role=request.user.role, **validated_data)

class PerfilProtectoraSerializer(serializers.ModelSerializer):
    """Serializer para perfil de protectora"""
    usuario = serializers.StringRelatedField(read_only=True)
    usuario_id = serializers.IntegerField(source='usuario.id', read_only=True)
    username = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = PerfilProtectora
        fields = '__all__'
        read_only_fields = ('usuario', 'usuario_id', 'username', 'role')
        
    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Autenticació requerida.")
        if request.user.role != 'protectora':
            raise serializers.ValidationError("Només usuaris amb rol 'protectora' poden crear aquest perfil.")
        return PerfilProtectora.objects.create(usuario=request.user, role=request.user.role, **validated_data)
    
    def validate_nucleo_zoologico(self, value):
        if value and not re.match(r'^ES\d{2}\d{3}C\d{6}$', value):
            raise serializers.ValidationError(
                'Formato inválido. Ejemplo: ES12345C000123'
            )
        return value

class LoginSerializer(serializers.Serializer):
    """Serializer para login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if not username:
            raise serializers.ValidationError({'username': 'Aquest camp és obligatori.'})
        if not password:
            raise serializers.ValidationError({'password': 'Aquest camp és obligatori.'})
        
        # Comprova si l'usuari existeix
        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError({'username': 'Usuari no trobat.'})
        
        # Comprova la contrasenya
        if not user.check_password(password):
            raise serializers.ValidationError({'password': 'Contrasenya incorrecta.'})
        
        attrs['user'] = user
        return attrs