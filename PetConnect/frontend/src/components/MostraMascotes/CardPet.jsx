import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useColors } from '../../hooks/useColors';
import Box from '@mui/material/Box';
import blackCatImg from '../../assets/black.png';
import nikaDogImg from '../../assets/nika.png';

// El component ara rep també la info de la protectora via props (simulant la futura connexió amb Django REST Framework)
// protectora = { nombre: string, foto: string }

export default function CardPet({ animal, isFavorito, onToggleFavorito, sx }) {
  const { colors } = useColors();
  // Exemple per defecte si no hi ha animal
  
  const data = animal || null;

  if (!data) return null;

  // Colors i icones segons espècie
  const cardColor = data.especie === 'perro' ? colors.background : colors.backgroundBlue;
  const iconColor = data.especie === 'perro' ? colors.darkOrange : colors.darkBlue;
  let imageSrc;
  if (!data.foto) {
    imageSrc = data.especie === 'gato'
      ? blackCatImg
      : nikaDogImg;
  } else {
    imageSrc = data.foto;
  }
  const raza = data.especie === 'perro' ? data.raza_perro : data.raza_gato;

  return (
    <Card sx={{
      ...sx,
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
      borderRadius: 2,
      overflow: 'hidden',
      backgroundColor: cardColor
    }}>
      {/* Imatge */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={imageSrc}
          alt={data.nombre}
          sx={{ objectFit: 'cover' }}
        />
        {/* Botó favorit */}
        <IconButton
          onClick={onToggleFavorito}
          sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', '&:hover': { backgroundColor: 'white' } }}
        >
          {isFavorito ? (
            <FavoriteIcon sx={{ color: 'red' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: colors.orange }} />
          )}
        </IconButton>
        {/* Chip d'espècie amb icona poteta */}
        <Chip
          icon={<PetsIcon />}
          label={data.especie === 'perro' ? 'Gos' : 'Gat'}
          sx={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: iconColor, color: 'white', fontWeight: 'bold' }}
        />
      </Box>

      {/* Contingut */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" sx={{ color: colors.black, mb: 1, textAlign: 'center' }}>
          {data.nombre}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          {data.genero === 'macho' ? (
            <MaleIcon sx={{ color: colors.blue, mr: 0.5 }} />
          ) : (
            <FemaleIcon sx={{ color: 'pink', mr: 0.5 }} />
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {raza || 'Raça no especificada'}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ 
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5
          }}>
            {data.descripcion || 'Sense descripció disponible.'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}