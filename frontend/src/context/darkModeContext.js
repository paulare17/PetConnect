import { createContext, useContext } from 'react';

export const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode debe usarse dentro de DarkModeProvider');
  }
  return context;
};
