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
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useColors } from '../../hooks/useColors';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import api from '../../api/client';


export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { colors, isDarkMode } = useColors();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    // Validar que les contrasenyes coincideixin
    if (formData.password !== formData.confirmPassword) {
      setError(t('resetPasswordPage.passwordsMustMatch'));
      return;
    }

    // Validar longitud mínima
    if (formData.password.length < 8) {
      setError(t('resetPasswordPage.passwordMinLength'));
      return;
    }

    setLoading(true);
    
    try {
      // Enviar petició al backend per canviar contrasenya
      await api.post('/usuarios/reset-password/', { 
        token,
        password: formData.password 
      });
      
      // Redirigir al login amb missatge d'èxit
      navigate('/formulari-acces', { state: { resetSuccess: true } });
    } catch (err) {
      console.log('Error reset contrasenya:', err.response?.data);
      const errorMsg = err.response?.data?.detail || 
                       err.response?.data?.error || 
                       t('resetPasswordPage.errorMessage');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            {t('resetPasswordPage.title')}
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            {t('resetPasswordPage.subtitle')}
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
              name="password"
              label={t('resetPasswordPage.newPasswordLabel')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              autoFocus
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx ={{color: isDarkMode ? colors.blue : colors.darkBlue}} />
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
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={t('resetPasswordPage.confirmPasswordLabel')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx ={{color: isDarkMode ? colors.blue : colors.darkBlue}} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              {loading ? t('resetPasswordPage.resetting') : t('resetPasswordPage.resetButton')}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <Button 
                  onClick={() => navigate('/formulari-acces')}
                  variant="text" 
                  size="small"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  {t('resetPasswordPage.backToLogin')}
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
