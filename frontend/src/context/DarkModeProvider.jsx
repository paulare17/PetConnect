import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { colors, darkColors } from '../constants/colors';
import { DarkModeContext } from './darkModeContext';

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar preferencia guardada al montar el componente
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newValue));
      return newValue;
    });
  };

  // Crear tema de MUI dinámicamente
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      ...(isDarkMode ? {
        // Tema oscuro
        primary: {
          main: darkColors.purple,
          dark: darkColors.darkPurple,
          light: darkColors.lightPurple,
        },
        secondary: {
          main: darkColors.blue,
          dark: darkColors.darkBlue,
          light: darkColors.lightBlue,
        },
        background: {
          default: darkColors.background,
          paper: darkColors.backgroundSecondary,
        },
        text: {
          primary: darkColors.textLight,
          secondary: darkColors.textMuted,
        },
        action: {
          hover: darkColors.backgroundTertiary,
          selected: darkColors.backgroundTertiary,
        },
      } : {
        // Tema claro
        primary: {
          main: colors.blue,
          dark: colors.darkBlue,
          light: colors.lightBlue,
        },
        secondary: {
          main: colors.orange,
          dark: colors.darkOrange,
          light: colors.background,
        },
        background: {
          default: colors.lightColor,
          paper: '#ffffff',
        },
        text: {
          primary: colors.textDark,
          secondary: colors.textDark,
        },
      }),
    },
    typography: {
      fontFamily: '"Rubik", sans-serif',
    },
  });

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};
