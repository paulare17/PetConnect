# 🚀 Quick Start - PetCardExtended

## 5 Minutos para Empezar

### 1️⃣ Copiar datos de mascota

```jsx
const animal = {
  id: 1,
  nombre: 'Max',
  especie: 'perro',  // o 'gato'
  raza_perro: 'Golden Retriever',
  edad: 3,
  genero: 'macho',  // o 'hembra'
  tamaño: 'Grande',
  color: 'Dorado',
  foto: 'https://example.com/max.jpg',
  descripcion: 'Max es un perro cariñoso...',
  ubicacion: 'Barcelona',
  caracter: 'Sociable',
  vacunado: true,
  esterilizado: true,
  desparasitado: true,
  con_microchip: true,
  necesidades_especiales: false,
};
```

### 2️⃣ Importar en tu componente

```jsx
import { PetCardExtended } from '../../components/PetCardExtended';
```

### 3️⃣ Renderizar

```jsx
<PetCardExtended
  animal={animal}
  isFavorito={false}
  onToggleFavorito={() => console.log('Favorito')}
  onViewMore={() => console.log('Ver más')}
/>
```

### 4️⃣ En un Grid (Recomendado)

```jsx
import { Grid } from '@mui/material';

<Grid container spacing={3}>
  {pets.map(pet => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={pet.id}>
      <PetCardExtended animal={pet} {...props} />
    </Grid>
  ))}
</Grid>
```

### 5️⃣ Listo ✅

---

## Props Principales

```jsx
<PetCardExtended
  animal={petObject}              // REQUERIDO
  isFavorito={boolean}            // false por defecto
  onToggleFavorito={function}     // Click en ❤️
  onViewMore={function}           // Click en botón
  sx={muiSxObject}               // Estilos adicionales
/>
```

---

## Traducido Automáticamente

El componente se traduce solo según idioma:
- 🇨🇦 Catalán
- 🇪🇸 Español  
- 🇬🇧 Inglés

No necesitas hacer nada.

---

## Dark Mode Automático

El componente detecta si está en modo oscuro y se adapta automáticamente.

---

## Archivos Creados

```
✅ PetCardExtended.jsx          (Componente principal - 442 líneas)
✅ PetCardExtendedShowcase.jsx  (Ejemplo completo)
✅ index.js                      (Export)
✅ README.md                     (Documentación detallada)
```

---

## Documentación Completa

- **`FRONTEND_ANALYSIS.md`** - Análisis del frontend
- **`PetCardExtended/README.md`** - Guía completa
- **`PETCARDEXTENDED_EXAMPLES.js`** - 10 ejemplos reales
- **`CARDPET_VS_PETCARDEXTENDED.md`** - Comparativa

---

## Errores Comunes

### ❌ "Cannot find module"
```
Verifica la ruta de importación:
import { PetCardExtended } from '../../components/PetCardExtended';
```

### ❌ Colores no cambian en dark mode
```
Verifica que la app esté dentro de <DarkModeProvider>
en main.jsx o App.jsx
```

### ❌ Traducciones en inglés
```
Verifica que i18n esté importado en main.jsx:
import './i18n';
```

### ❌ Foto no se muestra
```
Verifica que la URL sea válida:
{ foto: 'https://example.com/image.jpg' }
```

---

## Ejemplo Mínimo Funcional

```jsx
import React from 'react';
import { PetCardExtended } from './components/PetCardExtended';

export function MyPage() {
  const pet = {
    nombre: 'Luna',
    especie: 'gato',
    edad: 2,
    genero: 'hembra',
    raza_gato: 'Siamés',
    foto: null,
    descripcion: 'Luna es una gatita juguetona',
    tamaño: 'Pequeño',
    color: 'Gris',
    ubicacion: 'Madrid',
    caracter: 'Juguetona',
    vacunado: true,
    esterilizado: false,
    desparasitado: true,
    con_microchip: false,
  };

  return (
    <PetCardExtended
      animal={pet}
      onViewMore={() => alert('Ver perfil de ' + pet.nombre)}
    />
  );
}
```

---

## Próximo Paso

Mira `PetCardExtendedShowcase.jsx` para ver un ejemplo completo con grid, favoritos y manejo de datos.

---

## Soporte

Si algo no funciona:
1. Revisa la consola de errores
2. Verifica las importaciones
3. Consulta `PetCardExtended/README.md`
4. Mira los ejemplos en `PETCARDEXTENDED_EXAMPLES.js`

---

**¡Listo! Ahora tienes una tarjeta de mascota profesional con toda la información.** ✨

Tiempo estimado de integración: **5-10 minutos**
