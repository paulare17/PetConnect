# Simulación local de envío de notificaciones (no usa Django)

def simulate_send_mail(subject, message, from_email, recipients):
    print('--- SIMULATED SEND MAIL ---')
    print('Subject:', subject)
    print('From:', from_email)
    print('Recipients:', recipients)
    print('Message:\n' + message)
    print('--- END ---\n')

# Datos de ejemplo
role = 'protectora'
subject = '🐕 Prueba: nueva solicitud de adopción'
message = (
    "Hola Protectora,\n\n"
    "Tienes una nueva solicitud de adopción para la mascota: Fido.\n"
    "Solicitante: Juan Pérez <juan@example.com>\n\n"
    "Gracias,\nPetConnect Team"
)
from_email = 'petconnect.noreply@gmail.com'
# Simulamos que hay dos protectoras con email
recipients = ['protectora1@example.com', 'protectora2@example.com']

simulate_send_mail(subject, message, from_email, recipients)

# También simulamos la llamada a notificar_por_rol con número de destinatarios
print(f"Simulación: notificar_por_rol('{role}', subject, message) -> {len(recipients)} destinatarios")
