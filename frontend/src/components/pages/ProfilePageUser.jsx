import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "../../api/client";
import { useColors } from "../../hooks/useColors";
import GroupIcon from "@mui/icons-material/Group";
import PetsIcon from "@mui/icons-material/Pets";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import HomeIcon from "@mui/icons-material/Home";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  generoOptions,
  especieOptions,
  tamanoOptions,
  edadOptions,
  sexoOptions,
  tipoViviendaOptions,
  labelForValue,
} from "../../constants/options.jsx";

const ProfilePage = ({ profileData: initialProfileData }) => {
  const { t } = useTranslation();
  const { colors } = useColors();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    setProfileData(initialProfileData);
  }, [initialProfileData]);

  const loadUserData = async () => {
    try {
      const response = await getCurrentUser();
      setUserData(response.data);
    } catch (error) {
      console.error("Error al carregar dades de l'usuari:", error);
    } finally {
      setLoading(false);
    }
  };

  // Processar preferències que poden venir com a string separada per comes
  const parsePreferences = (pref) => {
    if (!pref) return [];
    if (Array.isArray(pref)) return pref;
    if (typeof pref === 'string') return pref.split(',').filter(Boolean);
    return [];
  };

  if (loading || !userData || !profileData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: colors.background,
        }}
      >
        <CircularProgress sx={{ color: colors.blue }} />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        py: 5,
        px: 1,
      }}
    >
      <Card sx={{ maxWidth: 700, mx: "auto", borderRadius: 5, boxShadow: `4px 4px 0 ${colors.purple}` }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{ width: 90, height: 90, bgcolor: colors.blue, mb: 2 }}
              src={profileData.foto_perfil || undefined}
            >
              {!profileData.foto_perfil && userData.username ? userData.username[0].toUpperCase() : null}
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                color: colors.blue,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <GroupIcon />
              {userData.username}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
              {profileData.descripcion || t('profilePageUser.noDescription')}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange,  mb: 1 }}
              >
                <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {t('profilePageUser.email')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange,  mb: 1 }}
              >
                <PhoneIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {t('profilePageUser.phone')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.telefono || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange,  mb: 1 }}
              >
                <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {t('profilePageUser.neighborhood')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.barrio || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange,  mb: 1 }}
              >
                <FamilyRestroomIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {t('profilePageUser.birthDate')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.fecha_nacimiento || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange,  mb: 1 }}
              >
                <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {t('profilePageUser.gender')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {labelForValue(generoOptions, profileData.genero) || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange,  mb: 1 }}
              >
                <HomeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {t('profilePageUser.housingType')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {labelForValue(tipoViviendaOptions, profileData.tipo_vivienda) || "-"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            sx={{
              color: colors.blue,
  
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PetsIcon /> {t('profilePageUser.preferencesFamily')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.speciesInterest')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {labelForValue(especieOptions, profileData.especie) || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.familyActivityLevel')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.nivel_actividad_familiar || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.hasChildren')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.tiene_ninos ? t('profilePageUser.yes') : t('profilePageUser.no')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.sizePreferences')}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {parsePreferences(profileData.preferencias_tamano).length > 0
                  ? parsePreferences(profileData.preferencias_tamano).map((t, i) => (
                      <Chip
                        key={i}
                        label={labelForValue(tamanoOptions, t)}
                        sx={{
                          mr: 1,
                          mb: 1,
                          bgcolor: colors.blue,
                          color: "white",
                        }}
                      />
                    ))
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.agePreferences')}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {parsePreferences(profileData.preferencias_edad).length > 0
                  ? parsePreferences(profileData.preferencias_edad).map((e, i) => (
                      <Chip
                        key={i}
                        label={labelForValue(edadOptions, e)}
                        sx={{
                          mr: 1,
                          mb: 1,
                          bgcolor: colors.blue,
                          color: "white",
                        }}
                      />
                    ))
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.genderPreferences')}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {parsePreferences(profileData.preferencias_sexo).length > 0
                  ? parsePreferences(profileData.preferencias_sexo).map((s, i) => (
                      <Chip
                        key={i}
                        label={labelForValue(sexoOptions, s)}
                        sx={{
                          mr: 1,
                          mb: 1,
                          bgcolor: colors.blue,
                          color: "white",
                        }}
                      />
                    ))
                  : "-"}
              </Box>
            </Grid>
            {(profileData.especie || "").toString().toLowerCase() === "perro" && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.orange, fontWeight: "bold" }}
                >
                  {t('profilePageUser.sportsActivities')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profileData.deporte_ofrecible || "-"}
                </Typography>
              </Grid>
            )}
            {(profileData.especie || "").toString().toLowerCase() === "gato" && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.orange, fontWeight: "bold" }}
                >
                  {t('profilePageUser.timeAtHome')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profileData.tiempo_en_casa_para_gatos || "-"}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            sx={{
              color: colors.blue,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <VolunteerActivismIcon /> {t('profilePageUser.experienceInvolvement')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.hadPetsBefore')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.mascota_previa ? t('profilePageUser.yes') : t('profilePageUser.no')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.hasPetsNow')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.mascota_actual ? t('profilePageUser.yes') : t('profilePageUser.no')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.canBeFosterHome')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.casa_acollida ? t('profilePageUser.yes') : t('profilePageUser.no')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                {t('profilePageUser.canCareSpecialNeeds')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.necesidades_especiales ? t('profilePageUser.yes') : t('profilePageUser.no')}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <button className="sticker-button"
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: 6,
                background: colors.blue,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              {t('profilePageUser.editProfile')}
            </button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
