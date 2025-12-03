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
import { useColors } from '../../hooks/useColors';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../context/AuthProvider';
import { useTranslation } from 'react-i18next';


export default function ViewLogin() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { colors } = useColors();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
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
    
    try {
      console.log('Dades d\'accés:', { username: formData.username, password: formData.password });
      const loginResult = await login({ 
        username: formData.username, 
        password: formData.password 
      });
      
      // Redirigir segons el rol
      if (loginResult?.user?.role === 'usuario') {
        navigate('/inici-usuari-pettinder');
      } else if (loginResult?.user?.role === 'protectora') {
        navigate('/inici-protectora');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log('Error backend detall:', err.response?.data);
      const errorMsg = err.response?.data?.detail || 
                       err.response?.data?.error || 
                       t('loginPage.authError');
      setError(errorMsg);
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
        bgcolor: colors.background,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 5, bgcolor: colors.lightColor, transition: 'background-color 0.3s ease'}}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ mb: 3, color: colors.darkBlue, fontWeight: 'bold' }}
          >
            {t('loginPage.title')}
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            {t('loginPage.subtitle')}
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
              id="username"
              label={t('loginPage.username')}
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
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
              label={t('loginPage.password')}
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
              {loading ? t('loginPage.loggingIn') : t('loginPage.loginButton')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              disabled={loading}
              onClick={() => navigate('/login-protectora')}
              sx={{ 
                mb: 2, 
                py: 1,
                px: 4,
                borderRadius: 5,
                fontSize: '0.95rem',
                textTransform: 'none',
                color: colors.yellow,
                borderColor: colors.yellow,
                "&:hover": {
                  borderColor: colors.purple,
                  bgcolor: 'rgba(246, 206, 91, 0.1)',
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t('loginPage.shelterButton')}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('loginPage.forgotPassword')}{' '}
                <Button 
                  variant="text" 
                  size="small"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  {t('loginPage.recoverPassword')}
                </Button>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('loginPage.noAccount')}{' '}
                <Button 
                  onClick={()=> navigate('/formulari-dialog')}
                  variant="text" 
                  size="small"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  {t('loginPage.createAccount')}
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
