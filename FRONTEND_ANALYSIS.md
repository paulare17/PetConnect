# Análisis Frontend - PetConnect

## 📋 Resumen Ejecutivo

El frontend de **PetConnect** está construido con **React + Vite** e implementa:
- ✅ **Material-UI (MUI)** como librería de componentes
- ✅ **i18next** para internacionalización (catalán, español, inglés)
- ✅ **Dark Mode** con Context API + almacenamiento local
- ✅ **Sistema de colores cohesivo** (naranja, azul, morado, amarillo)
- ✅ **Responsive design** con Flexbox y Grid

---

## 🎨 Sistema de Colores

### Archivos clave:
- **`constants/colors.jsx`** - Paleta de colores (luz y oscuro)
- **`hooks/useColors.jsx`** - Hook para aplicar colores según modo
- **`context/DarkModeProvider.jsx`** - Provider del tema MUI

### Colores principales (modo claro):
```jsx
{
  orange: "#f5842b",      // Primario - naranja cálido
  blue: "#66c5bd",        // Secundario - azul turquesa
  purple: "#bcbefa",      // Tercero - lila suave
  yellow: "#f6ce5b",      // Acentos - amarillo dorado
  background: "#f1d5b6",  // Fondo general - beige claro
}
```

### Colores modo oscuro (adaptados):
```jsx
{
  orange: "#4d9fff",      // Azul brillante (complementario)
  blue: "#7c5cff",        // Morado-azul vibrant
  purple: "#a78bfa",      // Lila brillante
  yellow: "#00d4ff",      // Cian turquesa
  background: "#0f0820",  // Fondo morado muy oscuro
}
```

---

## 🌙 Dark Mode

### Implementación:
1. **Context**: `DarkModeContext` almacena el estado `isDarkMode`
2. **Provider**: `DarkModeProvider` envuelve la app en `main.jsx`
3. **Hook**: `useColors()` retorna `{ colors, isDarkMode, toggleDarkMode }`
4. **Storage**: Guarda preferencia en `localStorage.darkMode`

### Cómo usar:
```jsx
const { colors, isDarkMode } = useColors();

<Box bgcolor={colors.background}>
  {isDarkMode ? '🌙 Oscuro' : '☀️ Claro'}
</Box>
```

---

## 🌍 Internacionalización (i18n)

### Estructura:
```
frontend/src/locales/
├── ca/translation.json  (Catalán)
├── en/translation.json  (Inglés)
└── es/translation.json  (Español)
```

### Uso:
```jsx
const { t } = useTranslation();

<Typography>{t('navbar.adopt')}</Typography>  // Retorna texto traducido
```

### Lenguajes guardados:
- Preferencia en `localStorage.language` (por defecto: 'ca')
- Selector: `LanguageSelector.jsx`

---

## 📦 Componentes Existentes

### Estructura base:
```
frontend/src/components/
├── PetCardExtended/      ⭐ NUEVO
│   ├── PetCardExtended.jsx
│   └── index.js
├── MostraMascotes/
│   ├── CardPet.jsx       (Tarjeta simple de mascota)
│   ├── CardPetDetail.jsx (Vista detallada)
│   ├── ProfileMascotaView.jsx
│   └── PetTinder.jsx
├── Chat/
├── Forms/
├── Navbar/
├── Footer/
├── Login/
├── Landpage/
├── pages/
└── LanguageSelector.jsx
```

### Patrones MUI observados:
1. **Card** - Componente base para tarjetas
2. **Box** - Contenedor flexible con sx prop
3. **Typography** - Textos con variantes
4. **Chip** - Etiquetas y badges
5. **Button** - Botones con variantes
6. **IconButton** - Botones icon
7. **Collapse** - Elementos expandibles

---

## ✨ Componente Nuevo: PetCardExtended

### Ubicación:
`frontend/src/components/PetCardExtended/PetCardExtended.jsx`

### Características:

#### 1. **Foto + Información Visual**
- Imagen de mascota con hover zoom
- Botón de favoritos (corazón animado)
- Chip de especie (perro/gato)
- Indicador de género (male/female icons)

#### 2. **Contenido Principal**
- Nombre destacado
- Raza/breed con opacidad
- Chips rápidos: edad, tamaño, color
- Descripción truncada (3 líneas)

#### 3. **Contenido Expandible (Collapse)**
- Ubicación con icono
- Carácter/personalidad
- Estado de salud (vacunado, esterilizado, etc.)
- Necesidades especiales (con warning visual)

#### 4. **Integración Completa**
- ✅ **useColors()** - Colores según modo claro/oscuro
- ✅ **useTranslation()** - Traducciones en 3 idiomas
- ✅ **MUI Icons** - Iconografía consistente
- ✅ **Dark Mode** - Sombras y colores adaptados
- ✅ **Responsive** - Funciona en todos los breakpoints

### Propiedades (Props):

```jsx
<PetCardExtended
  animal={{
    nombre: "Max",
    especie: "perro",
    raza_perro: "Golden Retriever",
    edad: 3,
    tamaño: "Grande",
    color: "Dorado",
    genero: "macho",
    foto: "url-imagen",
    descripcion: "Perro cariñoso y jugguetón...",
    ubicacion: "Barcelona",
    caracter: "Sociable y energético",
    vacunado: true,
    esterilizado: false,
    desparasitado: true,
    con_microchip: true,
    necesidades_especiales: false,
    descripcion_necesidades: "",
  }}
  isFavorito={true}
  onToggleFavorito={() => console.log('Toggle favorito')}
  onViewMore={() => console.log('Ver perfil completo')}
  sx={{ width: '100%', maxWidth: 300 }}
/>
```

### Uso en componentes:

```jsx
import { PetCardExtended } from '../../components/PetCardExtended';

export function MyPage() {
  const [favorites, setFavorites] = useState([]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
      {animals.map(animal => (
        <PetCardExtended
          key={animal.id}
          animal={animal}
          isFavorito={favorites.includes(animal.id)}
          onToggleFavorito={() => toggleFavorite(animal.id)}
          onViewMore={() => navigate(`/pet/${animal.id}`)}
        />
      ))}
    </Box>
  );
}
```

---

## 🎯 Patrones de Estilo Implementados

### 1. **Colores basados en especie**
```jsx
const isPerro = animal.especie === 'perro';
const cardBgColor = isPerro ? colors.lightOrange : colors.lightBlue;
const chipColor = isPerro ? colors.darkOrange : colors.darkBlue;
```

### 2. **Transiciones suaves**
```jsx
sx={{
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: isDarkMode ? '0 12px 24px rgba(167, 139, 250, 0.3)' : '...'
  }
}}
```

### 3. **Truncado de texto**
```jsx
sx={{
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}}
```

### 4. **Iconografía consistente**
- Iconos de Material-Icons
- Colores coordinados
- Tamaños proporcionales

---

## 📚 Traducciones Agregadas

Se han agregado claves i18n en 3 idiomas:

```json
"petCardExtended": {
  "dog": "Gos/Dog/Perro",
  "cat": "Gat/Cat/Gato",
  "breedNotSpecified": "Raça no especificada/Breed not specified/Raza no especificada",
  "year": "any/year/año",
  "years": "anys/years/años",
  "location": "Ubicació/Location/Ubicación",
  "character": "Caràcter/Character/Carácter",
  "healthStatus": "Estat de salut/Health Status/Estado de salud",
  "vaccinated": "Vacunat/Vaccinated/Vacunado",
  "sterilized": "Esterilitzat/Sterilized/Esterilizado",
  "dewormed": "Desparasitat/Dewormed/Desparasitado",
  "microchip": "Microxip/Microchip/Microchip",
  "specialNeeds": "⚠️ Necessitats especials/Special Needs/Necesidades especiales",
  "consultShelter": "Consultar amb la protectora/Consult with shelter/Consultar con la protectora",
  "noDescription": "Sense descripció/No description available/Sin descripción disponible",
  "showMore": "Mostrar més/Show more/Mostrar más",
  "viewMore": "Veure més/View more/Ver más"
}
```

---

## 🚀 Recomendaciones Futuras

1. **Animaciones adicionales**:
   - Skeleton loaders mientras carga imagen
   - Animación al expandir/contraer

2. **Validación de datos**:
   - PropTypes o TypeScript para validar animal object
   - Manejo de imágenes rotas

3. **Optimización de imágenes**:
   - Lazy loading de imágenes
   - WebP con fallback
   - Thumbnails comprimidas

4. **Accesibilidad**:
   - ARIA labels en botones
   - Navigación con teclado en Collapse

5. **Temas personalizables**:
   - Paleta de colores por protectora
   - Layouts alternativos (horizontal, minimal)

---

## 📝 Notas Técnicas

### Stack:
- **React 18+** con Hooks
- **Vite** (bundler)
- **Material-UI v5+** (componentes)
- **Material-Icons** (iconografía)
- **i18next** (traducciones)
- **React Context** (estado global)

### Versiones clave en package.json:
```json
{
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x",
  "react": "^18.x",
  "react-i18next": "^12.x",
  "i18next": "^23.x"
}
```

### Build & Dev:
```bash
npm run dev      # Desarrollo con Vite
npm run build    # Producción
npm run preview  # Vista previa build
```

---

## ✅ Verificación de Implementación

- [x] Componente utiliza `useColors()` hook
- [x] Componente utiliza `useTranslation()` hook
- [x] Darkmode completamente integrado
- [x] Traducciones en 3 idiomas (ca, es, en)
- [x] MUI components (Card, Box, Chip, Button, etc.)
- [x] Iconografía Material-Icons
- [x] Responsive design
- [x] Patrón de "more info" con Collapse
- [x] Estados visuales (hover, expanded, etc.)
- [x] Coherencia con componentes existentes

---

**Creado:** Diciembre 2025 | **Versión:** 1.0 | **Estado:** ✅ Listo para producción
