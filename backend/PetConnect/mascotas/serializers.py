from rest_framework import serializers
from .models import Mascota
from ai_service.views import simular_generacion_ia



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
    tamano_display = serializers.CharField(source='get_tamano_display', read_only=True)
    edad_clasificacion_display = serializers.CharField(source='get_edad_clasificacion_display', read_only=True)
    
    # Nuevos campos de matching
    apto_ninos_display = serializers.CharField(source='get_apto_ninos_display', read_only=True)
    necesita_compania_animal_display = serializers.CharField(source='get_necesita_compania_animal_display', read_only=True)
    nivel_experiencia_display = serializers.CharField(source='get_nivel_experiencia_display', read_only=True)
    
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
            'tamano_display',
            'edad_clasificacion_display',
            'apto_ninos_display',
            'necesita_compania_animal_display',
            'nivel_experiencia_display',
        )
        extra_kwargs = {
            'foto': {'required': True},
            'nombre': {'required': True, 'min_length': 2, 'max_length': 100},
            'especie': {'required': True},
            'genero': {'required': True},
            'edad': {'required': False, 'min_value': 0, 'max_value': 30}
        }
    
    def validate(self, data):
        """Validación condicional de razas según la especie."""
        especie = data.get('especie')

        # Si la especie no viene en los datos, tomarla de la instancia (en updates)
        if especie is None and getattr(self, 'instance', None):
            especie = getattr(self.instance, 'especie', None)

        if especie == 'PERRO':
            # raza_perro es obligatoria para perros
            if not data.get('raza_perro') and not (self.instance and getattr(self.instance, 'raza_perro', None)):
                raise serializers.ValidationError({'raza_perro': 'Se requiere `raza_perro` cuando `especie` es "PERRO".'})
            # Ignorar campos de gato
            data.pop('raza_gato', None)
            data.pop('color_pelaje_gato', None)
            data.pop('caracter_gato', None)
            data.pop('condicion_especial_gato', None)

        elif especie == 'GATO':
            if not data.get('raza_gato') and not (self.instance and getattr(self.instance, 'raza_gato', None)):
                raise serializers.ValidationError({'raza_gato': 'Se requiere `raza_gato` cuando `especie` es "GATO".'})
            # Ignorar campos de perro
            data.pop('raza_perro', None)
            data.pop('color_pelaje_perro', None)
            data.pop('caracter_perro', None)
            data.pop('condicion_especial_perro', None)

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
        rep = super().to_representation(instance)
        especie = rep.get('especie')
        if especie == 'PERRO':
            # Ocultar campos de gato
            rep.pop('raza_gato', None)
            rep.pop('raza_gato_display', None)
            rep.pop('color_pelaje_gato', None)
            rep.pop('caracter_gato', None)
            rep.pop('condicion_especial_gato', None)
        elif especie == 'GATO':
            # Ocultar campos de perro
            rep.pop('raza_perro', None)
            rep.pop('raza_perro_display', None)
            rep.pop('color_pelaje_perro', None)
            rep.pop('caracter_perro', None)
            rep.pop('condicion_especial_perro', None)
        return rep
