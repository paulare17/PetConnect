ESPECIE_CHOICES = [
    ('PERRO', 'Perro'),
    ('GATO', 'Gato'),
]

TAMANO_CHOICES = [
    ('PEQUENO', 'Pequeño (Hasta 10kg)'),
    ('MEDIANO', 'Mediano (10-25kg)'),
    ('GRANDE', 'Grande (25-45kg)'),
    ('GIGANTE', 'Gigante (Más de 45kg)'),
]

EDAD_CHOICES = [
    ('0', 'Menos de 1 año'),
    ('1_2', '1-2 años (Joven)'),
    ('3_6', '3-6 años (Adulto)'),
    ('7_10', '7-10 años (Adulto Maduro)'),
    ('11_14', '11-14 años (Senior)'),
    ('15_MAS', '15 años o más (Ultra Senior)'),
]

SEXO_CHOICES = [
    ('MACHO', 'Macho'),
    ('HEMBRA', 'Hembra'),
]


# Desplegable 1: Compatibilidad con niños
NINOS_CHOICES = [
    ('APTO_NINOS', 'Apto para convivir con niños'),
    ('NO_APTO_NINOS', 'Solo adultos / No apto para niños'),
    ('INDIFERENTE_NINOS', 'Indiferente / Sin preferencia'),
]

# Desplegable 2: Necesita compañía animal 
COMPANIA_ANIMAL_CHOICES = [
    ('PUEDE_SOLO', 'Puede vivir solo (sin otros animales)'),
    ('NECESITA_COMPANIA', 'Necesita compañía de otro animal'),
    ('INDIFERENTE_COMPANIA', 'Indiferente / Se adapta'),
]

# Desplegable 3: Nivel de experiencia del adoptante
NIVEL_EXPERIENCIA_CHOICES = [
    ('PRIMERIZOS', 'Apto para dueños primerizos'),
    ('EXPERIENCIA', 'Requiere dueños con experiencia'),
    ('LICENCIA_PPP', 'Requiere licencia PPP'),
    ('INDIFERENTE_EXP', 'Indiferente / Sin requisito especial'),
]

# Mantenemos por compatibilidad (se puede eliminar después de migrar)
APTO_CON_CHOICES = [
    ('NINOS', 'Apto para convivir con niños'),
    ('SIN_NINOS', 'Solo adultos / No apto para niños'),
    ('PERROS', 'Perros (Apto con introducción lenta)'),
    ('GATOS', 'Gatos (Apto con gatos tranquilos)'),
    ('SOLO_EL', 'Hogar sin otros animales/Exclusivo'),
    ('COMPANIA_OBLIGATORIA', 'Compañía Felina/Canina Obligatoria'),
    ('PRIMERIZOS', 'Dueños Primerizos'),
    ('EXPERIENCIA', 'Dueños con Experiencia'),
    ('DUEÑOS_PPP', 'Dueños con Licencia PPP (Para Perros Potencialmente Peligrosos)'),
]

ESTADO_LEGAL_SALUD_CHOICES = [
    ('DESPARASITADO', 'Desparasitado Interna y Externamente'),
    ('ESTERILIZADO', 'Esterilizado/Castrado'),
    ('VACUNADO', 'Vacunado'),
    ('MICROCHIP', 'Identificado con Microchip'),
]