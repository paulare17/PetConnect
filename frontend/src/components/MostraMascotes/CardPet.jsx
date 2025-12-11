import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useColors } from '../../hooks/useColors';
import Box from '@mui/material/Box';
import gatDefecte from "../../assets/gat_defecte.png";
import gosDefecte from "../../assets/gos_defecte.png";

// El component ara rep també la info de la protectora via props (simulant la futura connexió amb Django REST Framework)
// protectora = { nombre: string, foto: string }

export default function CardPet({ animal, isFavorito, onToggleFavorito, sx, showFavoriteButton = true }) {
  const { t } = useTranslation();
  const { colors } = useColors();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const data = animal || null;

  if (!data) return null;

  // Colors i icones segons espècie (el backend retorna en majúscules)
  const especieLower = (data.especie || '').toLowerCase();
  const generoLower = (data.genero || '').toLowerCase();
  const cardColor = especieLower === 'perro' ? colors.lightOrange : colors.lightBlue;
  const iconColor = especieLower === 'perro' ? colors.darkOrange : colors.darkBlue;
  
  // Determinar imatge per defecte segons espècie
  const defaultImage = especieLower === 'gato' ? gatDefecte : gosDefecte;
  
  // Crear array amb totes les fotos disponibles
  const images = [
    data.foto || defaultImage,
    data.foto2,
    data.foto3
  ].filter(Boolean); // Eliminar valors null/undefined
  
  // Si no hi ha cap foto, afegir la imatge per defecte
  if (images.length === 0) {
    images.push(defaultImage);
  }
  
  const raza = especieLower === 'perro' ? (data.raza_perro_display || data.raza_perro) : (data.raza_gato_display || data.raza_gato);

  // Funcions per navegar pel carrussel
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card sx={{
      ...sx,
      maxHeight: '100%',
      width: '100%',
      maxWidth: 400,
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
      borderRadius: 2,
      overflow: 'hidden',
      backgroundColor: cardColor
    }}>
      {/* Carrussel d'Imatges */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="270px"
          image={images[currentImageIndex]}
          alt={`${data.nombre} - ${currentImageIndex + 1}`}
          sx={{ objectFit: 'cover', objectPosition: 'center center' }}
        />
        
        {/* Degradat de transició foto → contingut */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: `linear-gradient(to bottom, transparent, ${cardColor})`,
            pointerEvents: 'none'
          }}
        />
        
        {/* Botó favorit - només si showFavoriteButton és true */}
        {showFavoriteButton && (
          <IconButton
            onClick={e => { e.stopPropagation(); onToggleFavorito(); }}
            sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', '&:hover': { backgroundColor: 'white' } }}
          >
            {isFavorito ? (
              <FavoriteIcon sx={{ color: 'red' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: colors.orange }} />
            )}
          </IconButton>
        )}
        
        {/* Chip d'espècie amb icona poteta */}
        <Chip
          icon={<PetsIcon />}
          label={especieLower === 'perro' ? t('cardPet.dog') : t('cardPet.cat')}
          sx={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: iconColor, color: 'white', fontWeight: 'bold' }}
        />
        
        {/* Controls del carrussel - només si hi ha més d'una imatge */}
        {images.length > 1 && (
          <>
            {/* Fletxa esquerra */}
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
                zIndex: 1
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            
            {/* Fletxa dreta */}
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
                zIndex: 1
              }}
            >
              <ChevronRightIcon />
            </IconButton>
            
            {/* Indicadors (dots) */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 42,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 0.5,
                zIndex: 1
              }}
            >
              {images.map((_, index) => (
                <Box
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'scale(1.2)'
                    }
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Contingut */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" sx={{ color: colors.textDark, mb: 1, textAlign: 'center' }}>
          {data.nombre}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          {generoLower === 'macho' ? (
            <MaleIcon sx={{ color: colors.blue, mr: 0.5 }} />
          ) : (
            <FemaleIcon sx={{ color: 'pink', mr: 0.5 }} />
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {raza || t('cardPet.breedNotSpecified')}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ 
            color: colors.textDark,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
            width: '100%'
          }}>
            {data.descripcion || t('cardPet.noDescription')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}