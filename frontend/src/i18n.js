import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationCA from './locales/ca/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: { translation: translationEN },
  ca: { translation: translationCA },
  es: { translation: translationES },
};

const savedLanguage = localStorage.getItem('language') || 'ca';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // idioma per defecte
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;