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
import { colors } from "../../constants/colors.jsx";
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
  const [formData, setFormData] = useState(existingProfile || {
    // Informació bàsica
    telefono: "",
    barrio: "",
    fecha_nacimiento: "",
    descripcion: "",
    foto_perfil: null,
    genero: "",
    necesidades_especiales: false,
    especie: "",
    mascota_previa: false,
    mascota_actual: false,
    casa_acollida: false,
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
        backgroundColor: colors.backgroundOrange,
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
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Group />
            Perfil de Usuario
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
          >
            Completa la información de tu perfil para que podamos recomendarte las mejores mascotas para ti.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Alert informatiu si és la primera vegada */}
            {existingProfile && !existingProfile.telefono && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>Completa tu perfil</AlertTitle>
                Aún no has completado tu perfil. Necesitamos esta información para poder
                recomendarte las mascotas más adecuadas para ti. <strong>¡Tómate un momento para rellenar el formulario!</strong>
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
              Información Personal
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
                  label="Fecha de nacimiento"
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
                  <InputLabel>Género</InputLabel>
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
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Especie de interés</InputLabel>
                  <Select
                    name="especie"
                    value={formData.especie}
                    onChange={handleInputChange}
                    label="Especie de interés"
                  >
                    {especieOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
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
                    : "Subir foto de perfil"}
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
                  label="Descripción personal"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  error={!!errors.descripcion}
                  helperText={
                    errors.descripcion ||
                    "Explica un poco sobre ti, tus intereses y experiencia con animales"
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
              Preferencias de mascota y actividad familiar
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Nivel de actividad familiar</InputLabel>
                  <Select
                    name="nivel_actividad_familiar"
                    value={formData.nivel_actividad_familiar}
                    onChange={handleInputChange}
                    label="Nivel de actividad familiar"
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
                  label="Tengo niños en casa"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Preferencias de tamaño
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
                  Preferencias de edad
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
                  Preferencias de sexo
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
                {formData.especie === "perro" && (
                  <TextField
                    fullWidth
                    name="deporte_ofrecible"
                    label="Deportes/actividades ofrecibles (perros)"
                    value={formData.deporte_ofrecible}
                    onChange={handleInputChange}
                  />
                )}
                {formData.especie === "gato" && (
                  <TextField
                    fullWidth
                    name="tiempo_en_casa_para_gatos"
                    label="Tiempo en casa (útil para gatos)"
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
              Situación de Vivienda
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!!errors.tipo_vivienda}>
                  <InputLabel>Tipo de vivienda</InputLabel>
                  <Select
                    name="tipo_vivienda"
                    value={formData.tipo_vivienda}
                    onChange={handleInputChange}
                    label="Tipo de vivienda"
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
              Experiencia con animales
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.mascota_previa}
                      onChange={() => handleCheckboxChange("mascota_previa")}
                      sx={{ color: colors.blue }}
                    />
                  }
                  label="He tenido mascotas antes"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.mascota_actual}
                      onChange={() => handleCheckboxChange("mascota_actual")}
                      sx={{ color: colors.blue }}
                    />
                  }
                  label="Actualmente tengo mascotas"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Capacitat d'Involucració */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <VolunteerActivism sx={{ mr: 1, verticalAlign: "middle" }} />
              Capacidad de implicación
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.necesidades_esp}
                      onChange={() => handleCheckboxChange("necesidades_esp")}
                      sx={{ color: colors.blue }}
                    />
                  }
                  label="Tengo los recursos y la capacidad para cuidar animales con necesidades especiales"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.casa_acollida}
                      onChange={() => handleCheckboxChange("casa_acollida")}
                      sx={{ color: colors.blue }}
                    />
                  }
                  label="Puedo ser casa de acogida"
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
