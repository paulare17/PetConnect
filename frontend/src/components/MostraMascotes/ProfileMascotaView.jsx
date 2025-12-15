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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthProvider';
import { ROLES } from '../../constants/roles';
// Mapeig de caràcters backend -> clau traducció
const CHARACTER_TRANSLATION_MAP = {
  CARINOSO: 'affectionate',
  FALDERO: 'lapDog',
  DEPENDIENTE: 'dependent',
  DUO_INSEPARABLE: 'inseparableDuo',
  TIMIDO: 'shy',
  MIEDOSO: 'fearful',
  JUGUETON: 'playful',
  ACTIVO_ENERGICO: 'activeEnergetic',
  TRANQUILO: 'calm',
  TRABAJADOR: 'hardWorking',
  SOCIABLE: 'sociable',
  PROTECTOR_GUARDIAN: 'protectiveGuardian',
  DOMINANTE_PERROS: 'dominantWithDogs',
  REACTIVO: 'reactive',
  LIDERAZGO: 'leadership',
  DESCONFIADO_EXTRANOS: 'distrustfulOfStrangers',
  OBEDIENTE: 'obedient',
  OLAFATEADOR: 'sniffer',
  LADRADOR: 'barker',
  ESCAPISTA: 'escapist',
  EXCAVADOR: 'digger',
  GLOTON: 'glutton',
  CABEZOTA: 'stubborn',
  INTELIGENTE: 'intelligent',
  SENSIBLE: 'sensitive',
  LEAL: 'loyal',
  INDEPENDIENTE: 'independent',
  ASUSTADIZO: 'skittish',
  JUGUETON_INTENSO: 'intenselyPlayful',
  ACTIVO: 'active',
  CAZADOR: 'hunter',
  AFECTIVO_CONOCIDOS: 'affectionateWithFamiliar',
  TERRITORIAL: 'territorial',
  SEMIFERAL: 'semiFeral',
  OBSERVADOR: 'observer',
  ADAPTABLE: 'adaptable',
  DIVA: 'diva',
  LIMPIO: 'clean'
};
import { useColors } from '../../hooks/useColors';
import gatDefecte from '../../assets/gat_defecte.png';
import gosDefecte from '../../assets/gos_defecte.png';

function ProfileMascotaView({ animal, showAdoptButton = true }) {
  const { t } = useTranslation();
  const { colors } = useColors();
  const { user } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [favorit, setFavorit] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [alerta, setAlerta] = useState(null);
  
  // Verificar si l'usuari és protectora
  const isProtectora = user?.role === ROLES.PROTECTORA;
  console.log('ProfileMascotaView - isProtectora:', isProtectora, 'user.role:', user?.role);
  
  // const isOwnPet = isProtectora && animal?.protectora === user?.id;
  const handleToggleFavorit = async () => {
    // No permetre accions de favorits per a protectores
    if (isProtectora) {
      console.log('Acció bloquejada: l\'usuari és protectora');
      return;
    }
    
    try {
      const action = favorit ? 'dislike' : 'like';
      const response = await import('../../api/client').then(m => m.default.post('/swipe/action/', {
        mascota_id: animal.id,
        action: action
      }));
      if (response.data.is_like) {
        setFavorit(true);
        if (response.data.chat_id) {
          setAlerta({
            type: 'success',
            message: `S'ha creat un xat amb la protectora!`,
            chatId: response.data.chat_id
          });
        }
      } else {
        setFavorit(false);
      }
    } catch (error) {
      console.error('Error al processar la interacció:', error);
      setAlerta({ type: 'error', message: 'Error al processar la interacció.' });
    }
    setTimeout(() => setAlerta(null), 4000);
  };

  if (!animal) return null;

  // Helper para construir URLs correctas para las imágenes
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // Ya es una URL absoluta
    }
    // Si es una ruta relativa, usar la variable de entorno VITE_API_BASE_URL
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${apiBase}${url}`;
  };

  // Normalitzar camps del backend (venen en majúscules)
  const especieLower = (animal.especie || '').toLowerCase();
  const generoLower = (animal.genero || '').toLowerCase();
  
  // Determinar imatge per defecte segons espècie
  const defaultImage = especieLower === 'perro' ? gosDefecte : gatDefecte;
  
  // Crear array amb totes les fotos disponibles
  const images = [
    getImageUrl(animal.foto) || defaultImage,
    getImageUrl(animal.foto2),
    getImageUrl(animal.foto3)
  ].filter(Boolean); // Eliminar valors null/undefined
  
  // Si no hi ha cap foto, afegir la imatge per defecte
  if (images.length === 0) {
    images.push(defaultImage);
  }
  
  // Raça i altres camps segons espècie
  const raza = especieLower === 'perro' 
    ? (animal.raza_perro_display || animal.raza_perro) 
    : (animal.raza_gato_display || animal.raza_gato);
  const tamanoDisplay = animal.tamano_display || animal.tamano;
  
  // Carácter - solo mostrar el de la especie correspondiente
  let caracter = especieLower === 'perro' ? animal.caracter_perro : animal.caracter_gato;
  
  // Convertir a array si es necesario (puede venir como string separado por comas)
  if (typeof caracter === 'string') {
    caracter = caracter.split(',').map(c => c.trim()).filter(Boolean);
  } else if (!Array.isArray(caracter)) {
    caracter = [];
  }
  
  // Camps d'estat de salut (ara és un array estado_legal_salud)
  const estadoSalud = animal.estado_legal_salud || [];
  const vacunado = estadoSalud.includes('VACUNADO');
  const esterilizado = estadoSalud.includes('ESTERILIZADO');
  const desparasitado = estadoSalud.includes('DESPARASITADO');
  const con_microchip = estadoSalud.includes('MICROCHIP');
  
  // Condicions especials segons espècie
  const condicionEspecial = especieLower === 'perro' ? animal.condicion_especial_perro : animal.condicion_especial_gato;
  const tieneNecesidadesEspeciales = condicionEspecial && condicionEspecial.length > 0;
  
  // Compatibilidad (convivencia)
  const compatibilidad = [];
  if (animal.convivencia_ninos) {
    compatibilidad.push(
      animal.convivencia_ninos === true || animal.convivencia_ninos === 'true' 
        ? t('profileMascota.goodWithKids') 
        : animal.convivencia_ninos === false || animal.convivencia_ninos === 'false'
        ? t('profileMascota.notGoodWithKids')
        : null
    );
  }
  if (animal.convivencia_animales) {
    compatibilidad.push(
      animal.convivencia_animales === 'si' 
        ? t('profileMascota.goodWithAnimals')
        : animal.convivencia_animales === 'no'
        ? t('profileMascota.notGoodWithAnimals')
        : null
    );
  }
  const compatibilidadText = compatibilidad.filter(Boolean).join(', ') || '-';

  // Funcions per navegar pel carrussel
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ 
      py: { xs: 1, md: 2 }, 
      width: { xs: '100%', md: '1000px' }, 
      maxWidth: '100%',
      justifyContent: 'center', 
      display: 'flex',
      px: { xs: 1, md: 0 },
    }}>
      <Paper elevation={4} sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: { xs: 3, md: 5 }, 
        background: colors.lightColor, 
        position: 'relative',
        width: '100%',
      }}>
        {/* Notificació visual d'alerta - només per usuaris */}
        {alerta && !isProtectora && (
          <Box sx={{ position: 'absolute', top: 70, right: 16, zIndex: 10, minWidth: 300 }}>
            <Button color={alerta.type === 'success' ? 'success' : 'error'} variant="outlined" fullWidth disabled>
              {alerta.message}
              {alerta.chatId && (
                <Button color="success" size="small" sx={{ ml: 2 }} href={`/chat/${alerta.chatId}`}>Ves al xat</Button>
              )}
            </Button>
          </Box>
        )}
        {/* Cor de favorit - només per usuaris */}
        {!isProtectora && (
          <IconButton
            onClick={handleToggleFavorit}
            sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2, background: 'none' }}
          >
            {favorit ? <FavoriteIcon sx={{ color: 'red', fontSize: 36 }} /> : <FavoriteBorderIcon sx={{ color: colors.orange, fontSize: 36 }} />}
          </IconButton>
        )}
        
        {/* Capçalera amb imatge i nom */}
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Card sx={{ 
              boxShadow: 3, 
              borderRadius: 3, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              width: '100%', 
              height: { xs: 250, sm: 300 }, 
              position: 'relative' 
            }}>
              <CardMedia
                component="img"
                image={images[currentImageIndex]}
                alt={`${animal.nombre} - ${currentImageIndex + 1}`}
                sx={{ 
                  objectFit: 'cover', 
                  objectPosition: 'center center', 
                  width: '100%', 
                  height: { xs: 250, sm: 300 }, 
                  borderRadius: 3 
                }}
              />
              
              {/* Controls del carrussel - només si hi ha més d'una imatge */}
              {images.length > 1 && (
                <>
                  {/* Fletxa esquerra */}
                  <IconButton
                    onClick={handlePrevImage}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      position: 'absolute',
                      left: { xs: 4, md: 8 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
                      zIndex: 1
                    }}
                  >
                    <ChevronLeftIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                  
                  {/* Fletxa dreta */}
                  <IconButton
                    onClick={handleNextImage}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      position: 'absolute',
                      right: { xs: 4, md: 8 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
                      zIndex: 1
                    }}
                  >
                    <ChevronRightIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                  
                  {/* Indicadors (dots) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
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
                        onClick={() => setCurrentImageIndex(index)}
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
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: colors.textDark, 
                mb: 2,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {animal.nombre}
            </Typography>
            {/* Quadre lila per característiques destacades */}
            <Box sx={{ 
              border: `3px solid ${colors.darkPurple}`, 
              borderRadius: 2, 
              p: { xs: 1.5, md: 2 }, 
              mb: 2, 
              background: colors.purple, 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
            }}>
              <Chip 
                label={raza || t('profileMascota.breedNotSpecified')} 
                sx={{ 
                  backgroundColor: colors.lightPurple, 
                  color: colors.textDark, 
                  fontWeight: 'bold', 
                  mb: 1,
                  fontSize: { xs: '0.75rem', md: '0.8125rem' },
                }} 
              />
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: { xs: 0.5, md: 1 }, 
                mb: 1,
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}>
                <Chip 
                  icon={generoLower === 'macho' ? <MaleIcon /> : <FemaleIcon />}
                  label={generoLower === 'macho' ? t('profileMascota.male') : t('profileMascota.female')}
                  sx={{ 
                    backgroundColor: colors.darkPurple, 
                    color: 'white',
                    fontSize: { xs: '0.7rem', md: '0.8125rem' },
                    '& .MuiChip-icon': { color: generoLower === 'macho' ? colors.blue : 'pink' }
                  }} 
                />
                <Chip 
                  label={`${animal.edad} ${animal.edad !== 1 ? t('profileMascota.years') : t('profileMascota.year')}`}
                  sx={{ 
                    backgroundColor: colors.darkPurple, 
                    color: 'white',
                    fontSize: { xs: '0.7rem', md: '0.8125rem' },
                  }} 
                />
                <Chip 
                  label={tamanoDisplay || t('profileMascota.sizeNotSpecified')}
                  sx={{ 
                    backgroundColor: colors.darkPurple, 
                    color: 'white',
                    fontSize: { xs: '0.7rem', md: '0.8125rem' },
                  }} 
                />
              </Box>
              <Chip
                label={animal.adoptado ? t('profileMascota.adopted') : t('profileMascota.available')}
                sx={{ backgroundColor: animal.adoptado ? colors.purple : colors.orange, color: 'white', mt: 1, fontWeight: 'bold' }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Descripció llarga estil blog */}
        <Box sx={{ mt: { xs: 2, md: 4 }, mb: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.textDark, 
              fontSize: { xs: '0.95rem', md: '1.1rem' }, 
              mb: 2,
              textAlign: { xs: 'justify', md: 'left' },
            }}
          >
            {animal.descripcion || t('profileMascota.noDescription')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{t('profileMascota.character')}</strong>
                {Array.isArray(caracter)
                  ? caracter.map((c) => t(`character.${CHARACTER_TRANSLATION_MAP[c] || c.toLowerCase()}`)).join(', ')
                  : caracter || '-'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.compatibility')}</strong> {compatibilidadText}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.dewormed')}</strong> {desparasitado ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.sterilized')}</strong> {esterilizado ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.microchip')}</strong> {con_microchip ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.vaccinated')}</strong> {vacunado ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.specialNeeds')}</strong> {tieneNecesidadesEspeciales ? t('profileMascota.yes') : t('profileMascota.no')}</Typography>
              {tieneNecesidadesEspeciales && (
                <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.needsDescription')}</strong> {Array.isArray(condicionEspecial) ? condicionEspecial.join(', ') : condicionEspecial}</Typography>
              )}
              {animal.protectora_ciudad && (
                <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.location')}</strong> {animal.protectora_ciudad}</Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Dades de la protectora */}
        {(animal.protectora || animal.protectora_nombre) && (
          <Box sx={{ mt: { xs: 2, md: 4 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: colors.orange, 
                mb: 1,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              {t('profileMascota.shelterInCharge')}
            </Typography>
            <Typography variant="body2"><strong>{t('profileMascota.name')}</strong> {animal.protectora_nombre || animal.protectora?.nombre || animal.protectora}</Typography>
            {animal.protectora_ciudad && <Typography variant="body2"><strong>{t('profileMascota.city')}</strong> {animal.protectora_ciudad}</Typography>}
          </Box>
        )}

        {showAdoptButton && (
          <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 6 } }}>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: colors.orange, 
                color: 'white', 
                px: { xs: 3, md: 6 }, 
                py: { xs: 1.5, md: 2 }, 
                fontSize: { xs: '1rem', md: '1.2rem' }, 
                '&:hover': { backgroundColor: colors.darkOrange },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {t('profileMascota.requestAdoption')}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ProfileMascotaView;
