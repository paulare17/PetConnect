import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../constants/colors';
import ChatMiniList from './ChatMiniList';
import Chat from './Chat';

export default function ChatList() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.backgroundOrange, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 3, 
          background: `linear-gradient(135deg, ${colors.orange} 0%, ${colors.darkOrange} 100%)`,
          color: 'white',
          boxShadow: 2
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography variant="h4" fontWeight="bold">
            Els meus xats
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Gestiona les teves converses amb les protectores
          </Typography>
        </Box>
      </Box>

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
              Selecciona un xat de la llista per començar a conversar 🐾
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
