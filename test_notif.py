import sys, types
# Ensure Python can import the project packages (the inner PetConnect/ folder)
sys.path.insert(0, 'PetConnect')
import mascotas.utils as utils

def fake_send_mail(subject, message, from_email, recipient_list, **kwargs):
    print('--- FAKE SEND MAIL ---')
    print('subject:', subject)
    print('from:', from_email)
    print('recipients:', recipient_list)
    print('message:', message)
    return len(recipient_list)

# Patch the send_mail used inside mascotas.utils
utils.send_mail = fake_send_mail

class FakeQS(list):
    def values_list(self, *args, **kwargs):
        return ['a@example.com', 'b@example.com']

class FakeObjects:
    def filter(self, **kwargs):
        return FakeQS()

class FakeUsuario:
    objects = FakeObjects()

# Patch the Usuario model reference
utils.Usuario = FakeUsuario

print(utils.notificar_por_rol('protectora', 'Asunto prueba', 'Mensaje de prueba'))
