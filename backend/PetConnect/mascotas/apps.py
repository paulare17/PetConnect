from django.apps import AppConfig


class MascotasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mascotas'

    def ready(self):
        import mascotas.signals