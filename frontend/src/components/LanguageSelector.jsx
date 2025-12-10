import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from 'react-bootstrap';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <ButtonGroup size="sm">
      <Button
        variant={i18n.language === 'ca' ? 'primary' : 'outline-primary'}
        onClick={() => changeLanguage('ca')}
      >
        CA
      </Button>
      <Button
        variant={i18n.language === 'es' ? 'primary' : 'outline-primary'}
        onClick={() => changeLanguage('es')}
      >
        ES
      </Button>
      <Button
        variant={i18n.language === 'en' ? 'primary' : 'outline-primary'}
        onClick={() => changeLanguage('en')}
      >
        EN
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSelector;
