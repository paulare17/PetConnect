import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Paper,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useColors } from '../../hooks/useColors';
import api from '../../api/client';

function ProfileAnimal() {
  const { colors } = useColors();
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorit, setFavorit] = useState(false);
  const [altres, setAltres] = useState([]);
  const [galeriaIndex, setGaleriaIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log('Carregant mascota amb id:', id);
    api.get(`/mascota/${id}/`)
      .then(res => {
        console.log('Dades de la mascota:', res.data);
        setAnimal(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error carregant mascota:', err);
        setError('No s\'ha pogut carregar el perfil de l\'animal.');
        setLoading(false);
      });
    // Carrega altres animals per la galeria
    api.get(`/mascota/`)
      .then(res => {
        console.log('Altres mascotes:', res.data);
        const altresAnimals = Array.isArray(res.data) ? res.data : res.data.results || [];
        setAltres(altresAnimals.filter(a => a.id !== Number(id)).slice(0, 10));
      })
      .catch(err => {
        console.error('Error carregant altres mascotes:', err);
      });
  }, [id]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress sx={{ color: colors.orange }} size={60} /></Box>;
  }
  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }
  if (!animal) return null;

  // Imatge principal
  const imageSrc = animal.foto || 'https://via.placeholder.com/400x300?text=Sense+imatge';
  const raza = animal.especie === 'perro' ? animal.raza_perro : animal.raza_gato;

  return (
    <Box sx={{ background: colors.background, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 5, background: colors.lightColor, maxWidth: 900, mx: 'auto', position: 'relative' }}>
          {/* Cor de favorit */}
          <IconButton
            onClick={() => setFavorit(f => !f)}
            sx={{ position: 'absolute', top: 32, right: 32, zIndex: 2, background: 'none' }}
          >
            {favorit ? <FavoriteIcon sx={{ color: 'red', fontSize: 36 }} /> : <FavoriteBorderIcon sx={{ color: colors.orange, fontSize: 36 }} />}
          </IconButton>
          {/* Capçalera amb imatge i nom */}
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5}>
              <Card sx={{ boxShadow: 3, borderRadius: 3,  display: 'flex', justifyContent: 'center', alignItems: 'center', width: 300, height: 300, }}>
                <CardMedia
                  component="img"
                  image={imageSrc}
                  alt={animal.nombre}
                  sx={{ objectFit: 'cover', objectPosition: 'center center', width: 300, height: 300, borderRadius: 3, mt: 2, mb: 2 }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h2" sx={{ color: colors.textDark, mb: 2 }}>
                {animal.nombre}
              </Typography>
              {/* Quadre lila per característiques destacades */}
              <Box sx={{ border: `3px solid ${colors.darkPurple}`, borderRadius: 2, p: 2, mb: 2, background: colors.purple, width: '400px' }}>
                <Chip 
                  label={raza || 'Raça no especificada'} 
                  sx={{ backgroundColor: colors.lightPurple, color: colors.textDark, fontWeight: 'bold', mb: 1 }} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip 
                    icon={animal.genero === 'macho' ? <MaleIcon /> : <FemaleIcon />}
                    label={animal.genero === 'macho' ? 'Mascle' : 'Femella'}
                    sx={{ 
                      backgroundColor: colors.darkPurple, 
                      color: 'white',
                      '& .MuiChip-icon': { color: animal.genero === 'macho' ? colors.blue : 'pink' }
                    }} 
                  />
                  <Chip 
                    label={`${animal.edad} any${animal.edad !== 1 ? 's' : ''}`}
                    sx={{ backgroundColor: colors.darkPurple, color: 'white' }} 
                  />
                  <Chip 
                    label={animal.tamaño || 'Mida no especificada'}
                    sx={{ backgroundColor: colors.darkPurple, color: 'white' }} 
                  />
                  {animal.peso && (
                    <Chip 
                      label={`${animal.peso} kg`}
                      sx={{ backgroundColor: colors.darkPurple, color: 'white' }} 
                    />
                  )}
                </Box>
                <Chip
                  label={animal.adoptado ? 'ADOPTAT' : 'DISPONIBLE'}
                  sx={{ backgroundColor: animal.adoptado ? colors.purple : colors.orange, color: 'white', mt: 1, fontWeight: 'bold' }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Descripció llarga estil blog */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="body1" sx={{ color: colors.black, fontSize: '1.1rem', mb: 2 }}>
              {animal.descripcion || 'Sense descripció.'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Color:</strong> {animal.color}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Caràcter:</strong> {animal.caracter}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Convivència amb animals:</strong> {animal.convivencia_animales}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Convivència amb nens:</strong> {animal.convivencia_ninos ? 'Sí' : 'No'}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Desparasitat:</strong> {animal.desparasitado ? 'Sí' : 'No'}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Esterilitzat:</strong> {animal.esterilizado ? 'Sí' : 'No'}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Microxip:</strong> {animal.con_microchip ? 'Sí' : 'No'}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Vacunat:</strong> {animal.vacunado ? 'Sí' : 'No'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Necessitats especials:</strong> {animal.necesidades_especiales ? 'Sí' : 'No'}</Typography>
                {animal.necesidades_especiales && (
                  <Typography variant="body2" sx={{ mb: 1 }}><strong>Descripció necessitats:</strong> {animal.descripcion_necesidades}</Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Ubicació:</strong> {animal.ubicacion}</Typography>
                {/* Espai per galeria d'imatges addicionals */}
              </Grid>
            </Grid>
          </Box>

          {/* Dades de la protectora */}
          {animal.protectora && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: colors.orange, mb: 1 }}>
                Protectora encarregada
              </Typography>
              <Typography variant="body2"><strong>Nom:</strong> {animal.protectora.nombre || animal.protectora}</Typography>
              {animal.protectora.email && <Typography variant="body2"><strong>Email:</strong> {animal.protectora.email}</Typography>}
              {animal.protectora.ciudad && <Typography variant="body2"><strong>Ciutat:</strong> {animal.protectora.ciudad}</Typography>}
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button variant="contained" sx={{ backgroundColor: colors.orange, color: 'white', px: 6, py: 2, fontSize: '1.2rem', '&:hover': { backgroundColor: colors.darkOrange } }}>
              Sol·licita Adopció
            </Button>
          </Box>
        </Paper>

        {/* Galeria d'altres animals (slider/carousel) */}
        <Box sx={{ mt: 6, mb: 2 }}>
          <Typography variant="h5" sx={{ color: colors.orange, mb: 2, textAlign: 'center' }}>
            Altres animals disponibles
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <IconButton onClick={() => setGaleriaIndex(i => Math.max(i - 1, 0))} disabled={galeriaIndex === 0}>
              <ArrowBackIosIcon />
            </IconButton>
            {altres.slice(galeriaIndex, galeriaIndex + 4).map((a, index) => {
              const cardColor = a.especie === 'perro' ? colors.background : colors.backgroundBlue;
              const iconColor = a.especie === 'perro' ? colors.darkOrange : colors.darkBlue;
              const raza = a.especie === 'perro' ? a.raza_perro : a.raza_gato;
              return (
                <Card 
                  key={a.id} 
                  sx={{ 
                    width: 200, 
                    backgroundColor: cardColor, 
                    borderRadius: 2, 
                    boxShadow: 2, 
                    mx: 1, 
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                    animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`,
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px) scale(0.95)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0) scale(1)',
                      },
                    },
                    '&:hover': { 
                      transform: 'translateY(-8px) scale(1.02)', 
                      boxShadow: 8,
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => window.location.href = `/mascotes/${a.id}`}
                >
                  {/* Imatge */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={a.foto || 'https://via.placeholder.com/200x140?text=Sense+imatge'}
                      alt={a.nombre}
                      sx={{ objectFit: 'cover', objectPosition: 'center center' }}
                    />
                    {/* Chip d'espècie */}
                    <Chip
                      icon={<PetsIcon />}
                      label={a.especie === 'perro' ? 'Gos' : 'Gat'}
                      size="small"
                      sx={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: iconColor, color: 'white', fontWeight: 'bold' }}
                    />
                  </Box>
                  {/* Contingut */}
                  <Box sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ color: colors.textDark, fontWeight: 'bold', textAlign: 'center' }}>
                      {a.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      {a.genero === 'macho' ? (
                        <MaleIcon sx={{ color: colors.blue, fontSize: 18 }} />
                      ) : (
                        <FemaleIcon sx={{ color: 'pink', fontSize: 18 }} />
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {raza || 'Raça no especificada'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })}
            <IconButton onClick={() => setGaleriaIndex(i => Math.min(i + 1, Math.max(altres.length - 4, 0)))} disabled={galeriaIndex >= Math.max(altres.length - 4, 0)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ProfileAnimal;
