import os
import django

#DATABASE FALSO PER A PODER MIRAR SI FUNCIONA EL SCRIPT


# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PetConnect.settings')
django.setup()

from mascotas.models import Mascota
from usuarios.models import Usuario

# Buscar la protectora1
try:
    protectora = Usuario.objects.get(username='protectora1')
    print(f"✅ Protectora trobada: {protectora.username}")
except Usuario.DoesNotExist:
    print("❌ Error: No s'ha trobat l'usuari 'protectora1'")
    exit(1)

# Crear gossos
gossos = [
    {
        'nombre': 'Max',
        'especie': 'perro',
        'raza_perro': 'labrador',
        'genero': 'macho',
        'edad': 3,
        'tamaño': 'grande',
        'color': 'daurat',
        'caracter': 'jugueton',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Luna',
        'especie': 'perro',
        'raza_perro': 'pastor_aleman',
        'genero': 'hembra',
        'edad': 2,
        'tamaño': 'grande',
        'color': 'negre i marró',
        'caracter': 'protector',
        'convivencia_animales': 'misma_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos2.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Toby',
        'especie': 'perro',
        'raza_perro': 'beagle',
        'genero': 'macho',
        'edad': 5,
        'tamaño': 'mediano',
        'color': 'blanc, marró i negre',
        'caracter': 'cariñoso',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Rocky',
        'especie': 'perro',
        'raza_perro': 'bulldog',
        'genero': 'macho',
        'edad': 4,
        'tamaño': 'mediano',
        'color': 'blanc i marró',
        'caracter': 'tranquilo',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Bella',
        'especie': 'perro',
        'raza_perro': 'mestizo',
        'genero': 'hembra',
        'edad': 1,
        'tamaño': 'pequeño',
        'color': 'marró',
        'caracter': 'sociable',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': False,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos2.jpg',
        'protectora': protectora
    }
]

# Crear gats
gats = [
    {
        'nombre': 'Mimi',
        'especie': 'gato',
        'raza_gato': 'siames',
        'genero': 'hembra',
        'edad': 1,
        'tamaño': 'pequeño',
        'color': 'blanc i marró',
        'caracter': 'independiente',
        'convivencia_animales': 'misma_especie',
        'convivencia_ninos': False,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Peluso',
        'especie': 'gato',
        'raza_gato': 'persa',
        'genero': 'macho',
        'edad': 4,
        'tamaño': 'mediano',
        'color': 'gris',
        'caracter': 'tranquilo',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat2.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Nala',
        'especie': 'gato',
        'raza_gato': 'mestizo',
        'genero': 'hembra',
        'edad': 2,
        'tamaño': 'pequeño',
        'color': 'negre',
        'caracter': 'sociable',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat3.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Simba',
        'especie': 'gato',
        'raza_gato': 'mestizo',
        'genero': 'macho',
        'edad': 3,
        'tamaño': 'mediano',
        'color': 'taronja',
        'caracter': 'jugueton',
        'convivencia_animales': 'misma_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat4.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Cleo',
        'especie': 'gato',
        'raza_gato': 'siames',
        'genero': 'hembra',
        'edad': 2,
        'tamaño': 'pequeño',
        'color': 'crema',
        'caracter': 'cariñoso',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': False,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat5.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Misifú',
        'especie': 'gato',
        'raza_gato': 'mestizo',
        'genero': 'macho',
        'edad': 5,
        'tamaño': 'mediano',
        'color': 'gris i blanc',
        'caracter': 'tranquilo',
        'convivencia_animales': 'no',
        'convivencia_ninos': False,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat6.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Luna',
        'especie': 'gato',
        'raza_gato': 'mestizo',
        'genero': 'hembra',
        'edad': 1,
        'tamaño': 'pequeño',
        'color': 'blanc i negre',
        'caracter': 'activo',
        'convivencia_animales': 'misma_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': False,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat7.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Bigotes',
        'especie': 'gato',
        'raza_gato': 'persa',
        'genero': 'macho',
        'edad': 6,
        'tamaño': 'mediano',
        'color': 'blanc',
        'caracter': 'independiente',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': True,
        'con_microchip': True,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat8.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Whiskers',
        'especie': 'gato',
        'raza_gato': 'mestizo',
        'genero': 'macho',
        'edad': 1,
        'tamaño': 'pequeño',
        'color': 'taronja i blanc',
        'caracter': 'sociable',
        'convivencia_animales': 'cualquier_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': False,
        'con_microchip': False,
        'vacunado': True,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gatito.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Minino',
        'especie': 'gato',
        'raza_gato': 'mestizo',
        'genero': 'macho',
        'edad': 0,
        'tamaño': 'pequeño',
        'color': 'gris',
        'caracter': 'jugueton',
        'convivencia_animales': 'misma_especie',
        'convivencia_ninos': True,
        'desparasitado': True,
        'esterilizado': False,
        'con_microchip': False,
        'vacunado': False,
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gatet.jpg',
        'protectora': protectora
    }
]

# Crear les mascotes
print("\n🐕 Creant gossos...")
for gos_data in gossos:
    mascota, created = Mascota.objects.get_or_create(
        nombre=gos_data['nombre'],
        protectora=protectora,
        defaults=gos_data
    )
    if created:
        print(f"  ✅ {mascota.nombre} creat correctament")
    else:
        print(f"  ℹ️  {mascota.nombre} ja existeix")

print("\n🐈 Creant gats...")
for gat_data in gats:
    mascota, created = Mascota.objects.get_or_create(
        nombre=gat_data['nombre'],
        protectora=protectora,
        defaults=gat_data
    )
    if created:
        print(f"  ✅ {mascota.nombre} creat correctament")
    else:
        print(f"  ℹ️  {mascota.nombre} ja existeix")

# Mostrar resum
total = Mascota.objects.filter(protectora=protectora, adoptado=False, oculto=False).count()
print(f"\n🎉 Total de mascotes disponibles: {total}")
print("✨ Ja pots provar el PetTinder!")
