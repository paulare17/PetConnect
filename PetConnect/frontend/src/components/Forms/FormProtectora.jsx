import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
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
import { colors } from "../../constants/colors.jsx";
import { useNavigate } from "react-router-dom";
import { tipusAnimalsOptions, serveisOptions } from "../../constants/options.jsx";
import api from "../../api/client";
import { ROLES } from "../../constants/roles.jsx";
import { useAuthContext } from "../../context/AuthProvider.jsx";

export default function FormProtectora() {
  const navigate = useNavigate();
  const { getMe } = useAuthContext();
  const [formData, setFormData] = useState({
    // Informació bàsica
    username: "",
    password: "",
    nombreProtectora: "",
    email: "",
    telefon: "",
    telefonEmergencia: "",
    webSite: "",
    cif: "",
    numRegistroAsociacion: "",
    tipoEntidadJuridica: "",

    // Adreça
    carrer: "",
    ciutat: "",
    codiPostal: "",
    provincia: "Barcelona",
    // Direcció jurídica
    direccionJuridica: "",
    calleJuridica: "",
    numeroJuridica: "",
    poblacionJuridica: "",
    codigoPostalJuridica: "",
    // Direcció refugi (si cal separar)
    direccionRefugio: "",
    calleRefugio: "",
    numeroRefugio: "",
    poblacionRefugio: "",
    codigoPostalRefugio: "",

    // Horaris per dia
    horario_lunes_apertura: "",
    horario_lunes_cierre: "",
    horario_martes_apertura: "",
    horario_martes_cierre: "",
    horario_miercoles_apertura: "",
    horario_miercoles_cierre: "",
    horario_jueves_apertura: "",
    horario_jueves_cierre: "",
    horario_viernes_apertura: "",
    horario_viernes_cierre: "",
    horario_sabado_apertura: "",
    horario_sabado_cierre: "",
    horario_domingo_apertura: "",
    horario_domingo_cierre: "",

    // Informació específica
    tipusAnimals: [],
    capacitatMaxima: "",
    anyFundacio: "",
    nucleoZoologico: "",
    ambitoGeografico: "",
    tipo_animal: "",

    // Descripció i serveis
    descripcio: "",
    serveisOferts: [],

    // Requisits adopció
    requisitoAdopcio: "",
    procesAdopcio: "",

    // Xarxes socials
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // tipusAnimalsOptions and serveisOptions are imported from shared constants

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim())
      newErrors.username = "Nom d'usuari obligatori";
    if (formData.username.length < 3)
      newErrors.username = "Mínim 3 caràcters";
    if (!formData.password.trim())
      newErrors.password = "Contrasenya obligatòria";
    if (formData.password.length < 8)
      newErrors.password = "Mínim 8 caràcters";
    if (!formData.nombreProtectora.trim())
      newErrors.nombreProtectora = "Nom de la protectora obligatori";
    if (!formData.email.trim()) newErrors.email = "Email obligatori";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format d'email invàlid";
    if (!formData.telefon.trim()) newErrors.telefon = "Telèfon obligatori";
    if (!formData.carrer.trim()) newErrors.carrer = "Carrer obligatori";
    if (!formData.ciutat.trim()) newErrors.ciutat = "Ciutat obligatòria";
    if (!formData.codiPostal.trim())
      newErrors.codiPostal = "Codi postal obligatori";
    if (!formData.descripcio.trim())
      newErrors.descripcio = "Descripció obligatòria";
    if (formData.tipusAnimals.length === 0)
      newErrors.tipusAnimals = "Selecciona almenys un tipus d'animal";

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
      // Preparar payload amb tots els camps del formulari
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: ROLES.PROTECTORA,
        city: formData.ciutat,
        // Dades específiques de la protectora
        protectora_data: {
          nombreProtectora: formData.nombreProtectora,
          telefon: formData.telefon,
          telefonEmergencia: formData.telefonEmergencia,
          webSite: formData.webSite,
          cif: formData.cif,
          numRegistroAsociacion: formData.numRegistroAsociacion,
          tipoEntidadJuridica: formData.tipoEntidadJuridica,
          carrer: formData.carrer,
          ciutat: formData.ciutat,
          codiPostal: formData.codiPostal,
          provincia: formData.provincia,
          direccionJuridica: formData.direccionJuridica,
          calleJuridica: formData.calleJuridica,
          numeroJuridica: formData.numeroJuridica,
          poblacionJuridica: formData.poblacionJuridica,
          codigoPostalJuridica: formData.codigoPostalJuridica,
          direccionRefugio: formData.direccionRefugio,
          calleRefugio: formData.calleRefugio,
          numeroRefugio: formData.numeroRefugio,
          poblacionRefugio: formData.poblacionRefugio,
          codigoPostalRefugio: formData.codigoPostalRefugio,
          horario_lunes_apertura: formData.horario_lunes_apertura,
          horario_lunes_cierre: formData.horario_lunes_cierre,
          horario_martes_apertura: formData.horario_martes_apertura,
          horario_martes_cierre: formData.horario_martes_cierre,
          horario_miercoles_apertura: formData.horario_miercoles_apertura,
          horario_miercoles_cierre: formData.horario_miercoles_cierre,
          horario_jueves_apertura: formData.horario_jueves_apertura,
          horario_jueves_cierre: formData.horario_jueves_cierre,
          horario_viernes_apertura: formData.horario_viernes_apertura,
          horario_viernes_cierre: formData.horario_viernes_cierre,
          horario_sabado_apertura: formData.horario_sabado_apertura,
          horario_sabado_cierre: formData.horario_sabado_cierre,
          horario_domingo_apertura: formData.horario_domingo_apertura,
          horario_domingo_cierre: formData.horario_domingo_cierre,
          tipusAnimals: formData.tipusAnimals,
          capacitatMaxima: formData.capacitatMaxima,
          anyFundacio: formData.anyFundacio,
          nucleoZoologico: formData.nucleoZoologico,
          ambitoGeografico: formData.ambitoGeografico,
          tipo_animal: formData.tipo_animal,
          descripcio: formData.descripcio,
          serveisOferts: formData.serveisOferts,
          requisitoAdopcio: formData.requisitoAdopcio,
          procesAdopcio: formData.procesAdopcio,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
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
        "Error en crear el perfil. Intenta-ho de nou.";
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
            <Pets />
            Perfil de Protectora
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
          >
            Completa la informació de la teva protectora per poder oferir els
            teus serveis d'adopció
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Informació Bàsica */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Business sx={{ mr: 1, verticalAlign: "middle" }} />
              Informació Bàsica
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="Nom d'usuari"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!errors.username}
                  helperText={errors.username || "Aquest serà el teu nom d'usuari per accedir"}
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
                  label="Contrasenya"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password || "Mínim 8 caràcters"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactPhone sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="nombreProtectora"
                  label="Nom de la Protectora"
                  value={formData.nombreProtectora}
                  onChange={handleInputChange}
                  error={!!errors.nombreProtectora}
                  helperText={errors.nombreProtectora}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email de contacte"
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

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  required
                  fullWidth
                  name="telefon"
                  label="Telèfon principal"
                  value={formData.telefon}
                  onChange={handleInputChange}
                  error={!!errors.telefon}
                  helperText={errors.telefon}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="cif"
                  label="CIF"
                  value={formData.cif}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="numRegistroAsociacion"
                  label="Núm. registre associació"
                  value={formData.numRegistroAsociacion}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipus entitat</InputLabel>
                  <Select
                    name="tipoEntidadJuridica"
                    value={formData.tipoEntidadJuridica}
                    onChange={handleInputChange}
                    label="Tipus entitat"
                  >
                    <MenuItem value="asociacion">Asociación</MenuItem>
                    <MenuItem value="fundacion">Fundación</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="telefonEmergencia"
                  label="Telèfon d'emergència"
                  value={formData.telefonEmergencia}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactPhone sx={{ color: colors.orange }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="webSite"
                  label="Pàgina web"
                  value={formData.webSite}
                  onChange={handleInputChange}
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

            {/* Adreça */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
              Ubicació
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  name="direccionJuridica"
                  label="Direcció jurídica (adreça completa)"
                  value={formData.direccionJuridica}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  required
                  fullWidth
                  name="carrer"
                  label="Carrer i número"
                  value={formData.carrer}
                  onChange={handleInputChange}
                  error={!!errors.carrer}
                  helperText={errors.carrer}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  required
                  fullWidth
                  name="ciutat"
                  label="Ciutat"
                  value={formData.ciutat}
                  onChange={handleInputChange}
                  error={!!errors.ciutat}
                  helperText={errors.ciutat}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  required
                  fullWidth
                  name="codiPostal"
                  label="Codi Postal"
                  value={formData.codiPostal}
                  onChange={handleInputChange}
                  error={!!errors.codiPostal}
                  helperText={errors.codiPostal}
                />
              </Grid>

            
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Direcció Refugi */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
              Direcció Refugi
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  name="direccionRefugio"
                  label="Direcció del refugi (adreça completa)"
                  value={formData.direccionRefugio}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="calleRefugio"
                  label="Carrer refugi"
                  value={formData.calleRefugio}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  fullWidth
                  name="numeroRefugio"
                  label="Número"
                  value={formData.numeroRefugio}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="poblacionRefugio"
                  label="Població refugi"
                  value={formData.poblacionRefugio}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  name="codigoPostalRefugio"
                  label="Codi postal refugi"
                  value={formData.codigoPostalRefugio}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />


            {/* Horaris per dia */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
              Horaris per dia
            </Typography>
      
            {(() => {
              const diesSetmana = [
                { label: "Dilluns", apertura: "horario_lunes_apertura", cierre: "horario_lunes_cierre" },
                { label: "Dimarts", apertura: "horario_martes_apertura", cierre: "horario_martes_cierre" },
                { label: "Dimecres", apertura: "horario_miercoles_apertura", cierre: "horario_miercoles_cierre" },
                { label: "Dijous", apertura: "horario_jueves_apertura", cierre: "horario_jueves_cierre" },
                { label: "Divendres", apertura: "horario_viernes_apertura", cierre: "horario_viernes_cierre" },
                { label: "Dissabte", apertura: "horario_sabado_apertura", cierre: "horario_sabado_cierre" },
                { label: "Diumenge", apertura: "horario_domingo_apertura", cierre: "horario_domingo_cierre" },
              ];
              return (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {diesSetmana.map((dia) => (
                    <Grid item xs={12} sm={6} md={3} key={dia.label}>
                      <Typography variant="subtitle2" sx ={{mb: 1}}>{dia.label}</Typography>
                      <TextField
                        fullWidth
                        name={dia.apertura}
                        label="Apertura"
                        type="time"
                        value={formData[dia.apertura]}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        name={dia.cierre}
                        label="Tancament"
                        type="time"
                        value={formData[dia.cierre]}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  ))}
                </Grid>
              );
            })()}


            <Divider sx={{ my: 3 }} />

            {/* Informació Específica */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Pets sx={{ mr: 1, verticalAlign: "middle" }} />
              Informació dels Animals
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, color: colors.blue }}>
              Tipus d'animals que acolliu: *
            </Typography>
            <FormGroup row sx={{ mb: 3 }}>
              {tipusAnimalsOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  control={
                    <Checkbox
                      checked={formData.tipusAnimals.includes(opt.value)}
                      onChange={() =>
                        handleCheckboxChange("tipusAnimals", opt.value)
                      }
                      sx={{ color: colors.blue }}
                    />
                  }
                  label={opt.label}
                />
              ))}
            </FormGroup>
            {errors.tipusAnimals && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mb: 2, display: "block" }}
              >
                {errors.tipusAnimals}
              </Typography>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="capacitatMaxima"
                  label="Capacitat màxima d'animals"
                  type="number"
                  value={formData.capacitatMaxima}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipus d'animal</InputLabel>
                  <Select
                    name="tipo_animal"
                    value={formData.tipo_animal || ""}
                    onChange={handleInputChange}
                    label="Tipus d'animal"
                  >
                    <MenuItem value="perro">Perro</MenuItem>
                    <MenuItem value="gato">Gato</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="ambitoGeografico"
                  label="Àmbit geogràfic"
                  value={formData.ambitoGeografico}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="anyFundacio"
                  label="Any de fundació"
                  type="number"
                  value={formData.anyFundacio}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="numeroRegistre"
                  label="Número de registre"
                  value={formData.numeroRegistre}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Descripció i Serveis */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Description sx={{ mr: 1, verticalAlign: "middle" }} />
              Descripció i Serveis
            </Typography>

            <TextField
              required
              fullWidth
              multiline
              rows={4}
              name="descripcio"
              label="Descripció de la protectora"
              value={formData.descripcio}
              onChange={handleInputChange}
              error={!!errors.descripcio}
              helperText={
                errors.descripcio ||
                "Explica la història, missió i valors de la protectora"
              }
              sx={{ mb: 3 }}
            />

            <Typography variant="body2" sx={{ mb: 2, color: colors.blue }}>
              Serveis que oferiu:
            </Typography>
            <FormGroup row sx={{ mb: 4 }}>
              {serveisOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  control={
                    <Checkbox
                      checked={formData.serveisOferts.includes(opt.value)}
                      onChange={() =>
                        handleCheckboxChange("serveisOferts", opt.value)
                      }
                      sx={{ color: colors.blue }}
                    />
                  }
                  label={opt.label}
                />
              ))}
            </FormGroup>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="requisitoAdopcio"
                  label="Requisits per l'adopció"
                  value={formData.requisitoAdopcio}
                  onChange={handleInputChange}
                  helperText="Explica els requisits que han de complir els adoptants"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="procesAdopcio"
                  label="Procés d'adopció"
                  value={formData.procesAdopcio}
                  onChange={handleInputChange}
                  helperText="Descriu el procés que seguiu per les adopcions"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Xarxes Socials */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: colors.blue, fontWeight: "bold" }}
            >
              <Group sx={{ mr: 1, verticalAlign: "middle" }} />
              Xarxes Socials
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="facebook"
                  label="Facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/..."
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="instagram"
                  label="Instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/..."
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="twitter"
                  label="Twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/..."
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
                    color: 'white',
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
                {loading ? "Creant perfil..." : "Crear Perfil de Protectora"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
