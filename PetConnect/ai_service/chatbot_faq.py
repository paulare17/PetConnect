# base_conocimiento.py

# Base de conocimiento (FAQ) para el Chatbot Básico
# La clave es una lista de palabras clave que activarán la respuesta.
FAQ_BOT = {
    # Proceso de Adopción
    ("adopcion", "proceso", "pasos"): 
        "El proceso de adopción en PetConnect es muy sencillo. Consiste en tres pasos: 1) Solicitud, 2) Entrevista y Visita, y 3) Firma del Contrato de Adopción. ¡Te guiaremos en todo momento!",

    # Requisitos Generales
    ("requisitos", "necesita", "edad", "puedo"): 
        "Los requisitos básicos son: ser mayor de edad, presentar una prueba de identidad y domicilio, y rellenar un cuestionario de compatibilidad. Algunos animales tienen requisitos especiales.",

    # Costos/Tasas
    ("costo", "precio", "cuesta", "pago"):
        "La adopción en sí misma es gratuita, pero se requiere una 'Tasa de Adopción' que cubre gastos veterinarios iniciales (vacunas, esterilización). El costo varía según el centro y la mascota.",

    # Saludo/Despedida
    ("gracias", "adios", "chao"):
        "¡De nada! Estamos encantados de ayudarte a encontrar a tu nueva mascota. ¡Vuelve pronto!",

    # Compatibilidad con Niños
    ("ninos", "pequenos", "bebe", "familia"):
        "Absolutamente. Muchos de nuestros animales son ideales para familias. Sin embargo, en PetConnect priorizamos la seguridad. Te pediremos que especifiques la edad de los niños para sugerirte mascotas con un historial de buena convivencia.",

    # Seguimiento Post-Adopción
    ("seguimiento", "post-adopcion", "contacto", "despues"):
        "Sí, en PetConnect realizamos un seguimiento post-adopción durante los primeros meses para asegurar la adaptación. Estamos disponibles para resolver cualquier duda que surja.",

    # Devoluciones
    ("devolucion", "retornar", "cambio", "problema"):
        "Si, lamentablemente, tienes que devolver la mascota, debes contactar inmediatamente con el centro de adopción. Es crucial que la mascota no termine en otro lugar para garantizar su bienestar y reubicación."
}