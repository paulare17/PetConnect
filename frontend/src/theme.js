import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito", Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: 'inherit', // Els h1 (títols) mantenen la font del tema
    },
    h2: {
      fontFamily: 'inherit',
    },
    h3: {
      fontFamily: 'inherit',
    },
    h4: {
      fontFamily: 'inherit',
    },
    h5: {
      fontFamily: 'inherit',
    },
    h6: {
      fontFamily: 'inherit',
    },
    subtitle1: {
      fontFamily: 'inherit',
    },
    subtitle2: {
      fontFamily: 'inherit',
    },
    body1: {
      fontFamily: '"Nunito", Helvetica, Arial, sans-serif',
    },
    body2: {
      fontFamily: '"Nunito", Helvetica, Arial, sans-serif',
    },
    button: {
      fontFamily: '"Nunito", Helvetica, Arial, sans-serif',
    },
  },
  palette: {
    primary: {
      main: '#66c5bd', // El teu blue
    },
    secondary: {
      main: '#f5842b', // El teu orange
    },
  },
});

export default theme;
