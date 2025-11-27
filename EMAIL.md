EMAIL setup and testing (PetConnect)
===================================

Propósito
--------
Este documento explica cómo configurar y probar el envío de correos en desarrollo y producción para el proyecto PetConnect.

Resumen rápido
---------------
- En desarrollo el backend por defecto imprime los correos en la consola.
- Para enviar correos reales activas `USE_SMTP=1` y defines las variables SMTP en el entorno.
- Recomendado: usar variables de entorno para no guardar credenciales en el repo.

Variables de entorno soportadas
------------------------------
- `USE_SMTP` = '1' para activar SMTP real; si no está definido, se usa el backend de consola.
- `EMAIL_HOST` (ej. `smtp.gmail.com`)
- `EMAIL_PORT` (ej. `587`)
- `EMAIL_HOST_USER` (usuario SMTP)
- `EMAIL_HOST_PASSWORD` (contraseña SMTP)
- `EMAIL_USE_TLS` = '1' (o 'true') para TLS
- `EMAIL_USE_SSL` = '1' (o 'true') para SSL (no usar ambos TLS y SSL)
- `DEFAULT_FROM_EMAIL` dirección por defecto del remitente (ej. `petconnect.noreply@tu-dominio.com`)

Agregar variables (PowerShell)
-----------------------------
Ejemplo (PowerShell) para pruebas locales:

```powershell
$env:USE_SMTP = '0'   # usa backend de consola (default)
# Para activar SMTP real (ejemplo):
$env:USE_SMTP = '1'
$env:EMAIL_HOST = 'smtp.tu-proveedor.com'
$env:EMAIL_PORT = '587'
$env:EMAIL_HOST_USER = 'usuario@tu-dominio.com'
$env:EMAIL_HOST_PASSWORD = 'secreto'
$env:EMAIL_USE_TLS = '1'
$env:DEFAULT_FROM_EMAIL = 'petconnect.noreply@tu-dominio.com'
```

Cómo probar (sin enviar correos reales)
--------------------------------------
1. Asegúrate de que no has activado `USE_SMTP` o configúralo a `0` (console backend).
2. Desde el directorio del proyecto, con el venv activado:

```powershell
# Ejecuta la función real; los correos se imprimirán en la consola
.\.venv\Scripts\python.exe PetConnect\manage.py shell -c "from mascotas.utils import notificar_por_rol; print(notificar_por_rol('protectora','Asunto prueba','Mensaje prueba'))"
```

Salida esperada: verás el contenido del mail impreso en la consola (Subject, From, To y body) y la función devolverá un texto con el número de destinatarios.

Cómo probar en tests automáticos
-------------------------------
Usa `locmem` email backend en tus tests y comprueba `django.core.mail.outbox`:

```python
from django.test import TestCase, override_settings
from django.core import mail

class NotifTest(TestCase):
    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_notificar_por_rol(self):
        # Crear usuarios de prueba en la DB con role='protectora' y email
        # Llamar a la función
        from mascotas.utils import notificar_por_rol
        result = notificar_por_rol('protectora','Asunto','Mensaje')
        self.assertIn('Email enviado', result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Asunto', mail.outbox[0].subject)
```

Enviar correos reales (producción)
----------------------------------
- Establece las variables `USE_SMTP=1` y las variables SMTP seguras (`EMAIL_HOST`, etc.) en el entorno del servidor (o en el sistema de secrets del proveedor).
- Asegúrate de usar un remitente verificado si tu proveedor lo exige.
- Monitoriza errores de envío (logs). La función `notificar_por_rol` registra excepciones vía `logger.exception()`.

Recomendaciones operativas
--------------------------
- No enviar correos desde el thread de la petición en producción: usa una cola de tareas (ej. Celery, RQ o Django background tasks) para enviar los emails de forma asíncrona y reintentar fallos.
- Centraliza credenciales en variables de entorno o secret manager.
- Añade métricas/logging (Sentry, Prometheus) para fallos de envío.

Si quieres puedo:
- Añadir un test unitario en `mascotas/tests.py` que verifique `notificar_por_rol` (con `locmem`).
- Esbozar una integración básica con Celery y una tarea `tasks.send_notification_email(...)`.

Fin.
