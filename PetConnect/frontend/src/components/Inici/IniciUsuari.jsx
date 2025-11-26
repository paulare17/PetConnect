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
import { colors } from '../../constants/colors';
import api from '../../api/client';

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
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [filtros, setFiltros] = useState({
    especie: 'todos',
    genero: 'todos',
    tamaño: 'todos',
  });

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
    
    if (filtros.especie !== 'todos') {
      params.append('especie', filtros.especie);
    }
    if (filtros.genero !== 'todos') {
      params.append('genero', filtros.genero);
    }
    if (filtros.tamaño !== 'todos') {
      params.append('tamaño', filtros.tamaño);
    }

    // Cridar l'API
    api.get(`/mascota/?${params.toString()}`)
      .then(response => {
        // El backend ja filtra els NO adoptats i NO ocults
        setAnimales(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtenir el catàleg:', err);
        setError('Error al carregar el catàleg. Verifica el servidor de Django i l\'API.');
        setLoading(false);
      });
  }, [filtros]);

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
        backgroundColor: colors.lightColor,
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
              fontWeight: 'bold',
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
              fontWeight: 'bold',
              py: 2,
              px: 1,
            }}
          />
        </Box>

        {/* Galeria d'animals */}
        {animales.length > 0 ? (
          <Grid container spacing={3}>
            {animales.map((animal) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
                <AnimalCard
                  animal={animal}
                  isFavorito={favoritos.includes(animal.id)}
                  onToggleFavorito={() => toggleFavorito(animal.id)}
                />
              </Grid>
            ))}
          </Grid>
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

// Component per mostrar cada animal (Targeta)
const AnimalCard = ({ animal, isFavorito, onToggleFavorito }) => {
  const cardColor = animal.especie === 'perro' ? colors.backgroundOrange : colors.backgroundBlue;
  const iconColor = animal.especie === 'perro' ? colors.darkOrange : colors.darkBlue;
  
  // Imatge placeholder si no hi ha foto
  const imageSrc = animal.foto || 'https://via.placeholder.com/300x200?text=Sense+imatge';

  // Obtenir la raça correcta segons l'espècie
  const raza = animal.especie === 'perro' ? animal.raza_perro : animal.raza_gato;
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Imatge */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={imageSrc}
          alt={animal.nombre}
          sx={{ objectFit: 'cover' }}
        />
        {/* Botó favorit */}
        <IconButton
          onClick={onToggleFavorito}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          {isFavorito ? (
            <FavoriteIcon sx={{ color: 'red' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: colors.orange }} />
          )}
        </IconButton>
        
        {/* Chip d'espècie */}
        <Chip
          icon={<PetsIcon />}
          label={animal.especie === 'perro' ? 'Gos' : 'Gat'}
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: iconColor,
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      {/* Contingut */}
      <CardContent
        sx={{
          flexGrow: 1,
          backgroundColor: cardColor,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 'bold',
            color: colors.black,
            mb: 1,
            textAlign: 'center',
          }}
        >
          {animal.nombre}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          {animal.genero === 'macho' ? (
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
            <strong>Edat:</strong> {animal.edad} any{animal.edad !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Sexe:</strong> {animal.genero === 'macho' ? 'Mascle' : 'Femella'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Mida:</strong> {animal.tamaño || 'No especificat'}
          </Typography>
          {animal.peso && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Pes:</strong> {animal.peso} kg
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Accions */}
      <CardActions sx={{ backgroundColor: cardColor, justifyContent: 'center', pb: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.orange,
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: colors.darkOrange,
            },
            px: 4,
          }}
        >
          Més Info
        </Button>
      </CardActions>
    </Card>
  );
};

export default IniciUsuari;
