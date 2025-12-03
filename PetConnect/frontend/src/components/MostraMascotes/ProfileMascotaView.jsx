import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Paper,
  Divider,
  Button,
  Card,
  CardMedia,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../hooks/useColors';
import gatDefecte from '../../assets/gat_defecte.png';
import gosDefecte from '../../assets/gos_defecte.png';

function ProfileMascotaView({ animal, showAdoptButton = true }) {
  const { t } = useTranslation();
  const { colors } = useColors();
  const [favorit, setFavorit] = useState(false);

  if (!animal) return null;

  // Si no hi ha foto, mostrar la imatge per defecte segons l'espècie
  let imageSrc = animal.foto;
  if (!imageSrc) {
    imageSrc = animal.especie === 'perro' ? gosDefecte : gatDefecte;
  }
  
  const raza = animal.especie === 'perro' ? animal.raza_perro : animal.raza_gato;

  return (
    <Box sx={{ py: 2 , width: '1000px', justifyContent: 'center', display: 'flex' }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 5, background: colors.lightColor, position: 'relative' }}>
        {/* Cor de favorit */}
        <IconButton
          onClick={() => setFavorit(f => !f)}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2, background: 'none' }}
        >
          {favorit ? <FavoriteIcon sx={{ color: 'red', fontSize: 36 }} /> : <FavoriteBorderIcon sx={{ color: colors.orange, fontSize: 36 }} />}
        </IconButton>
        
        {/* Capçalera amb imatge i nom */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 300 }}>
              <CardMedia
                component="img"
                image={imageSrc}
                alt={animal.nombre}
                sx={{ objectFit: 'cover', objectPosition: 'center center', width: '100%', height: 300, borderRadius: 3 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h2" sx={{ color: colors.textDark, mb: 2 }}>
              {animal.nombre}
            </Typography>
            {/* Quadre lila per característiques destacades */}
            <Box sx={{ border: `3px solid ${colors.darkPurple}`, borderRadius: 2, p: 2, mb: 2, background: colors.purple, width: '100%' }}>
              <Chip 
                label={raza || t('profileMascota.breedNotSpecified')} 
                sx={{ backgroundColor: colors.lightPurple, color: colors.textDark, fontWeight: 'bold', mb: 1 }} 
              />
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Chip 
                  icon={animal.genero === 'macho' ? <MaleIcon /> : <FemaleIcon />}
                  label={animal.genero === 'macho' ? t('profileMascota.male') : t('profileMascota.female')}
                  sx={{ 
                    backgroundColor: colors.darkPurple, 
                    color: 'white',
                    '& .MuiChip-icon': { color: animal.genero === 'macho' ? colors.blue : 'pink' }
                  }} 
                />
                <Chip 
                  label={`${animal.edad} ${animal.edad !== 1 ? t('profileMascota.years') : t('profileMascota.year')}`}
                  sx={{ backgroundColor: colors.darkPurple, color: 'white' }} 
                />
                <Chip 
                  label={animal.tamaño || t('profileMascota.sizeNotSpecified')}
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
                label={animal.adoptado ? t('profileMascota.adopted') : t('profileMascota.available')}
                sx={{ backgroundColor: animal.adoptado ? colors.purple : colors.orange, color: 'white', mt: 1, fontWeight: 'bold' }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Descripció llarga estil blog */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="body1" sx={{ color: colors.black, fontSize: '1.1rem', mb: 2 }}>
            {animal.descripcion || t('profileMascota.noDescription')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.color')}</strong> {animal.color}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.character')}</strong> {animal.caracter}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.coexistenceAnimals')}</strong> {animal.convivencia_animales}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.coexistenceChildren')}</strong> {animal.convivencia_ninos ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.dewormed')}</strong> {animal.desparasitado ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.sterilized')}</strong> {animal.esterilizado ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.microchip')}</strong> {animal.con_microchip ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.vaccinated')}</strong> {animal.vacunado ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.specialNeeds')}</strong> {animal.necesidades_especiales ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              {animal.necesidades_especiales && (
                <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.needsDescription')}</strong> {animal.descripcion_necesidades}</Typography>
              )}
              {animal.ubicacion && (
                <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.location')}</strong> {animal.ubicacion}</Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Dades de la protectora */}
        {animal.protectora && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: colors.orange, mb: 1 }}>
              {t('profileMascota.shelterInCharge')}
            </Typography>
            <Typography variant="body2"><strong>{t('profileMascota.name')}</strong> {animal.protectora.nombre || animal.protectora}</Typography>
            {animal.protectora.email && <Typography variant="body2"><strong>{t('profileMascota.email')}</strong> {animal.protectora.email}</Typography>}
            {animal.protectora.ciudad && <Typography variant="body2"><strong>{t('profileMascota.city')}</strong> {animal.protectora.ciudad}</Typography>}
          </Box>
        )}

        {showAdoptButton && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button variant="contained" sx={{ backgroundColor: colors.orange, color: 'white', px: 6, py: 2, fontSize: '1.2rem', '&:hover': { backgroundColor: colors.darkOrange } }}>
              {t('profileMascota.requestAdoption')}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ProfileMascotaView;
