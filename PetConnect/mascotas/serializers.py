from rest_framework import serializers
from .models import Mascota

class MascotaSerializer(serializers.ModelSerializer):
    protectora = serializers.PrimaryKeyRelatedField(read_only=True)
    protectora_nombre = serializers.CharField(source='protectora.username', read_only=True)
    protectora_ciudad = serializers.CharField(source='protectora.city', read_only=True)
    
    # Para mostrar valores legibles de choices en lugar de códigos
    especie_display = serializers.CharField(source='get_especie_display', read_only=True)
    genero_display = serializers.CharField(source='get_genero_display', read_only=True)
    tamaño_display = serializers.CharField(source='get_tamaño_display', read_only=True)
    caracter_display = serializers.CharField(source='get_caracter_display', read_only=True)
    convivencia_animales_display = serializers.CharField(source='get_convivencia_animales_display', read_only=True)

    class Meta:
        model = Mascota
        fields = '__all__'
        read_only_fields = (
            'id', 
            'fecha_creacion', 
            'fecha_actualizacion',
            'protectora',
            'protectora_nombre',
            'protectora_ciudad',
            'especie_display',
            'genero_display',
            'tamaño_display',
            'caracter_display',
            'convivencia_animales_display'
        )
        extra_kwargs = {
            'foto': {'required': True},
            'nombre': {'required': True},
            'especie': {'required': True},
            'genero': {'required': True},
            'edad': {'required': True}
        }