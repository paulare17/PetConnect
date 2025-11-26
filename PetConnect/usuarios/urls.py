"""
Aquest fitxer ja no és necessari perquè s'utilitza el ViewSet registrat al router principal.
Els endpoints d'usuaris estan disponibles a través de:

AUTENTICACIÓ:
- POST   /api/token/                → Login JWT (retorna access i refresh tokens)
- POST   /api/token/refresh/        → Renovar access token
- POST   /api/usuarios/login/       → Login custom (retorna tokens + dades usuari)
- POST   /api/usuarios/logout/      → Logout (cal eliminar tokens al client)

USUARIS:
- POST   /api/usuarios/              → Registrar usuari nou (públic)
- GET    /api/usuarios/              → Llistar usuaris (només admin veu tots)
- GET    /api/usuarios/{id}/         → Obtenir usuari específic
- PUT    /api/usuarios/{id}/         → Actualitzar usuari complet
- PATCH  /api/usuarios/{id}/         → Actualitzar camps específics
- DELETE /api/usuarios/{id}/         → Eliminar usuari
- GET    /api/usuarios/me/           → Perfil usuari actual

PERFILS:
- GET    /api/perfil-usuario/        → Llistar perfils usuari
- POST   /api/perfil-usuario/        → Crear perfil usuari (només rol usuario)
- GET    /api/perfil-usuario/{id}/   → Detall perfil usuari
- PUT    /api/perfil-usuario/{id}/   → Actualitzar perfil
- PATCH  /api/perfil-usuario/{id}/   → Actualitzar parcial
- DELETE /api/perfil-usuario/{id}/   → Eliminar perfil

- GET    /api/perfil-protectora/     → Llistar perfils protectora
- POST   /api/perfil-protectora/     → Crear perfil protectora (només rol protectora)
- GET    /api/perfil-protectora/{id}/ → Detall perfil protectora
- PUT    /api/perfil-protectora/{id}/ → Actualitzar perfil
- PATCH  /api/perfil-protectora/{id}/ → Actualitzar parcial
- DELETE /api/perfil-protectora/{id}/ → Eliminar perfil
"""

# Aquest fitxer es pot eliminar si no s'utilitza per res més
urlpatterns = []