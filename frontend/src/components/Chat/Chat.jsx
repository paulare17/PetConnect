import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

export default function ChatRoom({ chatId: chatIdProp, onClose, embedded = false, onRead }) {
  const { t } = useTranslation();
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
  const [showAvailabilityNotice, setShowAvailabilityNotice] = useState(true);
  
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

        const effectiveChatId = chatIdProp ?? chatIdParam;
        
        // Obtenir informació del chat directament amb el nou endpoint
        const chatInfoResponse = await api.get(`/chat/chats/${effectiveChatId}/info/`);
        setChatInfo(chatInfoResponse.data);

        // Obtenir missatges
        const messagesResponse = await api.get(`/chat/chats/${effectiveChatId}/`);
        setMessages(messagesResponse.data);
        // Backend marks as read on this GET; notify parent to refresh lists
        if (typeof onRead === 'function') {
          onRead();
        }
      } catch (err) {
        console.error('Error carregant xat:', err);
        setError(err.response?.data?.detail || t('chatComponent.errorLoading'));
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
      setError(t('chatComponent.errorSending'));
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
            <Chip label={t('chatComponent.connected')} color="success" size="small" />
          ) : (
            <Chip label={t('chatComponent.disconnected')} color="default" size="small" />
          )}
        </Box>
      </Paper>

      {/* Avís de disponibilitat de protectores al començar la conversa - només per usuaris/adoptants */}
      {showAvailabilityNotice && chatInfo && user && chatInfo.adoptante === user.id && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
        >
          {t('chatComponent.disclaimer')}
          <Box sx={{ mt: 1 }}>
            {chatInfo?.protectora_username && (
              <Typography variant="body2"><strong>{chatInfo.protectora_username}</strong></Typography>
            )}
            {chatInfo?.protectora_info?.horaris && (
              <Typography variant="body2">{t('chatComponent.schedule')}: {chatInfo.protectora_info.horaris}</Typography>
            )}
            {chatInfo?.protectora_info?.telefono && (
              <Typography variant="body2">{t('chatComponent.phone')}: {chatInfo.protectora_info.telefono}</Typography>
            )}
            {chatInfo?.protectora_info?.telefono_emergencia && (
              <Typography variant="body2">{t('chatComponent.emergencyPhone')}: {chatInfo.protectora_info.telefono_emergencia}</Typography>
            )}
            {chatInfo?.protectora_info?.email && (
              <Typography variant="body2">Email: {chatInfo.protectora_info.email}</Typography>
            )}
            {chatInfo?.protectora_info?.web && (
              <Typography variant="body2">Web: {chatInfo.protectora_info.web}</Typography>
            )}
            {chatInfo?.protectora_info?.instagram && (() => {
              const ig = chatInfo.protectora_info.instagram;
              const isUrl = typeof ig === 'string' && /^https?:\/\//i.test(ig);
              const handle = typeof ig === 'string' ? ig.replace(/^@/, '') : ig;
              const href = isUrl ? ig : `https://instagram.com/${handle}`;
              return (
                <Typography variant="body2">
                  {t('chatComponent.instagram')}: <a href={href} target="_blank" rel="noopener noreferrer">{isUrl ? ig : `@${handle}`}</a>
                </Typography>
              );
            })()}
          </Box>
        </Alert>
      )}

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
              {t('chatComponent.noMessages')}
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
                  {otherUser} {t('chatComponent.typing')}
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
            placeholder={t('chatComponent.messagePlaceholder')}
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