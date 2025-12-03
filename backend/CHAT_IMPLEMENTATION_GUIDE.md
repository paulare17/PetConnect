### Integrar con el Frontend

#### Crear componente de Chat en React
```jsx
// src/components/Chat/ChatRoom.jsx
import { useEffect, useState, useRef } from 'react';

export const ChatRoom = ({ chatId, userId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Conectar al WebSocket
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => {
      // Autenticarse
      ws.send(JSON.stringify({
        type: 'authenticate',
        userId: userId,
        chatId: chatId
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        setMessages(prev => [...prev, {
          username: data.username,
          content: data.content,
          timestamp: data.timestamp
        }]);
      }
      
      if (data.type === 'typing') {
        setIsTyping(data.isTyping);
        if (data.isTyping) {
          setTimeout(() => setIsTyping(false), 3000);
        }
      }
    };

    // Cargar mensajes existentes del backend
    fetch(`/api/chat/chats/${chatId}/`)
      .then(res => res.json())
      .then(data => setMessages(data));

    return () => {
      ws.close();
    };
  }, [chatId, userId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    // Enviar por WebSocket (tiempo real)
    wsRef.current.send(JSON.stringify({
      type: 'message',
      userId: userId,
      username: username,
      content: newMessage
    }));

    // Guardar en base de datos
    fetch(`/api/chat/chats/${chatId}/enviar_mensaje/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ contenido: newMessage })
    });

    setMessages(prev => [...prev, {
      username: username,
      content: newMessage,
      timestamp: new Date().toISOString()
    }]);

    setNewMessage('');
  };

  const handleTyping = () => {
    wsRef.current?.send(JSON.stringify({
      type: 'typing',
      userId: userId,
      username: username,
      isTyping: true
    }));
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.username === username ? 'my-message' : 'their-message'}>
            <strong>{msg.username}:</strong> {msg.content}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Escribiendo...</div>}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            handleTyping();
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};
```

#### Modificar el componente de Like/Swipe
```jsx
// Al hacer click en "Me gusta"
const handleLike = async (mascotaId) => {
  const response = await fetch('/api/swipe/action/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      mascota_id: mascotaId,
      action: 'L'  // Like
    })
  });
  
  const data = await response.json();
  
  if (data.chat_id) {
    // Chat creado! Redirigir o mostrar mensaje
    console.log('Chat creado con ID:', data.chat_id);
    // Opcional: Redirigir al chat
    // navigate(`/chat/${data.chat_id}`);
  }
};
```

## 🔗 Endpoints Disponibles

### Chat API

#### Listar chats del usuario
```
GET /api/chat/chats/
```

#### Ver mensajes de un chat
```
GET /api/chat/chats/{id}/
```

#### Enviar mensaje
```
POST /api/chat/chats/{id}/enviar_mensaje/
Body: { "contenido": "Hola!" }
```

#### Obtener o crear chat para una mascota
```
POST /api/chat/chats/obtener_o_crear/
Body: { "mascota_id": 123 }
```

### Mascotas API

#### Dar like/dislike
```
POST /api/swipe/action/
Body: { "mascota_id": 123, "action": "L" }
Response: { "status": "ok", "is_like": true, "chat_id": 456 }
```

## 🎨 Estructura de Mensajes WebSocket

### Autenticación (Cliente → Servidor)
```json
{
  "type": "authenticate",
  "userId": 123,
  "chatId": 456
}
```

### Enviar Mensaje (Cliente → Servidor)
```json
{
  "type": "message",
  "userId": 123,
  "username": "usuario",
  "content": "Hola!"
}
```

### Recibir Mensaje (Servidor → Cliente)
```json
{
  "type": "message",
  "chatId": 456,
  "userId": 789,
  "username": "otro_usuario",
  "content": "Hola!",
  "timestamp": "2025-11-28T10:30:00Z"
}
```

### Notificar Escritura (Cliente → Servidor)
```json
{
  "type": "typing",
  "userId": 123,
  "username": "usuario",
  "isTyping": true
}
```

## 🐛 Solución de Problemas

### El servidor WebSocket no arranca
- Verifica que el puerto 8080 esté libre
- Asegúrate de estar en la carpeta `chat-server`
- Ejecuta `npm install` primero

### Los chats no aparecen
- Verifica que las migraciones se hayan aplicado
- Comprueba que el usuario tenga el rol correcto
- Para protectoras: solo aparecen chats con mensajes

### Los mensajes no se envían en tiempo real
- Verifica que el servidor WebSocket esté corriendo
- Revisa la consola del navegador para errores de conexión
- Asegúrate de que la URL del WebSocket sea correcta

## 📝 Notas Importantes

1. **Seguridad**: En producción, deberías:
   - Añadir autenticación JWT al WebSocket
   - Usar WSS (WebSocket Secure) en lugar de WS
   - Validar permisos en cada mensaje

2. **Escalabilidad**: Para muchos usuarios concurrentes, considera:
   - Usar Redis para gestionar las conexiones
   - Implementar rooms en Socket.IO
   - Usar un servicio de mensajería como RabbitMQ

3. **Persistencia**: Actualmente:
   - Los mensajes se guardan en Django (SQLite)
   - WebSocket solo maneja la parte en tiempo real
   - Los mensajes antiguos se cargan del API REST
