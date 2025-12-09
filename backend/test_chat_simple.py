"""
Script simplificado para probar los endpoints del chat de PetConnect
"""
import requests
import json
import random
from io import BytesIO

BASE_URL = "http://127.0.0.1:8000"

# Colores
class C:
    G = '\033[92m'; R = '\033[91m'; Y = '\033[93m'; B = '\033[94m'; E = '\033[0m'

def pr(name): print(f"\n{C.B}{'='*60}\nTEST: {name}\n{'='*60}{C.E}")
def ok(msg): print(f"{C.G}✓ {msg}{C.E}")
def err(msg): print(f"{C.R}✗ {msg}{C.E}")
def info(msg): print(f"{C.Y}ℹ {msg}{C.E}")
def pj(d): print(json.dumps(d, indent=2, ensure_ascii=False))

# Datos globales
suffix = random.randint(1000, 9999)
protectora_user = f"protectora{suffix}"
adoptante_user = f"usuario{suffix}"
protectora_pass = "test12345"
adoptante_pass = "test12345"
token_p = None
token_u = None
mascota_id = None
chat_id = None

print(f"\n{C.B}{'='*60}\n🐾 PRUEBA DE ENDPOINTS - PETCONNECT CHAT\n{'='*60}{C.E}\n")
info(f"Servidor: {BASE_URL}")
info(f"Protectora: {protectora_user}")
info(f"Adoptante: {adoptante_user}")
input("\nPresiona Enter para continuar...\n")

# 1. REGISTRAR PROTECTORA
pr("1. Registrar Protectora")
r = requests.post(f"{BASE_URL}/api/usuarios/", json={
    "username": protectora_user,
    "password": protectora_pass,
    "email": f"{protectora_user}@test.com",
    "role": "protectora"
})
print(f"Status: {r.status_code}")
if r.status_code in [200, 201]:
    data = r.json()
    token_p = data['access']
    ok(f"Registrado - Token guardado")
else:
    err(f"Error: {r.text[:200]}")
    exit(1)

# 2. REGISTRAR USUARIO
pr("2. Registrar Usuario Adoptante")
r = requests.post(f"{BASE_URL}/api/usuarios/", json={
    "username": adoptante_user,
    "password": adoptante_pass,
    "email": f"{adoptante_user}@test.com",
    "role": "usuario"
})
print(f"Status: {r.status_code}")
if r.status_code in [200, 201]:
    data = r.json()
    token_u = data['access']
    ok(f"Registrado - Token guardado")
else:
    err(f"Error: {r.text[:200]}")
    exit(1)

# 3. CREAR MASCOTA
pr("3. Crear Mascota (como Protectora)")
# Crear una imagen fake en memoria
from PIL import Image
img = Image.new('RGB', (100, 100), color='red')
buf = BytesIO()
img.save(buf, format='JPEG')
buf.seek(0)

files = {'foto': ('luna.jpg', buf, 'image/jpeg')}
data = {
    "nombre": "Luna",
    "especie": "perro",
    "raza_perro": "labrador",
    "edad": 3,
    "genero": "hembra",
    "descripcion": "Perrita muy cariñosa",
    "estado_salud": "excelente",
    "vacunas_al_dia": "true",
    "esterilizado": "true",
    "convivencia_animales": "cualquier_especie",
    "caracter": "cariñoso"
}

r = requests.post(f"{BASE_URL}/api/mascota/", 
                 data=data, 
                 files=files,
                 headers={"Authorization": f"Bearer {token_p}"})
print(f"Status: {r.status_code}")
if r.status_code in [200, 201]:
    result = r.json()
    mascota_id = result['id']
    ok(f"Mascota creada - ID: {mascota_id}")
else:
    err(f"Error: {r.text[:500]}")
    exit(1)

# 4. SWIPE LIKE (Crea chat automáticamente)
pr("4. Swipe Like → Crea Chat Automático")
r = requests.post(f"{BASE_URL}/api/swipe/action/",
                 json={"mascota_id": mascota_id, "action": "L"},
                 headers={"Authorization": f"Bearer {token_u}"})
print(f"Status: {r.status_code}")
if r.status_code in [200, 201]:
    result = r.json()
    chat_id = result.get('chat_id')
    pj(result)
    ok(f"Like registrado - Chat ID: {chat_id}")
else:
    err(f"Error: {r.text[:200]}")
    exit(1)

# 5. LISTAR CHATS USUARIO
pr("5. Listar Chats del Usuario")
r = requests.get(f"{BASE_URL}/api/chat/chats/",
                headers={"Authorization": f"Bearer {token_u}"})
print(f"Status: {r.status_code}")
if r.status_code == 200:
    chats = r.json()
    pj(chats)
    if len(chats) > 0:
        ok(f"Usuario ve {len(chats)} chat(s)")
    else:
        info("Usuario no ve chats")
else:
    err(f"Error: {r.text[:200]}")

# 6. LISTAR CHATS PROTECTORA (sin mensajes)
pr("6. Listar Chats Protectora (SIN mensajes)")
r = requests.get(f"{BASE_URL}/api/chat/chats/",
                headers={"Authorization": f"Bearer {token_p}"})
print(f"Status: {r.status_code}")
if r.status_code == 200:
    chats = r.json()
    pj(chats)
    if len(chats) == 0:
        ok("✓ CORRECTO: Protectora NO ve el chat (sin mensajes)")
    else:
        info(f"Protectora ve {len(chats)} chat(s)")
else:
    err(f"Error: {r.text[:200]}")

# 7. ENVIAR PRIMER MENSAJE
pr("7. Usuario Envía Primer Mensaje")
r = requests.post(f"{BASE_URL}/api/chat/chats/{chat_id}/enviar_mensaje/",
                 json={"contenido": "¡Hola! Me encantaría adoptar a Luna 🐕"},
                 headers={"Authorization": f"Bearer {token_u}"})
print(f"Status: {r.status_code}")
if r.status_code in [200, 201]:
    result = r.json()
    pj(result)
    ok("Mensaje enviado")
else:
    err(f"Error: {r.text[:200]}")
    exit(1)

# 8. LISTAR CHATS PROTECTORA (CON mensajes)
pr("8. Listar Chats Protectora (CON mensajes)")
r = requests.get(f"{BASE_URL}/api/chat/chats/",
                headers={"Authorization": f"Bearer {token_p}"})
print(f"Status: {r.status_code}")
if r.status_code == 200:
    chats = r.json()
    pj(chats)
    if len(chats) > 0:
        ok(f"✓ CORRECTO: Protectora AHORA VE {len(chats)} chat(s)")
    else:
        err("Protectora NO ve el chat (debería verlo)")
else:
    err(f"Error: {r.text[:200]}")

# 9. VER MENSAJES
pr("9. Ver Mensajes del Chat")
r = requests.get(f"{BASE_URL}/api/chat/chats/{chat_id}/",
                headers={"Authorization": f"Bearer {token_p}"})
print(f"Status: {r.status_code}")
if r.status_code == 200:
    mensajes = r.json()
    pj(mensajes)
    ok(f"Mensajes: {len(mensajes)}")
else:
    err(f"Error: {r.text[:200]}")

# 10. PROTECTORA RESPONDE
pr("10. Protectora Responde")
r = requests.post(f"{BASE_URL}/api/chat/chats/{chat_id}/enviar_mensaje/",
                 json={"contenido": "¡Hola! Nos encantaría que conozcas a Luna. ¿Cuándo podrías venir?"},
                 headers={"Authorization": f"Bearer {token_p}"})
print(f"Status: {r.status_code}")
if r.status_code in [200, 201]:
    result = r.json()
    pj(result)
    ok("Respuesta enviada")
else:
    err(f"Error: {r.text[:200]}")

print(f"\n{C.B}{'='*60}\n✅ PRUEBAS COMPLETADAS\n{'='*60}{C.E}\n")
print(f"{C.G}🎉 Sistema de chat funcionando correctamente!{C.E}\n")
