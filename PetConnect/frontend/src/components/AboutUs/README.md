# PetCardExtended - Guía de Uso

## 📍 Ubicación

```
frontend/src/components/PetCardExtended/
├── PetCardExtended.jsx         # Componente principal
├── PetCardExtendedShowcase.jsx # Ejemplo de uso
└── index.js                    # Export
```

---

## 🚀 Instalación Rápida

### 1. Importar el componente

```jsx
import { PetCardExtended } from '../../components/PetCardExtended';
```

### 2. Usar en tu componente

```jsx
<PetCardExtended
  animal={petData}
  isFavorito={false}
  onToggleFavorito={handleFavorite}
  onViewMore={handleViewMore}
/>
```

---

## 📖 Props API

### `animal` (Object) - **REQUERIDO**

Objeto con la información de la mascota:

```jsx
{
  // Identificación
  id: number,
  nombre: string,
  especie: 'perro' | 'gato',
  
  // Características
  edad: number,
  genero: 'macho' | 'hembra',
  tamaño: string,
  color: string,
  raza_perro: string,      // Para perros
  raza_gato: string,       // Para gatos
  
  // Multimedia
  foto: string,            // URL de la imagen
  descripcion: string,     // Texto largo
  
  // Ubicación
  ubicacion: string,
  
  // Personalidad
  caracter: string,
  
  // Salud
  vacunado: boolean,
  esterilizado: boolean,
  desparasitado: boolean,
  con_microchip: boolean,
  
  // Necesidades especiales
  necesidades_especiales: boolean,
  descripcion_necesidades: string
}
```

### `isFavorito` (Boolean)
- Indica si la mascota está marcada como favorita
- Por defecto: `false`
- Afecta el ícono del corazón

```jsx
<PetCardExtended animal={pet} isFavorito={true} />
```

### `onToggleFavorito` (Function)
- Callback cuando se hace click en el botón de favorito
- Recibe el evento del click
- Opcional

```jsx
const handleFavorite = (event) => {
  console.log('Toggling favorite');
};

<PetCardExtended 
  animal={pet} 
  onToggleFavorito={handleFavorite}
/>
```

### `onViewMore` (Function)
- Callback cuando se hace click en "View more"
- Opcional

```jsx
const handleViewMore = (event) => {
  navigate(`/pet/${animal.id}`);
};

<PetCardExtended 
  animal={pet} 
  onViewMore={handleViewMore}
/>
```

### `sx` (Object)
- Props de MUI para estilización personalizada
- Se mergetea con los estilos del componente
- Opcional

```jsx
<PetCardExtended 
  animal={pet}
  sx={{ 
    maxWidth: 300,
    border: '2px solid red'
  }}
/>
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Grid responsive

```jsx
import { Box, Grid } from '@mui/material';
import { PetCardExtended } from './components/PetCardExtended';

export function PetsPage() {
  const [favorites, setFavorites] = useState([]);
  const [animals, setAnimals] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {animals.map(animal => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
            <PetCardExtended
              animal={animal}
              isFavorito={favorites.includes(animal.id)}
              onToggleFavorito={() => toggleFavorite(animal.id)}
              onViewMore={() => navigate(`/pet/${animal.id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

### Ejemplo 2: Con carga desde API

```jsx
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { PetCardExtended } from './components/PetCardExtended';

export function PetsFromAPI() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('/api/mascotas')
      .then(res => res.json())
      .then(data => {
        setAnimals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {animals.map(animal => (
        <PetCardExtended
          key={animal.id}
          animal={animal}
          isFavorito={favorites.includes(animal.id)}
          onToggleFavorito={() => toggleFavorite(animal.id)}
          onViewMore={() => handleViewMore(animal)}
        />
      ))}
    </Box>
  );
}
```

### Ejemplo 3: Con estado local de favoritos

```jsx
import { useState, useEffect } from 'react';
import { PetCardExtended } from './components/PetCardExtended';

export function SinglePetView() {
  const [animal, setAnimal] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Cargar mascota
    fetch(`/api/mascotas/${id}`)
      .then(res => res.json())
      .then(data => setAnimal(data));

    // Cargar favorito del localStorage
    const saved = localStorage.getItem(`favorite_${id}`);
    setIsFavorite(saved === 'true');
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    localStorage.setItem(`favorite_${id}`, !isFavorite);
  };

  if (!animal) return null;

  return (
    <PetCardExtended
      animal={animal}
      isFavorito={isFavorite}
      onToggleFavorito={handleToggleFavorite}
      onViewMore={() => navigate(`/pet/${animal.id}`)}
      sx={{ maxWidth: 400, mx: 'auto' }}
    />
  );
}
```

---

## 🎨 Personalización de Estilos

### Cambiar ancho máximo

```jsx
<PetCardExtended 
  animal={pet}
  sx={{ maxWidth: 250 }}
/>
```

### Agregar sombra personalizada

```jsx
<PetCardExtended 
  animal={pet}
  sx={{ 
    boxShadow: (theme) => theme.shadows[8],
    '&:hover': {
      boxShadow: (theme) => theme.shadows[16]
    }
  }}
/>
```

### Cambiar radio de bordes

```jsx
<PetCardExtended 
  animal={pet}
  sx={{ borderRadius: 1 }}
/>
```

### Agregar borde

```jsx
<PetCardExtended 
  animal={pet}
  sx={{ 
    border: '2px solid',
    borderColor: (theme) => theme.palette.primary.main
  }}
/>
```

---

## 🌙 Dark Mode Automático

El componente **detecta automáticamente** el modo oscuro mediante el hook `useColors()`:

```jsx
// No necesitas pasar el isDarkMode, se detecta automáticamente
<PetCardExtended animal={pet} />

// Las sombras, colores y transiciones se adaptan solo
```

---

## 🌍 Traducciones Automáticas

Las etiquetas se traducen automáticamente según el idioma (catalán, español, inglés):

```jsx
// Estos textos se traducen automáticamente:
// "perro/gato" → "dog/cat" o "perro/gato"
// "año/años" → "year/years" o "any/anys"
// "Mostrar más" → "Show more" o "Mostrar més"
// etc.
```

---

## 🔧 Troubleshooting

### La foto no se muestra

**Solución:** Verifica que la URL sea válida:

```jsx
// Correcto
{ foto: 'https://example.com/image.jpg' }

// Si no hay foto, el componente usa imagen por defecto
{ foto: null }
```

### Las traducciones no funcionan

**Solución:** Verifica que `useTranslation()` esté en el contexto:

```jsx
// En main.jsx debe estar el i18n importado
import './i18n';

// Y el app debe estar dentro del provider de i18n
```

### Los colores no cambian en dark mode

**Solución:** Verifica que estés dentro del `DarkModeProvider`:

```jsx
// En App.jsx o main.jsx:
<DarkModeProvider>
  <YourApp />
</DarkModeProvider>
```

---

## ✅ Checklist de Integración

- [ ] Importado en el componente padre
- [ ] Pasado el objeto `animal` con datos correctos
- [ ] Manejado el callback `onToggleFavorito`
- [ ] Manejado el callback `onViewMore`
- [ ] Verificado que está dentro de `DarkModeProvider`
- [ ] Verificado que está dentro de i18next provider
- [ ] Probado en light mode y dark mode
- [ ] Probado en mobile y desktop
- [ ] Verificado que las imágenes se cargan

---

## 📱 Responsive Behavior

El componente funciona bien en todos los tamaños:

```jsx
// Recomendado: usar dentro de Grid de MUI
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <PetCardExtended animal={pet} />
  </Grid>
</Grid>
```

---

## 🎯 Eventos Principales

| Evento | Trigger | Data |
|--------|---------|------|
| `onToggleFavorito` | Click en icono corazón | Click event |
| `onViewMore` | Click en botón "Ver más" | Click event |
| `handleExpandClick` | Click en icono expandir | Internal |

---

## 📊 Estado Interno

El componente mantiene su propio estado para:
- **`expanded`** - Controla si la sección colapsable está abierta

No necesitas manejo estado externo para esto.

---

## 🚀 Rendimiento

- ✅ Lightweight (~3KB minificado)
- ✅ Lazy loads en Grid responsivo
- ✅ Sin re-renders innecesarios (memoization implícita)
- ✅ Transiciones CSS (no JS)

---

## 📚 Referencias

- [Material-UI Docs](https://mui.com/)
- [i18next Docs](https://www.i18next.com/)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Última actualización:** Diciembre 2025
