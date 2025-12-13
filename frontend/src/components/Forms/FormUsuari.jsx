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
import { useTranslation } from "react-i18next";

export default function FormUsuari({ onProfileCreated, existingProfile }) {
  const navigate = useNavigate();
  const { colors } = useColors();
  const { t } = useTranslation();
  
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
    // Nous camps de situació personal
    tiene_perros: false,
    tiene_gatos: false,
    tiene_otros_animales: false,
    es_primerizo: true,
    tiene_licencia_ppp: false,
    codigo_postal: "",
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

    if (!formData.telefono.trim()) newErrors.telefono = t('formUsuari.phoneRequired');
    if (!formData.fecha_nacimiento)
      newErrors.fecha_nacimiento = t('formUsuari.birthdateRequired');
    if (!formData.descripcion.trim())
      newErrors.descripcion = t('formUsuari.descriptionRequired');
    if (!formData.genero) newErrors.genero = t('formUsuari.genderRequired');
    if (!formData.tipo_vivienda)
      newErrors.tipo_vivienda = t('formUsuari.housingTypeRequired');

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
                       t('formUsuari.createError');
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
            {t('formUsuari.title')}
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
          >
            {t('formUsuari.subtitle')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Alert informatiu si és la primera vegada */}
            {existingProfile && !existingProfile.telefono && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>{t('formUsuari.completeProfileTitle')}</AlertTitle>
                {t('formUsuari.completeProfileMessage')} <strong>{t('formUsuari.completeProfileAction')}</strong>
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
              {t('formUsuari.personalInfo')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="telefono"
                  label={t('formUsuari.phone')}
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
                  label={t('formUsuari.birthdate')}
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
                  <InputLabel>{t('formUsuari.gender')}</InputLabel>
                  <Select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    label={t('formUsuari.gender')}
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
                    ? t('formUsuari.photoSelected')
                    : t('formUsuari.uploadPhoto')}
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
                  label={t('formUsuari.description')}
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
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
              {t('formUsuari.familyInfo')}
            </Typography>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {t('formUsuari.species')}
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
                  <InputLabel>{t('formUsuari.activityLevel')}</InputLabel>
                  <Select
                    name="nivel_actividad_familiar"
                    value={formData.nivel_actividad_familiar}
                    onChange={handleInputChange}
                    label={t('formUsuari.activityLevel')}
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
                  label={t('formUsuari.hasChildren')}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {t('formUsuari.sizePreferences')}
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
                  {t('formUsuari.agePreferences')}
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
                  {t('formUsuari.sexPreferences')}
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
                    label={t('formUsuari.sports')}
                    value={formData.deporte_ofrecible}
                    onChange={handleInputChange}
                  />
                )}
                {formData.especie.includes("gato") && (
                  <TextField
                    fullWidth
                    name="tiempo_en_casa_para_gatos"
                    label={t('formUsuari.timeAtHome')}
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
              {t('formUsuari.housingInfo')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!!errors.tipo_vivienda}>
                  <InputLabel>{t('formUsuari.housingType')}</InputLabel>
                  <Select
                    name="tipo_vivienda"
                    value={formData.tipo_vivienda}
                    onChange={handleInputChange}
                    label={t('formUsuari.housingType')}
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

            {/* Situació Personal - Animals a casa */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Pets sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formUsuari.currentSituation')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {t('formUsuari.petsAtHome')}
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.tiene_perros}
                        onChange={() => handleCheckboxChange("tiene_perros")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label={t('formUsuari.hasDogs')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.tiene_gatos}
                        onChange={() => handleCheckboxChange("tiene_gatos")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label={t('formUsuari.hasCats')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.tiene_otros_animales}
                        onChange={() => handleCheckboxChange("tiene_otros_animales")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label={t('formUsuari.hasOtherAnimals')}
                  />
                </FormGroup>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="codigo_postal"
                  label={t('formUsuari.postalCode')}
                  value={formData.codigo_postal}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Experiència amb Animals */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <VolunteerActivism sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formUsuari.experienceInfo')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.es_primerizo}
                        onChange={() => handleCheckboxChange("es_primerizo")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label={t('formUsuari.isFirstTime')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.mascota_previa}
                        onChange={() => handleCheckboxChange("mascota_previa")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label={t('formUsuari.hadPetsBefore')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.tiene_licencia_ppp}
                        onChange={() => handleCheckboxChange("tiene_licencia_ppp")}
                        sx={{ color: colors.blue }}
                      />
                    }
                    label={t('formUsuari.hasPPPLicense')}
                  />
                </FormGroup>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Capacitat d'Involucràcia */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <VolunteerActivism sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formUsuari.specialNeeds')}
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
                  label={t('formUsuari.canCareSpecialNeeds')}
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
                {t('formUsuari.cancelButton')}
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
                {loading ? t('formUsuari.savingButton') : t('formUsuari.saveButton')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
