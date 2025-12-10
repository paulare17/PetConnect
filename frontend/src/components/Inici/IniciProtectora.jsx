import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Avatar, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PetsIcon from "@mui/icons-material/Pets";
import { useColors } from "../../hooks/useColors";
import api from "../../api/client.js";
import ChatMiniList from "../Chat/ChatMiniList.jsx";
import Chat from "../Chat/Chat.jsx";
import gatDefecte from "../../assets/gat_defecte.png";
import gosDefecte from "../../assets/gos_defecte.png";

export default function IniciProtectora() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Funció per obtenir imatge per defecte segons espècie
  const getDefaultImage = (especie) => {
    const especieLower = (especie || '').toLowerCase();
    return especieLower === 'gato' ? gatDefecte : gosDefecte;
  };

  useEffect(() => {
    const fetchMisMascotas = async () => {
      try {
        setLoading(true);
        const res = await api.get("/mascota/mis_mascotas/");
        setMascotas(res.data);
      } catch (err) {
        console.error("Error carregant les mascotes:", err);
        setError(err.response?.data?.detail || t('iniciProtectora.errorLoading'));
      } finally {
        setLoading(false);
      }
    };
    fetchMisMascotas();
  }, [t]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.background }}>
      <Box sx={{ pt: 8, px: { xs: 2, md: 6 }, pb: 8, maxWidth: 1400, mx: 'auto' }}>
        {/* Botó afegir animal a la part superior */}
        
        <Grid container spacing={{ xs:4, md:6 }} justifyContent="space-around" alignItems="flex-start" wrap="nowrap" sx={{ flexWrap:'nowrap' }}>
          {/* Columna esquerra: Botó + Adopcions (ordre 2 en mòbil) */}
          <Grid item xs={12} md={3} order={{ xs: 2, md: 1 }}>
            {/* Botó dins la graella, a dalt a l'esquerra */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
              <Button
                variant="contained"
                size="medium"
                sx={{
                  bgcolor: colors.yellow,
                  color: colors.black,
             
                  fontSize: { xs: 20, md: 25 },
                  px: { xs: 2.5, md: 3.5 },
                  py: 1,
                  minWidth: 300,
                  minHeight: 80,
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': { bgcolor: colors.orange, color: 'white' }
                }}
                onClick={() => navigate('/afegir-mascota')}
              >
                {t('iniciProtectora.addAnimalsButton')}
              </Button>
            </Box>
            <Card sx={{ borderRadius: 4, maxWidth: 520, maxHeight: 570, boxShadow: 3, p: 2, bgcolor: colors.lightColor, border: `2px dashed ${colors.orange}`, minHeight:{ md:440 }, display:'flex', flexDirection:'column' }}>
              <Typography variant="h6" sx={{  mb: 2, textAlign: "center", color: colors.black }}>
                {t('iniciProtectora.yourAdoptions')}
              </Typography>
              <Box sx={{ flexGrow:1, overflowY:'auto', pr:1 }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: colors.orange }} />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                ) : mascotas.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <PetsIcon sx={{ fontSize: 48, color: colors.orange, mb: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {t('iniciProtectora.noPetsYet')}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
                    gap: { xs: 2, md: 2 },
                    alignItems: 'start',
                    pb:1
                  }}>
                    {mascotas.map((animal) => (
                      <Box
                        key={animal.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          p: { xs: 1, md: 2 },
                          borderRadius: 2,
                          transition: 'background 0.2s',
                          '&:hover': { bgcolor: colors.background }
                        }}
                        onClick={() => navigate(`/mascotes/${animal.id}`)}
                      >
                        <Avatar
                          src={animal.foto || getDefaultImage(animal.especie)}
                          alt={animal.nombre}
                          sx={{
                            width: { xs: 95, sm: 120, md: 150 },
                            height: { xs: 95, sm: 120, md: 150 },
                            mb: 1,
                            border: `3px solid ${colors.orange}`,
                            boxShadow: 3,
                            transition: 'transform 0.25s',
                            '&:hover': { transform: 'scale(1.04)' }
                          }}
                        />
                        <Typography variant="body2" sx={{  textAlign: 'center', fontSize: { xs: 12, md: 16 } }}>
                          {animal.nombre}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Xats actius (disseny dues columnes) */}
          <Grid item xs={12} md={9} order={{ xs: 1, md: 2 }} sx={{ display:'flex', minWidth:0 }}>
            <Card sx={{ flexGrow:1, borderRadius:4, boxShadow:3, p:3, bgcolor:colors.lightColor, border:`3px solid ${colors.purple}`, minHeight:{ md:685 }, display:'flex', flexDirection:'column', minWidth:0 }}>
              <CardContent sx={{ flexGrow:1, display:'flex', flexDirection:'column', p:0 }}>
                <Typography variant="h6" sx={{ fontWeight:'bold', mb:2, mt:2, textAlign:'center', color:colors.black, fontSize:{ xs:18, md:22 } }}>
                  {t('iniciProtectora.activeChats')}
                </Typography>
                <Box sx={{ flexGrow:1, display:'flex', gap:2, px:2, pb:2 }}>
                  {/* Columna llista (amplada fixa) */}
                  <Box sx={{ width:300, flexShrink:0, display:'flex' }}>
                    <ChatMiniList 
                      maxHeight={650}
                      onSelectChat={(chatId) => setSelectedChatId(chatId)}
                    />
                  </Box>
                  {/* Columna xat */}
                  <Box sx={{ flexGrow:1, minWidth:320, display:'flex', position:'relative', minHeight:535, }}>
                    <Box sx={{
                      position:'absolute',
                      inset:0,
                      display: selectedChatId ? 'none' : 'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      border:`2px dashed ${colors.purple}`,
                      borderRadius:3,
                      opacity:0.6,
                      p:3,
                      transition:'opacity .2s'
                    }}>
                      <Typography variant="body1" color="text.secondary" textAlign="center">
                        {t('iniciProtectora.selectChatPrompt')}
                      </Typography>
                    </Box>
                    {selectedChatId && (
                      <Box sx={{ flexGrow:1, minWidth:0, height:'100%' }}>
                        <Chat chatId={selectedChatId} onClose={() => setSelectedChatId(null)} embedded />
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        
      </Box>
    </Box>
  );
}
