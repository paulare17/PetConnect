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

export default function FormProtectora() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informació bàsica
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
      // Simulem l'enviament
      console.log("Dades de la protectora:", formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Perfil de protectora creat correctament!");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Error en crear el perfil. Intenta-ho de nou.");
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
