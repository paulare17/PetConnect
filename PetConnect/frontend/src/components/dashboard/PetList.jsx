import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  CircularProgress, 
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import CardAnimal from '../dashboard/CardAnimal';
import useMascotas from '../../hooks/useMascotas';

/**
 * Component per llistar mascotes amb filtres
 */
export default function PetList() {
  const [filters, setFilters] = useState({
    especie: '',
    genero: '',
    tamaño: '',
    busqueda: ''
  });

  const { mascotas, loading, error, refetch } = useMascotas(filters);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ especie: '', genero: '', tamaño: '', busqueda: '' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" onClose={() => refetch()}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mascotes en Adopció
      </Typography>

      {/* Filtres */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Buscar"
              placeholder="Nom, color, descripció..."
              value={filters.busqueda}
              onChange={(e) => handleFilterChange('busqueda', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Espècie</InputLabel>
              <Select
                value={filters.especie}
                label="Espècie"
                onChange={(e) => handleFilterChange('especie', e.target.value)}
              >
                <MenuItem value="">Totes</MenuItem>
                <MenuItem value="perro">Gos</MenuItem>
                <MenuItem value="gato">Gat</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Gènere</InputLabel>
              <Select
                value={filters.genero}
                label="Gènere"
                onChange={(e) => handleFilterChange('genero', e.target.value)}
              >
                <MenuItem value="">Tots</MenuItem>
                <MenuItem value="macho">Mascle</MenuItem>
                <MenuItem value="hembra">Femella</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Mida</InputLabel>
              <Select
                value={filters.tamaño}
                label="Mida"
                onChange={(e) => handleFilterChange('tamaño', e.target.value)}
              >
                <MenuItem value="">Totes</MenuItem>
                <MenuItem value="pequeño">Petit</MenuItem>
                <MenuItem value="mediano">Mitjà</MenuItem>
                <MenuItem value="grande">Gran</MenuItem>
                <MenuItem value="gigante">Gegant</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={clearFilters}
            >
              Netejar Filtres
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Llista de mascotes */}
      {mascotas.length === 0 ? (
        <Alert severity="info">
          No s'han trobat mascotes amb aquests filtres.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {mascotas.map((mascota) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={mascota.id}>
              <CardAnimal 
                itemData={[mascota]} 
                protectora={{
                  nombre: mascota.protectora_nombre || 'Protectora',
                  foto: null
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Total: {mascotas.length} mascotes
        </Typography>
      </Box>
    </Box>
  );
}
