from usuarios.models import Usuario
from django.core.mail import send_mail

def notificar_por_rol(rol, asunto, mensaje):
    destinatarios = Usuario.objects.filter(role=rol).values_list('email', flat=True)
    if destinatarios:
        send_mail(asunto, mensaje, 'petconnect.noreply@gmail.com', list(destinatarios))

def notificar_nueva_solicitud_adopcion(mascota, adoptante, usuario):
    asunto = f"🐕 Nueva solicitud de adopción para {mascota.nombre}"
    mensaje = f"""
    ¡Hola {usuario.username}! 
    
    Tienes una nueva solicitud de adopción:
    
    🐾 Mascota: {mascota.nombre}
    👤 Solicitante: {adoptante.get_full_name()}
    📧 Email: {adoptante.email}
    
    Por favor, contacta con el solicitante pronto.
    
    ❤️ PetConnect Team
    """
    send_mail(asunto, mensaje, 'petconnect.noreply@gmail.com', [mascota.protectora.email])

def notificar_mascota_compatible(usuario, mascota):
    asunto = "🎯 ¡Encontramos una mascota compatible contigo!"
    mensaje = f"""
    Hola {usuario.username},
    
    Según tus preferencias, creemos que {mascota.nombre} podría ser 
    perfecto para ti:
    
    🐕 {mascota.nombre} - {mascota.get_tipo_display()}
    📍 {mascota.ubicacion}
    🎂 {mascota.edad} años
    📝 {mascota.descripcion}
    
    ¡No dudes en contactar con la protectora!
    
    ❤️ PetConnect Team
    """
    # Enviar solo a este usuario específico
    send_mail(asunto, mensaje, 'petconnect.noreply@gmail.com', [usuario.email])
