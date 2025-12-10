import os
import unicodedata
import csv
import re
from django.conf import settings
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from nltk.tokenize import RegexpTokenizer
from .chatbot_faq import FAQ_BOT
from mascotas.models import Mascota, Interaccion 

# --- Lógica de Ayuda Global y Carga de Dataset (IA 3: El Entrenamiento) ---

DATASET_BIOGRAFIAS = {}

def normalize_text(text):
    """Convierte tildes y ñ a caracteres ASCII planos, elimina guiones bajos y lo pone en minúsculas."""
    if not isinstance(text, str):
        text = str(text)

    text = text.lower().replace('_', ' ')
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode("utf-8")
    return text

def cargar_dataset_ia3():
    """Carga el CSV de datos de entrenamiento y almacena todas las palabras clave."""
    global DATASET_BIOGRAFIAS
    # Construir ruta absoluta al CSV dins de ai_service/
    file_path = os.path.join(os.path.dirname(__file__), 'training_data.csv') 
    
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            
            for row in reader:
                especie = normalize_text(row.get('Especie', ''))
                caracter_raw = normalize_text(row.get('Caracter_Necesidad', ''))
                keywords_set = set([k.strip() for k in caracter_raw.split(',') if k.strip()])
                
                if especie not in DATASET_BIOGRAFIAS:
                    DATASET_BIOGRAFIAS[especie] = []
                    
                DATASET_BIOGRAFIAS[especie].append({
                    'nombre_ejemplo': row.get('Nombre', 'ejemplo'),
                    'biografia_final': row.get('Biografia_Final', 'Biografía de ejemplo no disponible.'), 
                    'sexo': normalize_text(row.get('Sexo', 'N/A')),
                    'keywords': keywords_set
                })
                        
    except FileNotFoundError:
        print(f"ADVERTENCIA IA: No se encontró el archivo de entrenamiento: {file_path}")
            
cargar_dataset_ia3()


import random

# ============================================================================
# SISTEMA DE GENERACIÓ PER FRAGMENTS MODULARS
# Crea biografies úniques combinant frases segons les característiques reals
# ============================================================================

# Fragments d'introducció segons espècie i edat
INTROS = {
    'perro': {
        'cachorro': [
            "¡{nombre} es un cachorrito lleno de energía y ganas de descubrir el mundo!",
            "Con sus ojitos curiosos, {nombre} está listo para conquistar tu corazón.",
            "¡Prepárate para las travesuras! {nombre} es un cachorro que no para quieto.",
            "{nombre} es un pequeño torbellino de alegría que busca su primera familia.",
        ],
        'joven': [
            "{nombre} es un perro joven con toda la vida por delante.",
            "Con {edad}, {nombre} está en la flor de la vida y lleno de vitalidad.",
            "{nombre} es un joven aventurero que busca un compañero de vida.",
            "A sus {edad}, {nombre} combina la energía juvenil con un carácter ya formado.",
        ],
        'adulto': [
            "{nombre} es un perro adulto equilibrado y con mucho amor para dar.",
            "Con {edad} de experiencia, {nombre} sabe exactamente cómo hacerte feliz.",
            "{nombre} es un compañero maduro que busca un hogar donde compartir sus días.",
            "A sus {edad}, {nombre} tiene el equilibrio perfecto entre juego y calma.",
        ],
        'senior': [
            "{nombre} es un veterano con un corazón de oro que busca una jubilación tranquila.",
            "Con sus {edad}, {nombre} solo pide un rincón cálido y mucho cariño.",
            "{nombre} es un abuelito adorable que merece pasar sus últimos años rodeado de amor.",
            "A sus {edad}, {nombre} tiene la sabiduría de quien ha vivido y el amor de quien aún tiene mucho que dar.",
        ],
    },
    'gato': {
        'cachorro': [
            "¡{nombre} es una bolita de pelo con energía infinita!",
            "{nombre} es un gatito curioso que está descubriendo el mundo a zarpazos.",
            "Con su mirada traviesa, {nombre} promete llenar tu hogar de aventuras.",
            "¡Cuidado con tus cortinas! {nombre} es un cachorro felino lleno de energía.",
        ],
        'joven': [
            "{nombre} es un gato joven con personalidad propia y mucha curiosidad.",
            "Con {edad}, {nombre} combina la agilidad juvenil con un carácter encantador.",
            "{nombre} está en esa edad perfecta: juguetón pero ya con su personalidad definida.",
            "A sus {edad}, {nombre} es pura elegancia felina en movimiento.",
        ],
        'adulto': [
            "{nombre} es un gato adulto con el equilibrio perfecto entre independencia y cariño.",
            "Con {edad}, {nombre} sabe lo que quiere: un hogar tranquilo y mimos a demanda.",
            "{nombre} es un felino maduro que busca un humano que aprecie su compañía.",
            "A sus {edad}, {nombre} tiene la serenidad de quien conoce el arte de vivir bien.",
        ],
        'senior': [
            "{nombre} es un gato senior con años de ronroneos acumulados para compartir.",
            "Con sus {edad}, {nombre} busca un regazo cálido donde pasar sus tardes.",
            "{nombre} es un abuelito felino que merece una jubilación llena de mimos.",
            "A sus {edad}, {nombre} solo pide tranquilidad, comida a su hora y mucho amor.",
        ],
    }
}

# Fragments de personalitat segons caràcter
PERSONALIDAD = {
    'cariñoso': [
        "Es extremadamente cariñoso y le encanta acurrucarse junto a ti.",
        "Su mayor pasión son los mimos y las sesiones de caricias.",
        "Es un experto en dar amor incondicional.",
        "Tiene una capacidad infinita para el afecto.",
    ],
    'jugueton': [
        "¡Le encanta jugar! Cualquier objeto se convierte en diversión.",
        "Es muy juguetón y necesita sesiones diarias de entretenimiento.",
        "Su energía para el juego es contagiosa.",
        "Siempre está listo para una sesión de juegos.",
    ],
    'tranquilo': [
        "Es un alma tranquila que disfruta de la calma del hogar.",
        "Prefiere las tardes relajadas a las aventuras intensas.",
        "Su serenidad transmite paz a todo su alrededor.",
        "Es el compañero perfecto para hogares tranquilos.",
    ],
    'activo': [
        "Tiene energía para dar y regalar, ¡prepárate para moverte!",
        "Necesita ejercicio diario para canalizar toda su vitalidad.",
        "Es muy activo y disfruta de los paseos largos y el ejercicio.",
        "Su nivel de energía requiere un dueño igualmente dinámico.",
    ],
    'sociable': [
        "Es muy sociable y se lleva bien con todo el mundo.",
        "Le encanta conocer gente nueva y hacer amigos.",
        "Es el alma de la fiesta, siempre dispuesto a socializar.",
        "Su carácter amigable conquista a todos los que lo conocen.",
    ],
    'independiente': [
        "Tiene un espíritu independiente y valora su espacio.",
        "Es autosuficiente pero sabe cuándo pedir cariño.",
        "Disfruta de su autonomía, aunque siempre vuelve por mimos.",
        "Es independiente pero leal a su familia.",
    ],
    'timido': [
        "Es algo tímido al principio, pero una vez que confía, es muy leal.",
        "Necesita un poco de tiempo para abrirse, pero vale la pena la espera.",
        "Su timidez esconde un corazón enorme.",
        "Con paciencia y cariño, florece como el mejor compañero.",
    ],
    'protector': [
        "Es muy protector con su familia y su hogar.",
        "Tiene un instinto guardián que lo hace muy leal.",
        "Siempre está alerta para cuidar de los suyos.",
        "Es un protector nato con un corazón de oro.",
    ],
    'inteligente': [
        "Es muy inteligente y aprende rápido.",
        "Su inteligencia lo hace fácil de educar.",
        "Sorprende con su capacidad de aprendizaje.",
        "Es listo como él solo y siempre está pensando.",
    ],
}

# Fragments de tamany
TAMANO_FRASES = {
    'pequeño': [
        "Su tamaño pequeño lo hace perfecto para cualquier espacio.",
        "Es pequeñito pero con una personalidad enorme.",
        "Su tamaño compacto esconde un gran corazón.",
    ],
    'mediano': [
        "Su tamaño mediano es ideal para la mayoría de hogares.",
        "Es de tamaño mediano, ni muy grande ni muy pequeño: ¡perfecto!",
        "Con su tamaño equilibrado, se adapta a cualquier situación.",
    ],
    'grande': [
        "Es grande y majestuoso, con presencia imponente pero corazón tierno.",
        "Su gran tamaño necesita espacio, pero su amor es aún más grande.",
        "Es un grandullón adorable que necesita sitio para moverse.",
    ],
    'gigante': [
        "Es un gigante bondadoso que necesita un hogar con espacio.",
        "Su tamaño gigante solo es superado por su enorme corazón.",
        "Es majestuoso y enorme, un verdadero oso de peluche viviente.",
    ],
}

# Fragments de convivència
CONVIVENCIA = {
    'ninos_si': [
        "Se lleva genial con los niños y disfruta jugando con ellos.",
        "Es perfecto para familias con niños.",
        "Adora a los pequeños de la casa.",
    ],
    'ninos_no': [
        "Prefiere hogares sin niños pequeños para estar más tranquilo.",
        "Es mejor para hogares con niños mayores o sin niños.",
    ],
    'animales_si': [
        "Convive perfectamente con otros animales.",
        "Le encanta tener compañía de otras mascotas.",
        "Es sociable con otros animales.",
    ],
    'animales_no': [
        "Prefiere ser el único rey de la casa.",
        "Es mejor como mascota única.",
    ],
}

# Cierres emotivos
CIERRES = [
    "¿Serás tú quien le dé el hogar que merece?",
    "Está esperando a alguien especial que le abra las puertas de su corazón.",
    "Solo necesita una oportunidad para demostrar todo el amor que puede dar.",
    "¿Te animas a cambiar su vida... y la tuya?",
    "Está listo para empezar una nueva vida llena de amor contigo.",
    "Su familia perfecta está ahí fuera. ¿Eres tú?",
]


def determinar_etapa_vida(edad, especie):
    """Determina la etapa de vida según edad y especie."""
    if edad is None:
        return 'adulto'
    
    if especie == 'perro':
        if edad < 1:
            return 'cachorro'
        elif edad < 3:
            return 'joven'
        elif edad < 8:
            return 'adulto'
        else:
            return 'senior'
    else:  # gato
        if edad < 1:
            return 'cachorro'
        elif edad < 3:
            return 'joven'
        elif edad < 10:
            return 'adulto'
        else:
            return 'senior'


def generar_biografia_modular(datos):
    """
    NUEVA IA: Genera biografías únicas combinando fragmentos modulares
    según las características reales del animal.
    """
    try:
        # Extraer datos
        nombre = datos.get('nombre', 'Amigo')
        if nombre:
            nombre = str(nombre).strip().capitalize()
        else:
            nombre = 'Amigo'
            
        especie = normalize_text(datos.get('especie', 'perro'))
        sexo = normalize_text(datos.get('sexo', 'macho'))
        
        edad = datos.get('edad')
        if edad is not None:
            try:
                edad = int(edad)
            except (ValueError, TypeError):
                edad = None
        
        tamano = datos.get('tamano') or datos.get('tamaño') or ''
        tamano = tamano.lower() if tamano else ''
    except Exception as e:
        print(f"❌ Error extrayendo datos básicos: {e}")
        raise
    
    raza = datos.get('raza') or datos.get('raza_perro') or datos.get('raza_gato') or ''
    
    caracter_input = datos.get('caracter_necesidad', '')
    caracteres = [c.strip().lower() for c in caracter_input.split(',') if c.strip()]
    
    convivencia_ninos = datos.get('convivencia_ninos', '')
    convivencia_animales = datos.get('convivencia_animales', '')
    historia_breve = datos.get('historia_breve', '').strip()
    
    # Determinar etapa de vida
    etapa = determinar_etapa_vida(edad, especie)
    
    # Ajustar género en textos
    es_hembra = sexo == 'hembra'
    
    # ============ CONSTRUIR BIOGRAFÍA ============
    partes = []
    
    # 1. INTRO según especie y etapa
    if especie in INTROS and etapa in INTROS[especie]:
        intro = random.choice(INTROS[especie][etapa])
        # Formatear edad correctamente (1 año vs X años)
        edad_texto = f"{edad} año" if edad == 1 else f"{edad} años" if edad else '?'
        intro = intro.format(nombre=nombre, edad=edad_texto)
        # Limpiar posibles duplicados de "años años"
        intro = intro.replace('años años', 'años').replace('año años', 'años')
        partes.append(intro)
    else:
        partes.append(f"¡Conoce a {nombre}!")
    
    # 2. RAZA Y TAMAÑO (si hay)
    descripcion_fisica = []
    if raza and raza.lower() not in ['mestizo', 'cruce', '', 'desconocido']:
        descripcion_fisica.append(f"Es {'una' if es_hembra else 'un'} {raza.lower()} {'preciosa' if es_hembra else 'precioso'}.")
    
    if tamano and tamano in TAMANO_FRASES:
        frase_tamano = random.choice(TAMANO_FRASES[tamano])
        # Eliminar punto final si lo tiene para evitar duplicados
        descripcion_fisica.append(frase_tamano.rstrip('.') + '.')
    
    if descripcion_fisica:
        partes.append(' '.join(descripcion_fisica))
    
    # 3. PERSONALIDAD (máximo 2 características)
    frases_personalidad = []
    caracteres_mapeados = {
        'cariñoso': 'cariñoso', 'carinoso': 'cariñoso', 'afectivo': 'cariñoso', 'mimoso': 'cariñoso',
        'juguetón': 'jugueton', 'jugueton': 'jugueton', 'divertido': 'jugueton', 'activo': 'activo',
        'tranquilo': 'tranquilo', 'calmado': 'tranquilo', 'relajado': 'tranquilo',
        'activo': 'activo', 'energico': 'activo', 'enérgico': 'activo',
        'sociable': 'sociable', 'amigable': 'sociable', 'familiar': 'sociable',
        'independiente': 'independiente', 'solitario': 'independiente',
        'timido': 'timido', 'tímido': 'timido', 'cauteloso': 'timido', 'asustadizo': 'timido',
        'protector': 'protector', 'guardian': 'protector', 'leal': 'protector',
        'inteligente': 'inteligente', 'obediente': 'inteligente', 'listo': 'inteligente',
    }
    
    caracteres_usados = set()
    for c in caracteres[:3]:
        c_lower = c.lower()
        if c_lower in caracteres_mapeados:
            clave = caracteres_mapeados[c_lower]
            if clave not in caracteres_usados and clave in PERSONALIDAD:
                frases_personalidad.append(random.choice(PERSONALIDAD[clave]))
                caracteres_usados.add(clave)
    
    if frases_personalidad:
        partes.append(' '.join(frases_personalidad[:2]))
    
    # 4. CONVIVENCIA (si hay datos)
    frases_convivencia = []
    if convivencia_ninos:
        conv_ninos = convivencia_ninos.lower()
        if conv_ninos in ['si', 'sí', 'yes', 'true']:
            frases_convivencia.append(random.choice(CONVIVENCIA['ninos_si']))
        elif conv_ninos in ['no', 'false']:
            frases_convivencia.append(random.choice(CONVIVENCIA['ninos_no']))
    
    if convivencia_animales:
        conv_animales = convivencia_animales.lower()
        if conv_animales in ['si', 'sí', 'yes', 'true']:
            frases_convivencia.append(random.choice(CONVIVENCIA['animales_si']))
        elif conv_animales in ['no', 'false']:
            frases_convivencia.append(random.choice(CONVIVENCIA['animales_no']))
    
    if frases_convivencia:
        partes.append(' '.join(frases_convivencia))
    
    # 5. CIERRE EMOTIVO
    partes.append(random.choice(CIERRES))
    
    # 6. HISTORIA BREVE (si hay)
    if historia_breve:
        partes.append(f"\n\n📖 {historia_breve}")
    
    # Ensamblar biografía final
    biografia = ' '.join(partes)
    
    # Ajustar género si es hembra (algunos ajustes básicos)
    if es_hembra:
        biografia = biografia.replace(' él ', ' ella ')
        biografia = biografia.replace(' listo ', ' lista ')
        biografia = biografia.replace(' pequeñito ', ' pequeñita ')
        biografia = biografia.replace(' tranquilo,', ' tranquila,')
        biografia = biografia.replace(' activo ', ' activa ')
    
    return {'biografia': biografia, 'metodo': 'modular'}


def simular_generacion_ia(datos):
    """
    IA de generación de biografías - VERSIÓN MODULAR
    Genera biografías únicas basadas en las características reales del animal.
    """
    return generar_biografia_modular(datos)


# ============================================================================
# IA 2: SISTEMA DE RECOMANACIÓ HÍBRID
# Combina preferències explícites (PerfilUsuario) + implícites (likes)
# ============================================================================

def obtenir_preferencies_explicites(usuario):
    """
    Obté les preferències explícites del perfil de l'usuari.
    Retorna None si l'usuari no té perfil o no té preferències configurades.
    """
    try:
        perfil = usuario.perfil_usuario
    except:
        return None
    
    preferencies = {
        'especie': list(perfil.preferencias_especie) if perfil.preferencias_especie else [],
        'tamano': list(perfil.preferencias_tamano) if perfil.preferencias_tamano else [],
        'edad': list(perfil.preferencias_edad) if perfil.preferencias_edad else [],
        'sexo': list(perfil.preferencias_sexo) if perfil.preferencias_sexo else [],
        'convivencia': list(perfil.preferencias_convivencia) if perfil.preferencias_convivencia else [],
        'estado_salud': list(perfil.preferencias_estado_basico) if perfil.preferencias_estado_basico else [],
        'acepta_condicion_especial': perfil.acepta_condicion_especial,
    }
    
    # Comprovar si té alguna preferència configurada
    tiene_preferencias = any([
        preferencies['especie'],
        preferencies['tamano'],
        preferencies['edad'],
        preferencies['sexo'],
        preferencies['convivencia'],
        preferencies['estado_salud'],
    ])
    
    if not tiene_preferencias:
        return None
        
    return preferencies


def obtenir_preferencies_implicites(usuario):
    """
    Analitza els likes anteriors de l'usuari per inferir preferències implícites.
    Retorna None si l'usuari no té likes.
    """
    likes = Interaccion.objects.filter(
        usuario=usuario, 
        accion='like'
    ).select_related('mascota')
    
    if not likes.exists():
        return None
    
    preferencies = {
        'especie': {},
        'tamano': {},
        'edad_clasificacion': {},
        'sexo': {},
        'convivencia': {},
        'estado_salud': {},
        'total_likes': likes.count()
    }
    
    for interaccion in likes:
        mascota = interaccion.mascota
        
        # Espècie
        esp = mascota.especie or 'DESCONOCIDO'
        preferencies['especie'][esp] = preferencies['especie'].get(esp, 0) + 1
        
        # Tamany
        tam = getattr(mascota, 'tamano', None) or 'DESCONOCIDO'
        preferencies['tamano'][tam] = preferencies['tamano'].get(tam, 0) + 1
        
        # Edat (classificació)
        edad_cls = getattr(mascota, 'edad_clasificacion', None) or 'DESCONOCIDO'
        preferencies['edad_clasificacion'][edad_cls] = preferencies['edad_clasificacion'].get(edad_cls, 0) + 1
        
        # Sexe/Gènere
        sexo = mascota.genero or 'DESCONOCIDO'
        preferencies['sexo'][sexo] = preferencies['sexo'].get(sexo, 0) + 1
        
        # Convivència (apto_con)
        apto_con = getattr(mascota, 'apto_con', None)
        if apto_con:
            for apt in apto_con:
                preferencies['convivencia'][apt] = preferencies['convivencia'].get(apt, 0) + 1
        
        # Estat de salut
        estado = getattr(mascota, 'estado_legal_salud', None)
        if estado:
            for est in estado:
                preferencies['estado_salud'][est] = preferencies['estado_salud'].get(est, 0) + 1
    
    return preferencies


def calcular_score_preferencies_explicites(mascota, pref_explicites):
    """
    Calcula score basat en les preferències explícites de l'usuari (0-1).
    """
    if not pref_explicites:
        return 0.0
    
    score = 0.0
    total_criteris = 0
    
    # Espècie (molt important)
    if pref_explicites['especie']:
        total_criteris += 2  # Doble pes
        if mascota.especie in pref_explicites['especie']:
            score += 2
    
    # Tamany
    if pref_explicites['tamano']:
        total_criteris += 1
        mascota_tamano = getattr(mascota, 'tamano', None)
        if mascota_tamano and mascota_tamano in pref_explicites['tamano']:
            score += 1
    
    # Edat
    if pref_explicites['edad']:
        total_criteris += 1
        mascota_edad = getattr(mascota, 'edad_clasificacion', None)
        if mascota_edad and mascota_edad in pref_explicites['edad']:
            score += 1
    
    # Sexe
    if pref_explicites['sexo']:
        total_criteris += 1
        if mascota.genero and mascota.genero in pref_explicites['sexo']:
            score += 1
    
    # Convivència
    if pref_explicites['convivencia']:
        total_criteris += 1
        mascota_apto = getattr(mascota, 'apto_con', None) or []
        if any(apt in pref_explicites['convivencia'] for apt in mascota_apto):
            score += 1
    
    # Estat de salut mínim
    if pref_explicites['estado_salud']:
        total_criteris += 1
        mascota_estado = getattr(mascota, 'estado_legal_salud', None) or []
        # L'usuari vol que la mascota tingui TOTS els estats requerits
        if all(est in mascota_estado for est in pref_explicites['estado_salud']):
            score += 1
    
    # Condició especial (penalització si no accepta però la mascota en té)
    if not pref_explicites['acepta_condicion_especial']:
        tiene_condicion = False
        if mascota.especie == 'GATO':
            tiene_condicion = bool(getattr(mascota, 'condicion_especial_gato', None))
        elif mascota.especie == 'PERRO':
            tiene_condicion = bool(getattr(mascota, 'condicion_especial_perro', None))
        
        if tiene_condicion:
            score -= 0.5  # Penalització
    
    return score / total_criteris if total_criteris > 0 else 0.0


def calcular_score_preferencies_implicites(mascota, pref_implicites):
    """
    Calcula score basat en l'historial de likes de l'usuari (0-1).
    """
    if not pref_implicites:
        return 0.0
    
    total_likes = pref_implicites['total_likes']
    if total_likes == 0:
        return 0.0
    
    score = 0.0
    total_weight = 0.0
    
    # Espècie (40%)
    weight = 0.4
    esp = mascota.especie or 'DESCONOCIDO'
    esp_count = pref_implicites['especie'].get(esp, 0)
    score += weight * (esp_count / total_likes)
    total_weight += weight
    
    # Tamany (20%)
    weight = 0.2
    tam = getattr(mascota, 'tamano', None) or 'DESCONOCIDO'
    tam_count = pref_implicites['tamano'].get(tam, 0)
    score += weight * (tam_count / total_likes)
    total_weight += weight
    
    # Edat (15%)
    weight = 0.15
    edad_cls = getattr(mascota, 'edad_clasificacion', None) or 'DESCONOCIDO'
    edad_count = pref_implicites['edad_clasificacion'].get(edad_cls, 0)
    score += weight * (edad_count / total_likes)
    total_weight += weight
    
    # Sexe (15%)
    weight = 0.15
    sexo = mascota.genero or 'DESCONOCIDO'
    sexo_count = pref_implicites['sexo'].get(sexo, 0)
    score += weight * (sexo_count / total_likes)
    total_weight += weight
    
    # Convivència (10%)
    weight = 0.1
    mascota_apto = getattr(mascota, 'apto_con', None) or []
    if mascota_apto:
        conv_score = sum(pref_implicites['convivencia'].get(apt, 0) for apt in mascota_apto)
        max_conv = max(pref_implicites['convivencia'].values()) if pref_implicites['convivencia'] else 1
        score += weight * (conv_score / (max_conv * len(mascota_apto))) if max_conv > 0 else 0
    total_weight += weight
    
    return score / total_weight if total_weight > 0 else 0.0


def obtenir_recomanacions_ia(usuario, limit=5):
    """
    IA 2: Motor de recomanació HÍBRID.
    
    Combina:
    - 60% preferències explícites (PerfilUsuario)
    - 40% preferències implícites (historial de likes)
    + Bonus de popularitat (fins a 10%)
    
    Si només té una font, usa 100% d'aquesta.
    Si no en té cap, mostra mascotes populars aleatòriament.
    """
    from mascotas.serializers import MascotaSerializer
    
    # Obtenir IDs de mascotes ja vistes
    mascotas_vistas_ids = Interaccion.objects.filter(
        usuario=usuario
    ).values_list('mascota_id', flat=True)
    
    # Mascotes disponibles
    mascotas_disponibles = Mascota.objects.filter(
        adoptado=False,
        oculto=False
    ).exclude(
        id__in=mascotas_vistas_ids
    )
    
    if not mascotas_disponibles.exists():
        return []
    
    # Obtenir preferències
    pref_explicites = obtenir_preferencies_explicites(usuario)
    pref_implicites = obtenir_preferencies_implicites(usuario)
    
    # Determinar pesos segons disponibilitat
    if pref_explicites and pref_implicites:
        weight_explicites = 0.6
        weight_implicites = 0.4
    elif pref_explicites:
        weight_explicites = 1.0
        weight_implicites = 0.0
    elif pref_implicites:
        weight_explicites = 0.0
        weight_implicites = 1.0
    else:
        # Sense preferències: ordre per popularitat + aleatori
        weight_explicites = 0.0
        weight_implicites = 0.0
    
    # Calcular score per cada mascota
    mascotas_con_score = []
    
    for mascota in mascotas_disponibles:
        # Score híbrid
        score_explicites = calcular_score_preferencies_explicites(mascota, pref_explicites) if pref_explicites else 0
        score_implicites = calcular_score_preferencies_implicites(mascota, pref_implicites) if pref_implicites else 0
        
        score_base = (weight_explicites * score_explicites) + (weight_implicites * score_implicites)
        
        # Bonus per popularitat (nombre de likes globals de la mascota)
        total_likes_mascota = Interaccion.objects.filter(
            mascota=mascota, 
            accion='like'
        ).count()
        popularity_bonus = min(0.1, total_likes_mascota * 0.02)  # Max 10%
        
        # Si no hi ha preferències, afegir component aleatori
        if weight_explicites == 0 and weight_implicites == 0:
            import random
            score_base = 0.3 + (random.random() * 0.2)  # Entre 0.3 i 0.5
        
        final_score = min(1.0, max(0.0, score_base + popularity_bonus))
        
        mascotas_con_score.append({
            'mascota': mascota,
            'score': round(final_score, 3),
            'score_explicites': round(score_explicites, 3),
            'score_implicites': round(score_implicites, 3),
        })
    
    # Ordenar per score descendent
    mascotas_con_score.sort(key=lambda x: x['score'], reverse=True)
    
    return mascotas_con_score[:limit]


# --- VISTAS API ---

class GenerarBioIAView(APIView):
    """
    Endpoint IA 3: Genera la biografía de una mascota usando la lógica de Fine-Tuning Simulado.
    Públic - no requereix autenticació.
    """
    permission_classes = []  # Públic
    
    def post(self, request, *args, **kwargs):
        try:
            print("📥 Datos recibidos en GenerarBioIAView:", request.data)
            resultado = simular_generacion_ia(request.data)
            print("✅ Biografía generada exitosamente")
            
            return Response({'biografia': resultado['biografia']}, status=status.HTTP_200_OK)
        except Exception as e:
            print("❌ Error en GenerarBioIAView:", str(e))
            import traceback
            traceback.print_exc()
            
            return Response({
                'error': str(e),
                'biografia': 'Error al generar la biografía. Por favor, inténtalo de nuevo o escribe una manualmente.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChatbotFAQView(APIView):
    """
    Endpoint IA 1: Chatbot FAQ básico.
    Públic - no requereix autenticació.
    """
    permission_classes = []  # Públic
    
    def post(self, request, *args, **kwargs):
        pregunta_usuario = normalize_text(request.data.get('pregunta', ''))
        
        tokenizer = RegexpTokenizer(r'\w+') 
        palabras_pregunta = tokenizer.tokenize(pregunta_usuario)
        palabras_set = set(palabras_pregunta)

        for palabras_clave, respuesta in FAQ_BOT.items():
            if palabras_set.intersection(set(palabras_clave)):
                return Response({'respuesta': respuesta}, status=status.HTTP_200_OK)

        return Response({
            "respuesta": "Lo siento, aún no tengo respuesta para eso. Nuestro equipo te contactará pronto si tu duda no se resuelve. Pregúntame sobre \"costo\", \"proceso\" o \"niños\"."
        }, status=status.HTTP_200_OK)


class RecomendacionIAView(APIView):
    """
    Endpoint IA 2: Sistema de Recomanació Híbrid Intel·ligent.
    
    GET /api/ia/recomendacion/
    - Requereix autenticació
    - Combina preferències explícites (perfil) + implícites (likes)
    - Retorna mascotes recomanades amb score de compatibilitat
    
    Query params opcionals:
    - limit: nombre màxim de recomanacions (default: 5)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        from mascotas.serializers import MascotaSerializer
        
        usuario = request.user
        limit = int(request.query_params.get('limit', 5))
        
        # Obtenir recomanacions
        recomanacions = obtenir_recomanacions_ia(usuario, limit=limit)
        
        if recomanacions:
            resultado = []
            for rec in recomanacions:
                mascota_data = MascotaSerializer(
                    rec['mascota'], 
                    context={'request': request}
                ).data
                mascota_data['recomendacion_score'] = rec['score']
                mascota_data['match_percentage'] = int(rec['score'] * 100)
                mascota_data['score_preferencias'] = rec['score_explicites']
                mascota_data['score_historial'] = rec['score_implicites']
                resultado.append(mascota_data)
            
            return Response({
                'recomendaciones': resultado,
                'total': len(resultado),
                'mensaje': f'Hem trobat {len(resultado)} mascotes que podrien interessar-te!'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'recomendaciones': [],
                'total': 0,
                'mensaje': 'No hi ha més mascotes disponibles. Has revisat totes!'
            }, status=status.HTTP_200_OK)


class DebugKeysIAView(APIView):
    """
    Endpoint de Depuración. Muestra todas las palabras clave que la IA 3 ha cargado.
    """
    def get(self, request, *args, **kwargs):
        debug_output = {}
        for especie, plantillas in DATASET_BIOGRAFIAS.items():
            debug_output[especie] = [
                {'nombre_ejemplo': p['nombre_ejemplo'], 'keywords': list(p['keywords'])} 
                for p in plantillas
            ]
        
        return Response({
            'total_especies_cargadas': len(debug_output),
            'detalles_de_entrenamiento': debug_output
        }, status=status.HTTP_200_OK)