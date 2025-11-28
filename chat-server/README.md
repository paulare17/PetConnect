# Servidor WebSocket - PetConnect Chat

Servidor WebSocket para chat en tiempo real entre adoptantes y protectoras.

## Instalación

```bash
npm install
```

## Ejecución

### Modo desarrollo (con recarga automática)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se ejecutará en el puerto 8080 por defecto.

## Uso desde el Frontend

```javascript
// Conectar al WebSocket
const ws = new WebSocket('ws://localhost:8080');

// Autenticarse al conectar
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    userId: userId,
    chatId: chatId
  }));
};

// Recibir mensajes
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'message') {
    console.log('Nuevo mensaje:', data.content);
  }
};

// Enviar mensaje
ws.send(JSON.stringify({
  type: 'message',
  userId: userId,
  username: username,
  content: 'Hola, estoy interesado en adoptar!'
}));
```

## Tipos de mensajes

### Autenticación
```json
{
  "type": "authenticate",
  "userId": 123,
  "chatId": 456
}
```

### Enviar mensaje
```json
{
  "type": "message",
  "userId": 123,
  "username": "usuario",
  "content": "texto del mensaje"
}
```

### Notificar escritura
```json
{
  "type": "typing",
  "userId": 123,
  "username": "usuario",
  "isTyping": true
}
```
