import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import {colors } from '../../constants/colors.jsx';
import { useNavigate } from "react-router-dom";


export default function ViewLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validació bàsica
    if (!formData.email || !formData.password) {
      setError('Tots els camps són obligatoris');
      setLoading(false);
      return;
    }

    try {
      // Aquí aniria la lògica d'autenticació
      console.log('Dades d\'accés:', formData);
      // Simulem una petició
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir o actualitzar estat d'autenticació
      alert('Accés correcte!');
    } catch {
      setError('Error en l\'autenticació. Comprova les teves credencials.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
       minHeight: 'calc(100vh - 90px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: colors.backgroundOrange,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 5}}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ mb: 3, color: colors.darkBlue, fontWeight: 'bold' }}
          >
            Iniciar Sessió
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            Accedeix al teu compte de PetMatch
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correu electrònic"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx ={{color:colors.blue}} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2}}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contrasenya"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx ={{color:colors.blue}} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1,
                px: 4,
                borderRadius: 5,
                fontSize: '1.1rem',
                textTransform: 'none',
                bgcolor: colors.blue,
                "&:hover": {
                              bgcolor: colors.darkBlue,
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(102, 197, 189, 0.3)",
                            },
              }}
            >
              {loading ? 'Accedint...' : 'Iniciar Sessió'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Has oblidat la contrasenya?{' '}
                <Button 
                  variant="text" 
                  size="small"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  Recupera-la
                </Button>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No tens compte?{' '}
                <Button 
                  onClick={()=> navigate('/formulari-dialog')}
                  variant="text" 
                  size="small"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  Crea'l
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
