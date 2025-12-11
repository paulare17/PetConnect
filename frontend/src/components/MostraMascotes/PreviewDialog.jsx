import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProfileMascotaView from "./ProfileMascotaView.jsx";
import CardPetDetail from "./CardPetDetail.jsx";
import { useColors } from '../../hooks/useColors.jsx';

export default function PreviewDialog({ openPreviewDialog, setOpenPreviewDialog, formData, previewUrls }) {
  const { t } = useTranslation();
  const { colors } = useColors();


  return (
<Dialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            maxHeight: '90vh',
            backgroundColor: colors.background,
            transition: 'background-color 0.3s ease',
          }
        }}
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: colors.background,
          color: colors.textDark,
          transition: 'all 0.3s ease'
        }}>
          <Typography variant="h5" sx={{ color: colors.textDark }}>
            {t('addAnimalForm.previewDialogTitle')}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpenPreviewDialog(false)}
            sx={{
              color: colors.textDark,
              '&:hover': {
                backgroundColor: colors.lightColor,
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ 
          p: 4,
          backgroundColor: colors.background,
          borderColor: colors.lightColor,
          transition: 'all 0.3s ease'
        }}>
          <Grid container spacing={4} sx={{display: 'flex',
            justifyContent: 'center',}}>
            {/* Perfil Complet */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                border: `2px solid ${colors.orange}`, 
                borderRadius: 3, 
                p: 2, 
                height: '100%',
                backgroundColor: colors.lightColor,
                overflow: 'auto',
                maxHeight: '70vh'
              }}>
                <Typography variant="h5" sx={{ mb: 2, color: colors.orange, textAlign: 'center', fontWeight: 'bold' }}>
                  {t('addAnimalForm.fullProfileView')}
                </Typography>
                <ProfileMascotaView 
                  animal={{
                    ...formData,
                    foto: previewUrls[0] || (typeof formData.foto === "string" ? formData.foto : ""),
                    foto2: previewUrls[1] || (typeof formData.foto2 === "string" ? formData.foto2 : ""),
                    foto3: previewUrls[2] || (typeof formData.foto3 === "string" ? formData.foto3 : "")
                  }}
                  showAdoptButton={false}
                />
              </Box>
            </Grid>

            {/* Perfil Tinder */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                border: `2px solid ${colors.purple}`, 
                borderRadius: 3, 
                p: 3, 
                height: '100%',
                backgroundColor: colors.lightColor 
              }}>
                <Typography variant="h5" sx={{ mb: 3, color: colors.purple, textAlign: 'center', fontWeight: 'bold' }}>
                  {t('addAnimalForm.tinderProfileView')}
                </Typography>
                {/* Vista estil CardPet */}
                <Box sx={{ display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                  <CardPetDetail 
                    animal={{
                      ...formData,
                      foto: previewUrls[0] || (typeof formData.foto === "string" ? formData.foto : ""),
                      foto2: previewUrls[1] || (typeof formData.foto2 === "string" ? formData.foto2 : ""),
                      foto3: previewUrls[2] || (typeof formData.foto3 === "string" ? formData.foto3 : "")
                    }} 
                    isFavorito={false} 
                    onToggleFavorito={() => {}} 
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog> 
)}