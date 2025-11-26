from usuarios.models import Usuario

print("Actualizando contraseñas de protectoras...")

# Actualizar protectora1
try:
    u1 = Usuario.objects.get(username='protectora1')
    u1.set_password('Protectora1')  # Usar set_password para hashear
    u1.save()
    print(f"✓ Contraseña de protectora1 actualizada")
except Usuario.DoesNotExist:
    print("✗ protectora1 no existe")

# Actualizar protectora5
try:
    u2 = Usuario.objects.get(username='protectora5')
    u2.set_password('12345678')  # Usar set_password para hashear
    u2.save()
    print(f"✓ Contraseña de protectora5 actualizada")
except Usuario.DoesNotExist:
    print("✗ protectora5 no existe")

print("\n Verificando autenticación...")
from django.contrib.auth import authenticate

auth1 = authenticate(username='protectora1', password='Protectora1')
print(f"protectora1: {'✓ OK' if auth1 else '✗ FAIL'}")

auth2 = authenticate(username='protectora5', password='12345678')
print(f"protectora5: {'✓ OK' if auth2 else '✗ FAIL'}")
