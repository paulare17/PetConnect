import os 

# Datos estructurados de entrada para la IA (Simulando la información del centro)
ANIMALES_PARA_BIO = [
    {
        "id": 1,
        "nombre": "Leo",
        "especie": "Perro",
        "raza": "Mestizo Labrador",
        "edad_años": 3,
        "caracter": "Tímido al principio, pero muy cariñoso con mujeres. Ama las pelotas y los paseos tranquilos.",
        "historia_breve": "Fue encontrado atado a un poste en un parque. Le cuesta confiar en hombres.",
        "condicion_especial": "Ninguna"
    },
    {
        "id": 2,
        "nombre": "Luna",
        "especie": "Gato",
        "raza": "Siamés",
        "edad_años": 1,
        "caracter": "Juguetona, muy activa, independiente, y no le gusta que la carguen mucho.",
        "historia_breve": "Rescatada de una camada abandonada en un almacén. Necesita enriquecimiento ambiental.",
        "condicion_especial": "Sufre de diabetes y requiere dieta especial."
    },
]

# ----------------------------------------------------------------------
# IMPORTANTE: Esta función SIMULA la llamada a un modelo grande de lenguaje.
# Usamos una lógica de string simple para el prototipo.
# ----------------------------------------------------------------------

def generar_biografia_ia(animal_data):
    """
    Simula la IA para generar una biografía atractiva a partir de los datos.
    """
    nombre = animal_data['nombre']
    especie = animal_data['especie']
    raza = animal_data['raza']
    edad = animal_data['edad_años']
    caracter = animal_data['caracter']
    historia = animal_data['historia_breve']
    necesidades = animal_data['condicion_especial'] if 'condicion_especial' in animal_data else "Ninguna"

    # Definición del prompt (Instrucción clave para la IA)
    # El prompt es lo que guía el estilo de la biografía.
    prompt = f"""
    Toma los siguientes datos sobre un animal y redacta una biografía corta, emotiva y persuasiva para un sitio web de adopción.
    El tono debe ser esperanzador y honesto.

    DATOS DEL ANIMAL:
    - Nombre: {nombre}
    - Especie: {especie}
    - Raza: {raza}
    - Edad: {edad} año(s)
    - Carácter: {caracter}
    - Historia: {historia}
    - Necesidades especiales: {necesidades}
    """

    # --- SIMULACIÓN DEL RESULTADO (Esta es la 'respuesta' de la IA) ---
    if nombre == "Leo":
        biografia_generada = f"""
¡Conoce a Leo, nuestro apuesto {raza} de {edad} años! 🐾
Leo llegó a nuestro refugio con una historia de abandono, lo que lo hace un poco reservado al conocer gente nueva. Es **tímido con hombres**, pero una vez que te ganas su corazón, especialmente si eres mujer, se convierte en la sombra más fiel. Su mayor alegría es perseguir pelotas en un jardín seguro y disfrutar de paseos relajantes. Leo busca una casa con paciencia y mucho amor para ayudarle a olvidar su pasado. ¡Dale la oportunidad de saber lo que es el calor de un hogar!
        """
    else: # Luna
        biografia_generada = f"""
¡Te presentamos a Luna, una hermosa y vibrante {raza} de {edad} año! 🐈
Luna no es una gata de regazo, ¡es una exploradora! Es la compañera ideal si buscas un espíritu libre y juguetón que convierta cualquier rincón de tu casa en una aventura. Rescatada de una camada abandonada en un almacén, su energía es ilimitada y necesita muchos juguetes y rascadores. Si te gusta la acción y buscas una gata independiente con personalidad, Luna te está esperando. ¡Promete diversión y travesuras garantizadas!
        """
    # -------------------------------------------------------------

    return biografia_generada


# --- Ejecución del Prototipo ---
if __name__ == "__main__":
    print("--- 🤖 PROTOTIPO IA 3: GENERACIÓN DE BIOGRAFÍA ---")
    
    for animal in ANIMALES_PARA_BIO:
        print(f"\n[ENTRADA] Procesando a {animal['nombre']}...")
        
        # 1. Ejecutar la simulación de la IA
        bio_final = generar_biografia_ia(animal)
        
        # 2. Mostrar el resultado generado por la IA
        print(f"\n[SALIDA DE IA PARA {animal['nombre']}]")
        print(bio_final.strip())
        print("\n" + "="*50)