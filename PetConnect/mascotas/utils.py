from django.core.mail import send_mail
from django.contrib.auth.models import User

def notificar_por_rol(rol, asunto, mensaje):
    """Envía email a todos los usuarios de un rol específico"""
    usuarios = User.objects.filter(rol=rol)
    
    emails = []
    for usuario in usuarios:
        if usuario.email:  # Solo si tiene email
            emails.append(usuario.email)
    
    if emails:
        send_mail(
            asunto,
            mensaje,
            'noreply@petmatch.com',
            emails,
            fail_silently=False,
        )
        return f"Email enviado a {len(emails)} {rol}s"
    return f"No hay {rol}s con email registrado"