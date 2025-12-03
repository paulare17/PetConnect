from usuarios.models import Usuario
from django.contrib.auth import authenticate

# Verificar usuarios protectora
users = Usuario.objects.filter(role='protectora')
print(f'Protectoras en BD: {users.count()}')
for u in users:
    print(f'  - Username: {u.username}')
    print(f'    Email: {u.email}')
    print(f'    Password hash: {u.password[:50]}...')
    print(f'    Has usable password: {u.has_usable_password()}')
    
    # Intentar autenticar con diferentes contraseñas comunes
    for pwd in ['protectora1', 'test123', 'password']:
        auth = authenticate(username=u.username, password=pwd)
        if auth:
            print(f'    ✓ Authenticate OK with password: {pwd}')
            break
    else:
        print(f'    ✗ No authenticate with common passwords')
    print()
