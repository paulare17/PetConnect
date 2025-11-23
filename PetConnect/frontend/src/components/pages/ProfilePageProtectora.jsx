import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
  Link,
} from "@mui/material";
import { colors } from "../../constants/colors.jsx";
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

// Exemple de dades de demostració per a la protectora (match amb FormProtectora)
const userData = {
  nombreProtectora: "Protectora Paula",
  email: "protectora@example.com",
  telefon: "123456789",
  telefonEmergencia: "987654321",
  webSite: "https://protectora.example.org",
  cif: "B12345678",
  numRegistroAsociacion: "ASO-2025-001",
  tipoEntidadJuridica: "asociacion",

  // Adreça principal
  carrer: "Carrer Major, 10",
  ciutat: "Barcelona",
  codiPostal: "08001",
  provincia: "Barcelona",
  direccionJuridica: "Carrer Major, 10, Barcelona",
  calleJuridica: "Carrer Major",
  numeroJuridica: "10",
  poblacionJuridica: "Barcelona",
  codigoPostalJuridica: "08001",

  // Direcció refugi (opcional)
  direccionRefugio: "Camí del Bosc 5, Sant Cugat",
  calleRefugio: "Camí del Bosc",
  numeroRefugio: "5",
  poblacionRefugio: "Sant Cugat",
  codigoPostalRefugio: "08195",

  // Horaris (exemple)
  horario_lunes_apertura: "09:00",
  horario_lunes_cierre: "13:00",
  horario_martes_apertura: "09:00",
  horario_martes_cierre: "13:00",
  horario_miercoles_apertura: "09:00",
  horario_miercoles_cierre: "13:00",
  horario_jueves_apertura: "09:00",
  horario_jueves_cierre: "13:00",
  horario_viernes_apertura: "09:00",
  horario_viernes_cierre: "13:00",
  horario_sabado_apertura: "",
  horario_sabado_cierre: "",
  horario_domingo_apertura: "",
  horario_domingo_cierre: "",

  // Informació específica
  tipusAnimals: ["gats", "gossos"],
  capacitatMaxima: 120,
  anyFundacio: 2004,
  nucleoZoologico: "123456",
  ambitoGeografico: "Comarcal",
  tipo_animal: "perro",

  // Descripció i serveis
  descripcio:
    "Som una protectora dedicada a la cura i adopció d'animals domèstics.",
  serveisOferts: ["adopcio", "veterinari", "transport"],

  // Requisits/processos
  requisitoAdopcio: "Entrevista i visita domiciliària",
  procesAdopcio: "Formulari -> Entrevista -> Seguiment",

  // Xarxes
  facebook: "https://facebook.com/protectora",
  instagram: "https://instagram.com/protectora",
  twitter: "https://twitter.com/protectora",
};

const ProfilePageProtectora = () => {
  return (
    <Box
      sx={{
        backgroundColor: colors.backgroundOrange,
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
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <GroupIcon /> {userData.nombreProtectora || "-"}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Informació Bàsica */}
          <Typography
            variant="h6"
            sx={{ color: colors.blue, fontWeight: "bold", mb: 2 }}
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
                {userData.telefon || "-"}
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
                {userData.telefonEmergencia || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                <LanguageIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Web
              </Typography>
              {userData.webSite ? (
                <Link
                  href={userData.webSite}
                  target="_blank"
                  rel="noopener"
                  sx={{ mb: 1, display: "block" }}
                >
                  {userData.webSite}
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
                {userData.cif || "-"}
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
                {userData.numRegistroAsociacion || "-"}
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
                {userData.tipoEntidadJuridica || "-"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Ubicació */}
          <Typography
            variant="h6"
            sx={{ color: colors.blue, fontWeight: "bold", mb: 2 }}
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
                {userData.carrer || "-"}
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
                {userData.ciutat || "-"}
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
                {userData.codiPostal || "-"}
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
                {userData.provincia || "-"}
              </Typography>
            </Grid>
          </Grid>

          {/* Direcció jurídica i refugi */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, fontWeight: "bold", mb: 2 }}
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
                {userData.direccionJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Carrer: {userData.calleJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Número: {userData.numeroJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Població: {userData.poblacionJuridica || "-"}
              </Typography>
              <Typography variant="body2">
                Codi postal: {userData.codigoPostalJuridica || "-"}
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
                {userData.direccionRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Carrer: {userData.calleRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Número: {userData.numeroRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Població: {userData.poblacionRefugio || "-"}
              </Typography>
              <Typography variant="body2">
                Codi postal: {userData.codigoPostalRefugio || "-"}
              </Typography>
            </Grid>
          </Grid>

          {/* Horaris per dia */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, fontWeight: "bold", mb: 2 }}
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
              const open = userData[openKey];
              const close = userData[closeKey];
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
            sx={{ color: colors.blue, fontWeight: "bold", mb: 2 }}
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
                {Array.isArray(userData.tipusAnimals) &&
                userData.tipusAnimals.length > 0
                  ? labelsForValues(
                      tipusAnimalsOptions,
                      userData.tipusAnimals
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
                {userData.capacitatMaxima || "-"}
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
                {userData.ambitoGeografico || "-"}
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
                {userData.anyFundacio || "-"}
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
                {userData.nucleoZoologico || "-"}
              </Typography>
            </Grid>
          </Grid>

          {/* Descripció i Serveis */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, fontWeight: "bold", mb: 2 }}
          >
            Descripció i Serveis
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {userData.descripcio || "-"}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: colors.orange, fontWeight: "bold" }}
          >
            Serveis
          </Typography>
          <Box sx={{ mb: 2 }}>
            {Array.isArray(userData.serveisOferts) &&
            userData.serveisOferts.length > 0
              ? labelsForValues(serveisOptions, userData.serveisOferts).map(
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
            {userData.requisitoAdopcio || "-"}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: colors.orange, fontWeight: "bold", mt: 2 }}
          >
            Procés d'adopció
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {userData.procesAdopcio || "-"}
          </Typography>

          {/* Xarxes Socials */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.blue, fontWeight: "bold", mb: 2 }}
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
              {userData.facebook ? (
                <Link href={userData.facebook} target="_blank" rel="noopener">
                  {userData.facebook}
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
              {userData.instagram ? (
                <Link href={userData.instagram} target="_blank" rel="noopener">
                  {userData.instagram}
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
              {userData.twitter ? (
                <Link href={userData.twitter} target="_blank" rel="noopener">
                  {userData.twitter}
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
