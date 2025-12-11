// 📋 EJEMPLOS DE INTEGRACIÓN - PetCardExtended

// ============================================
// EJEMPLO 1: Integración Básica en una Página
// ============================================

import React, { useState } from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PetCardExtended } from '../components/PetCardExtended';
import { useColors } from '../hooks/useColors';

export function BasicPetListPage() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const [favorites, setFavorites] = useState([]);

  const animals = [
    {
      id: 1,
      nombre: 'Max',
      especie: 'perro',
      raza_perro: 'Golden Retriever',
      raza_gato: null,
      edad: 3,
      tamaño: 'Grande',
      color: 'Dorado',
      genero: 'macho',
      foto: 'https://example.com/max.jpg',
      descripcion: 'Max es un perro cariñoso y juguetón...',
      ubicacion: 'Barcelona',
      caracter: 'Sociable y energético',
      vacunado: true,
      esterilizado: true,
      desparasitado: true,
      con_microchip: true,
      necesidades_especiales: false,
      descripcion_necesidades: null,
    },
    // ... más mascotas
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: colors.textDark }}>
        {t('pets')} {t('navbar.adopt')}
      </Typography>

      <Grid container spacing={3}>
        {animals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
            <PetCardExtended
              animal={animal}
              isFavorito={favorites.includes(animal.id)}
              onToggleFavorito={() => {
                setFavorites((prev) =>
                  prev.includes(animal.id)
                    ? prev.filter((id) => id !== animal.id)
                    : [...prev, animal.id]
                );
              }}
              onViewMore={() => {
                window.location.href = `/pet/${animal.id}`;
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// ============================================
// EJEMPLO 2: Con Carga desde API
// ============================================

import { useEffect, useState } from 'react';
import { CircularProgress, Alert, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth'; // Custom hook

export function PetListFromAPI() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { authToken } = useAuth();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/mascotas/', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setAnimals(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container spacing={3}>
      {animals.map((animal) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
          <PetCardExtended
            animal={animal}
            isFavorito={favorites.includes(animal.id)}
            onToggleFavorito={() => handleToggleFavorite(animal.id)}
            onViewMore={() => handleViewPet(animal)}
          />
        </Grid>
      ))}
    </Grid>
  );

  function handleToggleFavorite(petId) {
    setFavorites((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );

    // Guardar en servidor (opcional)
    fetch(`/api/mascotas/${petId}/favorite/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_favorite: !favorites.includes(petId) }),
    });
  }

  function handleViewPet(animal) {
    // Navegar a página de detalle
    window.location.href = `/pet/${animal.id}`;
  }
}

// ============================================
// EJEMPLO 3: Con Filtros y Búsqueda
// ============================================

import { TextField, Box, FormControlLabel, Checkbox } from '@mui/material';

export function PetListWithFilters() {
  const [animals, setAnimals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPerros, setFilterPerros] = useState(true);
  const [filterGatos, setFilterGatos] = useState(true);

  // Filtrar cuando cambian los criterios
  useEffect(() => {
    let result = animals;

    // Filtro por nombre o descripción
    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por especie
    result = result.filter((a) => {
      if (a.especie === 'perro' && filterPerros) return true;
      if (a.especie === 'gato' && filterGatos) return true;
      return false;
    });

    setFiltered(result);
  }, [animals, searchTerm, filterPerros, filterGatos]);

  return (
    <Box>
      {/* Controles */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar mascota..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterPerros}
                onChange={(e) => setFilterPerros(e.target.checked)}
              />
            }
            label="Perros"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterGatos}
                onChange={(e) => setFilterGatos(e.target.checked)}
              />
            }
            label="Gatos"
          />
        </Box>
      </Box>

      {/* Resultados */}
      <Grid container spacing={3}>
        {filtered.map((animal) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
            <PetCardExtended
              animal={animal}
              isFavorito={false}
              onToggleFavorito={() => console.log('Favorito:', animal.id)}
              onViewMore={() => console.log('Ver:', animal.id)}
            />
          </Grid>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Typography>No se encontraron mascotas...</Typography>
      )}
    </Box>
  );
}

// ============================================
// EJEMPLO 4: Con Carousel/Slider
// ============================================

import { IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export function PetCarousel() {
  const [animals, setAnimals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % animals.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + animals.length) % animals.length);
  };

  if (animals.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton onClick={prev}>
        <ChevronLeft />
      </IconButton>

      <Box sx={{ flex: 1, maxWidth: 400 }}>
        <PetCardExtended
          animal={animals[currentIndex]}
          isFavorito={false}
          onToggleFavorito={() => console.log('Favorito')}
          onViewMore={() => console.log('Ver')}
        />
      </Box>

      <IconButton onClick={next}>
        <ChevronRight />
      </IconButton>
    </Box>
  );
}

// ============================================
// EJEMPLO 5: Masonry Layout (Pinterest-style)
// ============================================

import { Masonry } from '@mui/lab';

export function PetMasonryLayout() {
  const [animals, setAnimals] = useState([]);

  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
      {animals.map((animal) => (
        <PetCardExtended
          key={animal.id}
          animal={animal}
          isFavorito={false}
          onToggleFavorito={() => console.log('Fav')}
          onViewMore={() => console.log('Ver')}
        />
      ))}
    </Masonry>
  );
}

// ============================================
// EJEMPLO 6: Vista Previa en Modal
// ============================================

import { Dialog, DialogContent } from '@mui/material';

export function PetPreviewModal() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [animals, setAnimals] = useState([]);

  return (
    <>
      {/* Grid con tarjetas clicables */}
      <Grid container spacing={3}>
        {animals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
            <Box onClick={() => setSelectedPet(animal)}>
              <PetCardExtended
                animal={animal}
                isFavorito={false}
                onToggleFavorito={() => console.log('Fav')}
                onViewMore={() => console.log('Ver')}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal de previa */}
      <Dialog open={!!selectedPet} onClose={() => setSelectedPet(null)} maxWidth="sm">
        <DialogContent>
          {selectedPet && (
            <PetCardExtended
              animal={selectedPet}
              isFavorito={false}
              onToggleFavorito={() => console.log('Fav')}
              onViewMore={() => console.log('Ver detalle')}
              sx={{ width: '100%' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================
// EJEMPLO 7: Lazy Loading / Infinite Scroll
// ============================================

import { useEffect, useRef, useCallback } from 'react';
import { InView } from 'react-intersection-observer';

export function PetListInfiniteScroll() {
  const [animals, setAnimals] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    fetch(`/api/mascotas/?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimals((prev) => [...prev, ...data.results]);
        setHasMore(data.next !== null);
        setPage((prev) => prev + 1);
        setLoading(false);
      });
  }, [page, loading, hasMore]);

  return (
    <Grid container spacing={3}>
      {animals.map((animal) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
          <PetCardExtended
            animal={animal}
            isFavorito={false}
            onToggleFavorito={() => console.log('Fav')}
            onViewMore={() => console.log('Ver')}
          />
        </Grid>
      ))}

      {/* Trigger para cargar más */}
      <InView onInView={loadMore}>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          {loading && <CircularProgress />}
        </Box>
      </InView>
    </Grid>
  );
}

// ============================================
// EJEMPLO 8: Con Animación de Entrada
// ============================================

import { Fade } from '@mui/material';

export function PetListWithAnimation() {
  const [animals, setAnimals] = useState([]);

  return (
    <Grid container spacing={3}>
      {animals.map((animal, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
          <Fade in={true} timeout={300 + index * 100}>
            <div>
              <PetCardExtended
                animal={animal}
                isFavorito={false}
                onToggleFavorito={() => console.log('Fav')}
                onViewMore={() => console.log('Ver')}
              />
            </div>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
}

// ============================================
// EJEMPLO 9: Con Favoritos Persistentes (localStorage)
// ============================================

export function PetListWithPersistentFavorites() {
  const [animals, setAnimals] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos del localStorage al montar
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('petFavorites') || '[]');
    setFavorites(saved);
  }, []);

  // Guardar favoritos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('petFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (petId) => {
    setFavorites((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  return (
    <Grid container spacing={3}>
      {animals.map((animal) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
          <PetCardExtended
            animal={animal}
            isFavorito={favorites.includes(animal.id)}
            onToggleFavorito={() => toggleFavorite(animal.id)}
            onViewMore={() => console.log('Ver')}
          />
        </Grid>
      ))}
    </Grid>
  );
}

// ============================================
// EJEMPLO 10: Integración con React Router
// ============================================

import { useNavigate } from 'react-router-dom';

export function PetListWithRouting() {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  const handleViewPet = (animal) => {
    navigate(`/pet/${animal.id}`, { state: { pet: animal } });
  };

  const handleFavorite = (petId) => {
    // Llamar a API para guardar favorito
    fetch(`/api/mascotas/${petId}/favorite/`, {
      method: 'POST',
    });
  };

  return (
    <Grid container spacing={3}>
      {animals.map((animal) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
          <PetCardExtended
            animal={animal}
            isFavorito={false}
            onToggleFavorito={() => handleFavorite(animal.id)}
            onViewMore={() => handleViewPet(animal)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default {
  BasicPetListPage,
  PetListFromAPI,
  PetListWithFilters,
  PetCarousel,
  PetMasonryLayout,
  PetPreviewModal,
  PetListInfiniteScroll,
  PetListWithAnimation,
  PetListWithPersistentFavorites,
  PetListWithRouting,
};
