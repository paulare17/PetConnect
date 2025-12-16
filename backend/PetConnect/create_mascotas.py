import os
import django
from mascotas.models import Mascota
from usuarios.models import Usuario

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PetConnect.settings')
django.setup()


# Buscar la protectora1
try:
    protectora = Usuario.objects.get(username='protectora1')
    print(f"✅ Protectora trobada: {protectora.username}")
except Usuario.DoesNotExist:
    print("❌ Error: No s'ha trobat l'usuari 'protectora1'")
    exit(1)

# Crear perros con los campos actualizados del modelo
gossos = [
    {
        'nombre': 'Max',
        'especie': 'PERRO',
        'raza_perro': 'LABRADOR',
        'genero': 'MACHO',
        'edad': 3,
        'edad_clasificacion': '3_6',
        'tamano': 'GRANDE',
        'color_pelaje_perro': ['DORADO_LEONADO'],
        'caracter_perro': ['JUGUETON', 'SOCIABLE', 'CARINOSO'],
        'apto_con': ['NINOS', 'PERROS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Luna',
        'especie': 'PERRO',
        'raza_perro': 'PASTOR_ALEMAN',
        'genero': 'HEMBRA',
        'edad': 2,
        'edad_clasificacion': '1_2',
        'tamano': 'GRANDE',
        'color_pelaje_perro': ['NEGRO', 'CANELA_ROJIZO'],
        'caracter_perro': ['PROTECTOR_GUARDIAN', 'LEAL', 'INTELIGENTE'],
        'apto_con': ['NINOS', 'PERROS', 'EXPERIENCIA'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos2.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Toby',
        'especie': 'PERRO',
        'raza_perro': 'BEAGLE',
        'genero': 'MACHO',
        'edad': 5,
        'edad_clasificacion': '3_6',
        'tamano': 'MEDIANO',
        'color_pelaje_perro': ['TRICOLOR'],
        'caracter_perro': ['CARINOSO', 'OLAFATEADOR', 'SOCIABLE'],
        'apto_con': ['NINOS', 'PERROS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Rocky',
        'especie': 'PERRO',
        'raza_perro': 'BULLDOG_FRANCES',
        'genero': 'MACHO',
        'edad': 4,
        'edad_clasificacion': '3_6',
        'tamano': 'MEDIANO',
        'color_pelaje_perro': ['BICOLOR'],
        'caracter_perro': ['TRANQUILO', 'FALDERO', 'CARINOSO'],
        'apto_con': ['NINOS', 'PERROS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'condicion_especial_perro': ['BRAQUICEFALICO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Bella',
        'especie': 'PERRO',
        'raza_perro': 'MESTIZO',
        'genero': 'HEMBRA',
        'edad': 1,
        'edad_clasificacion': '1_2',
        'tamano': 'PEQUENO',
        'color_pelaje_perro': ['MARRON'],
        'caracter_perro': ['SOCIABLE', 'JUGUETON', 'TIMIDO'],
        'apto_con': ['NINOS', 'PERROS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gos2.jpg',
        'protectora': protectora
    }
]

# Crear gatos con los campos actualizados del modelo
gats = [
    {
        'nombre': 'Mimi',
        'especie': 'GATO',
        'raza_gato': 'SIAMES',
        'genero': 'HEMBRA',
        'edad': 1,
        'edad_clasificacion': '1_2',
        'tamano': 'PEQUENO',
        'color_pelaje_gato': ['POINT_OSCURO'],
        'caracter_gato': ['INDEPENDIENTE', 'HABALADOR', 'ACTIVO'],
        'apto_con': ['SIN_NINOS', 'GATOS', 'EXPERIENCIA'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Peluso',
        'especie': 'GATO',
        'raza_gato': 'PERSA',
        'genero': 'MACHO',
        'edad': 4,
        'edad_clasificacion': '3_6',
        'tamano': 'MEDIANO',
        'color_pelaje_gato': ['GRIS_AZUL'],
        'caracter_gato': ['TRANQUILO', 'FALDERO', 'CARINOSO'],
        'apto_con': ['NINOS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat2.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Nala',
        'especie': 'GATO',
        'raza_gato': 'MESTIZO',
        'genero': 'HEMBRA',
        'edad': 2,
        'edad_clasificacion': '1_2',
        'tamano': 'PEQUENO',
        'color_pelaje_gato': ['NEGRO'],
        'caracter_gato': ['SOCIABLE', 'CARINOSO', 'JUGUETON'],
        'apto_con': ['NINOS', 'PERROS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat3.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Simba',
        'especie': 'GATO',
        'raza_gato': 'MESTIZO',
        'genero': 'MACHO',
        'edad': 3,
        'edad_clasificacion': '3_6',
        'tamano': 'MEDIANO',
        'color_pelaje_gato': ['ROJO_NARANJA'],
        'caracter_gato': ['JUGUETON', 'ACTIVO', 'CAZADOR'],
        'apto_con': ['NINOS', 'GATOS', 'EXPERIENCIA'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat4.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Cleo',
        'especie': 'GATO',
        'raza_gato': 'SIAMES',
        'genero': 'HEMBRA',
        'edad': 2,
        'edad_clasificacion': '1_2',
        'tamano': 'PEQUENO',
        'color_pelaje_gato': ['CREMA', 'POINT_CREMA'],
        'caracter_gato': ['CARINOSO', 'FALDERO', 'DEPENDIENTE'],
        'apto_con': ['SIN_NINOS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat5.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Misifú',
        'especie': 'GATO',
        'raza_gato': 'MESTIZO',
        'genero': 'MACHO',
        'edad': 5,
        'edad_clasificacion': '3_6',
        'tamano': 'MEDIANO',
        'color_pelaje_gato': ['GRIS_AZUL', 'BICOLOR'],
        'caracter_gato': ['TRANQUILO', 'INDEPENDIENTE', 'TERRITORIAL'],
        'apto_con': ['SIN_NINOS', 'SOLO_EL', 'EXPERIENCIA'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat6.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Lluna',
        'especie': 'GATO',
        'raza_gato': 'MESTIZO',
        'genero': 'HEMBRA',
        'edad': 1,
        'edad_clasificacion': '0',
        'tamano': 'PEQUENO',
        'color_pelaje_gato': ['BICOLOR'],
        'caracter_gato': ['ACTIVO', 'JUGUETON', 'SOCIABLE'],
        'apto_con': ['NINOS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat7.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Bigotes',
        'especie': 'GATO',
        'raza_gato': 'PERSA',
        'genero': 'MACHO',
        'edad': 6,
        'edad_clasificacion': '3_6',
        'tamano': 'MEDIANO',
        'color_pelaje_gato': ['BLANCO'],
        'caracter_gato': ['INDEPENDIENTE', 'TRANQUILO', 'LIMPIO'],
        'apto_con': ['NINOS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'ESTERILIZADO', 'MICROCHIP', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gat8.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Whiskers',
        'especie': 'GATO',
        'raza_gato': 'MESTIZO',
        'genero': 'MACHO',
        'edad': 1,
        'edad_clasificacion': '0',
        'tamano': 'PEQUENO',
        'color_pelaje_gato': ['ROJO_NARANJA', 'BICOLOR'],
        'caracter_gato': ['SOCIABLE', 'JUGUETON', 'CARINOSO'],
        'apto_con': ['NINOS', 'PERROS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO', 'VACUNADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gatito.jpg',
        'protectora': protectora
    },
    {
        'nombre': 'Minino',
        'especie': 'GATO',
        'raza_gato': 'MESTIZO',
        'genero': 'MACHO',
        'edad': 0,
        'edad_clasificacion': '0',
        'tamano': 'PEQUENO',
        'color_pelaje_gato': ['GRIS_AZUL', 'ATIGRADO'],
        'caracter_gato': ['JUGUETON', 'ACTIVO', 'OBSERVADOR'],
        'apto_con': ['NINOS', 'GATOS', 'PRIMERIZOS'],
        'estado_legal_salud': ['DESPARASITADO'],
        'adoptado': False,
        'oculto': False,
        'foto': 'mascotas/gatet.jpg',
        'protectora': protectora
    }
]

# Crear las mascotas
print("\n🐕 Creant gossos...")
for gos_data in gossos:
    try:
        mascota, created = Mascota.objects.get_or_create(
            nombre=gos_data['nombre'],
            protectora=protectora,
            defaults=gos_data
        )
        if created:
            print(f"  ✅ {mascota.nombre} creat correctament")
        else:
            print(f"  ℹ️  {mascota.nombre} ja existeix")
    except Exception as e:
        print(f"  ❌ Error creant {gos_data['nombre']}: {e}")

print("\n🐈 Creant gats...")
for gat_data in gats:
    try:
        mascota, created = Mascota.objects.get_or_create(
            nombre=gat_data['nombre'],
            protectora=protectora,
            defaults=gat_data
        )
        if created:
            print(f"  ✅ {mascota.nombre} creat correctament")
        else:
            print(f"  ℹ️  {mascota.nombre} ja existeix")
    except Exception as e:
        print(f"  ❌ Error creant {gat_data['nombre']}: {e}")

# Mostrar resumen
total = Mascota.objects.filter(protectora=protectora, adoptado=False, oculto=False).count()
print(f"\n🎉 Total de mascotes disponibles: {total}")
print("✨ Ja pots provar el PetTinder!")
