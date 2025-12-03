# 🌍 Sistema d'Internacionalització (i18n) - PetConnect

## ✅ Instal·lació i Configuració Completada

S'ha implementat correctament el sistema d'internacionalització amb suport per a 3 idiomes:
- **Català (CA)** - Idioma per defecte
- **Castellà (ES)**
- **Anglès (EN)**

---

## 📂 Estructura de fitxers

```
frontend/src/
├── i18n.js                          # Configuració principal d'i18next
├── locales/
│   ├── ca/
│   │   └── translation.json         # Traduccions en català
│   ├── es/
│   │   └── translation.json         # Traduccions en castellà
│   └── en/
│       └── translation.json         # Traduccions en anglès
└── components/
    ├── LanguageSelector.jsx         # Component selector d'idioma (opcional)
    └── Navbar/
        └── Navbar.jsx              # Navbar amb traduccions integrades
```

---

## 🎯 Funcionalitats implementades

### 1. Navbar completament traduïda
- ✅ Menús de navegació dinàmics segons l'idioma
- ✅ Selector d'idioma amb banderes (CA, ES, EN)
- ✅ Tooltip traduït per Mode fosc/clar
- ✅ Menú d'usuari traduït (Perfil, Inici, Sortir)
- ✅ Idioma guardat al localStorage (es manté entre sessions)

### 2. Configuració automàtica
- ✅ L'idioma es recupera automàticament del localStorage
- ✅ Fallback a anglès si l'idioma no està disponible
- ✅ Canvi d'idioma en temps real sense recarregar la pàgina

---

## 🚀 Com utilitzar les traduccions als teus components

### Exemple bàsic

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('login')}</button>
      <button>{t('register')}</button>
    </div>
  );
};
```

### Exemple amb traduccions imbricades

```jsx
import { useTranslation } from 'react-i18next';

const NavbarExample = () => {
  const { t } = useTranslation();

  return (
    <nav>
      <a href="/about">{t('navbar.aboutUs')}</a>
      <a href="/contact">{t('navbar.contact')}</a>
      <a href="/adopt">{t('navbar.adopt')}</a>
    </nav>
  );
};
```

### Exemple amb variables

**Fitxer JSON:**
```json
{
  "greeting": "Hola, {{name}}!",
  "itemCount": "Tens {{count}} mascotes"
}
```

**Component:**
```jsx
const { t } = useTranslation();

<p>{t('greeting', { name: 'Paula' })}</p>
// Resultat: "Hola, Paula!"

<p>{t('itemCount', { count: 5 })}</p>
// Resultat: "Tens 5 mascotes"
```

### Exemple amb plurals

**Fitxer JSON:**
```json
{
  "pets": "{{count}} mascota",
  "pets_plural": "{{count}} mascotes"
}
```

**Component:**
```jsx
<p>{t('pets', { count: 1 })}</p>  // "1 mascota"
<p>{t('pets', { count: 5 })}</p>  // "5 mascotes"
```

---

## 📝 Afegir noves traduccions

### Pas 1: Editar els fitxers JSON

Afegeix les noves claus als 3 fitxers de traducció:

**`src/locales/ca/translation.json`:**
```json
{
  "forms": {
    "name": "Nom",
    "email": "Correu electrònic",
    "password": "Contrasenya",
    "submit": "Enviar"
  }
}
```

**`src/locales/es/translation.json`:**
```json
{
  "forms": {
    "name": "Nombre",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "submit": "Enviar"
  }
}
```

**`src/locales/en/translation.json`:**
```json
{
  "forms": {
    "name": "Name",
    "email": "Email",
    "password": "Password",
    "submit": "Submit"
  }
}
```

### Pas 2: Utilitzar-les al component

```jsx
import { useTranslation } from 'react-i18next';

const MyForm = () => {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('forms.name')}</label>
      <input type="text" />
      
      <label>{t('forms.email')}</label>
      <input type="email" />
      
      <label>{t('forms.password')}</label>
      <input type="password" />
      
      <button type="submit">{t('forms.submit')}</button>
    </form>
  );
};
```

---

## 🔧 Funcions avançades

### Canviar l'idioma programàticament

```jsx
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('ca')}>Català</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
};
```

### Obtenir l'idioma actual

```jsx
const { i18n } = useTranslation();
const currentLanguage = i18n.language; // 'ca', 'es', o 'en'
```

### Traduir sense el hook (fora de components React)

```jsx
import i18n from './i18n';

const translatedText = i18n.t('welcome');
```

---

## 📋 Claus de traducció disponibles

### Generals
- `welcome` - Missatge de benvinguda
- `login` - Iniciar sessió
- `logout` - Tancar sessió
- `register` - Registrar-se
- `save` - Desar
- `cancel` - Cancel·lar
- `delete` - Eliminar
- `edit` - Editar
- `back` - Tornar
- `next` - Següent
- `submit` - Enviar

### Navbar (`navbar.`)
- `aboutUs` - Sobre nosaltres
- `lost` - Perduts
- `contact` - Contacte
- `adopt` - Adopta
- `giveAdoption` - Dóna en adopció
- `chat` - Xateja
- `darkMode` - Mode fosc
- `lightMode` - Mode clar
- `changeLanguage` - Canviar idioma

### Menú d'usuari (`menu.`)
- `profile` - Perfil
- `home` - Inici
- `logout` - Sortir

---

## ✅ Propers passos recomanats

1. **Traduir components principals:**
   - FormUsuari.jsx
   - FormProtectora.jsx
   - Login components
   - MostraMascotes components
   - Footer components

2. **Afegir traduccions per formularis:**
   - Etiquetes de camps
   - Missatges de validació
   - Botons d'acció

3. **Traduir missatges del sistema:**
   - Notificacions d'èxit/error
   - Missatges de confirmació
   - Tooltips i ajuda contextual

4. **Considerar afegir més idiomes:**
   - Francès (fr)
   - Alemany (de)
   - Italià (it)

---

## 🐛 Solució de problemes

### Les traduccions no apareixen
- Verifica que has importat `import { useTranslation } from 'react-i18next';`
- Comprova que la clau existeix als 3 fitxers JSON
- Assegura't que `i18n.js` s'importa al `main.jsx`

### L'idioma no canvia
- Verifica que la funció `changeLanguage` crida a `i18n.changeLanguage(lng)`
- Comprova que l'idioma es guarda al localStorage
- Refresca la pàgina per veure si es manté l'idioma

### Errors de consola
- Revisa la sintaxi dels fitxers JSON (han de ser JSON vàlid)
- Verifica que les rutes dels fitxers de traducció són correctes

---

## 📚 Recursos addicionals

- [Documentació oficial react-i18next](https://react.i18next.com/)
- [Documentació i18next](https://www.i18next.com/)
- [Guia de plurals](https://www.i18next.com/translation-function/plurals)
- [Interpolació de variables](https://www.i18next.com/translation-function/interpolation)

---

**Sistema implementat per:** GitHub Copilot  
**Data:** 3 de desembre de 2025  
**Estat:** ✅ Funcionant correctament
