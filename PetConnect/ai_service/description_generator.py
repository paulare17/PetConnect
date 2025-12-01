# ai_service/description_generator.py
# Generador de biografías para mascotas usando IA
# Adaptado del código del repositorio PetConnect_Proyecto-main

class DescriptionGenerator:
    """
    Genera biografías atractivas para mascotas basándose en sus características.
    Actualmente usa lógica simulada, pero puede ser extendido para usar LLMs reales.
    """
    
    @staticmethod
    def generate_description(mascota_data):
        """
        Genera una biografía automática basada en los datos de la mascota.
        
        Args:
            mascota_data (dict): Diccionario con los datos de la mascota:
                - nombre: str
                - especie: str ('perro' o 'gato')
                - raza_perro: str (opcional)
                - raza_gato: str (opcional)
                - edad: int
                - genero: str
                - tamaño: str
                - caracter: str
                - convivencia_ninos: bool
                - convivencia_animales: str
                - descripcion_necesidades: str (opcional)
                - desparasitado: bool (opcional)
                - esterilizado: bool (opcional)
                - con_microchip: bool (opcional)
                - vacunado: bool (opcional)
        
        Returns:
            str: Biografía generada de la mascota
        """
        nombre = mascota_data.get('nombre', 'Mascota')
        especie = mascota_data.get('especie', 'animal')
        edad = mascota_data.get('edad', 0)
        genero = mascota_data.get('genero', '')
        tamaño = mascota_data.get('tamaño', '')
        caracter = mascota_data.get('caracter', '')
        convivencia_ninos = mascota_data.get('convivencia_ninos')
        convivencia_animales = mascota_data.get('convivencia_animales', '')
        necesidades = mascota_data.get('descripcion_necesidades', '')
        
        # Estado de salud
        desparasitado = mascota_data.get('desparasitado', False)
        esterilizado = mascota_data.get('esterilizado', False)
        con_microchip = mascota_data.get('con_microchip', False)
        vacunado = mascota_data.get('vacunado', False)
        
        # Determinar la raza según la especie
        if especie.lower() == 'perro':
            raza = mascota_data.get('raza_perro', 'Mestizo')
        else:
            raza = mascota_data.get('raza_gato', 'Mestizo')
        
        # Construir el prompt basado en los datos
        biografia = DescriptionGenerator._build_biography(
            nombre, especie, raza, edad, genero, tamaño, 
            caracter, convivencia_ninos, convivencia_animales, necesidades,
            desparasitado, esterilizado, con_microchip, vacunado
        )
        
        return biografia
    
    @staticmethod
    def _build_biography(nombre, especie, raza, edad, genero, tamaño, 
                        caracter, convivencia_ninos, convivencia_animales, necesidades,
                        desparasitado, esterilizado, con_microchip, vacunado):
        """
        Construye la biografía con lógica personalizada según características.
        """
        # Determinar el artículo y pronombres
        articulo = "un" if genero == "macho" else "una"
        pronombre = "él" if genero == "macho" else "ella"
        
        # Introducción según la especie
        if especie.lower() == 'perro':
            intro = f"¡Te presentamos a {nombre}, {articulo} encantador {especie.lower()} {raza}"
        else:
            intro = f"¡Conoce a {nombre}, {articulo} precioso {especie.lower()} {raza}"
        
        # Descripción de edad y tamaño
        if edad == 0:
            edad_desc = "Es un cachorro lleno de energía"
        elif edad <= 2:
            edad_desc = f"Con {edad} año{'s' if edad > 1 else ''}, está en la flor de la vida"
        elif edad <= 7:
            edad_desc = f"A sus {edad} años, tiene la madurez perfecta"
        else:
            edad_desc = f"Con {edad} años de experiencia en dar amor"
        
        # Descripción según el carácter (puede ser múltiple)
        if caracter:
            caracter_mapping = {
                'cariñoso': 'cariñoso',
                'jugueton': 'juguetón',
                'tranquilo': 'tranquilo',
                'activo': 'activo',
                'sociable': 'sociable',
                'independiente': 'independiente',
                'protector': 'protector',
                'timido': 'tímido',
                'obediente': 'obediente'
            }
            
            caracter_detalle = {
                'cariñoso': 'le encanta estar cerca de sus humanos y dar mimos constantemente',
                'jugueton': 'adora jugar y divertirse',
                'tranquilo': 'es de naturaleza calmada',
                'activo': 'necesita mucha actividad física y mental',
                'sociable': 'le encanta conocer gente nueva y hacer amigos',
                'independiente': 'valora su espacio personal pero también sabe dar cariño',
                'protector': 'cuida de su familia con devoción',
                'timido': 'necesita un poco de paciencia para ganar su confianza',
                'obediente': 'es muy receptivo al entrenamiento y aprendizaje'
            }
            
            # Convertir caracter a lista si viene como string separado por comas
            if isinstance(caracter, str):
                caracteres = [c.strip().lower() for c in caracter.split(',') if c.strip()]
            else:
                caracteres = [caracter.lower()]
            
            # Construir descripción de carácter
            if len(caracteres) == 0:
                caracter_desc = ""
            elif len(caracteres) == 1:
                car = caracteres[0]
                detalle = caracter_detalle.get(car, '')
                if detalle:
                    caracter_desc = f"{pronombre.capitalize()} es {caracter_mapping.get(car, car)} y {detalle}"
                else:
                    caracter_desc = ""
            else:
                # Múltiples características
                cars_str = ", ".join([caracter_mapping.get(c, c) for c in caracteres[:-1]]) + f" y {caracter_mapping.get(caracteres[-1], caracteres[-1])}"
                detalles = [caracter_detalle.get(c, '') for c in caracteres if caracter_detalle.get(c)]
                if detalles:
                    detalles_str = ", ".join(detalles[:2]) if len(detalles) > 1 else detalles[0]
                    caracter_desc = f"{pronombre.capitalize()} es {cars_str}. {detalles_str.capitalize()}"
                else:
                    caracter_desc = f"{pronombre.capitalize()} es {cars_str}"
        else:
            caracter_desc = ""
        
        # Información sobre convivencia
        convivencia_desc = ""
        if convivencia_ninos is not None:
            if convivencia_ninos:
                convivencia_desc = f"{pronombre.capitalize()} puede convivir perfectamente con niños. "
            else:
                convivencia_desc = f"Es mejor para hogares sin niños pequeños. "
        
        if convivencia_animales == 'cualquier_especie':
            convivencia_desc += f"Además, se lleva bien con otros animales."
        elif convivencia_animales == 'misma_especie':
            convivencia_desc += f"Puede convivir con otros {especie.lower()}s."
        elif convivencia_animales == 'no':
            convivencia_desc += f"Prefiere ser el único animal en casa."
        
        # Estado de salud
        salud_items = []
        if vacunado:
            salud_items.append("vacunado")
        if esterilizado:
            salud_items.append("esterilizado")
        if desparasitado:
            salud_items.append("desparasitado")
        if con_microchip:
            salud_items.append("con microchip")
        
        salud_desc = ""
        if salud_items:
            if len(salud_items) == 1:
                salud_desc = f"\n\n✅ Estado de salud: {pronombre.capitalize()} está {salud_items[0]}."
            elif len(salud_items) == 2:
                salud_desc = f"\n\n✅ Estado de salud: {pronombre.capitalize()} está {salud_items[0]} y {salud_items[1]}."
            else:
                items_str = ", ".join(salud_items[:-1]) + f" y {salud_items[-1]}"
                salud_desc = f"\n\n✅ Estado de salud: {pronombre.capitalize()} está {items_str}."
        
        # Necesidades especiales si las hay
        necesidades_desc = ""
        if necesidades:
            necesidades_desc = f"\n\n⚕️ Nota importante: {necesidades}"
        
        # Llamada a la acción
        if especie.lower() == 'perro':
            cierre = f"\n\n¡{nombre} está listo para llenar tu hogar de alegría y ladridos felices! ¿Le darás la oportunidad de ser tu mejor amigo? 🐾"
        else:
            cierre = f"\n\n¡{nombre} está esperando encontrar su hogar definitivo! ¿Serás tú quien le abra las puertas a una nueva vida? 🐾"
        
        # Ensamblar la biografía completa
        partes = [intro + "!", edad_desc + "."]
        
        if caracter_desc:
            partes.append(caracter_desc + ".")
            
        if convivencia_desc:
            partes.append(convivencia_desc)
            
        if salud_desc:
            partes.append(salud_desc)
            
        if necesidades_desc:
            partes.append(necesidades_desc)
            
        partes.append(cierre)
        
        biografia = " ".join(partes)
        
        return biografia
    
    @staticmethod
    def generate_description_with_openai(mascota_data, api_key=None):
        """
        Versión alternativa usando OpenAI (requiere configuración adicional).
        Esta función está preparada para cuando quieras usar un LLM real.
        
        Args:
            mascota_data (dict): Datos de la mascota
            api_key (str): API key de OpenAI (opcional, puede venir de settings)
        
        Returns:
            str: Biografía generada por IA
        """
        # TODO: Implementar cuando se tenga acceso a OpenAI
        # from openai import OpenAI
        # from django.conf import settings
        # 
        # client = OpenAI(api_key=api_key or settings.OPENAI_API_KEY)
        # 
        # prompt = f"""Genera una biografía atractiva para una mascota en adopción:
        # Nombre: {mascota_data.get('nombre')}
        # Especie: {mascota_data.get('especie')}
        # ...
        # """
        # 
        # response = client.chat.completions.create(...)
        # return response.choices[0].message.content
        
        # Por ahora, usar la versión simulada
        return DescriptionGenerator.generate_description(mascota_data)
