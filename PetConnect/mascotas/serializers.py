from rest_framework import serializers
from .models import Mascota


class MascotaSerializer(serializers.ModelSerializer):
    protectora = serializers.PrimaryKeyRelatedField(read_only=True)

    nombre = serializers.CharField(min_length=2, max_length=100)
    edad = serializers.IntegerField(min_value=0, max_value=30)
    peso = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0.1, max_value=100.0, required=False, allow_null=True)

    class Meta:
        model = Mascota
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'fecha_actualizacion', 'protectora')

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
        elif especie == 'gato':
            rep.pop('raza_perro', None)
        return rep