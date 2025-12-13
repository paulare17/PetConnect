import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import api from '../../api/client';
import { useColors } from '../../hooks/useColors';
import { useAuthContext } from '../../context/AuthProvider';

export default function ChatMiniList({ maxHeight = 400, onSelectChat }) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { colors } = useColors();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  // No usem estat d'error per evitar lint de variables no usades

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        // Reset estat abans de carregar
        const response = await api.get('/chat/chats/');
        setChats(response.data);
      } catch (e) {
        console.error('Error carregant els xats', e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchChats();
  }, [user]);

  const handleChatClick = (chatId) => {
    if (onSelectChat) {
      onSelectChat(chatId);
    }
    // Si no es passa onSelectChat, no fa res
  };

  return (
    <Box sx={{ width: '100%', height: maxHeight || '500px', minHeight: maxHeight || '500px', overflowY: 'auto', bgcolor: colors.lightColor, borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${colors.orange}`, flexShrink: 0 }}>
        <Typography variant="h6" fontWeight="bold" color={colors.orange}>
          {t('chatComponent.chatsListTitle')}
        </Typography>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
          <CircularProgress sx={{ color: colors.orange }} size={28} />
        </Box>
      ) : chats.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <PetsIcon sx={{ fontSize: 40, color: colors.orange, opacity: 0.5, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {t('chatComponent.noChatsYet')}
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {chats.map((chat, idx) => {
            const lastMessage = chat.ultimo_mensaje;
            return (
              <Box key={chat.id} >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleChatClick(chat.id)}
                    sx={{ py: 1, px: 2, gap: 1, '&:hover': { bgcolor: colors.orange, color: 'white' } }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={chat.mascota_foto}
                        alt={chat.mascota_nombre}
                        sx={{ width: 36, height: 36, border: `2px solid ${colors.orange}` }}
                      >
                        <PetsIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight="500" fontSize="18px" noWrap color={colors.textDark}>
                        {chat.mascota_nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{fontSize: '14px'}}>
                        {lastMessage ? `${lastMessage.remitente}: ${lastMessage.contenido}` : t('chatComponent.newChat')}
                      </Typography>
                    </Box>
                    {chat.num_no_llegits > 0 && (
                      <Chip
                        label={chat.num_no_llegits}
                        size="small"
                        sx={{ bgcolor: colors.blue, color: colors.lightOrange,  minWidth: 28, height: 28, fontWeight: 'bold' }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {idx < chats.length - 1 && <Divider />}
              </Box>
            );
          })}
        </List>
      )}
    </Box>
  );
}
