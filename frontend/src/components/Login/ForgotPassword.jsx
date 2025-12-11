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
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { useColors } from '../../hooks/useColors';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import api from '../../api/client';


export default function ForgotPassword() {
  const navigate = useNavigate();
  const { colors, isDarkMode } = useColors();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    try {
      // Enviar petició al backend per recuperar contrasenya
      await api.post('/usuarios/forgot-password/', { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.log('Error recuperació contrasenya:', err.response?.data);
      const errorMsg = err.response?.data?.detail || 
                       err.response?.data?.error || 
                       t('forgotPasswordPage.errorMessage');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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
            {t('forgotPasswordPage.title')}
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            {t('forgotPasswordPage.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t('forgotPasswordPage.successMessage')}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('forgotPasswordPage.emailLabel')}
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleInputChange}
              disabled={success}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx ={{color: isDarkMode ? colors.blue : colors.darkBlue}} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3}}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || success}
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
              {loading ? t('forgotPasswordPage.sending') : t('forgotPasswordPage.sendButton')}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <Button 
                  onClick={() => navigate('/formulari-acces')}
                  variant="text" 
                  size="small"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  {t('forgotPasswordPage.backToLogin')}
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
