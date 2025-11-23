import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";
import { colors } from "../../constants/colors.jsx";
import GroupIcon from "@mui/icons-material/Group";
import PetsIcon from "@mui/icons-material/Pets";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import HomeIcon from "@mui/icons-material/Home";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
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

// Exemple de dades d'usuari amb tots els camps de FormUsuari
const userData = {
  nom: "Paula",
  cognoms: "Reverter",
  email: "paula@example.com",
  telefono: "123456789",
  barrio: "Eixample",
  fecha_nacimiento: "1995-05-10",
  descripcion: "Amant dels animals i amb experiència en acollida.",
  foto_perfil: null, // URL o fitxer
  genero: "F",
  necesidades_especiales: true,
  especie: "gato",
  mascota_previa: true,
  mascota_actual: false,
  casa_acollida: true,
  tipo_vivienda: "casa_con_jardin",
  tiene_ninos: true,
  nivel_actividad_familiar: "alta",
  preferencias_tamano: ["mediano", "grande"],
  preferencias_edad: ["joven", "adulto"],
  preferencias_sexo: ["hembra"],
  deporte_ofrecible: "Correr, senderisme",
  tiempo_en_casa_para_gatos: "6 hores/dia",
};

const ProfilePage = () => {
  return (
    <Box
      sx={{
        backgroundColor: colors.backgroundOrange,
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
              src={userData.foto_perfil || undefined}
            >
              {!userData.foto_perfil && userData.nom ? userData.nom[0] : null}
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                color: colors.blue,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <GroupIcon />
              {userData.nom} {userData.cognoms}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
              {userData.descripcion}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold", mb: 1 }}
              >
                <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold", mb: 1 }}
              >
                <PhoneIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Telèfon
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.telefono}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold", mb: 1 }}
              >
                <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Barri
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.barrio}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold", mb: 1 }}
              >
                <FamilyRestroomIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Data de naixement
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.fecha_nacimiento}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold", mb: 1 }}
              >
                <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Gènere
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {labelForValue(generoOptions, userData.genero)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold", mb: 1 }}
              >
                <HomeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Tipus de vivenda
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {labelForValue(tipoViviendaOptions, userData.tipo_vivienda)}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            sx={{
              color: colors.blue,
              fontWeight: "bold",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PetsIcon /> Preferències i activitat familiar
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Espècie d'interès
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {labelForValue(especieOptions, userData.especie)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Nivell d'activitat familiar
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.nivel_actividad_familiar}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Té nens a casa
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.tiene_ninos ? "Sí" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Preferències de mida
              </Typography>
              <Box sx={{ mb: 2 }}>
                {userData.preferencias_tamano &&
                userData.preferencias_tamano.length > 0
                  ? userData.preferencias_tamano.map((t, i) => (
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
                Preferències d'edat
              </Typography>
              <Box sx={{ mb: 2 }}>
                {userData.preferencias_edad &&
                userData.preferencias_edad.length > 0
                  ? userData.preferencias_edad.map((e, i) => (
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
                Preferències de sexe
              </Typography>
              <Box sx={{ mb: 2 }}>
                {userData.preferencias_sexo &&
                userData.preferencias_sexo.length > 0
                  ? userData.preferencias_sexo.map((s, i) => (
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
            {(userData.especie || "").toString().toLowerCase() === "perro" && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.orange, fontWeight: "bold" }}
                >
                  Esports/activitats oferibles
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {userData.deporte_ofrecible || "-"}
                </Typography>
              </Grid>
            )}
            {(userData.especie || "").toString().toLowerCase() === "gato" && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.orange, fontWeight: "bold" }}
                >
                  Temps a casa (gats)
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {userData.tiempo_en_casa_para_gatos || "-"}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            sx={{
              color: colors.blue,
              fontWeight: "bold",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <VolunteerActivismIcon /> Experiència i implicació
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Ha tingut mascotes abans
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.mascota_previa ? "Sí" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Té mascotes actualment
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.mascota_actual ? "Sí" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Pot ser casa d'acollida
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.casa_acollida ? "Sí" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: colors.orange, fontWeight: "bold" }}
              >
                Pot cuidar animals amb necessitats especials
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.necesidades_especiales ? "Sí" : "No"}
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
              Edita el perfil
            </button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
