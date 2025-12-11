import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../hooks/useColors';
import api from '../../api/client';
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

function ProfileAnimal() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferit, setPreferit] = useState(false);
  const [altres, setAltres] = useState([]);
  const [galeriaIndex, setGaleriaIndex] = useState(0);
  const [updatingAdoption, setUpdatingAdoption] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [alerta, setAlerta] = useState(null);
  
  // Verificar si l'usuari és protectora
  const isProtectora = user?.role === ROLES.PROTECTORA;

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
        setError(t('profileMascota.errorLoading'));
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
    // Carrega els preferits de l'usuari
    if (user) {
      api.get('/preferits/')
        .then(res => {
          const preferitsIds = res.data.preferits_ids || [];
          if (preferitsIds.includes(Number(id))) {
            setPreferit(true);
          }
        })
        .catch(err => {
          console.error('Error carregant preferits:', err);
        });
    }
  }, [id, t, user]);

  const togglePreferit = async () => {
    // No permetre accions de favorits per a protectores
    if (isProtectora) {
      console.log('Acció bloquejada: l\'usuari és protectora');
      return;
    }
    
    try {
      const action = preferit ? 'dislike' : 'like';
      const response = await api.post('/swipe/action/', {
        mascota_id: animal.id,
        action: action
      });
      if (response.data.is_like) {
        setPreferit(true);
        if (response.data.chat_id) {
          setAlerta({
            type: 'success',
            message: `S'ha creat un xat amb la protectora!`,
            chatId: response.data.chat_id
          });
        }
      } else {
        setPreferit(false);
      }
    } catch (error) {
      setAlerta({ type: 'error', message: 'Error al processar la interacció.' });
    }
    setTimeout(() => setAlerta(null), 4000);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress sx={{ color: colors.orange }} size={60} /></Box>;
  }
  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }
  if (!animal) return null;

  // Normalitzar camps del backend (venen en majúscules)
  const especieLower = (animal.especie || '').toLowerCase();
  const generoLower = (animal.genero || '').toLowerCase();
  
  // Imatge principal
  const imageSrc = animal.foto || `https://via.placeholder.com/400x300?text=${t('profileMascota.noImage')}`;
  const raza = especieLower === 'perro' 
    ? (animal.raza_perro_display || animal.raza_perro) 
    : (animal.raza_gato_display || animal.raza_gato);
  const tamanoDisplay = animal.tamano_display || animal.tamano;
  const caracter = especieLower === 'perro' ? animal.caracter_perro : animal.caracter_gato;
  
  // Camps d'estat de salut (ara és un array estado_legal_salud)
  const estadoSalud = animal.estado_legal_salud || [];
  const vacunado = estadoSalud.includes('VACUNADO');
  const esterilizado = estadoSalud.includes('ESTERILIZADO');
  const desparasitado = estadoSalud.includes('DESPARASITADO');
  const con_microchip = estadoSalud.includes('MICROCHIP');
  
  // Condicions especials segons espècie
  const condicionEspecial = especieLower === 'perro' ? animal.condicion_especial_perro : animal.condicion_especial_gato;
  const tieneNecesidadesEspeciales = condicionEspecial && condicionEspecial.length > 0;
  
  // Apto con (convivència)
  const aptoCon = animal.apto_con || [];

  return (
    <Box sx={{ background: colors.background, minHeight: '100vh', py: { xs: 2, md: 6 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Paper elevation={4} sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: { xs: 3, md: 5 }, 
          background: colors.lightColor, 
          maxWidth: 900, 
          mx: 'auto', 
          position: 'relative' 
        }}>
          {/* Notificació visual d'alerta - només per usuaris */}
          {alerta && !isProtectora && (
            <Alert severity={alerta.type} sx={{ mb: 3 }}>
              {alerta.message}
              {alerta.chatId && (
                <Button color="success" size="small" sx={{ ml: 2 }} onClick={() => navigate(`/chat/${alerta.chatId}`)}>
                  Ves al xat
                </Button>
              )}
            </Alert>
          )}
          {/* Cor de preferit - només per usuaris */}
          {!isProtectora && (
            <IconButton
              onClick={togglePreferit}
              sx={{ 
                position: 'absolute', 
                top: { xs: 12, md: 32 }, 
                right: { xs: 12, md: 32 }, 
                zIndex: 2, 
                background: 'none' 
              }}
            >
              {preferit ? <FavoriteIcon sx={{ color: 'red', fontSize: { xs: 28, md: 36 } }} /> : <FavoriteBorderIcon sx={{ color: colors.orange, fontSize: { xs: 28, md: 36 } }} />}
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
                width: { xs: '100%', md: 300 }, 
                height: { xs: 250, md: 300 },
                mx: 'auto',
              }}>
                <CardMedia
                  component="img"
                  image={imageSrc}
                  alt={animal.nombre}
                  sx={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center center', 
                    width: '100%', 
                    height: { xs: 250, md: 300 }, 
                    borderRadius: 3,
                  }}
                />
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
                width: { xs: '100%', md: '400px' },
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
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
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
                      fontSize: { xs: '0.7rem', md: '0.875rem' },
                      '& .MuiChip-icon': { color: generoLower === 'macho' ? colors.blue : 'pink' }
                    }} 
                  />
                  <Chip 
                    label={`${animal.edad} ${animal.edad !== 1 ? t('profileMascota.years') : t('profileMascota.year')}`}
                    sx={{ 
                      backgroundColor: colors.darkPurple, 
                      color: 'white',
                      fontSize: { xs: '0.7rem', md: '0.875rem' },
                    }} 
                  />
                  <Chip 
                    label={tamanoDisplay || t('profileMascota.sizeNotSpecified')}
                    sx={{ 
                      backgroundColor: colors.darkPurple, 
                      color: 'white',
                      fontSize: { xs: '0.7rem', md: '0.875rem' },
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
                color: colors.black, 
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
                  <strong>{t('profileMascota.character')}</strong>{' '}
                  {Array.isArray(caracter)
                    ? caracter.map((c) => t(`character.${CHARACTER_TRANSLATION_MAP[c] || c.toLowerCase()}`)).join(', ')
                    : caracter || '-'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>{t('profileMascota.compatibility')}</strong> {aptoCon.length > 0 ? aptoCon.join(', ') : '-'}</Typography>
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

          <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 6 } }}>
            {user?.role === ROLES.PROTECTORA ? (
              <Button 
                variant="contained" 
                disabled={updatingAdoption}
                onClick={async () => {
                  setUpdatingAdoption(true);
                  try {
                    const res = await api.patch(`/mascota/${id}/`, {
                      adoptado: !animal.adoptado
                    });
                    setAnimal(res.data);
                  } catch (err) {
                    console.error('Error actualitzant estat d\'adopció:', err);
                    alert(t('profileMascota.errorUpdatingAdoption'));
                  } finally {
                    setUpdatingAdoption(false);
                  }
                }}
                sx={{ 
                  backgroundColor: animal.adoptado ? colors.purple : colors.green, 
                  color: 'white', 
                  px: { xs: 3, md: 6 }, 
                  py: { xs: 1.5, md: 2 }, 
                  fontSize: { xs: '1rem', md: '1.2rem' }, 
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { 
                    backgroundColor: animal.adoptado ? colors.darkPurple : colors.darkGreen 
                  },
                  '&:disabled': {
                    backgroundColor: colors.lightColor,
                  }
                }}
              >
                {updatingAdoption 
                  ? t('profileMascota.updating') 
                  : animal.adoptado 
                    ? t('profileMascota.markAsAvailable') 
                    : t('profileMascota.markAsAdopted')
                }
              </Button>
            ) : (
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: colors.orange, 
                  color: 'white', 
                  px: { xs: 3, md: 6 }, 
                  py: { xs: 1.5, md: 2 }, 
                  fontSize: { xs: '1rem', md: '1.2rem' }, 
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { backgroundColor: colors.darkOrange } 
                }}
                onClick={async () => {
                  if (!animal?.id) return;
                  try {
                    setStartingChat(true);
                    const res = await api.post('/chat/chats/obtener_o_crear/', { mascota_id: Number(id) });
                    const chatId = res.data?.chat?.id || res.data?.id;
                    // Portem a la pàgina de xats amb el xat de la protectora obert
                    if (chatId) navigate(`/chats?chatId=${chatId}`);
                    else navigate('/chats');
                  } catch (err) {
                    console.error('Error iniciant xat amb protectora:', err);
                    alert(t('chatComponent.errorLoading'));
                  } finally {
                    setStartingChat(false);
                  }
                }}
              >
                {startingChat ? t('chatComponent.newChat') : t('profileMascota.requestAdoption')}
              </Button>
            )}
          </Box>
        </Paper>

        {/* Galeria d'altres animals (slider/carousel) */}
        <Box sx={{ mt: { xs: 4, md: 6 }, mb: 2 }}>
          <Typography variant="h5" sx={{ color: colors.orange, mb: 2, textAlign: 'center', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            {t('profileMascota.otherAnimals')}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: { xs: 1, md: 2 },
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            px: { xs: 1, md: 0 },
          }}>
            <IconButton 
              onClick={() => setGaleriaIndex(i => Math.max(i - 1, 0))} 
              disabled={galeriaIndex === 0}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            {altres.slice(galeriaIndex, galeriaIndex + (isMobile ? 2 : 4)).map((a, index) => {
              const aEspecieLower = (a.especie || '').toLowerCase();
              const aGeneroLower = (a.genero || '').toLowerCase();
              const cardColor = aEspecieLower === 'perro' ? colors.background : colors.backgroundBlue;
              const iconColor = aEspecieLower === 'perro' ? colors.darkOrange : colors.darkBlue;
              const aRaza = aEspecieLower === 'perro' 
                ? (a.raza_perro_display || a.raza_perro) 
                : (a.raza_gato_display || a.raza_gato);
              return (
                <Card 
                  key={a.id} 
                  sx={{ 
                    width: { xs: 150, sm: 180, md: 200 }, 
                    backgroundColor: cardColor, 
                    borderRadius: 2, 
                    boxShadow: 2, 
                    mx: { xs: 0.5, md: 1 }, 
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
                      sx={{ height: { xs: 100, sm: 120, md: 140 }, objectFit: 'cover', objectPosition: 'center center' }}
                      image={a.foto || `https://via.placeholder.com/200x140?text=${t('profileMascota.noImage')}`}
                      alt={a.nombre}
                    />
                    {/* Chip d'espècie */}
                    <Chip
                      icon={<PetsIcon sx={{ fontSize: { xs: 14, md: 18 } }} />}
                      label={aEspecieLower === 'perro' ? t('profileMascota.dog') : t('profileMascota.cat')}
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        bottom: 8, 
                        left: 8, 
                        backgroundColor: iconColor, 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.65rem', md: '0.75rem' },
                        '& .MuiChip-icon': { color: 'white' },
                      }}
                    />
                  </Box>
                  {/* Contingut */}
                  <Box sx={{ p: { xs: 1, md: 1.5 } }}>
                    <Typography variant="subtitle1" sx={{ color: colors.textDark, fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '0.85rem', md: '1rem' } }}>
                      {a.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      {aGeneroLower === 'macho' ? (
                        <MaleIcon sx={{ color: colors.blue, fontSize: { xs: 14, md: 18 } }} />
                      ) : (
                        <FemaleIcon sx={{ color: 'pink', fontSize: { xs: 14, md: 18 } }} />
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        {aRaza || t('profileMascota.breedNotSpecified')}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })}
            <IconButton 
              onClick={() => setGaleriaIndex(i => Math.min(i + 1, Math.max(altres.length - (isMobile ? 2 : 4), 0)))} 
              disabled={galeriaIndex >= Math.max(altres.length - (isMobile ? 2 : 4), 0)}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ProfileAnimal;
