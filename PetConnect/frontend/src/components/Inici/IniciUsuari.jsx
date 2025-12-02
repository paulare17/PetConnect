import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useColors } from '../../hooks/useColors';
import api from '../../api/client';
import CardPet from '../MostraMascotes/CardPet';
import Pagination from '@mui/material/Pagination';

// Opcions de filtre segons el model Mascota
const FILTROS = {
  especie: [
    { value: 'todos', label: 'Tots' },
    { value: 'perro', label: 'Gos' },
    { value: 'gato', label: 'Gat' },
  ],
  genero: [
    { value: 'todos', label: 'Tots' },
    { value: 'macho', label: 'Mascle' },
    { value: 'hembra', label: 'Femella' },
  ],
  tamaño: [
    { value: 'todos', label: 'Tots' },
    { value: 'pequeño', label: 'Petit' },
    { value: 'mediano', label: 'Mitjà' },
    { value: 'grande', label: 'Gran' },
    { value: 'gigante', label: 'Gegant' },
  ],
};

function IniciUsuari() {
  const { colors } = useColors();
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [filtros, setFiltros] = useState({
    especie: 'todos',
    genero: 'todos',
    tamaño: 'todos',
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
    if (filtros.especie !== 'todos') params.append('especie', filtros.especie);
    if (filtros.genero !== 'todos') params.append('genero', filtros.genero);
    if (filtros.tamaño !== 'todos') params.append('tamaño', filtros.tamaño);
    // Afegim la paginació
    params.append('limit', itemsPerPage);
    params.append('offset', (page - 1) * itemsPerPage);

    // Cridar l'API
    api.get(`/mascota/?${params.toString()}`)
      .then(response => {
        setAnimales(response.data.results || response.data);
        setTotalCount(response.data.count || (response.data.results ? response.data.results.length : response.data.length));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtenir el catàleg:', err);
        setError('Error al carregar el catàleg. Verifica el servidor de Django i l\'API.');
        setLoading(false);
      });
  }, [filtros, page]);

  // Gestió de favorits
  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(fav => fav !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
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
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Capçalera */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              
              color: colors.orange,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Espècie</InputLabel>
                <Select
                  value={filtros.especie}
                  label="Espècie"
                  onChange={(e) => handleFilterChange('especie', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.orange,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.darkOrange,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
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
                <InputLabel>Sexe</InputLabel>
                <Select
                  value={filtros.genero}
                  label="Sexe"
                  onChange={(e) => handleFilterChange('genero', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.blue,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.darkBlue,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
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
                <InputLabel>Mida</InputLabel>
                <Select
                  value={filtros.tamaño}
                  label="Mida"
                  onChange={(e) => handleFilterChange('tamaño', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.yellow,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.yellow,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
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

        {/* Comptador d'animals */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Chip
            label={`${animales.length} animal${animales.length !== 1 ? 's' : ''} trobat${animales.length !== 1 ? 's' : ''}`}
            sx={{
              backgroundColor: colors.orange,
              color: 'white',
              fontSize: '1.1rem',

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
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                  },
                  gap: { xs: 2, sm: 3 },
                  mx: 'auto'
                }}
              >
                {animales.map((animal) => (
                  <Box key={animal.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CardPet
                      animal={animal}
                      isFavorito={favoritos.includes(animal.id)}
                      onToggleFavorito={() => toggleFavorito(animal.id)}
                      sx={{ width: { xs: '100%', sm: 300, md: 300 }, maxWidth: 300, }}
                    />
                  </Box>
                ))}
              </Box>
            </Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <PetsIcon sx={{ fontSize: 80, color: colors.purple, mb: 2 }} />
            <Typography variant="h5" sx={{ color: colors.darkBlue }}>
              No s'han trobat animals disponibles que coincideixin amb els filtres.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
              Prova amb altres criteris de cerca.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default IniciUsuari;
