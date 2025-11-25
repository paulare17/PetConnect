from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes.models import ContentType
from .models import Favorito
from django.http import HttpResponse

@login_required
def toggle_like(request, object_type, object_id):
    # Seguridad: solo permitimos peticiones POST para cambiar el estado.
    if request.method != 'POST':
        return HttpResponse("Método no permitido.", status=405)

    # 1. Obtener el ContentType (Tipo de objeto: Perro o Gato)
    try:
        content_type = ContentType.objects.get(model=object_type)
    except ContentType.DoesNotExist:
        return HttpResponse("Tipo de objeto inválido.", status=400)

    # 2. Implementar la Alternancia (Toggle) usando get_or_create
    # Buscamos la combinación única (Usuario, Tipo, ID).
    # Si existe, nos da el objeto y 'created' es False.
    # Si no existe, lo crea y 'created' es True.
    favorito, created = Favorito.objects.get_or_create(
        usuario=request.user,
        content_type=content_type,
        object_id=object_id
    )

    # 3. Si 'created' es False, significa que ya existía, y por lo tanto, lo eliminamos.
    if not created:
        favorito.delete()
        
    # Redirigimos a la página anterior, que es la vista del perro/gato.
    return redirect(request.META.get('HTTP_REFERER', '/'))