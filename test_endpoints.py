"""
Script para probar los endpoints del chat de PetConnect
Ejecutar con: python test_endpoints.py
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Colores para la consola
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"TEST: {name}")
    print(f"{'='*60}{Colors.END}")

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.YELLOW}ℹ {msg}{Colors.END}")

def print_json(data):
    print(json.dumps(data, indent=2, ensure_ascii=False))

# Variables globales para almacenar tokens y IDs
auth_token_usuario = None
auth_token_protectora = None
user_id = None
protectora_id = None
mascota_id = None
chat_id = None

def test_1_registrar_protectora():
    """Registrar una cuenta de protectora"""
    print_test("1. Registrar Protectora")
    
    import random
    suffix = random.randint(1000, 9999)
    
    data = {
        "username": f"protectora_test_{suffix}",
        "password": "test123456",
        "email": f"protectora{suffix}@test.com",
        "role": "protectora"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/usuarios/", json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print_json(result)
            print_success("Protectora registrada correctamente")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_2_registrar_usuario():
    """Registrar una cuenta de usuario adoptante"""
    print_test("2. Registrar Usuario Adoptante")
    
    import random
    suffix = random.randint(1000, 9999)
    
    data = {
        "username": f"usuario_test_{suffix}",
        "password": "test123456",
        "email": f"usuario{suffix}@test.com",
        "role": "usuario"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/usuarios/", json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print_json(result)
            print_success("Usuario registrado correctamente")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_3_login_protectora():
    """Login con cuenta de protectora"""
    global auth_token_protectora, protectora_id
    print_test("3. Login Protectora")
    
    data = {
        "username": "protectora_test",
        "password": "test123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/usuarios/login/", json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            auth_token_protectora = result.get('access')
            protectora_id = result.get('user', {}).get('id')
            print_json(result)
            print_success(f"Login exitoso - Token guardado - User ID: {protectora_id}")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_4_login_usuario():
    """Login con cuenta de usuario"""
    global auth_token_usuario, user_id
    print_test("4. Login Usuario Adoptante")
    
    data = {
        "username": "usuario_test",
        "password": "test123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/usuarios/login/", json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            auth_token_usuario = result.get('access')
            user_id = result.get('user', {}).get('id')
            print_json(result)
            print_success(f"Login exitoso - Token guardado - User ID: {user_id}")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_5_crear_mascota():
    """Crear una mascota como protectora"""
    global mascota_id
    print_test("5. Crear Mascota (como Protectora)")
    
    if not auth_token_protectora:
        print_error("No hay token de protectora. Ejecuta el login primero.")
        return False
    
    data = {
        "nombre": "Luna",
        "especie": "perro",
        "raza": "Labrador",
        "edad": 3,
        "sexo": "H",
        "tamaño": "grande",
        "descripcion": "Perrita muy cariñosa y juguetona",
        "estado_salud": "excelente",
        "vacunas_al_dia": True,
        "esterilizado": True,
        "convivencia_animales": "si",
        "convivencia_ninos": "si",
        "nivel_actividad": "alta",
        "caracter": "amigable,jugueton,energico"
    }
    
    headers = {"Authorization": f"Bearer {auth_token_protectora}"}
    
    try:
        response = requests.post(f"{BASE_URL}/api/mascota/", json=data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            mascota_id = result.get('id')
            print_json(result)
            print_success(f"Mascota creada - ID: {mascota_id}")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_6_swipe_like():
    """Hacer like a una mascota (crea el chat automáticamente)"""
    global chat_id
    print_test("6. Swipe Like (Crea Chat Automáticamente)")
    
    if not auth_token_usuario:
        print_error("No hay token de usuario. Ejecuta el login primero.")
        return False
    
    if not mascota_id:
        print_error("No hay mascota creada. Ejecuta test_5_crear_mascota primero.")
        return False
    
    data = {
        "mascota_id": mascota_id,
        "action": "L"
    }
    
    headers = {"Authorization": f"Bearer {auth_token_usuario}"}
    
    try:
        response = requests.post(f"{BASE_URL}/api/swipe/action/", json=data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            chat_id = result.get('chat_id')
            print_json(result)
            print_success(f"Like registrado - Chat creado - ID: {chat_id}")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_7_listar_chats_usuario():
    """Listar chats del usuario (debe ver el chat creado)"""
    print_test("7. Listar Chats del Usuario (debe aparecer el chat)")
    
    if not auth_token_usuario:
        print_error("No hay token de usuario.")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token_usuario}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/chat/chats/", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print_json(result)
            if len(result) > 0:
                print_success(f"Usuario ve {len(result)} chat(s)")
            else:
                print_info("Usuario no ve ningún chat todavía")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_8_listar_chats_protectora():
    """Listar chats de la protectora (NO debe ver el chat sin mensajes)"""
    print_test("8. Listar Chats de la Protectora (NO debe aparecer sin mensajes)")
    
    if not auth_token_protectora:
        print_error("No hay token de protectora.")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token_protectora}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/chat/chats/", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print_json(result)
            if len(result) == 0:
                print_success("✓ CORRECTO: Protectora NO ve el chat (sin mensajes)")
            else:
                print_info(f"Protectora ve {len(result)} chat(s) - puede tener mensajes de otros tests")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_9_enviar_mensaje():
    """Enviar primer mensaje (ahora la protectora DEBE verlo)"""
    print_test("9. Enviar Primer Mensaje")
    
    if not auth_token_usuario or not chat_id:
        print_error("Falta token de usuario o ID del chat.")
        return False
    
    data = {
        "contenido": "¡Hola! Me encantaría adoptar a Luna 🐕"
    }
    
    headers = {"Authorization": f"Bearer {auth_token_usuario}"}
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat/chats/{chat_id}/enviar_mensaje/",
            json=data,
            headers=headers
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print_json(result)
            print_success("Mensaje enviado correctamente")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_10_listar_chats_protectora_con_mensaje():
    """Listar chats de la protectora (AHORA SÍ debe verlo)"""
    print_test("10. Listar Chats de la Protectora (AHORA SÍ debe aparecer)")
    
    if not auth_token_protectora:
        print_error("No hay token de protectora.")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token_protectora}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/chat/chats/", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print_json(result)
            if len(result) > 0:
                print_success(f"✓ CORRECTO: Protectora ahora ve {len(result)} chat(s) con mensajes")
            else:
                print_error("Protectora NO ve el chat (debería verlo)")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_11_ver_mensajes():
    """Ver mensajes de un chat"""
    print_test("11. Ver Mensajes del Chat")
    
    if not auth_token_protectora or not chat_id:
        print_error("Falta token o ID del chat.")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token_protectora}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/chat/chats/{chat_id}/", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print_json(result)
            print_success(f"Mensajes recuperados: {len(result)} mensaje(s)")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_12_responder_mensaje():
    """Protectora responde al mensaje"""
    print_test("12. Protectora Responde al Mensaje")
    
    if not auth_token_protectora or not chat_id:
        print_error("Falta token de protectora o ID del chat.")
        return False
    
    data = {
        "contenido": "¡Hola! Nos encantaría que conozcas a Luna. ¿Cuándo podrías venir?"
    }
    
    headers = {"Authorization": f"Bearer {auth_token_protectora}"}
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat/chats/{chat_id}/enviar_mensaje/",
            json=data,
            headers=headers
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print_json(result)
            print_success("Respuesta enviada correctamente")
            return True
        else:
            print_error(f"Error: {response.text}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def main():
    print(f"\n{Colors.BLUE}{'='*60}")
    print("🐾 PRUEBA DE ENDPOINTS - PETCONNECT CHAT")
    print(f"{'='*60}{Colors.END}\n")
    
    print_info("Asegúrate de que el servidor Django esté corriendo en http://127.0.0.1:8000")
    input("Presiona Enter para continuar...")
    
    tests = [
        test_1_registrar_protectora,
        test_2_registrar_usuario,
        test_3_login_protectora,
        test_4_login_usuario,
        test_5_crear_mascota,
        test_6_swipe_like,
        test_7_listar_chats_usuario,
        test_8_listar_chats_protectora,
        test_9_enviar_mensaje,
        test_10_listar_chats_protectora_con_mensaje,
        test_11_ver_mensajes,
        test_12_responder_mensaje,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except KeyboardInterrupt:
            print_error("\n\nPruebas interrumpidas por el usuario")
            break
        except Exception as e:
            print_error(f"Error inesperado: {str(e)}")
            failed += 1
    
    print(f"\n{Colors.BLUE}{'='*60}")
    print("RESUMEN DE PRUEBAS")
    print(f"{'='*60}{Colors.END}")
    print(f"{Colors.GREEN}✓ Exitosas: {passed}{Colors.END}")
    print(f"{Colors.RED}✗ Fallidas: {failed}{Colors.END}")
    print(f"Total: {passed + failed}\n")

if __name__ == "__main__":
    main()
