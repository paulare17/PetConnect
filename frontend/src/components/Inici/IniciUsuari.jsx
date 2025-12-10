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
import { useColors } from "../../hooks/useColors";
import api from "../../api/client";
import CardPet from "../MostraMascotes/CardPet";
import Pagination from "@mui/material/Pagination";
import { Height } from "@mui/icons-material";

function IniciUsuari() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const navigate = useNavigate();
  
  // Opcions de filtre segons el model Mascota
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
  };
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [filtros, setFiltros] = useState({
    especie: "todos",
    genero: "todos",
    tamaño: "todos",
  });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Funció per canviar els filtres
  const handleFilterChange = (name, value) => {
    setFiltros({
      ...filtros,
      [name]: value,
    });
  };

  // Carregar animals des de l'API
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Construir la URL amb paràmetres de consulta
    const params = new URLSearchParams();
    if (filtros.especie !== "todos") params.append("especie", filtros.especie.toUpperCase());
    if (filtros.genero !== "todos") params.append("genero", filtros.genero.toUpperCase());
    if (filtros.tamaño !== "todos") params.append("tamano", filtros.tamaño.toUpperCase());
    // Afegim la paginació
    params.append("limit", itemsPerPage);
    params.append("offset", (page - 1) * itemsPerPage);

    // Cridar l'API
    api
      .get(`/mascota/?${params.toString()}`)
      .then((response) => {
        setAnimales(response.data.results || response.data);
        setTotalCount(
          response.data.count ||
            (response.data.results
              ? response.data.results.length
              : response.data.length)
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(t('iniciUsuari.errorFetch'), err);
        setError(t('iniciUsuari.errorLoading'));
        setLoading(false);
      });
  }, [filtros, page, t]);

  // Gestió de favorits
  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((fav) => fav !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

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
        <Button
          variant="contained"
          onClick={() => navigate("/inici-usuari-pettinder")}
          sx={{
            position: "fixed",
            top: 125,
            right: 60,
            backgroundColor: colors.blue,
            color: "white",
            px: 4,
            py: 3,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: 50,
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            boxShadow: `0 6px 20px ${colors.blue}60`,
            zIndex: 1000,
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.20)" },
            },
            "&:hover": {
              backgroundColor: colors.darkBlue,
              transform: "translateY(-2px) scale(1.05)",
              boxShadow: `0 8px 25px ${colors.orange}80`,
            },
            transition: "all 0.3s ease",
            // Responsive
            "@media (max-width: 600px)": {
              px: 2.5,
              py: 1.2,
              fontSize: "0.95rem",
              top: 16,
              right: 16,
            },
          }}
        >
          <PetsIcon sx={{ fontSize: 28 }} />
          {t('iniciUsuari.petTinderButton')}
        </Button>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: colors.orange,
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <PetsIcon sx={{ fontSize: 48 }} />
            Galeria d'Animals Disponibles
          </Typography>
          <Typography variant="h6" sx={{ color: colors.darkBlue }}>
            Troba el teu company perfecte!
          </Typography>
        </Box>

        {/* Filtres */}
        <Box sx={{ mb: 4 }}>
          {/* Filtres */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              flex: 1,
              backgroundColor: "white",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('iniciUsuari.filterSpecies')}</InputLabel>
                  <Select
                    value={filtros.especie}
                    label={t('iniciUsuari.filterSpecies')}
                    onChange={(e) =>
                      handleFilterChange("especie", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.orange,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.darkOrange,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.orange,
                      },
                    }}
                  >
                    {FILTROS.especie.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('iniciUsuari.filterGender')}</InputLabel>
                  <Select
                    value={filtros.genero}
                    label={t('iniciUsuari.filterGender')}
                    onChange={(e) =>
                      handleFilterChange("genero", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.blue,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.darkBlue,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.blue,
                      },
                    }}
                  >
                    {FILTROS.genero.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('iniciUsuari.filterSize')}</InputLabel>
                  <Select
                    value={filtros.tamaño}
                    label={t('iniciUsuari.filterSize')}
                    onChange={(e) =>
                      handleFilterChange("tamaño", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.yellow,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.yellow,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.yellow,
                      },
                    }}
                  >
                    {FILTROS.tamaño.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
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
                      isFavorito={favoritos.includes(animal.id)}
                      onToggleFavorito={() => toggleFavorito(animal.id)}
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={Math.ceil(totalCount / itemsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
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
