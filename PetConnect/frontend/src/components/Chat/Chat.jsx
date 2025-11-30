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