import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
  Link,
  CircularProgress,
} from "@mui/material";
import { useColors } from "../../hooks/useColors";
import { getCurrentUser, getProtectoraProfile } from "../../api/client";
import GroupIcon from "@mui/icons-material/Group";
import PetsIcon from "@mui/icons-material/Pets";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";
import LanguageIcon from "@mui/icons-material/Language";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import {
  tipusAnimalsOptions,
  serveisOptions,
  labelsForValues,
} from "../../constants/options.jsx";

const ProfilePageProtectora = () => {
  const { colors } = useColors();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, profileResponse] = await Promise.all([
        getCurrentUser(),
        getProtectoraProfile(),
      ]);
      setUserData(userResponse.data);
      setProfileData(profileResponse.data);
    } catch (error) {
      console.error("Error al carregar dades de la protectora:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (!userData || !profileData) {
    return (
      <Box
        sx={{
          backgroundColor: colors.background,
          minHeight: "100vh",
          py: 5,
          px: 1,
        }}
      >
        <Card sx={{ maxWidth: 900, mx: "auto", borderRadius: 5, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ color: colors.blue, textAlign: "center" }}>
              No s'han trobat dades del perfil de la protectora
            </Typography>
          </CardContent>
        </Card>
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
      <Card sx={{ maxWidth: 900, mx: "auto", borderRadius: 5, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: colors.blue,
            
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <GroupIcon /> {profileData.nombreProtectora || "-"}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Informació Bàsica */}
          <Typography
            variant="h6"
            sx={{ color: colors.blue, mb: 2 }}
          >
            Informació Bàsica
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {userData.email || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                <PhoneIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Telèfon
                principal
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.telefon || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                <ContactPhoneIcon sx={{ mr: 1, verticalAlign: "middle" }} />{" "}
                Telèfon d'emergència
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.telefonEmergencia || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                <LanguageIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Web
              </Typography>
              {profileData.webSite ? (
                <Link
                  href={profileData.webSite}
                  target="_blank"
                  rel="noopener"
                  sx={{ mb: 1, display: "block" }}
                >
                  {profileData.webSite}
                </Link>
              ) : (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  -
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                CIF
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.cif || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Núm. registre associació
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.numRegistroAsociacion || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Tipus entitat
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.tipoEntidadJuridica || "-"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Ubicació */}
          <Typography
            variant="h6"
            sx={{ color: colors.blue,  mb: 2 }}
          >
            Ubicació
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Carrer i número
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.carrer || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Ciutat
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.ciutat || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Codi Postal
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.codiPostal || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Província
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.provincia || "-"}
              </Typography>
            </Grid>
          </Grid>

          {/* Direcció jurídica i refugi */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, mb: 2 }}
          >
            Direcció jurídica i refugi
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Direcció jurídica (adreça completa)
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.direccionJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Carrer: {profileData.calleJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Número: {profileData.numeroJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Població: {profileData.poblacionJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Codi postal: {profileData.codigoPostalJuridica || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Direcció refugi (adreça completa)
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.direccionRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Carrer: {profileData.calleRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Número: {profileData.numeroRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Població: {profileData.poblacionRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Codi postal: {profileData.codigoPostalRefugio || "-"}
              </Typography>
            </Grid>
          </Grid>

          {/* Horaris per dia */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, mb: 2 }}
          >
            Horaris per dia
          </Typography>
          <Box sx={{ mb: 2 }}>
            {[
              ["Dilluns", "horario_lunes_apertura", "horario_lunes_cierre"],
              ["Dimarts", "horario_martes_apertura", "horario_martes_cierre"],
              [
                "Dimecres",
                "horario_miercoles_apertura",
                "horario_miercoles_cierre",
              ],
              ["Dijous", "horario_jueves_apertura", "horario_jueves_cierre"],
              [
                "Divendres",
                "horario_viernes_apertura",
                "horario_viernes_cierre",
              ],
              ["Dissabte", "horario_sabado_apertura", "horario_sabado_cierre"],
              [
                "Diumenge",
                "horario_domingo_apertura",
                "horario_domingo_cierre",
              ],
            ].map(([label, openKey, closeKey]) => {
              const open = profileData[openKey];
              const close = profileData[closeKey];
              const text =
                open && close
                  ? `${open} - ${close}`
                  : open || close
                  ? open || close
                  : "Tancat";
              return (
                <Typography key={openKey} variant="body2">
                  {label}: {text}
                </Typography>
              );
            })}
          </Box>

          {/* Informació específica */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue,  mb: 2 }}
          >
            Informació dels Animals
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Tipus d'animals
              </Typography>
              <Box sx={{ mb: 1 }}>
                {Array.isArray(profileData.tipusAnimals) &&
                profileData.tipusAnimals.length > 0
                  ? labelsForValues(
                      tipusAnimalsOptions,
                      profileData.tipusAnimals
                    ).map((label, i) => (
                      <Chip
                        key={i}
                        label={label}
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
                Capacitat màxima d'animals
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.capacitatMaxima || "-"}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Àmbit geogràfic
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.ambitoGeografico || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Any de fundació
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.anyFundacio || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Núcleo zoológico
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {profileData.nucleoZoologico || "-"}
              </Typography>
            </Grid>
          </Grid>

          {/* Descripció i Serveis */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, mb: 2 }}
          >
            Descripció i Serveis
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {profileData.descripcio || "-"}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: colors.orange, fontWeight: "bold" }}
          >
            Serveis
          </Typography>
          <Box sx={{ mb: 2 }}>
            {Array.isArray(profileData.serveisOferts) &&
            profileData.serveisOferts.length > 0
              ? labelsForValues(serveisOptions, profileData.serveisOferts).map(
                  (label, i) => (
                    <Chip
                      key={i}
                      label={label}
                      sx={{
                        mr: 1,
                        mb: 1,
                        bgcolor: colors.blue,
                        color: "white",
                      }}
                    />
                  )
                )
              : "-"}
          </Box>
          <Typography
            variant="subtitle2"
            sx={{ color: colors.orange, fontWeight: "bold" }}
          >
            Requisits per l'adopció
          </Typography>
          <Typography variant="body2">
            {profileData.requisitoAdopcio || "-"}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: colors.orange,  mt: 2 }}
          >
            Procés d'adopció
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {profileData.procesAdopcio || "-"}
          </Typography>

          {/* Xarxes Socials */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, mb: 2 }}
          >
            Xarxes Socials
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Facebook
              </Typography>
              {profileData.facebook ? (
                <Link href={profileData.facebook} target="_blank" rel="noopener">
                  {profileData.facebook}
                </Link>
              ) : (
                <Typography variant="body1">-</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Instagram
              </Typography>
              {profileData.instagram ? (
                <Link href={profileData.instagram} target="_blank" rel="noopener">
                  {profileData.instagram}
                </Link>
              ) : (
                <Typography variant="body1">-</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Twitter
              </Typography>
              {profileData.twitter ? (
                <Link href={profileData.twitter} target="_blank" rel="noopener">
                  {profileData.twitter}
                </Link>
              ) : (
                <Typography variant="body1">-</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePageProtectora;

