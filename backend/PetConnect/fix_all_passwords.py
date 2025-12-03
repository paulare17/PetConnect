from usuarios.models import Usuario

print("Verificando todos los usuarios...")

for user in Usuario.objects.all():
    print(f"\nUsuario: {user.username} (role: {user.role})")
    password_hash = user.password
    
    # Verificar si la contraseña está hasheada (debe empezar con pbkdf2_sha256$, argon2$, bcrypt$, etc.)
    if not (password_hash.startswith('pbkdf2_') or 
            password_hash.startswith('argon2') or 
            password_hash.startswith('bcrypt')):
        print(f"  ⚠️  CONTRASEÑA EN TEXTO PLANO: {password_hash}")
        print(f"  Actualizando con set_password()...")
        user.set_password(password_hash)
        user.save()
        print(f"  ✓ Actualizada")
    else:
        print(f"  ✓ Contraseña hasheada correctamente")
