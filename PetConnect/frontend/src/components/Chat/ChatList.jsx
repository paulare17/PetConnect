import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container } from '@mui/material';
import { useColors } from '../../hooks/useColors';
import ChatMiniList from './ChatMiniList';
import Chat from './Chat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function ChatList() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.background, display: 'flex', flexDirection: 'column', py: 4 }}>
      <Container maxWidth="xl">
        {/* Capçalera */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{

              color: colors.orange,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 48 }} />
            {t('chatComponent.title')}
          </Typography>
        </Box>
      </Container>

      {/* Layout dues columnes */}
      <Box sx={{ flexGrow: 1, display: 'flex', maxWidth: 1400, mx: 'auto', width: '100%', p: 5, gap: 3 }}>
        {/* Columna llista */}
        <Box sx={{ width: 350, flexShrink: 0, display: 'flex' }}>
          <ChatMiniList 
            maxHeight="calc(100vh - 180px)"
            onSelectChat={(chatId) => setSelectedChatId(chatId)}
          />
        </Box>
        
        {/* Columna xat */}
        <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', position: 'relative'}}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            display: selectedChatId ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px dashed ${colors.purple}`,
            borderRadius: 3,
            bgcolor: colors.lightColor,
            opacity: 0.6,
            p: 3,
            transition: 'opacity .2s'
          }}>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              {t('chatComponent.selectChat')}
            </Typography>
          </Box>
          {selectedChatId && (
            <Box sx={{ flexGrow: 1, minWidth: 0, bgcolor: colors.lightColor, borderRadius: 3, overflow: 'hidden' }}>
              <Chat chatId={selectedChatId} onClose={() => setSelectedChatId(null)} embedded />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
