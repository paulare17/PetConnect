from rest_framework import serializers
from .models import Mascota


class MascotaSerializer(serializers.ModelSerializer):
    # Campos relacionados con la protectora
    protectora = serializers.PrimaryKeyRelatedField(read_only=True)
    protectora_nombre = serializers.CharField(source='protectora.username', read_only=True)
    protectora_ciudad = serializers.CharField(source='protectora.city', read_only=True)
    
    # Campos display para mostrar valores legibles de choices
    especie_display = serializers.CharField(source='get_especie_display', read_only=True)
    genero_display = serializers.CharField(source='get_genero_display', read_only=True)
    raza_perro_display = serializers.CharField(source='get_raza_perro_display', read_only=True)
    raza_gato_display = serializers.CharField(source='get_raza_gato_display', read_only=True)
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
            'raza_perro_display',
            'raza_gato_display',
            'caracter_display',
            'convivencia_animales_display'
        )
        extra_kwargs = {
            'foto': {'required': True},
            'nombre': {'required': True, 'min_length': 2, 'max_length': 100},
            'especie': {'required': True},
            'genero': {'required': True},
            'edad': {'required': True, 'min_value': 0, 'max_value': 30}
        }
    
    def validate(self, data):
        """Validación condicional de razas según la especie y otras validaciones puntuales."""
        especie = data.get('especie')

        # Si la especie no viene en los datos, tomarla de la instancia (en updates)
        if especie is None and getattr(self, 'instance', None):
            especie = getattr(self.instance, 'especie', None)

        if especie == 'perro':
            # raza_perro es obligatoria para perros
            if not data.get('raza_perro') and not (self.instance and getattr(self.instance, 'raza_perro', None)):
                raise serializers.ValidationError({'raza_perro': 'Se requiere `raza_perro` cuando `especie` es "perro".'})
            # Ignorar/ocultar raza_gato si se envía
            data.pop('raza_gato', None)

        elif especie == 'gato':
            if not data.get('raza_gato') and not (self.instance and getattr(self.instance, 'raza_gato', None)):
                raise serializers.ValidationError({'raza_gato': 'Se requiere `raza_gato` cuando `especie` es "gato".'})
            data.pop('raza_perro', None)

        return data

    def create(self, validated_data):
        # Asignar automáticamente la protectora como el usuario autenticado
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['protectora'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Evitar que la protectora sea modificada por la petición
        validated_data.pop('protectora', None)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """Oculta la raza irrelevante según la especie en la representación de salida."""
        rep = super().to_representation(instance)
        especie = rep.get('especie')
        if especie == 'perro':
            rep.pop('raza_gato', None)
            rep.pop('raza_gato_display', None)
        elif especie == 'gato':
            rep.pop('raza_perro', None)
            rep.pop('raza_perro_display', None)
        return rep