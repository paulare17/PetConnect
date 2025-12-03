import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Grid,
} from "@mui/material";
import {
  Business,
  Email,
  Phone,
  LocationOn,
  Language,
  Schedule,
  Pets,
  Description,
  ContactPhone,
  Group,
  VolunteerActivism,
} from "@mui/icons-material";
import { useColors } from "../../hooks/useColors";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../../api/client";
import {
  generoOptions,
  especieOptions,
  actividadOptions,
  tamanoOptions,
  edadOptions,
  sexoOptions,
  tipoViviendaOptions,
} from "../../constants/options";

export default function FormUsuari({ onProfileCreated, existingProfile }) {
  const navigate = useNavigate();
  const { colors } = useColors();
  
  // Normalitzar existingProfile per assegurar que els camps són arrays
  const normalizeProfile = (profile) => {
    if (!profile) return null;
    return {
      ...profile,
      especie: Array.isArray(profile.especie) 
        ? profile.especie 
        : (profile.especie ? profile.especie.split(',').map(s => s.trim()) : []),
      preferencias_tamano: Array.isArray(profile.preferencias_tamano)
        ? profile.preferencias_tamano
        : (profile.preferencias_tamano ? profile.preferencias_tamano.split(',').map(s => s.trim()) : []),
      preferencias_edad: Array.isArray(profile.preferencias_edad)
        ? profile.preferencias_edad
        : (profile.preferencias_edad ? profile.preferencias_edad.split(',').map(s => s.trim()) : []),
      preferencias_sexo: Array.isArray(profile.preferencias_sexo)
        ? profile.preferencias_sexo
        : (profile.preferencias_sexo ? profile.preferencias_sexo.split(',').map(s => s.trim()) : []),
    };
  };

  const [formData, setFormData] = useState(normalizeProfile(existingProfile) || {
    // Informació bàsica
    telefono: "",
    barrio: "",
    fecha_nacimiento: "",
    descripcion: "",
    foto_perfil: null,
    genero: "",
    necesidades_especiales: false,
    especie: [],
    mascota_previa: false,
    tipo_vivienda: "",
    tiene_ninos: false,
    nivel_actividad_familiar: "",
    preferencias_tamano: [],
    preferencias_edad: [],
    preferencias_sexo: [],
    deporte_ofrecible: "",
    tiempo_en_casa_para_gatos: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      foto_perfil: file,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.telefono.trim()) newErrors.telefono = "Telèfon obligatori";
    if (!formData.fecha_nacimiento)
      newErrors.fecha_nacimiento = "Data de naixement obligatòria";
    if (!formData.descripcion.trim())
      newErrors.descripcion = "Descripció obligatòria";
    if (!formData.genero) newErrors.genero = "Gènere obligatori";
    if (!formData.tipo_vivienda)
      newErrors.tipo_vivienda = "Tipus de vivenda obligatori";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Preparar les dades per enviar
      const dataToSend = { ...formData };
      
      // Convertir arrays a strings separats per comes si cal (segons el backend)
      if (Array.isArray(dataToSend.especie)) {
        dataToSend.especie = dataToSend.especie.join(',');
      }
      if (Array.isArray(dataToSend.preferencias_tamano)) {
        dataToSend.preferencias_tamano = dataToSend.preferencias_tamano.join(',');
      }
      if (Array.isArray(dataToSend.preferencias_edad)) {
        dataToSend.preferencias_edad = dataToSend.preferencias_edad.join(',');
      }
      if (Array.isArray(dataToSend.preferencias_sexo)) {
        dataToSend.preferencias_sexo = dataToSend.preferencias_sexo.join(',');
      }

      let response;
      if (existingProfile && existingProfile.id) {
        // Actualitzar perfil existent
        const { updateUserProfile } = await import("../../api/client");
        response = await updateUserProfile(existingProfile.id, dataToSend);
        console.log("Perfil actualitzat:", response.data);
      } else {
        // Crear perfil nou
        response = await createUserProfile(dataToSend);
        console.log("Perfil creat:", response.data);
      }
      
      // Notificar al component pare que s'ha creat el perfil
      if (onProfileCreated) {
        onProfileCreated();
      }
    } catch (error) {
      console.error("Error en crear el perfil:", error);
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.message || 
                       "Error en crear el perfil. Intenta-ho de nou.";
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/formulari-dialog");
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        padding: 3,
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        overflowY: "auto", // Permet scroll vertical
      }}
    >
      <Card sx={{ height: "100%", width: "80%", borderRadius: 5 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              mb: 3,
              color: colors.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Group />
            Perfil d'Usuari
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
          >
            Completa la informació del teu perfil perquè puguem recomanar-te les millors mascotes per a tu.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Alert informatiu si és la primera vegada */}
            {existingProfile && !existingProfile.telefono && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>Completa el teu perfil</AlertTitle>
                Encara no has completat el teu perfil. Necessitem aquesta informació per poder
                recomanar-te les mascotes més adequades per a tu. <strong>Pren-te un moment per emplenar el formulari!</strong>
              </Alert>
            )}

            {apiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {apiError}
              </Alert>
            )}

            {/* Informació Personal */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Group sx={{ mr: 1, verticalAlign: "middle" }} />
              Informació Personal
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="telefono"
                  label="Telèfon de contacte"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="fecha_nacimiento"
                  label="Data de naixement"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  error={!!errors.fecha_nacimiento}
                  helperText={errors.fecha_nacimiento}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!!errors.genero}>
                  <InputLabel>Gènere</InputLabel>
                  <Select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    label="Gènere"
                  >
                    {generoOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.genero && (
                    <Typography color="error" variant="caption">
                      {errors.genero}
                    </Typography>
                  )}
                </FormControl>
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    height: 56,
                    borderColor: colors.orange,
                    color: colors.orange,
                    "&:hover": {
                      borderColor: colors.darkOrange,
                      backgroundColor: "rgba(245, 132, 43, 0.04)",
                    },
                  }}
                >
                  {formData.foto_perfil
                    ? "Foto seleccionada"
                    : "Pujar foto de perfil"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name="descripcion"
                  label="Descripció personal"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  error={!!errors.descripcion}
                  helperText={
                    errors.descripcion ||
                    "Explica una mica sobre tu, els teus interessos i experiència amb animals"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Preferències i Activitat Familiar */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
              Preferències de mascota i activitat familiar
            </Typography>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Espècie d'interès
                      </Typography>
                      <FormGroup row>
                        {especieOptions.map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            control={
                              <Checkbox
                                checked={formData.especie.includes(opt.value)}
                                onChange={() => handleMultiSelectChange("especie", opt.value)}
                                sx={{ color: colors.blue }}
                              />
                            }
                            label={opt.label}
                          />
                        ))}
                      </FormGroup>
                    </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Nivell d'activitat familiar</InputLabel>
                  <Select
                    name="nivel_actividad_familiar"
                    value={formData.nivel_actividad_familiar}
                    onChange={handleInputChange}
                    label="Nivell d'activitat familiar"
                  >
                    {actividadOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.tiene_ninos}
                      onChange={() => handleCheckboxChange("tiene_ninos")}
                      sx={{ color: colors.blue }}
                    />
                  }
                  label="Tinc nens a casa"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Preferències de mida
                </Typography>
                <FormGroup row sx={{ mb: 2 }}>
                  {tamanoOptions.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      control={
                        <Checkbox
                          checked={formData.preferencias_tamano.includes(opt.value)}
                          onChange={() => handleMultiSelectChange("preferencias_tamano", opt.value)}
                          sx={{ color: colors.blue }}
                        />
                      }
                      label={opt.label}
                    />
                  ))}
                </FormGroup>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Preferències d'edat
                </Typography>
                <FormGroup row sx={{ mb: 2 }}>
                  {edadOptions.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      control={
                        <Checkbox
                          checked={formData.preferencias_edad.includes(opt.value)}
                          onChange={() => handleMultiSelectChange("preferencias_edad", opt.value)}
                          sx={{ color: colors.blue }}
                        />
                      }
                      label={opt.label}
                    />
                  ))}
                </FormGroup>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Preferències de sexe
                </Typography>
                <FormGroup row sx={{ mb: 2 }}>
                  {sexoOptions.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      control={
                        <Checkbox
                          checked={formData.preferencias_sexo.includes(opt.value)}
                          onChange={() => handleMultiSelectChange("preferencias_sexo", opt.value)}
                          sx={{ color: colors.blue }}
                        />
                      }
                      label={opt.label}
                    />
                  ))}
                </FormGroup>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {formData.especie.includes("perro") && (
                  <TextField
                    fullWidth
                    name="deporte_ofrecible"
                    label="Esports/activitats que puc oferir (gossos)"
                    value={formData.deporte_ofrecible}
                    onChange={handleInputChange}
                  />
                )}
                {formData.especie.includes("gato") && (
                  <TextField
                    fullWidth
                    name="tiempo_en_casa_para_gatos"
                    label="Temps a casa (útil per gats)"
                    value={formData.tiempo_en_casa_para_gatos}
                    onChange={handleInputChange}
                  />
                )}
              </Grid>
            </Grid>

            {/* Situació de Vivenda */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
              Situació d'Habitatge
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!!errors.tipo_vivienda}>
                  <InputLabel>Tipus d'habitatge</InputLabel>
                  <Select
                    name="tipo_vivienda"
                    value={formData.tipo_vivienda}
                    onChange={handleInputChange}
                    label="Tipus d'habitatge"
                  >
                    {tipoViviendaOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipo_vivienda && (
                    <Typography color="error" variant="caption">
                      {errors.tipo_vivienda}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Experiència amb Animals */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Pets sx={{ mr: 1, verticalAlign: "middle" }} />
              Experiència amb animals
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.mascota_previa}
                        onChange={() => handleCheckboxChange("mascota_previa")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label="He tingut mascotes abans"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.mascota_previa}
                        onChange={() => handleCheckboxChange("mascota_previa")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label="Actualment tinc mascotes a casa"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.mascota_previa}
                        onChange={() => handleCheckboxChange("mascota_previa")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label="No he tingut mascotes abans"
                  />
                </FormGroup>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Capacitat d'Involucració */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <VolunteerActivism sx={{ mr: 1, verticalAlign: "middle" }} />
              Capacitat d'implicació
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.necesidades_especiales}
                      onChange={() => handleCheckboxChange("necesidades_especiales")}
                      sx={{ color: colors.blue }}
                    />
                  }
                  label="Tinc els recursos i la capacitat per cuidar animals amb necessitats especials"
                />
              </Grid>
            </Grid>

            {/* Botons d'acció */}
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}
            >
              <Button
                variant="container"
                onClick={handleCancel}
                sx={{
                  color: "white",
                  bgcolor: colors.orange,
                  "&:hover": {
                    bgcolor: colors.darkOrange,
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(245, 132, 43, 0.3)",
                  },
                  borderRadius: 5,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Cancel·lar
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: colors.blue,
                  "&:hover": {
                    bgcolor: colors.darkBlue,
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(102, 197, 189, 0.3)",
                  },
                  borderRadius: 5,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {loading ? "Actualitzant perfil..." : "Actualitza Perfil d'Usuari"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
