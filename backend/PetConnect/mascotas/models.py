from django.db import models
from django.db import models
from django.conf import settings
from django.utils import timezone
from multiselectfield import MultiSelectField 

class Mascota(models.Model):

    ESPECIES_CHOICES = [
        ('PERRO', 'Perro'),
        ('GATO', 'Gato'),
    ]

    especie = models.CharField(
        max_length=10, 
        choices=ESPECIES_CHOICES, 
        default='GATO', 
        verbose_name="Especie"
    )
    
    GENERO_CHOICES = [
        ('MACHO', 'Macho'), 
        ('HEMBRA', 'Hembra'),
    ]

    genero = models.CharField(
        max_length=10, 
        choices=GENERO_CHOICES, 
        default='HEMBRA', 
        verbose_name="Género"
    )

    RAZAS_PERRO_CHOICES = [
        ('MESTIZO', 'Mestizo / Cruce'),
        ('LABRADOR', 'Labrador Retriever'),
        ('GOLDEN_RETRIEVER', 'Golden Retriever'),
        ('PASTOR_ALEMAN', 'Pastor Alemán'),
        ('HUSKY', 'Husky Siberiano / Malamute'), 
        ('BEAGLE', 'Beagle'),
        ('BORDER_COLLIE', 'Border Collie'),
        ('ROTTWEILER', 'Rottweiler'),
        ('PITBULL', 'Pitbull / Amstaff'), 
        ('TECKEL', 'Teckel (Salchicha / Dachshund)'), 
        ('POODLE', 'Caniche (Poodle)'), 
        ('BICHON', 'Bichón (Maltés / Frisé)'),
        ('CHIHUAHUA', 'Chihuahua / Pincher'), 
        ('YORKSHIRE_TERRIER', 'Yorkshire Terrier'),
        ('POMERANIA', 'Pomerania'),
        ('MASTIN', 'Mastín (Español, Napolitano, etc.)'),
        ('BULLDOG_FRANCES', 'Bulldog Francés'),
        ('AKITA_INU', 'Akita Inu'),
        ('DOBERMAN', 'Dóberman'),
        ('BOXER', 'Bóxer'),
        ('COCKER_SPANIEL', 'Cocker Spaniel'),
        ('GALGO', 'Galgo (Español / Greyhound / Lurcher)'),
        ('DOGO_ARGENTINO', 'Dogo Argentino'),
        ('SAN_BERNARDO', 'San Bernardo'),
        ('CAREA', 'Carea (Leonés / Vasco)'),
        ('PODENCO', 'Podenco'),
        ('GRAN_DANES', 'Gran Danés'),
        ('CORGI', 'Corgi'),
        ('SHIH_TZU', 'Shih Tzu'),
        ('SAMOYEDO', 'Samoyedo'),
        ('MALINOIS', 'Pastor Belga Malinois'),
        ('JACK_RUSSELL', 'Jack Russell Terrier'),
        ('SETTER_INGLES', 'Setter Inglés'),
        ('PEKINES', 'Pekinés / Lhasa Apso'),
    ]

    raza_perro = models.CharField(
        max_length=20, 
        choices=RAZAS_PERRO_CHOICES, 
        default='MESTIZO',
        verbose_name="Raza del Perro"
    )

    RAZAS_GATO_CHOICES = [
        ('MESTIZO', 'Mestizo / Cruce'), 
        ('SPHYNX', 'Esfinge (Sphynx)'),
        ('EUROPEO', 'Europeo'),
        ('ANGORA_TURCO', 'Angora Turco'),
        ('SIAMES', 'Siamés'),
        ('PERSA', 'Persa'),
        ('BENGAL', 'Bengal'),
        ('SIBERIANO', 'Siberiano'),
        ('SCOTTISH_FOLD', 'Scottish Fold'),
        ('AZUL_RUSO', 'Azul Ruso'),
        ('MAINE_COON', 'Maine Coon'),
        ('BOSQUE_NORUEGA', 'Bosque de Noruega'),
        ('TAILANDES', 'Tailandés (Wichian Mat)'),
        ('DEVON_REX', 'Devon Rex'),
        ('RAGDOLL', 'Ragdoll'),
        ('ORIENTAL', 'Oriental'),
        ('ABISINIO', 'Abisinio'),
    ]

    raza_gato = models.CharField(
        max_length=20, 
        choices=RAZAS_GATO_CHOICES, 
        default='MESTIZO',
        verbose_name="Raza del Gato"
    )
    
    COLOR_PELAJE_GATO_CHOICES = [
        ('NEGRO', 'Negro'),
        ('BLANCO', 'Blanco Puro'),
        ('GRIS_AZUL', 'Gris / Azul Sólido'),
        ('ROJO_NARANJA', 'Rojo / Naranja (Ginger / Melocotón)'),
        ('CREMA', 'Crema'),
        ('MARRON', 'Marrón'),

        # Patrones
        ('ATIGRADO', 'Atigrado (Tabby)'), 
        ('MOTEADO', 'Moteado (Spotted Tabby)'),
        ('BICOLOR', 'Bicolor / Manchas'),
        ('TRICOLOR_CALICO', 'Tricolor / Calicó'), 
        ('CAREY', 'Carey (Tortoiseshell)'),
        
        # Point
        ('POINT_OSCURO', 'Seal Point (Puntas Oscuras)'),
        ('POINT_AZUL', 'Point Azul'),
        ('POINT_CREMA', 'Point Crema (Muted)'),
    ]

    color_pelaje_gato = MultiSelectField(
        choices=COLOR_PELAJE_GATO_CHOICES, 
        max_length=150, 
        blank=True,
        verbose_name="Color y Patrón de Pelaje del Gato"
    )

    COLOR_PELAJE_PERRO_CHOICES = [
        ('NEGRO', 'Negro Sólido'),
        ('BLANCO', 'Blanco Sólido'),
        ('MARRON', 'Marrón / Chocolate'),
        ('GRIS_AZUL', 'Gris / Azul Sólido'),
        ('DORADO_LEONADO', 'Dorado / Amarillo / Leonado'), 
        ('CANELA_ROJIZO', 'Canela / Rojo / Fuego (Tan)'), 
        
        # Patrones
        ('ATIGRADO', 'Atigrado (Brindle)'), 
        ('TRICOLOR', 'Tricolor (Negro, Blanco, Canela)'), 
        ('BICOLOR', 'Bicolor / Manchas'),
        ('MOTEADO', 'Moteado (Ticking)'),
        ('MERLE', 'Merle (Azul o Rojo)'),
    ]

    color_pelaje_perro = MultiSelectField(
        choices=COLOR_PELAJE_PERRO_CHOICES, 
        max_length=150, 
        blank=True,
        verbose_name="Color y Patrón de Pelaje del Perro"
    )

    APTO_CON_CHOICES = [
        # Enfoque en Niños/Adultos
        ('NINOS', 'Apto para convivir con niños'),
        ('SIN_NINOS', 'Solo adultos / No apto para niños'), 
        
        # Enfoque en Compañía Animal
        ('PERROS', 'Perros (Apto con introducción lenta)'),
        ('GATOS', 'Gatos (Apto con gatos tranquilos)'),
        ('SOLO_EL', 'Hogar sin otros animales/Exclusivo'),
        ('COMPANIA_OBLIGATORIA', 'Compañía Felina/Canina Obligatoria'),
        
        # Enfoque en el Dueño
        ('PRIMERIZOS', 'Dueños Primerizos'),
        ('EXPERIENCIA', 'Dueños con Experiencia'),
        ('DUEÑOS_PPP', 'Dueños con Licencia PPP (Para Perros Potencialmente Peligrosos)'), 
    ]

    apto_con = MultiSelectField(
        choices=APTO_CON_CHOICES, 
        max_length=150, 
        blank=True,
        verbose_name="Apto para Convivir con"
    )

    CONDICION_ESPECIAL_GATO_CHOICES = [
        # Salud y Medicación Crónica
        ('DIABETES', 'Diabetes Mellitus (Requiere Insulina/Dieta)'), # Consolida Diabetes Felina
        ('RENAL_CRONICA', 'Enfermedad Renal Crónica'),
        ('HIPERTIROIDISMO', 'Hipertiroidismo (Controlado con medicación)'),
        ('CARDIACA', 'Insuficiencia Cardíaca Congestiva (Controlada)'),
        ('EPILEPSIA', 'Epilepsia Controlada'),
        ('FIP_RECUPERACION', 'Recuperación de Peritonitis Infecciosa Felina (FIP)'),

        # Inmunidad
        ('FIV_POSITIVO', 'Inmunodeficiencia Felina (FIV Positivo)'),
        
        # Sensorial y Neurológico
        ('SORDERA', 'Sordera Total o Parcial'), # Consolida Congénita, Sénior
        ('CEGUERA', 'Ceguera Total o Parcial'),
        ('HIPOPLASIA_CEREBELAR', 'Hipoplasia Cerebelar (Ataxia)'),
        ('PARAPARESIA', 'Parálisis Parcial/Total (Paraparesia)'),

        # Físico y Musculoesquelético
        ('AMPUTACION', 'Amputación o Falta de Extremidades'),
        ('OSTEOARTRITIS', 'Osteoartritis Severa/Problemas Articulares'),
        ('PROBLEMAS_RESPIRATORIOS', 'Problemas Respiratorios Crónicos (Braquicefalia)'),
        ('DISPLASIA', 'Osteocondrodisplasia (Articulaciones Rígidas)'),

        # Piel, Higiene y Digestivo
        ('PIEL_CRONICA', 'Dermatitis/Cuidados de Piel Específicos'),
        ('DENTAL_CRONICA', 'Problemas Dentales Crónicos/Periodontitis'),
        ('INCONTINENCIA', 'Incontinencia Urinaria Crónica'),
        ('OBESIDAD_CRONICA', 'Obesidad Crónica (Bulimia/Dieta Estricta)'),
        
        # Comportamiento Extremo
        ('TIMIDEZ_EXTREMA', 'Timidez Extrema / No Sociable'), # Consolida Crónica
        ('SEMIFERAL', 'Semiferal / No Doméstico'),
        ('CARACTER_FUERTE', 'Carácter Fuerte / Alfa (Intolerancia a otros animales)'),
    ]

    condicion_especial_gato = MultiSelectField(
        choices=CONDICION_ESPECIAL_GATO_CHOICES, 
        max_length=300, 
        blank=True,
        verbose_name="Condición o Necesidad Especial del Gato"
    )

    CONDICION_ESPECIAL_PERRO_CHOICES = [
        # Comportamiento y Ansiedad
        ('ANSIEDAD_SEPARACION', 'Ansiedad por Separación (Severa)'),
        ('REACTIVIDAD', 'Reactividad (Miedo, Territorialidad o Hacia Otros Perros)'),
        ('MIEDO_RUIDOS', 'Miedo a Ruidos Fuertes/Fuegos Artificiales'),
        ('MIEDO_PERSONAS', 'Miedo a Personas Desconocidas o Hombres'),
        ('ESCAPE', 'Tendencia al Escapismo'),
        ('SECUELAS_ABUSO', 'Secuelas de Abuso Físico/Timidez Crónica'),
        ('DEPENDENCIA_DUO', 'Dependencia Emocional/Adopción Conjunta Obligatoria'),

        # Articulaciones y Movilidad
        ('DISPLASIA_CADERA', 'Displasia de Cadera o Codo'),
        ('OSTEOARTRITIS', 'Osteoartritis/Artritis Geriátrica'),
        ('PROBLEMAS_COLUMNA', 'Problemas de Columna'),
        ('AMPUTACION', 'Amputación o Falta de Extremidades'),
        ('MOVILIDAD_SENIOR', 'Problemas de Movilidad (Senior)'),

        # Enfermedades Crónicas y Neurológicas
        ('CARDIACA', 'Insuficiencia Cardíaca Congestiva (Controlada)'),
        ('EPILEPSIA', 'Epilepsia Controlada'),
        ('CUSHING', 'Síndrome de Cushing (Hiperadrenocorticismo)'),
        ('HIPOPLASIA_CEREBELAR', 'Hipoplasia Cerebelar (Ataxia)'),

        # Ojos, Oídos y Respiratorio
        ('BRAQUICEFALICO', 'Síndrome Braquicefálico/Problemas Respiratorios Crónicos'),
        ('COLAPSO_TRAQUEAL', 'Colapso Traqueal'),
        ('PROBLEMAS_OIDO', 'Problemas de Oído Crónicos'),
        ('CATARATAS', 'Cataratas (Geriátricas o Congénitas)'),

        # Piel, Higiene y Digestivo
        ('ALERGIA_ALIMENTARIA', 'Alergia Alimentaria Múltiple/Dieta Estricta'),
        ('DERMATITIS', 'Dermatitis/Alergia Cutánea Crónica'),
        ('DENTAL_CRONICA', 'Problemas Dentales Crónicos'),
        ('INCONTINENCIA', 'Incontinencia Urinaria Crónica'),
        ('SOBREPESO', 'Sobrepeso/Obesidad Crónica'),
    ]

    condicion_especial_perro = MultiSelectField(
        choices=CONDICION_ESPECIAL_PERRO_CHOICES, 
        max_length=350, 
        blank=True,
        verbose_name="Condición o Necesidad Especial del Perro"
    )

    CARACTER_CHOICES_GATO = [
        # Afectividad y Compañía
        ('CARINOSO', 'Cariñoso / Afectivo'),
        ('FALDERO', 'Faldero / Buscador de Mimos'),
        ('DEPENDIENTE', 'Dependiente / Necesita Compañía'),
        ('INDEPENDIENTE', 'Independiente / Solitario'),
        ('TIMIDO', 'Tímido / Cauteloso / Se Esconde'),
        ('ASUSTADIZO', 'Asustadizo / Nervioso'),
        
        # Juego y Actividad
        ('JUGUETON', 'Juguetón (Moderado)'),
        ('JUGUETON_INTENSO', 'Juguetón Intenso / Hiperactivo'),
        ('ACTIVO', 'Activo / Enérgico / Aventurero'),
        ('TRANQUILO', 'Tranquilo / Baja Energía / Perezoso'),
        ('CAZADOR', 'Cazador'),

        # Socialización y Comunicación
        ('SOCIABLE', 'Sociable / Amigable (Con todos)'),
        ('AFECTIVO_CONOCIDOS', 'Afectivo (Solo con conocidos)'),
        ('HABALADOR', 'Hablador / Expresivo'),
        ('TERRITORIAL', 'Territorial / Mandón (Bossy)'),
        ('SEMIFERAL', 'Semiferal / No Doméstico'),
        ('OBSERVADOR', 'Observador / Curioso'),

        # Rasgos Adicionales
        ('ADAPTABLE', 'Adaptable / Estable'),
        ('DIVA', 'Diva / Carácter Fuerte / Posesivo'),
        ('LIMPIO', 'Limpio'),
    ]

    caracter_gato = MultiSelectField(
        choices=CARACTER_CHOICES_GATO, 
        max_length=250, 
        blank=True,
        verbose_name="Carácter y Personalidad"
    )

    CARACTER_MANEJO_CHOICES_PERRO = [
        # Afectividad y Compañía
        ('CARINOSO', 'Cariñoso / Afectivo'),
        ('FALDERO', 'Faldero'),
        ('DEPENDIENTE', 'Dependiente (Necesita Compañía Constante)'),
        ('DUO_INSEPARABLE', 'Dúo / Hermanos Inseparables (Adopción Conjunta)'),
        ('TIMIDO', 'Tímido / Reservado / Baja Confianza'),
        ('MIEDOSO', 'Miedoso / Nervioso'),

        # Juego y Actividad
        ('JUGUETON', 'Juguetón / Travieso'),
        ('ACTIVO_ENERGICO', 'Activo / Enérgico / Hiperactivo'),
        ('TRANQUILO', 'Tranquilo / Pacífico / Lento'),
        ('TRABAJADOR', 'Trabajador / Necesita Misión'),

        # Socialización y Liderazgo
        ('SOCIABLE', 'Sociable / Familiar (Apto con Personas y Perros)'),
        ('PROTECTOR_GUARDIAN', 'Protector / Guardián / Fuerte Instinto de Alerta'),
        ('DOMINANTE_PERROS', 'Dominante / Territorial (Hacia otros Perros)'),
        ('REACTIVO', 'Reactivo (Necesita Bozal o Doble Correa para Paseos)'),
        ('LIDERAZGO', 'Necesita Liderazgo y Entrenamiento Firme'),
        ('DESCONFIADO_EXTRANOS', 'Desconfiado (Hacia Extraños)'),
        ('OBEDIENTE', 'Obediente (Requiere Consistencia)'),

        # Instintos y Hábitos
        ('OLAFATEADOR', 'Olfateador / Instinto de Caza Alto'),
        ('LADRADOR', 'Ladrador (Fácil o Moderado)'),
        ('ESCAPISTA', 'Escapista / Tendencia a Aullar'),
        ('EXCAVADOR', 'Excavador'),
        ('GLOTON', 'Glotón / Obsesión por Comida'),
        ('CABEZOTA', 'Cabezota / Independiente'),

        # Rasgos Adicionales
        ('INTELIGENTE', 'Inteligente / Necesidad de Estimulación Mental'),
        ('SENSIBLE', 'Sensible / Oídos Sensibles'),
        ('LEAL', 'Leal'),
    ]

    caracter_perro = MultiSelectField(
        choices=CARACTER_MANEJO_CHOICES_PERRO, 
        max_length=350, 
        blank=True,
        verbose_name="Carácter, Instinto y Necesidad de Manejo"
    )

    ESTADO_LEGAL_SALUD_CHOICES = [
        ('DESPARASITADO', 'Desparasitado Interna y Externamente'),
        ('ESTERILIZADO', 'Esterilizado/Castrado'),
        ('VACUNADO', 'Vacunado'),
        ('MICROCHIP', 'Identificado con Microchip'),
    ]

    estado_legal_salud = MultiSelectField(
        choices=ESTADO_LEGAL_SALUD_CHOICES, 
        max_length=50, 
        blank=True,
        verbose_name="Estado de Salud y Legal"
    )

    TAMANO_CHOICES = [
        ('PEQUENO', 'Pequeño (Hasta 10kg)'),
        ('MEDIANO', 'Mediano (10-25kg)'),
        ('GRANDE', 'Grande (25-45kg)'),
        ('GIGANTE', 'Gigante (Más de 45kg)'),
    ]

    tamano = models.CharField(
        max_length=10, 
        choices=TAMANO_CHOICES, 
        default='MEDIANO',
        verbose_name="Tamaño"
    )

    EDAD_CHOICES = [
        ('0', 'Menos de 1 año'),
        ('1_2', '1-2 años (Joven)'),
        ('3_6', '3-6 años (Adulto)'),
        ('7_10', '7-10 años (Adulto Maduro)'),
        ('11_14', '11-14 años (Senior)'),
        ('15_MAS', '15 años o más (Ultra Senior)'),
    ]

    edad_clasificacion = models.CharField(
        max_length=10, 
        choices=EDAD_CHOICES, 
        default='3_6',
        verbose_name="Clasificación de Edad"
    )

    # Datos básicos
    nombre = models.CharField(max_length=100, help_text="Introduzca el nombre del animal", verbose_name="Nombre")
    edad = models.PositiveIntegerField(default=0, help_text="Edad en años", verbose_name="Edad")
    foto = models.ImageField(upload_to='mascotas/', verbose_name="Foto")
    foto2 = models.ImageField(upload_to='mascotas/', verbose_name="Foto 2", blank=True, null=True)
    foto3 = models.ImageField(upload_to='mascotas/', verbose_name="Foto 3", blank=True, null=True)
    
    # Descripción/Biografía del animal (puede ser generada por IA)
    descripcion = models.TextField(
        blank=True, 
        null=True,
        verbose_name="Descripción/Biografía",
        help_text="Descripción del animal, puede ser generada automáticamente por IA"
    )

    #estado del perfil
    oculto = models.BooleanField(default=False)
    adoptado = models.BooleanField(default=False)
        
    # Campo crucial: registra cuándo se marcó la adopción
    fecha_adopcion = models.DateField(
            null=True, 
            blank=True,
            verbose_name="Fecha de Adopción"
        )
        
    def save(self, *args, **kwargs):
            # Si se marca como adoptado y aún no tiene fecha, establece la fecha actual
            if self.adoptado and not self.fecha_adopcion:
                self.fecha_adopcion = timezone.now().date()
            # Si se desmarca como adoptado, limpia la fecha
            elif not self.adoptado and self.fecha_adopcion:
                self.fecha_adopcion = None
                
            super().save(*args, **kwargs)    

    # Fechas
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    #vinculación con protectora
    protectora = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mascotas'
    )
    
    def __str__(self):
        return f"{self.nombre} ({self.especie})"
    
    def get_caracter_list(self):
        """Retorna el carácter como lista"""
        return [c.strip() for c in self.caracter.split(',') if c.strip()]
    
    class Meta:
        db_table = 'mascotas'
        verbose_name = "Mascota"
        verbose_name_plural = "Mascotas"
        ordering = ['-fecha_creacion']


class Interaccion(models.Model):
    """
    Registra les interaccions (likes/dislikes) dels usuaris amb les mascotes.
    S'utilitza per al sistema de swipe (PetTinder) i per a les recomanacions de IA.
    """
    ACCION_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
    ]
    
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='interacciones'
    )
    mascota = models.ForeignKey(
        Mascota, 
        on_delete=models.CASCADE,
        related_name='interacciones'
    )
    accion = models.CharField(max_length=10, choices=ACCION_CHOICES)
    fecha = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'interacciones'
        verbose_name = "Interacción"
        verbose_name_plural = "Interacciones"
        unique_together = ('usuario', 'mascota')  # Un usuari només pot tenir una interacció per mascota
        ordering = ['-fecha']
    
    def __str__(self):
        return f"{self.usuario.username} - {self.accion} - {self.mascota.nombre}"
