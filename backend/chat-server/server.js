const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Leer orígenes permitidos desde variable de entorno
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');

const wss = new WebSocketServer({ 
  server,
  verifyClient: (info) => {
    const origin = info.origin || info.req.headers.origin;
    if (!origin || !allowedOrigins.includes(origin)) {
      console.warn(`Conexión rechazada desde origen: ${origin}`);
      return false;
    }
    return true;
  }
});

// Almacena las conexiones activas por usuario
const connections = new Map();

// Configurar CORS para el frontend
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

wss.on('connection', (ws) => {
  console.log('Nueva conexión WebSocket establecida');
  
  let userId = null;
  let chatId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Autenticar y registrar la conexión
      if (data.type === 'authenticate') {
        userId = data.userId;
        chatId = data.chatId;
        
        // Crear una clave única para este usuario en este chat
        const connectionKey = `${chatId}-${userId}`;
        connections.set(connectionKey, ws);
        
        console.log(`Usuario ${userId} conectado al chat ${chatId}`);
        
        ws.send(JSON.stringify({
          type: 'authenticated',
          message: 'Conectado al chat en tiempo real'
        }));
      }
      
      // Enviar mensaje a otros participantes del chat
      if (data.type === 'message') {
        console.log(`Mensaje recibido de usuario ${userId} en chat ${chatId}:`, data.content);
        
        // Broadcast del mensaje a todos los usuarios conectados al mismo chat
        connections.forEach((clientWs, key) => {
          // Enviar a todos los usuarios del mismo chat excepto el remitente
          if (key.startsWith(`${chatId}-`) && key !== `${chatId}-${userId}`) {
            if (clientWs.readyState === ws.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'message',
                chatId: chatId,
                userId: data.userId,
                username: data.username,
                content: data.content,
                timestamp: new Date().toISOString()
              }));
            }
          }
        });
      }
      
      // Notificar que el usuario está escribiendo
      if (data.type === 'typing') {
        connections.forEach((clientWs, key) => {
          if (key.startsWith(`${chatId}-`) && key !== `${chatId}-${userId}`) {
            if (clientWs.readyState === ws.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'typing',
                userId: data.userId,
                username: data.username,
                isTyping: data.isTyping
              }));
            }
          }
        });
      }
      
    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  });

  ws.on('close', () => {
    if (userId && chatId) {
      const connectionKey = `${chatId}-${userId}`;
      connections.delete(connectionKey);
      console.log(`Usuario ${userId} desconectado del chat ${chatId}`);
    }
  });

  ws.on('error', (error) => {
    console.error('Error WebSocket:', error);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en puerto ${PORT}`);
});
