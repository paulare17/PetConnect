from django.shortcuts import render
from .models import Chat

def mis_conversaciones(request):
    # Buscamos chats donde el usuario sea el adoptante
    chats = Chat.objects.filter(adoptante=request.user, activo=True)
    
    return render(request, 'lista_chats.html', {'chats': chats})