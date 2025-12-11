import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import { Box, useMediaQuery } from '@mui/material';
import { useColors } from '../../hooks/useColors';
import ChatMiniList from './ChatMiniList';
import Chat from './Chat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function ChatList() {
  // const { t } = useTranslation();
  const { colors } = useColors();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  // Obre automàticament el xat si ve especificat a la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatIdParam = params.get('chatId');
    if (chatIdParam) {
      setSelectedChatId(chatIdParam);
    }
  }, [location.search]);

  return (
    <Box sx={{ 
      minHeight: isMobile ? "calc(100vh - 120px)" : "80vh", 
      height: isMobile ? 'calc(100vh - 120px)' : '80vh', 
      bgcolor: colors.background, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>

      {/* Layout responsive */}
      {isMobile ? (
        // Vista mòbil: pantalla completa
        <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', height: '100%' }}>
          <ChatMiniList 
            maxHeight="100%"
            onSelectChat={(chatId) => {
              // En mòbil, naveguem al xat a pantalla completa
              navigate(`/chat/${chatId}`);
            }}
          />
        </Box>
      ) : (
        // Vista escriptori: dues columnes (llista + xat)
        <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', height: '100%', p: 0, gap: 0, overflow: 'hidden' }}>
          {/* Columna llista */}
          <Box sx={{ width: 360, flexShrink: 0, display: 'flex', height: '100%', borderRight: `1px solid ${colors.border}` }}>
            <ChatMiniList 
              maxHeight="100%"
              onSelectChat={(chatId) => setSelectedChatId(chatId)}
            />
          </Box>
          
          {/* Columna xat */}
          <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', position: 'relative', height: '100%', p: 1 }}>
            {selectedChatId && (
              <Box sx={{ flexGrow: 1, minWidth: 0, height: '100%', bgcolor: colors.lightColor, overflow: 'hidden', borderRadius: 2 }}>
                <Chat chatId={selectedChatId} onClose={() => setSelectedChatId(null)} embedded />
              </Box>
            )}
          </Box>
        </Box>
      )}
      </Box>
  );
}
