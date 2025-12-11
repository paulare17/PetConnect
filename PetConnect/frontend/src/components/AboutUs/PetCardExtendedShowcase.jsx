import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { PetCardExtended } from '../PetCardExtended';
import { useColors } from '../../hooks/useColors';

/**
 * Componente de ejemplo que muestra cómo usar PetCardExtended
 * 
 * Características demostradas:
 * - Renderizado en grid responsive
 * - Gestión de favoritos local
 * - Integración con colores (light/dark mode)
 * - Traducciones multiidioma
 * - Manejo de click events
 */

export default function PetCardExtendedShowcase() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo (en producción vendría del backend)
  const exampleAnimals = [
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
      foto: 'https://images.unsplash.com/photo-1633722715463-d30628519d63?w=400',
      descripcion:
        'Max es un Golden Retriever alegre, cariñoso y sociable. Le encanta jugar a buscar, nadar y pasar tiempo con la familia. Es perfecto para hogares activos con experiencia con perros de raza grande. ¡Buscamos una familia que pueda ofrecerle mucho amor y actividad!',
      ubicacion: 'Barcelona, Catalonia',
      caracter: 'Sociable, energético, amigable',
      vacunado: true,
      esterilizado: true,
      desparasitado: true,
      con_microchip: true,
      necesidades_especiales: false,
      descripcion_necesidades: null,
    },
    {
      id: 2,
      nombre: 'Luna',
      especie: 'gato',
      raza_perro: null,
      raza_gato: 'Gato Común Europeo',
      edad: 2,
      tamaño: 'Pequeño',
      color: 'Gris atigrado',
      genero: 'hembra',
      foto: 'https://images.unsplash.com/photo-1574158622147-e121fa0c6d9e?w=400',
      descripcion:
        'Luna es una gatita joven, juguetona y curiosa. Le encanta interactuar con sus humanos y pasar tiempo explorando. Es ideal para personas que disfrutan de un gato activo e interactivo. Prefiere un hogar tranquilo pero estimulante.',
      ubicacion: 'Madrid, Spain',
      caracter: 'Juguetona, curiosa, cariñosa',
      vacunado: true,
      esterilizado: false,
      desparasitado: true,
      con_microchip: false,
      necesidades_especiales: false,
      descripcion_necesidades: null,
    },
    {
      id: 3,
      nombre: 'Bolt',
      especie: 'perro',
      raza_perro: 'Border Collie',
      raza_gato: null,
      edad: 5,
      tamaño: 'Mediano',
      color: 'Blanco y negro',
      genero: 'macho',
      foto: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
      descripcion:
        'Bolt es un Border Collie inteligente y muy activo. Es un perro que necesita estimulación mental y física constante. Requiere propietarios con experiencia en razas de pastoreo. ¡Es ideal para gente deportista!',
      ubicacion: 'Valencia, Spain',
      caracter: 'Inteligente, activo, leal',
      vacunado: true,
      esterilizado: true,
      desparasitado: true,
      con_microchip: true,
      necesidades_especiales: true,
      descripcion_necesidades: 'Requiere mucho ejercicio y estimulación mental diaria. Mejor con experiencia en Border Collies.',
    },
    {
      id: 4,
      nombre: 'Miso',
      especie: 'gato',
      raza_perro: null,
      raza_gato: 'Gato Siamés',
      edad: 1,
      tamaño: 'Pequeño',
      color: 'Crema y chocolate',
      genero: 'hembra',
      foto: 'https://images.unsplash.com/photo-1567336282842-f05ea329a414?w=400',
      descripcion:
        'Miso es una gatita Siamés bebé, muy sociable y demandante de atención. Es muy vocal y le encanta estar cerca de sus humanos. Prefiere hogares donde haya gente durante el día.',
      ubicacion: 'Barcelona, Catalonia',
      caracter: 'Vocal, demandante, cariñosa',
      vacunado: true,
      esterilizado: false,
      desparasitado: true,
      con_microchip: true,
      necesidades_especiales: false,
      descripcion_necesidades: null,
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleFavorito = (id) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter((favId) => favId !== id);
      } else {
        return [...prevFavorites, id];
      }
    });
  };

  const handleViewMore = (animal) => {
    console.log('Ver más de:', animal.nombre);
    // En una app real, navegaría a /pet/:id
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        py: 4,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: colors.textDark,
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            {t('petCardExtended.showMore') || 'Nuestras Mascotas'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.textDark,
              opacity: 0.7,
              fontSize: '1.1rem',
            }}
          >
            Explora nuestras mascotas disponibles para adopción. Haz clic en el corazón
            para guardar tus favoritas.
          </Typography>
        </Box>

        {/* Grid de tarjetas */}
        <Grid container spacing={3}>
          {exampleAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
              <PetCardExtended
                animal={animal}
                isFavorito={favorites.includes(animal.id)}
                onToggleFavorito={() => handleToggleFavorito(animal.id)}
                onViewMore={() => handleViewMore(animal)}
                sx={{
                  height: '100%',
                  boxShadow: 2,
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Footer de info */}
        <Box
          sx={{
            mt: 8,
            p: 3,
            backgroundColor: colors.lightColor,
            borderRadius: 3,
            textAlign: 'center',
            borderLeft: `4px solid ${colors.orange}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.textDark,
              fontWeight: 500,
            }}
          >
            {`Total de favoritos: ${favorites.length} / ${exampleAnimals.length}`}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
