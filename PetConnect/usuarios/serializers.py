from rest_framework import serializers
from .models import Usuario, PerfilUsuario, PerfilProtectora


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer básico para Usuario"""
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'role', 'date_joined')
        read_only_fields = ('id', 'date_joined')

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
    
    class Meta:
        model = PerfilUsuario
        fields = '__all__'
        read_only_fields = ('usuario',)

class PerfilProtectoraSerializer(serializers.ModelSerializer):
    """Serializer para perfil de protectora"""
    usuario = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = PerfilProtectora
        fields = '__all__'
        read_only_fields = ('usuario',)
    
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