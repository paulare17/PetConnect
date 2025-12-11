import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardPet from '../../../../PetConnect/frontend/src/components/MostraMascotes/CardPet';
import { useColors } from '../../hooks/useColors';
import api from '../../api/client';
import { useAuthContext } from '../../../../PetConnect/frontend/src/context/AuthProvider';
import { ROLES } from '../../constants/roles';

export default function Favs() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [favorits, setFavorits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirigir protectores a la seva pàgina d'inici
    if (user?.role === ROLES.PROTECTORA) {
      navigate('/inici');
      return;
    }
    
    if (!user) {
      setLoading(false);
      return;
    }
    
    const fetchFavorits = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Primer obtenim els IDs dels preferits
        const preferitsRes = await api.get('/preferits/');
        console.log('Resposta preferits:', preferitsRes.data);
        const preferitsIds = preferitsRes.data.preferits_ids || [];
        
        if (preferitsIds.length === 0) {
          setFavorits([]);
          setLoading(false);
          return;
        }
        
        // Obtenir les mascotes preferides directament per ID
        const mascotesPromises = preferitsIds.map(id => 
          api.get(`/mascota/${id}/`).catch(err => {
            console.error(`Error carregant mascota ${id}:`, err);
            return null;
          })
        );
        
        const mascotesResponses = await Promise.all(mascotesPromises);
        const mascotesFiltrades = mascotesResponses
          .filter(res => res !== null)
          .map(res => res.data);
        
        setFavorits(mascotesFiltrades);
        setLoading(false);
      } catch (err) {
        console.error('Error carregant preferits:', err);
        console.error('Detalls error:', err.response?.data);
        setError(err.response?.data?.detail || t('favs.errorLoading'));
        setLoading(false);
      }
    };
    
    fetchFavorits();
  }, [user, t, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: colors.orange }} size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 4 }}>
      <Box sx={{ textAlign: 'center', py: 4 }}>
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
          <FavoriteIcon sx={{ fontSize: 48 }} />
          {t('favs.title')}
        </Typography>
        <Typography variant="h6" sx={{ color: colors.textDark }}>
          {t('favs.subtitle')}
        </Typography>
      </Box>
      
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
          {favorits.length === 0 ? (
            <Typography variant="body1" sx={{ color: colors.textDark, textAlign: 'center', gridColumn: '1/-1' }}>
              {t('favs.noFavorites')}
            </Typography>
          ) : (
            favorits.map(animal => (
              <Box
                key={animal.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/mascotes/${animal.id}`)}
              >
                <CardPet animal={animal} isFavorito={true} onToggleFavorito={() => {}} />
              </Box>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}
