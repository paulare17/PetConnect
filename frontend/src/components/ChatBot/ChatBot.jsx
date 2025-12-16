import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Fab,
  Paper,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Fade,
  Slide,
  ClickAwayListener
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useColors } from '../../hooks/useColors';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthProvider';

const STORAGE_KEY_PREFIX = 'petconnect_chatbot_messages_';

const defaultMessage = {
  id: 1,
  text: "Hola! Sóc el teu assistent virtual. Com et puc ajudar avui?",
  sender: 'bot',
  timestamp: new Date().toISOString()
};

// Funció per carregar missatges del localStorage (amb userId)
const loadMessagesFromStorage = (userId) => {
  if (!userId) return [{ ...defaultMessage, timestamp: new Date(defaultMessage.timestamp) }];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convertir les dates string a objectes Date
      return parsed.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading chat messages:', error);
  }
  return [{ ...defaultMessage, timestamp: new Date(defaultMessage.timestamp) }];
};

// Funció per guardar missatges al localStorage (amb userId)
const saveMessagesToStorage = (messages, userId) => {
  if (!userId) return;
  
  try {
    // Convertir les dates a ISO string per a serialització
    const toSave = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
    }));
    localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(toSave));
  } catch (error) {
    console.error('Error saving chat messages:', error);
  }
};

const ChatbotWidget = () => {
  const { colors, isDarkMode } = useColors();
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Carregar missatges quan l'usuari canvia
  useEffect(() => {
    if (user?.id) {
      const saved = loadMessagesFromStorage(user.id);
      // Si només hi ha el missatge per defecte, actualitzar-lo amb la traducció actual
      if (saved.length === 1 && saved[0].id === 1) {
        setMessages([{ ...saved[0], text: t('chatbot.welcomeMessage') }]);
      } else {
        setMessages(saved);
      }
    } else {
      // Usuari no autenticat, mostrar missatge de benvinguda
      setMessages([{ 
        id: 1, 
        text: t('chatbot.welcomeMessage'), 
        sender: 'bot', 
        timestamp: new Date() 
      }]);
    }
  }, [user?.id, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Guardar missatges al localStorage quan canvien
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      saveMessagesToStorage(messages, user.id);
    }
  }, [messages, user?.id]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handler per tancar quan es fa clic fora
  const handleClickAway = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Endpoint del chatbot FAQ de Django
      const response = await fetch('http://localhost:8000/api/ia/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pregunta: inputValue
        })
      });

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        text: data.respuesta || t('chatbot.errorProcessing'),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: t('chatbot.errorGeneral'),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Finestra del xat amb ClickAwayListener */}
      {isOpen && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Slide direction="up" in={isOpen} appear>
            <Paper
              elevation={8}
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 30,
                width: 380,
                height: 600,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                zIndex: 1300,
                bgcolor: isDarkMode ? colors.backgroundSecondary : colors.lightColor,
            border: `1px solid ${colors.border}`,
            '@media (max-width: 600px)': {
              width: 'calc(100vw - 32px)',
              height: 'calc(100vh - 120px)',
              right: 16,
              bottom: 90,
            }
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: isDarkMode 
                ? `linear-gradient(135deg, ${colors.purple} 0%, ${colors.darkPurple} 100%)`
                : `linear-gradient(135deg, ${colors.blue} 0%, ${colors.darkBlue} 100%)`,
              color: colors.textLight,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {t('chatbot.title')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {t('chatbot.online')}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={toggleChat} sx={{ color: colors.textLight }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Missatges */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: isDarkMode ? colors.background : colors.lightColor,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: isDarkMode ? colors.purple : colors.blue }}>
                    <BotIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '75%',
                    bgcolor: message.sender === 'user' 
                      ? (isDarkMode ? colors.purple : colors.blue)
                      : (isDarkMode ? colors.backgroundSecondary : 'white'),
                    color: message.sender === 'user' 
                      ? colors.textLight 
                      : (isDarkMode ? colors.textDark : colors.textDark),
                    borderRadius: 2,
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.7,
                      fontSize: '0.65rem'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString('ca-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Paper>
                {message.sender === 'user' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: isDarkMode ? colors.darkPurple : colors.orange }}>
                    <PersonIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {/* Indicador de typing */}
            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: isDarkMode ? colors.purple : colors.blue }}>
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: isDarkMode ? colors.backgroundSecondary : 'white',
                    borderRadius: 2,
                    display: 'flex',
                    gap: 0.5
                  }}
                >
                  <CircularProgress size={8} />
                  <CircularProgress size={8} sx={{ animationDelay: '0.2s' }} />
                  <CircularProgress size={8} sx={{ animationDelay: '0.4s' }} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: isDarkMode ? colors.backgroundSecondary : 'white',
              borderTop: `1px solid ${colors.border}`
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={3}
                placeholder={t('chatbot.placeholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: isDarkMode ? colors.backgroundTertiary : 'white',
                    '& fieldset': {
                      borderColor: colors.border,
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? colors.purple : colors.blue,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? colors.purple : colors.blue,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? colors.textDark : colors.textDark,
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: isDarkMode ? colors.textMuted : colors.textDark,
                    opacity: 0.7,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                sx={{
                  bgcolor: isDarkMode ? colors.purple : colors.blue,
                  color: colors.textLight,
                  '&:hover': {
                    bgcolor: isDarkMode ? colors.darkPurple : colors.darkBlue
                  },
                  '&:disabled': {
                    bgcolor: colors.border
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
            </Paper>
          </Slide>
        </ClickAwayListener>
      )}

      {/* Botó flotant */}
      <Fade in={!isOpen}>
        <Fab
          color="primary"
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: isDarkMode 
              ? `linear-gradient(135deg, ${colors.purple} 0%, ${colors.darkPurple} 100%)`
              : `linear-gradient(135deg, ${colors.blue} 0%, ${colors.darkBlue} 100%)`,
            '&:hover': {
              background: isDarkMode
                ? `linear-gradient(135deg, ${colors.darkPurple} 0%, ${colors.lightPurple} 100%)`
                : `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.blue} 100%)`,
            },
            width: 64,
            height: 64
          }}
        >
          <ChatIcon sx={{ fontSize: 32, color: colors.textLight }} />
        </Fab>
      </Fade>
    </>
  );
};

export default ChatbotWidget;