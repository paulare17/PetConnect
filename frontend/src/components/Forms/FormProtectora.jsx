import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
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
} from "@mui/icons-material";
import { useColors } from "../../hooks/useColors";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { ROLES } from "../../constants/roles.jsx";
import { useAuthContext } from "../../context/AuthProvider.jsx";
import { useTranslation } from "react-i18next";

// Opcions segons el model PerfilProtectora
const ENTIDAD_CHOICES = [
  { value: "asociacion", label: "Asociación" },
  { value: "fundacion", label: "Fundación" },
];

export default function FormProtectora() {
  const navigate = useNavigate();
  const { getMe } = useAuthContext();
  const { colors } = useColors();
  const { t } = useTranslation();

  // Camps segons el model PerfilProtectora + camps d'usuari
  const [formData, setFormData] = useState({
    // Camps d'usuari (Usuario model)
    username: "",
    password: "",
    email: "",
    city: "",

    // Informació bàsica (PerfilProtectora)
    cif: "",
    tipo_entidad_juridica: "",

    // Direcció refugi
    calle_refugio: "",
    numero_refugio: "",
    poblacion_refugio: "",
    codigo_postal_refugio: "",

    // Contacte
    web: "",
    telefono: "",
    telefono_emergencia: "",

    // Informació organitzativa
    ano_fundacion: "",
    nucleo_zoologico: "",

    // Serveis i processos
    requisitos_adopcion: "",
    proceso_adopcion: "",
    descripcion: "",

    // Horari (camp de text lliure - s'afegirà al model més endavant)
    horario: "",

    // Xarxes socials (s'afegiran al model més endavant)
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validacions camps d'usuari
    if (!formData.username.trim())
      newErrors.username = t('formProtectora.usernameRequired');
    else if (formData.username.length < 3)
      newErrors.username = t('formProtectora.usernameMinLength');

    if (!formData.password.trim())
      newErrors.password = t('formProtectora.passwordRequired');
    else if (formData.password.length < 8)
      newErrors.password = t('formProtectora.passwordMinLength');

    if (!formData.email.trim()) newErrors.email = t('formProtectora.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t('formProtectora.emailInvalid');

    if (!formData.city.trim()) newErrors.city = t('formProtectora.cityRequired');

    // Validacions camps de protectora
    if (!formData.telefono.trim()) newErrors.telefono = t('formProtectora.phoneRequired');

    if (!formData.descripcion.trim())
      newErrors.descripcion = t('formProtectora.descriptionRequired');

    // Validació URL web (opcional però si s'omple ha de ser vàlida)
    if (formData.web && !/^https?:\/\/.+/.test(formData.web))
      newErrors.web =
        "Format d'URL invàlid (ha de començar amb http:// o https://)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Preparar payload amb tots els camps del model
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: ROLES.PROTECTORA,
        city: formData.city,
        // Dades específiques de la protectora (segons model PerfilProtectora)
        protectora_data: {
          cif: formData.cif || null,
          tipo_entidad_juridica: formData.tipo_entidad_juridica || null,
          calle_refugio: formData.calle_refugio || null,
          numero_refugio: formData.numero_refugio || null,
          poblacion_refugio: formData.poblacion_refugio || null,
          codigo_postal_refugio: formData.codigo_postal_refugio || null,
          web: formData.web || null,
          telefono: formData.telefono || null,
          telefono_emergencia: formData.telefono_emergencia || null,
          ano_fundacion: formData.ano_fundacion
            ? parseInt(formData.ano_fundacion)
            : null,
          nucleo_zoologico: formData.nucleo_zoologico || null,
          requisitos_adopcion: formData.requisitos_adopcion || null,
          proceso_adopcion: formData.proceso_adopcion || null,
          descripcion: formData.descripcion || null,
          // Camps que s'afegiran al model més endavant
          horario: formData.horario || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
        },
      };

      console.log("Enviant dades al backend:", payload);
      const res = await api.post("/usuarios/", payload);

      // El backend retorna access/refresh/user; guardem-los per fer login automàtic
      if (res?.data?.access) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // Actualitzar l'estat del context
        await getMe();
      }

      alert("Perfil de protectora creat correctament!");
      navigate("/");
    } catch (error) {
      console.error("Error creant protectora:", error);
      const msg =
        error?.response?.data?.detail ||
        JSON.stringify(error?.response?.data) ||
        t('formProtectora.createError');
      alert(msg);
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
        overflowY: "auto",
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
            <Pets />
            {t('formProtectora.title')}
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
          >
            {t('formProtectora.subtitle')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* =============== DADES D'ACCÉS =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Group sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.accessData')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label={t('formProtectora.username')}
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Group sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={t('formProtectora.password')}
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label={t('formProtectora.email')}
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="city"
                  label={t('formProtectora.city')}
                  value={formData.city}
                  onChange={handleInputChange}
                  error={!!errors.city}
                  helperText={errors.city}
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

            {/* =============== INFORMACIÓ BÀSICA =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Business sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.basicInfo')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="cif"
                  label={t('formProtectora.cif')}
                  value={formData.cif}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>{t('formProtectora.entityType')}</InputLabel>
                  <Select
                    name="tipo_entidad_juridica"
                    value={formData.tipo_entidad_juridica}
                    onChange={handleInputChange}
                    label={t('formProtectora.entityType')}
                  >
                    <MenuItem value="">
                      <em>Selecciona...</em>
                    </MenuItem>
                    {ENTIDAD_CHOICES.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =============== CONTACTE =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Phone sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.contactInfo')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  required
                  fullWidth
                  name="telefono"
                  label={t('formProtectora.mainPhone')}
                  value={formData.telefono}
                  onChange={handleInputChange}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  inputProps={{ maxLength: 15 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="telefono_emergencia"
                  label={t('formProtectora.emergencyPhone')}
                  value={formData.telefono_emergencia}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 15 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactPhone sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="web"
                  label={t('formProtectora.website')}
                  value={formData.web}
                  onChange={handleInputChange}
                  error={!!errors.web}
                  helperText={errors.web}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Language sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =============== DIRECCIÓ REFUGI =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.shelterAddress')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="calle_refugio"
                  label={t('formProtectora.street')}
                  value={formData.calle_refugio}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  fullWidth
                  name="numero_refugio"
                  label={t('formProtectora.number')}
                  value={formData.numero_refugio}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="poblacion_refugio"
                  label={t('formProtectora.town')}
                  value={formData.poblacion_refugio}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="codigo_postal_refugio"
                  label={t('formProtectora.postalCode')}
                  value={formData.codigo_postal_refugio}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =============== HORARI =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.schedule')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="horario"
                  label={t('formProtectora.schedule')}
                  value={formData.horario}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =============== INFORMACIÓ ORGANITZATIVA =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Business sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.organizationInfo')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="ano_fundacion"
                  label={t('formProtectora.foundationYear')}
                  type="number"
                  value={formData.ano_fundacion}
                  onChange={handleInputChange}
                  inputProps={{ min: 1900, max: new Date().getFullYear() }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =============== DESCRIPCIÓ I SERVEIS =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Description sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.servicesProcess')}
            </Typography>

            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="descripcion"
              label={t('formProtectora.description')}
              value={formData.descripcion}
              onChange={handleInputChange}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="requisitos_adopcion"
                  label={t('formProtectora.adoptionRequirements')}
                  value={formData.requisitos_adopcion}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="proceso_adopcion"
                  label={t('formProtectora.adoptionProcess')}
                  value={formData.proceso_adopcion}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =============== XARXES SOCIALS =============== */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Group sx={{ mr: 1, verticalAlign: "middle" }} />
              {t('formProtectora.socialNetworks')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="facebook"
                  label={t('formProtectora.facebook')}
                  value={formData.facebook}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="instagram"
                  label={t('formProtectora.instagram')}
                  value={formData.instagram}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="twitter"
                  label={t('formProtectora.twitter')}
                  value={formData.twitter}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            {/* =============== BOTONS D'ACCIÓ =============== */}
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}
            >
              <Button
                variant="contained"
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
                {t('formProtectora.cancelButton')}
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
                {loading ? t('formProtectora.registeringButton') : t('formProtectora.registerButton')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
