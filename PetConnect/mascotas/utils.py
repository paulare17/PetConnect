
from django.core.mail import EmailMessage
from django.conf import settings
import logging

# Use the project's custom user model
from usuarios.models import Usuario

logger = logging.getLogger(__name__)


def notificar_por_rol(rol: str, asunto: str, mensaje: str, from_email: str | None = None) -> str:
    """Envía email a todos los usuarios de un rol específico.

    - Usa el modelo `Usuario` (campo `role`) para obtener emails.
    - `from_email` opcional; si no se pasa, usa `settings.DEFAULT_FROM_EMAIL`.
    - Devuelve un mensaje breve sobre el resultado.
    """
    if from_email is None:
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'petconnect.noreply@gmail.com')

    destinatarios_qs = Usuario.objects.filter(role=rol).values_list('email', flat=True)
    destinatarios = [email for email in destinatarios_qs if email]

    if not destinatarios:
        logger.info("No hay %s con email registrado", rol)
        return f"No hay {rol}s con email registrado"

    email = EmailMessage(subject=asunto, body=mensaje, from_email=from_email, to=destinatarios)
    try:
        # send() uses the configured EMAIL_BACKEND (console, smtp, etc.)
        email.send(fail_silently=False)
        logger.info("Email enviado a %d %s(s)", len(destinatarios), rol)
        return f"Email enviado a {len(destinatarios)} {rol}s"
    except Exception as exc:
        # Log exception with stack trace; do not expose stack traces to users
        logger.exception("Error enviando email a %s: %s", rol, exc)
        return f"Error enviando email: {exc}"
