from rest_framework import serializers
from .models import Mascota

class MascotaSerializer(serializers.ModelSerializer):
    propietario = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Mascota
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'propietario')