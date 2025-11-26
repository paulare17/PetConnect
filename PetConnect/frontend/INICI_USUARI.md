# 🐾 Pàgina Home per Usuaris - Galeria d'Animals

## 📋 Descripció

Aquesta pàgina mostra una galeria d'animals disponibles per adopció amb opcions de filtre per espècie, sexe i mida. Està dissenyada específicament per a usuaris (adoptants) que vulguin buscar el seu company perfecte.

## 🎨 Característiques

- ✅ **Galeria responsive** amb targetes d'animals
- ✅ **Filtres dinàmics**: per espècie (gos/gat), sexe (mascle/femella) i mida
- ✅ **Sistema de favorits**: marca els animals que més t'agradin
- ✅ **Estètica consistent**: utilitza els colors del projecte (taronja i blau)
- ✅ **Material-UI**: components moderns i accessibles
- ✅ **Integració amb API**: connexió directa amb el backend Django

## 🚀 Com accedir

### Ruta
```
/inici-usuari
```

### Requisits
- Estar autenticat com a **usuari** (no protectora)
- El backend ha d'estar executant-se al port 8000
- El frontend ha d'estar executant-se (normalment Vite al port 5173)

## 📊 Dades que es mostren

Per cada animal es mostra:
- **Nom**
- **Foto** (o placeholder si no té)
- **Espècie** (Gos o Gat)
- **Raça** (raza_perro o raza_gato segons l'espècie)
- **Edat** (en anys)
- **Sexe** (Mascle o Femella)
- **Mida** (Petit, Mitjà, Gran, Gegant)
- **Pes** (si està disponible)
- **Estat**: només es mostren animals **NO adoptats** i **NO ocults**

## 🔍 Filtres disponibles

### Espècie
- Tots
- Gos (`perro`)
- Gat (`gato`)

### Sexe
- Tots
- Mascle (`macho`)
- Femella (`hembra`)

### Mida
- Tots
- Petit (`pequeño`)
- Mitjà (`mediano`)
- Gran (`grande`)
- Gegant (`gigante`)

## 🎨 Estètica

### Colors utilitzats
- **Taronja** (`#f5842b`): color principal, accents
- **Taronja fosc** (`#fc6d00ff`): hover i emfatitzar
- **Fons taronja** (`#f1d5b6`): fons de targetes de gossos
- **Blau** (`#66c5bd`): color secundari
- **Blau fosc** (`#29afa4ff`): hover blau
- **Fons blau** (`#e0f2f1`): fons de targetes de gats
- **Groc** (`#f6ce5b`): accent adicional
- **Lila** (`#bcbefa`): elements decoratius

### Components MUI utilitzats
- `Container`, `Box`, `Grid`
- `Card`, `CardMedia`, `CardContent`, `CardActions`
- `Typography`, `Button`, `IconButton`
- `FormControl`, `InputLabel`, `Select`, `MenuItem`
- `Chip`, `Paper`
- `CircularProgress`, `Alert`

## 🔌 Integració amb API

### Endpoint
```
GET /api/mascota/
```

### Query parameters
- `especie`: filtra per espècie
- `genero`: filtra per sexe
- `tamaño`: filtra per mida

### Exemple de crida
```javascript
api.get('/mascota/?especie=perro&genero=macho&tamaño=mediano')
```

## 📱 Responsive Design

- **Mobile (xs)**: 1 targeta per fila
- **Tablet (sm)**: 2 targetes per fila
- **Desktop (md)**: 3 targetes per fila
- **Large Desktop (lg)**: 4 targetes per fila

## 🐕 Animals de test

A la base de dades hi ha 2 animals de prova:
- **animal1**
- **animal2**

Aquests haurien d'aparèixer a la galeria si no estan marcats com adoptats o ocults.

## 🚧 Funcionalitats futures

- [ ] Pàgina de detall de cada animal
- [ ] Sistema de favorits persistent (guardat al backend)
- [ ] Més filtres: edat, caràcter, convivència
- [ ] Ordenació per diferents criteris
- [ ] Paginació per a grans volums d'animals
- [ ] Compartir animals a xarxes socials
- [ ] Sol·licitud d'adopció directament des de la targeta

## 🛠️ Arxius relacionats

- **Component**: `frontend/src/components/Inici/IniciUsuari.jsx`
- **Ruta**: Definida a `frontend/src/App.jsx`
- **API Backend**: `mascotas/views.py` (MascotaViewSet)
- **Model**: `mascotas/models.py` (Mascota)
- **Colors**: `frontend/src/constants/colors.jsx`

## 🐛 Troubleshooting

### No es carreguen els animals
1. Verifica que el backend està executant-se
2. Comprova que hi ha animals a la base de dades no adoptats ni ocults
3. Revisa la consola del navegador per errors d'API
4. Verifica el token d'autenticació al localStorage

### Els filtres no funcionen
1. Comprova que els valors dels filtres coincideixen amb el backend
2. Revisa la consola del navegador
3. Verifica que l'API accepta els query parameters

### Error d'autenticació
1. Assegura't d'estar loguejat com a usuari (no protectora)
2. Verifica que tens un token vàlid al localStorage
3. Refresca la pàgina i torna a fer login si cal

## 📝 Notes tècniques

- El component utilitza hooks de React (`useState`, `useEffect`)
- Les crides a l'API són asíncrones amb axios
- Els filtres triggeregen automàticament noves cerques
- El sistema de favorits és local (només al client de moment)
- Les imatges utilitzen un placeholder si no hi ha foto disponible

---

**Desenvolupat amb ❤️ per PetConnect Team**
