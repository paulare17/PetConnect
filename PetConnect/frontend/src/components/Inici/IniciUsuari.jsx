import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PetsIcon from "@mui/icons-material/Pets";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useTranslation } from "react-i18next";
import { useColors } from "../../../../PetConnect/frontend/src/hooks/useColors";
import { useAuthContext } from "../../../../PetConnect/frontend/src/context/AuthProvider";
import api from "../../api/client";
import CardPet from "../../../../PetConnect/frontend/src/components/MostraMascotes/CardPet";
import Pagination from "@mui/material/Pagination";
import { Height } from "@mui/icons-material";
import PetTinderButton from "../Buttons/PetTinderButton";

function IniciUsuari() {
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const { colors } = useColors();
  const navigate = useNavigate();
  
  // Opcions de filtre segons el model Mascota i preferències d'usuari
  const FILTROS = {
    especie: [
      { value: "todos", label: t('iniciUsuari.all') },
      { value: "perro", label: t('iniciUsuari.dog') },
      { value: "gato", label: t('iniciUsuari.cat') },
    ],
    genero: [
      { value: "todos", label: t('iniciUsuari.all') },
      { value: "macho", label: t('iniciUsuari.male') },
      { value: "hembra", label: t('iniciUsuari.female') },
    ],
    tamaño: [
      { value: "todos", label: t('iniciUsuari.all') },
      { value: "pequeño", label: t('iniciUsuari.small') },
      { value: "mediano", label: t('iniciUsuari.medium') },
      { value: "grande", label: t('iniciUsuari.large') },
      { value: "gigante", label: t('iniciUsuari.giant') },
    ],
    edad: [
      { value: "todos", label: t('iniciUsuari.all') },
      { value: "0", label: t('iniciUsuari.ageLessThan1') },
      { value: "1_2", label: t('iniciUsuari.age1to2') },
      { value: "3_6", label: t('iniciUsuari.age3to6') },
      { value: "7_10", label: t('iniciUsuari.age7to10') },
      { value: "11_14", label: t('iniciUsuari.age11to14') },
      { value: "15_MAS", label: t('iniciUsuari.age15plus') },
    ],
    convivencia: [
      { value: "todos", label: t('iniciUsuari.all') },
      { value: "NINOS", label: t('iniciUsuari.aptChildren') },
      { value: "SIN_NINOS", label: t('iniciUsuari.adultsOnly') },
      { value: "PERROS", label: t('iniciUsuari.aptDogs') },
      { value: "GATOS", label: t('iniciUsuari.aptCats') },
      { value: "SOLO_EL", label: t('iniciUsuari.onlyPet') },
      { value: "PRIMERIZOS", label: t('iniciUsuari.beginnerOwners') },
      { value: "EXPERIENCIA", label: t('iniciUsuari.experiencedOwners') },
    ],
    estadoSalud: [
      { value: "todos", label: t('iniciUsuari.all') },
      { value: "DESPARASITADO", label: t('iniciUsuari.dewormed') },
      { value: "ESTERILIZADO", label: t('iniciUsuari.sterilized') },
      { value: "VACUNADO", label: t('iniciUsuari.vaccinated') },
      { value: "MICROCHIP", label: t('iniciUsuari.microchipped') },
    ],
  };
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferits, setPreferits] = useState([]);
  const [filtros, setFiltros] = useState({
    especie: "todos",
    genero: "todos",
    tamaño: "todos",
    edad: "todos",
    convivencia: "todos",
    estadoSalud: "todos",
  });
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 12; // Match backend pagination

  // Detectar si l'usuari ha aplicat filtres manuals
  const tienesFiltrosManuales = filtros.especie !== "todos" || 
                                filtros.genero !== "todos" || 
                                filtros.tamaño !== "todos" ||
                                filtros.edad !== "todos" ||
                                filtros.convivencia !== "todos" ||
                                filtros.estadoSalud !== "todos";

  // Funció per canviar els filtres
  const handleFilterChange = (name, value) => {
    setFiltros({
      ...filtros,
      [name]: value,
    });
    setPage(1); // Reset to first page when filters change
  };

  // Funció per carregar llista normal (sense IA)
  const carregarLlistaNormal = () => {
    const params = new URLSearchParams();
    if (filtros.especie !== "todos") params.append("especie", filtros.especie.toUpperCase());
    if (filtros.genero !== "todos") params.append("genero", filtros.genero.toUpperCase());
    if (filtros.tamaño !== "todos") params.append("tamano", filtros.tamaño.toUpperCase());
    if (filtros.edad !== "todos") params.append("edad", filtros.edad);
    // Buscar dentro de los arrays JSON usando format: "valor"
    if (filtros.convivencia !== "todos") params.append("apto_con", `"${filtros.convivencia}"`);
    if (filtros.estadoSalud !== "todos") params.append("estado_salud", `"${filtros.estadoSalud}"`);
    params.append("page", page);

    api
      .get(`/mascota/?${params.toString()}`)
      .then((response) => {
        setAnimales(response.data.results || response.data);
        setTotalCount(response.data.count || 0);
        setTotalPages(Math.ceil((response.data.count || 0) / itemsPerPage));
        setLoading(false);
      })
      .catch((err) => {
        console.error(t('iniciUsuari.errorFetch'), err);
        setError(t('iniciUsuari.errorLoading'));
        setLoading(false);
      });
  };

  // Carregar animals des de l'API
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Si NO hi ha filtres manuals i l'usuari està autenticat -> usar IA de recomanació
    if (!tienesFiltrosManuales && user) {
      api
        .get(`/ia/recomendacion/?limit=50`) // Obtenir recomanacions IA
        .then((response) => {
          const recomanacions = response.data.recomendaciones || [];
          setAnimales(recomanacions);
          setTotalCount(recomanacions.length);
          setTotalPages(Math.ceil(recomanacions.length / itemsPerPage));
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error carregant recomanacions IA, usant llista normal:', err);
          // Fallback a la llista normal si falla la IA
          carregarLlistaNormal();
        });
    } else {
      // Amb filtres manuals o usuari no autenticat -> llista normal
      carregarLlistaNormal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros, page, user, tienesFiltrosManuales]);

  // Carregar preferits de l'usuari
  useEffect(() => {
    if (!user) return;
    api.get('/preferits/')
      .then(res => {
        const preferitsIds = res.data.preferits_ids || [];
        setPreferits(preferitsIds);
      })
      .catch(err => {
        console.error('Error carregant preferits:', err);
      });
  }, [user]);


  // Gestió de preferits amb API i notificació
  const [alerta, setAlerta] = useState(null);
  const togglePreferit = async (id) => {
    const isPreferit = preferits.includes(id);
    try {
      const action = isPreferit ? 'dislike' : 'like';
      const response = await api.post('/swipe/action/', {
        mascota_id: id,
        action: action
      });
      if (response.data.is_like) {
        setPreferits([...preferits, id]);
        if (response.data.chat_id) {
          setAlerta({
            type: 'success',
            message: `S'ha creat un xat amb la protectora!`,
            chatId: response.data.chat_id
          });
        }
      } else {
        setPreferits(preferits.filter(fav => fav !== id));
      }
    } catch {
      setAlerta({ type: 'error', message: 'Error al processar la interacció.' });
    }
    setTimeout(() => setAlerta(null), 4000);
  } 

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
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
    <Box
      sx={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Capçalera */}
        <PetTinderButton 
          route="/inici-usuari-pettinder" 
          labelKey="iniciUsuari.petTinderButton" 
        />
        <Box sx={{ textAlign: "center", mb: 4, py: { xs: 1, md: 4 }, position: "relative" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: colors.orange,
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1, md: 2 },
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            <PetsIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
            {t('iniciUsuari.title')}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: colors.darkBlue,
              fontSize: { xs: "0.9rem", md: "1.25rem" },
              px: { xs: 2, md: 0 },
            }}
          >
            {t('iniciUsuari.subtitle')}
          </Typography>
        </Box>

        {/* Filtres */}
        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              flex: 1,
              backgroundColor: colors.lightColor,
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Espècie */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('iniciUsuari.filterSpecies')}</InputLabel>
                  <Select
                    value={filtros.especie}
                    label={t('iniciUsuari.filterSpecies')}
                    onChange={(e) => handleFilterChange("especie", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.orange },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.darkOrange },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.orange },
                    }}
                  >
                    {FILTROS.especie.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Gènere */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('iniciUsuari.filterGender')}</InputLabel>
                  <Select
                    value={filtros.genero}
                    label={t('iniciUsuari.filterGender')}
                    onChange={(e) => handleFilterChange("genero", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.blue },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.darkBlue },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blue },
                    }}
                  >
                    {FILTROS.genero.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Tamany */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('iniciUsuari.filterSize')}</InputLabel>
                  <Select
                    value={filtros.tamaño}
                    label={t('iniciUsuari.filterSize')}
                    onChange={(e) => handleFilterChange("tamaño", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.yellow },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.yellow },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.yellow },
                    }}
                  >
                    {FILTROS.tamaño.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Edat */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('iniciUsuari.filterAge')}</InputLabel>
                  <Select
                    value={filtros.edad}
                    label={t('iniciUsuari.filterAge')}
                    onChange={(e) => handleFilterChange("edad", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.purple },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.purple },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.purple },
                    }}
                  >
                    {FILTROS.edad.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Convivència */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('iniciUsuari.filterCohabitation')}</InputLabel>
                  <Select
                    value={filtros.convivencia}
                    label={t('iniciUsuari.filterCohabitation')}
                    onChange={(e) => handleFilterChange("convivencia", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.green },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.green },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.green },
                    }}
                  >
                    {FILTROS.convivencia.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Estat de Salut */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('iniciUsuari.filterHealthStatus')}</InputLabel>
                  <Select
                    value={filtros.estadoSalud}
                    label={t('iniciUsuari.filterHealthStatus')}
                    onChange={(e) => handleFilterChange("estadoSalud", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.red },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.red },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.red },
                    }}
                  >
                    {FILTROS.estadoSalud.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Comptador d'animals */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Chip
            label={`${animales.length} ${animales.length !== 1 ? t('iniciUsuari.animalsFoundPlural') : t('iniciUsuari.animalsFound')} ${animales.length !== 1 ? t('iniciUsuari.foundPlural') : t('iniciUsuari.found')}`}
            sx={{
              backgroundColor: colors.orange,
              color: "white",
              fontSize: "1.1rem",

              py: 2,
              px: 1,
            }}
          />
        </Box>

        {/* Notificació visual d'alerta */}
        {alerta && (
          <Alert severity={alerta.type} sx={{ mb: 3 }}>
            {alerta.message}
            {alerta.chatId && (
              <Button color="success" size="small" sx={{ ml: 2 }} onClick={() => navigate(`/chat/${alerta.chatId}`)}>
                Ves al xat
              </Button>
            )}
          </Alert>
        )}

        {/* Galeria d'animals */}
        {animales.length > 0 ? (
          <>
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: { xs: 2, sm: 3 },
                  mx: "auto",
                }}
              >
                {animales.map((animal) => (
                  <Box
                    key={animal.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      cursor: "pointer",
                      pb: 5,
                    }}
                    onClick={() => navigate(`/mascotes/${animal.id}`)}
                  >
                    <CardPet
                      animal={animal}
                      isFavorito={preferits.includes(animal.id)}
                      onToggleFavorito={() => togglePreferit(animal.id)}
                      sx={{
                        width: { xs: "100%", sm: 300, md: 300 },
                        maxWidth: 300,
                        height: 450,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Container>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <PetsIcon sx={{ fontSize: 80, color: colors.purple, mb: 2 }} />
            <Typography variant="h5" sx={{ color: colors.darkBlue }}>
              {t('iniciUsuari.noAnimalsFound')}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
              {t('iniciUsuari.tryOtherFilters')}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default IniciUsuari;
