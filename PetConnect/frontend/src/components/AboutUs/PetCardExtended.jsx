import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
  Collapse,
  Divider,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  Pets as PetsIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  LocationOn as LocationOnIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useColors } from '../../hooks/useColors';
import gatDefecte from '../../assets/gat_defecte.png';
import gosDefecte from '../../assets/gos_defecte.png';

const ExpandMoreIconStyled = React.forwardRef(({ expand, ...props }, ref) => {
  return (
    <IconButton
      ref={ref}
      {...props}
      sx={{
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: (theme) =>
          theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
      }}
    >
      <ExpandMoreIcon />
    </IconButton>
  );
});

ExpandMoreIconStyled.displayName = 'ExpandMoreIconStyled';

export default function PetCardExtended({
  animal,
  isFavorito = false,
  onToggleFavorito = () => {},
  onViewMore = () => {},
  sx = {},
}) {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useColors();
  const [expanded, setExpanded] = useState(false);

  if (!animal) return null;

  // Determine colors based on species
  const isPerro = animal.especie === 'perro';
  const cardBgColor = isPerro ? colors.lightOrange : colors.lightBlue;
  const chipColor = isPerro ? colors.darkOrange : colors.darkBlue;
  const accentColor = isPerro ? colors.orange : colors.blue;

  // Get default image
  let imageSrc = animal.foto || (isPerro ? gosDefecte : gatDefecte);
  const raza = isPerro ? animal.raza_perro : animal.raza_gato;
  const especieLabel = isPerro
    ? t('petCardExtended.dog')
    : t('petCardExtended.cat');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 3,
        backgroundColor: cardBgColor,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: isDarkMode
            ? '0 12px 24px rgba(167, 139, 250, 0.3)'
            : '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
        overflow: 'hidden',
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="280px"
          image={imageSrc}
          alt={animal.nombre}
          sx={{
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Favorite Button */}
        <IconButton
          onClick={onToggleFavorito}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isFavorito ? (
            <FavoriteIcon sx={{ color: '#ff1744', fontSize: 28 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: accentColor, fontSize: 28 }} />
          )}
        </IconButton>

        {/* Species Chip */}
        <Chip
          icon={<PetsIcon />}
          label={especieLabel}
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: chipColor,
            color: colors.textLight,
            fontWeight: 'bold',
            fontSize: '0.85rem',
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Name and Gender */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: colors.textDark,
              fontWeight: 'bold',
              fontSize: '1.3rem',
            }}
          >
            {animal.nombre}
          </Typography>
          {animal.genero === 'macho' ? (
            <MaleIcon sx={{ color: colors.blue, fontSize: 24 }} />
          ) : (
            <FemaleIcon sx={{ color: '#ff69b4', fontSize: 24 }} />
          )}
        </Box>

        {/* Breed/Raza */}
        <Typography
          variant="body2"
          sx={{
            color: colors.textDark,
            fontWeight: 500,
            mb: 1,
            opacity: 0.8,
          }}
        >
          {raza || t('petCardExtended.breedNotSpecified')}
        </Typography>

        {/* Quick Info Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {animal.edad && (
            <Chip
              label={`${animal.edad} ${
                animal.edad !== 1
                  ? t('petCardExtended.years')
                  : t('petCardExtended.year')
              }`}
              size="small"
              sx={{
                backgroundColor: colors.purple,
                color: colors.textLight,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
          )}
          {animal.tamaño && (
            <Chip
              label={animal.tamaño}
              size="small"
              sx={{
                backgroundColor: colors.yellow,
                color: colors.textDark,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
          )}
          {animal.color && (
            <Chip
              label={animal.color}
              size="small"
              variant="outlined"
              sx={{
                borderColor: colors.textDark,
                color: colors.textDark,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>

        {/* Main Description - Truncated */}
        <Typography
          variant="body2"
          sx={{
            color: colors.textDark,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
            mb: 1,
          }}
        >
          {animal.descripcion || t('petCardExtended.noDescription')}
        </Typography>
      </CardContent>

      {/* Extended Content - Collapsible */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ pt: 2 }}>
          {/* Location */}
          {animal.ubicacion && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <LocationOnIcon
                sx={{
                  color: accentColor,
                  fontSize: 20,
                  mt: 0.5,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography variant="caption" sx={{ color: colors.textDark, opacity: 0.7 }}>
                  {t('petCardExtended.location')}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textDark, fontWeight: 500 }}>
                  {animal.ubicacion}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Character/Personality */}
          {animal.caracter && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: colors.textDark,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  opacity: 0.7,
                }}
              >
                {t('petCardExtended.character')}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textDark, mt: 0.5 }}>
                {animal.caracter}
              </Typography>
            </Box>
          )}

          {/* Health Status */}
          {(animal.vacunado ||
            animal.esterilizado ||
            animal.desparasitado ||
            animal.con_microchip) && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: colors.textDark,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  opacity: 0.7,
                }}
              >
                {t('petCardExtended.healthStatus')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {animal.vacunado && (
                  <Chip
                    label={t('petCardExtended.vaccinated')}
                    size="small"
                    sx={{
                      backgroundColor: '#c8e6c9',
                      color: '#2e7d32',
                      fontWeight: 600,
                    }}
                  />
                )}
                {animal.esterilizado && (
                  <Chip
                    label={t('petCardExtended.sterilized')}
                    size="small"
                    sx={{
                      backgroundColor: '#c8e6c9',
                      color: '#2e7d32',
                      fontWeight: 600,
                    }}
                  />
                )}
                {animal.desparasitado && (
                  <Chip
                    label={t('petCardExtended.dewormed')}
                    size="small"
                    sx={{
                      backgroundColor: '#c8e6c9',
                      color: '#2e7d32',
                      fontWeight: 600,
                    }}
                  />
                )}
                {animal.con_microchip && (
                  <Chip
                    label={t('petCardExtended.microchip')}
                    size="small"
                    sx={{
                      backgroundColor: '#c8e6c9',
                      color: '#2e7d32',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Special Needs */}
          {animal.necesidades_especiales && (
            <Box
              sx={{
                backgroundColor: isDarkMode
                  ? 'rgba(255, 193, 7, 0.1)'
                  : 'rgba(255, 193, 7, 0.1)',
                border: `1px solid ${colors.yellow}`,
                p: 1.5,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <InfoIcon
                  sx={{
                    color: colors.yellow,
                    fontSize: 18,
                    mt: 0.3,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.textDark,
                      fontWeight: 'bold',
                      display: 'block',
                    }}
                  >
                    {t('petCardExtended.specialNeeds')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textDark, mt: 0.5 }}>
                    {animal.descripcion_necesidades ||
                      t('petCardExtended.consultShelter')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Collapse>

      {/* Actions Section */}
      <CardActions sx={{ pt: 0, gap: 1 }}>
        <ExpandMoreIconStyled
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label={t('petCardExtended.showMore')}
        />
        <Button
          size="small"
          variant="contained"
          sx={{
            backgroundColor: accentColor,
            color: colors.textLight,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: chipColor,
            },
          }}
          onClick={onViewMore}
          startIcon={<InfoIcon />}
        >
          {t('petCardExtended.viewMore')}
        </Button>
      </CardActions>
    </Card>
  );
}
