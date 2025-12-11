# CardPet vs PetCardExtended - Guía de Selección

## 📊 Comparativa Visual

### CardPet (Existente)
```
┌──────────────────────┐
│  [🖼️ Imagen]  [❤️]  │  ← Compacto
│                      │
│  Max          [♂️]   │
│  Golden R.           │  ← Menos información
│                      │
│  Max es cariñoso...  │  ← 4 líneas de texto
│                      │
└──────────────────────┘
```

### PetCardExtended (Nuevo)
```
┌──────────────────────┐
│  [🖼️ Imagen]  [❤️]  │
│    [🐕 DOG]          │  ← Más visual
├──────────────────────┤
│  Max          [♂️]   │
│  Golden R.           │
│  [3y] [Grande] [Or.] │  ← Más chips de info
│                      │
│  Max es cariñoso...  │  ← 3 líneas truncadas
│                      │
├──────────────────────┤  ← Contenido expandible
│  [▼] [Ver más]      │
└──────────────────────┘

EXPANDIDO:
├──────────────────────┤
│ 📍 Barcelona         │
│ 😊 Sociable...       │  ← Información adicional
│ ✅ Vacunado ✅ Ester.│
│ ⚠️ Necesidades...    │
└──────────────────────┘
```

---

## 🎯 Casos de Uso

### Usar **CardPet** cuando:

✅ Necesites una tarjeta **compacta y minimalista**
- Grid muy apretada (4+ columnas)
- Espacio limitado
- Solo información básica (nombre, raza, descripción corta)

Ejemplo:
```jsx
// Home page con muchas mascotas en pequeño
<Grid container spacing={1}>
  {animals.map(a => <CardPet animal={a} />)}
</Grid>
```

### Usar **PetCardExtended** cuando:

✅ Necesites una tarjeta **rica en información y detalles**
- Grid amplia (2-3 columnas)
- Información detallada
- Ubicación, carácter, salud
- Necesidades especiales

Ejemplo:
```jsx
// Página de adopción con detalles
<Grid container spacing={3}>
  {animals.map(a => <PetCardExtended animal={a} />)}
</Grid>
```

---

## 📋 Comparativa de Características

| Característica | CardPet | PetCardExtended |
|---|---|---|
| **Tamaño** | Compacto | Grande |
| **Foto** | Sí | Sí (+ hover zoom) |
| **Favorito** | ✅ Sí | ✅ Sí |
| **Especie Chip** | Básico | Destacado |
| **Raza** | Texto simple | Muted style |
| **Edad** | En descripción | Chip separado |
| **Tamaño Mascota** | ❌ No | ✅ Sí (chip) |
| **Color Mascota** | ❌ No | ✅ Sí (chip) |
| **Género Icon** | ✅ Sí | ✅ Sí |
| **Ubicación** | ❌ No | ✅ Sí (expandible) |
| **Carácter** | ❌ No | ✅ Sí (expandible) |
| **Salud Info** | Parcial | ✅ Completa |
| **Necesidades** | ❌ No | ✅ Sí (con alerta) |
| **Expandible** | ❌ No | ✅ Sí |
| **Botón Action** | Implícito | Explícito |
| **Dark Mode** | ✅ Manual | ✅ Automático |
| **Traducciones** | Límitado | ✅ Completo |

---

## 🎨 Diferencias Visuales

### Colores según Especie

**CardPet:**
```jsx
// Usa colores de fondo simple
cardColor = isPerro ? colors.lightOrange : colors.lightBlue;
```

**PetCardExtended:**
```jsx
// Colores coordinados para toda la tarjeta
cardBgColor = isPerro ? colors.lightOrange : colors.lightBlue;
chipColor = isPerro ? colors.darkOrange : colors.darkBlue;
accentColor = isPerro ? colors.orange : colors.blue;
```

### Transiciones

**CardPet:**
```jsx
'&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }
```

**PetCardExtended:**
```jsx
'&:hover': { 
  transform: 'translateY(-12px)',
  boxShadow: isDarkMode ? '0 12px 24px rgba(167, 139, 250, 0.3)' : '...'
}
```

---

## 💡 Ejemplos de Integración Recomendada

### Escenario 1: Home Page (Mezcla de ambos)

```jsx
// Sección 1: Destacados (PetCardExtended)
<Section title="Destacados">
  <Grid container spacing={3}>
    {featuredPets.slice(0, 3).map(pet => (
      <Grid item xs={12} sm={6} md={4} key={pet.id}>
        <PetCardExtended animal={pet} {...props} />
      </Grid>
    ))}
  </Grid>
</Section>

// Sección 2: Todas las mascotas (CardPet)
<Section title="Todas las mascotas">
  <Grid container spacing={2}>
    {allPets.map(pet => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={pet.id}>
        <CardPet animal={pet} {...props} />
      </Grid>
    ))}
  </Grid>
</Section>
```

### Escenario 2: Página de Búsqueda (PetCardExtended)

```jsx
// Resultados de búsqueda - muestra detalles
<Grid container spacing={3}>
  {searchResults.map(pet => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={pet.id}>
      <PetCardExtended 
        animal={pet}
        isFavorito={favorites.includes(pet.id)}
        onToggleFavorito={handleFav}
        onViewMore={handleView}
      />
    </Grid>
  ))}
</Grid>
```

### Escenario 3: Carrusel de Adopción (CardPet)

```jsx
// Solo muestra lo esencial en carrusel
<Carousel>
  {pets.map(pet => (
    <Box key={pet.id} sx={{ maxWidth: 250 }}>
      <CardPet 
        animal={pet}
        onToggleFavorito={handleFav}
      />
    </Box>
  ))}
</Carousel>
```

---

## 📱 Comportamiento Responsive

### CardPet:
```jsx
// Funciona bien en cualquier tamaño
<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
  <CardPet animal={pet} />
</Grid>
```

### PetCardExtended:
```jsx
// Recomendado: máximo 3 columnas en desktop
<Grid item xs={12} sm={6} md={4} lg={3}>
  <PetCardExtended animal={pet} />
</Grid>
```

---

## 🚀 Migración de CardPet a PetCardExtended

Si tienes código existente con `CardPet`, es fácil migrar:

```jsx
// ANTES: CardPet
<CardPet 
  animal={animal}
  isFavorito={isFav}
  onToggleFavorito={handleFav}
/>

// DESPUÉS: PetCardExtended (mismas props!)
<PetCardExtended 
  animal={animal}
  isFavorito={isFav}
  onToggleFavorito={handleFav}
  onViewMore={handleViewMore}  // Nueva prop, opcional
/>
```

**Diferencias:**
- Mismas props básicas ✅
- `onViewMore` es nuevo pero opcional
- Visualización diferente (expandible)
- Más información visible

---

## 🎯 Decision Tree (Árbol de Decisión)

```
¿Necesitas mostrar muchas mascotas en grid apretado?
├─ SÍ → ¿Espacio muy limitado (4+ columnas)?
│       ├─ SÍ → CardPet ✅
│       └─ NO → PetCardExtended ✅
└─ NO → ¿Necesitas información detallada?
         ├─ SÍ → PetCardExtended ✅
         └─ NO → CardPet ✅

¿Necesitas Ubicación + Carácter + Salud?
├─ SÍ → PetCardExtended ✅
└─ NO → CardPet ✅

¿La tarjeta será clicable para ver detalles?
├─ SÍ → PetCardExtended (tiene botón explícito) ✅
└─ NO → CardPet o PetCardExtended ✅
```

---

## ⚡ Rendimiento

### CardPet:
- Más ligero (~1.5KB)
- Sin componentes complejos
- Ideal para listas largas

### PetCardExtended:
- Un poco más pesado (~3KB)
- Collapse component (solo renderiza cuando expande)
- Ideal para listas medianas

**Recomendación:**
- 100+ mascotas → CardPet
- 10-50 mascotas → PetCardExtended
- Depende también de ancho de pantalla

---

## 🎨 Customización

### CardPet - Limitada:
```jsx
<CardPet 
  animal={pet}
  sx={{ maxWidth: 300 }} // Solo sx
/>
```

### PetCardExtended - Amplia:
```jsx
<PetCardExtended 
  animal={pet}
  isFavorito={true}
  onToggleFavorito={fn}
  onViewMore={fn}
  sx={{ maxWidth: 300, border: '...' }} // Más props de control
/>
```

---

## 📚 Referencias

- **CardPet**: `components/MostraMascotes/CardPet.jsx`
- **PetCardExtended**: `components/PetCardExtended/PetCardExtended.jsx`
- **Ejemplo combinado**: `PetCardExtendedShowcase.jsx`

---

## ✅ Resumen

| Aspecto | CardPet | PetCardExtended |
|--------|---------|-----------------|
| **Usa si...** | Espacio limitado | Información detallada |
| **No uses si...** | Necesitas ubicación | Espacio muy ajustado |
| **Rendimiento** | Mejor | Bueno |
| **Visualización** | Simple | Rica |
| **Mejor para** | Listas largas | Catálogos |

**Regla de oro:** 
- Si cabe en 2-3 columnas → **PetCardExtended**
- Si cabe en 4+ columnas → **CardPet**

---

**Actualizado:** Diciembre 2025
