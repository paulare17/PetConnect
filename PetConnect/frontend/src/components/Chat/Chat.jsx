import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PetsIcon from '@mui/icons-material/Pets';
import api from '../../api/client';
import { colors } from '../../constants/colors';
import { useAuthContext } from '../../context/AuthProvider';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export default function ChatRoom({ chatId: chatIdProp, onClose, embedded = false }) {
  const { chatId: chatIdParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInfo, setChatInfo] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  // Scroll automàtic al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Evitem fer scroll automàtic al carregar el xat; només quan arriben nous missatges després
  useEffect(() => {
    if (prevMessagesLengthRef.current === 0) {
      // Primera càrrega: no fem scroll
    } else if (messages.length > prevMessagesLengthRef.current) {
      // Només si s'ha afegit un nou missatge
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Carregar informació del xat i missatges
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtenir informació del chat de la llista
        const chatListResponse = await api.get('/chat/chats/');
        const effectiveChatId = chatIdProp ?? chatIdParam;
        const currentChat = chatListResponse.data.find(c => c.id === parseInt(effectiveChatId));
        
        if (!currentChat) {
          throw new Error('Chat no trobat');
        }
        setChatInfo(currentChat);

        // Obtenir missatges
        const messagesResponse = await api.get(`/chat/chats/${effectiveChatId}/`);
        setMessages(messagesResponse.data);
      } catch (err) {
        console.error('Error carregant xat:', err);
        setError(err.response?.data?.detail || 'Error carregant el xat');
      } finally {
        setLoading(false);
      }
    };

    const effectiveChatId = chatIdProp ?? chatIdParam;
    if (effectiveChatId && user) {
      fetchChatData();
    }
  }, [chatIdProp, chatIdParam, user]);

  // Connexió WebSocket
  useEffect(() => {
    const effectiveChatId = chatIdProp ?? chatIdParam;
    if (!effectiveChatId || !user || !chatInfo) return;

    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connectat');
      setWsConnected(true);
      // Autenticar-se
      ws.send(JSON.stringify({
        type: 'authenticate',
        userId: user.id,
        chatId: effectiveChatId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          setMessages(prev => [...prev, {
            id: Date.now(), // ID temporal
            remitente_username: data.username,
            contenido: data.content,
            fecha_envio: data.timestamp
          }]);
        }
        
        if (data.type === 'typing') {
          setIsTyping(data.isTyping);
          if (data.isTyping) {
            setTimeout(() => setIsTyping(false), 3000);
          }
        }
      } catch (err) {
        console.error('Error processant missatge WebSocket:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket desconnectat');
      setWsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [chatIdProp, chatIdParam, user, chatInfo]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !wsRef.current || !user) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Enviar per WebSocket (temps real)
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'message',
          userId: user.id,
          username: user.username,
          content: messageContent
        }));
      }

      // Guardar a base de dades
      const effectiveChatId = chatIdProp ?? chatIdParam;
      const response = await api.post(`/chat/chats/${effectiveChatId}/enviar_mensaje/`, {
        contenido: messageContent
      });

      // Afegir missatge a la llista si no s'ha rebut per WebSocket
      setMessages(prev => {
        const exists = prev.some(m => 
          m.remitente_username === user.username && 
          m.contenido === messageContent &&
          Date.now() - new Date(m.fecha_envio).getTime() < 1000
        );
        if (!exists) {
          return [...prev, response.data];
        }
        return prev;
      });
    } catch (err) {
      console.error('Error enviant missatge:', err);
      setError('Error enviant el missatge. Torna-ho a provar.');
      setNewMessage(messageContent); // Restaurar el missatge
    }
  };

  const handleTyping = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !user) return;

    wsRef.current.send(JSON.stringify({
      type: 'typing',
      userId: user.id,
      username: user.username,
      isTyping: true
    }));

    // Cancel·lar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Establir nou timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'typing',
          userId: user.id,
          username: user.username,
          isTyping: false
        }));
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={embedded ? '100%' : '80vh'}>
        <CircularProgress sx={{ color: colors.orange }} />
      </Box>
    );
  }

  if (error && !chatInfo) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Alert severity="error" onClose={() => navigate('/chats')}>
          {error}
        </Alert>
      </Box>
    );
  }

  const otherUser = chatInfo?.adoptante === user?.id 
    ? chatInfo?.protectora_username 
    : chatInfo?.adoptante_username;

  return (
    <Box sx={{ 
      height: embedded ? '100%' : 'calc(100vh - 100px)', 
      maxWidth: embedded ? '100%' : 1000, 
      mx: embedded ? 0 : 'auto', 
      p: embedded ? 0 : 2,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: colors.lightColor }}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => {
            if (onClose) onClose(); else navigate('/chats');
          }} sx={{ color: colors.orange }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: colors.orange }}>
            <PetsIcon />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              {chatInfo?.mascota_nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {otherUser}
            </Typography>
          </Box>
          {wsConnected ? (
            <Chip label="Connectat" color="success" size="small" />
          ) : (
            <Chip label="Desconnectat" color="default" size="small" />
          )}
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Missatges */}
      <Paper 
        elevation={1} 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2, 
          mb: 2,
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {messages.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="body1" color="text.secondary">
              No hi ha missatges. Envia el primer! 🐾
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isMyMessage = msg.remitente_username === user?.username;
              return (
                <Box
                  key={msg.id || idx}
                  sx={{
                    display: 'flex',
                    justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isMyMessage ? colors.orange : 'white',
                      color: isMyMessage ? 'white' : 'black',
                      boxShadow: 1
                    }}
                  >
                    <Typography variant="caption" display="block" sx={{ 
                      fontWeight: 'bold',
                      opacity: 0.9,
                      mb: 0.5 
                    }}>
                      {msg.remitente_username}
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {msg.contenido}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      opacity: 0.7,
                      fontSize: '0.7rem',
                      display: 'block',
                      mt: 0.5
                    }}>
                      {new Date(msg.fecha_envio).toLocaleTimeString('ca-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                  {otherUser} està escrivint...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Paper>

      {/* Input */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" gap={1} alignItems="center">
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escriu un missatge..."
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: colors.orange,
                }
              }
            }}
          />
          <IconButton 
            onClick={sendMessage} 
            disabled={!newMessage.trim()}
            sx={{ 
              backgroundColor: colors.orange,
              color: 'white',
              '&:hover': { backgroundColor: colors.darkOrange },
              '&:disabled': { backgroundColor: '#ccc' }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}