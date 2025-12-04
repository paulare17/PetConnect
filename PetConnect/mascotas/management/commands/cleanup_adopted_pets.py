from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from mascotas.models import Mascota  # Asegúrate que el import sea correcto

class Command(BaseCommand):
    help = 'Elimina mascotas que fueron adoptadas y cuya fecha de adopción excede el límite de 30 días.'

    def handle(self, *args, **options):
        # 1. Definimos el límite de tiempo (30 días)
        dias_a_mantener = 30
        
        # 2. Calculamos la fecha límite (Hoy - 30 días)
        limite_fecha = timezone.now().date() - timedelta(days=dias_a_mantener)

        # 3. Filtramos las mascotas que cumplen las condiciones:
        #    - adoptado = True
        #    - fecha_adopcion es anterior al límite
        mascotas_a_eliminar = Mascota.objects.filter(
            adoptado=True,
            fecha_adopcion__lt=limite_fecha 
        )

        # 4. Ejecutamos la eliminación
        count = mascotas_a_eliminar.count()
        mascotas_a_eliminar.delete()

        # 5. Reportamos el resultado
        self.stdout.write(
            self.style.SUCCESS(
                f'Borrado exitoso: {count} mascotas adoptadas eliminadas de la base de datos (límite: {dias_a_mantener} días).'
            )
        )