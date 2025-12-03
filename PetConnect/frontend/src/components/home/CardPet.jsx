import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useColors } from '../../hooks/useColors';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import blackCatImg from '../../assets/black.png';
import nikaDogImg from '../../assets/nika.png';

const ExpandMore = styled((props) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(
  ({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    transform: 'rotate(0deg)',
  })
);

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
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Edat:</strong> {data.edad} any{data.edad !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Sexe:</strong> {data.genero === 'macho' ? 'Mascle' : 'Femella'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Mida:</strong> {data.tamaño || 'No especificat'}
          </Typography>
          {data.peso && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Pes:</strong> {data.peso} kg
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Accions */}
      <CardActions sx={{ backgroundColor: cardColor, justifyContent: 'center', pb: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: colors.orange, color: 'white', '&:hover': { backgroundColor: colors.darkOrange }, px: 4 }}
        >
          Més Info
        </Button>
      </CardActions>
    </Card>
  );
}