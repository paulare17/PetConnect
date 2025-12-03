# Guia d'ús de i18n a PetConnect

## Configuració completada ✅

S'ha instal·lat i configurat react-i18next al projecte amb suport per a 3 idiomes:
- **Català (ca)** - Idioma per defecte
- **Castellà (es)**
- **Anglès (en)**

## Com utilitzar les traduccions als components

### 1. Importa el hook useTranslation

```jsx
import { useTranslation } from 'react-i18next';
```

### 2. Utilitza el hook al component

```jsx
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

### 3. Exemple complet d'un component

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

const ExampleComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('about')}</p>
      <Button variant="primary">{t('login')}</Button>
      <Button variant="secondary">{t('register')}</Button>
    </div>
  );
};

export default ExampleComponent;
```

## Component LanguageSelector

S'ha creat un component `LanguageSelector` que pots afegir al teu Navbar o Footer per canviar l'idioma:

```jsx
import LanguageSelector from './components/LanguageSelector';

// Al teu Navbar o Footer:
<LanguageSelector />
```

## Afegir noves traduccions

Per afegir noves claus de traducció, edita els fitxers JSON:

- `src/locales/ca/translation.json` - Català
- `src/locales/es/translation.json` - Castellà
- `src/locales/en/translation.json` - Anglès

### Exemple d'estructura de traducció:

```json
{
  "welcome": "Benvingut a PetConnect",
  "menu": {
    "home": "Inici",
    "pets": "Mascotes",
    "profile": "Perfil"
  },
  "forms": {
    "name": "Nom",
    "email": "Correu electrònic",
    "password": "Contrasenya"
  }
}
```

Per utilitzar traduccions imbricades:

```jsx
{t('menu.home')}
{t('forms.name')}
```

## Traduccions amb variables

Pots passar variables a les traduccions:

**JSON:**
```json
{
  "greeting": "Hola, {{name}}!"
}
```

**Component:**
```jsx
{t('greeting', { name: 'Paula' })}
// Resultat: "Hola, Paula!"
```

## Propers passos

1. Afegir el component `LanguageSelector` al teu Navbar
2. Reemplaçar els textos hardcoded dels components amb `t('clau')`
3. Afegir totes les traduccions necessàries als fitxers JSON
4. Provar el canvi d'idioma a l'aplicació

## Estructura de fitxers creats

```
src/
  ├── i18n.js                           # Configuració d'i18next
  ├── locales/
  │   ├── ca/
  │   │   └── translation.json          # Traduccions en català
  │   ├── es/
  │   │   └── translation.json          # Traduccions en castellà
  │   └── en/
  │       └── translation.json          # Traduccions en anglès
  └── components/
      └── LanguageSelector.jsx          # Selector d'idioma
```
