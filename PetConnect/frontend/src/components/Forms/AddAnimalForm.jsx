import React, { useState } from "react";
import "./no-scroll-form.css";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import CardAnimal from "../home/CardAnimal.jsx";
import { colors } from "../../constants/colors.jsx";
import api from "../../api/client";

const AddAnimalForm = () => {
    const [previewUrl, setPreviewUrl] = useState("");
  const initialFormData = {
    nombre: "",
    especie: "gato",
    genero: "hembra",
    edad: 0,
    tamaño: "mediano",
    peso: "",
    color: "marrón",
    foto: "",
    necesidades_especiales: false,
    descripcion_necesidades: "",
    convivencia_animales: "no",
    convivencia_ninos: "no",
    caracter: [],
    descripcion: "",
    ubicacion: "Ciudad",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // {type: 'success'|'error', message: ''}

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      // Crear FormData per pujar imatge
      const formDataToSend = new FormData();
      
      // Afegir tots els camps del formulari
      Object.keys(formData).forEach(key => {
        if (key === 'caracter') {
          // Caracter és un array, enviar-lo com a string amb comes
          formDataToSend.append(key, formData[key].join(','));
        } else if (key === 'foto' && formData[key]) {
          // Si hi ha foto (File object)
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Usar axios amb l'API client (afegeix token automàticament)
      const res = await api.post("/mascota/", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Mascota creada:", res.data);
      setStatus({ type: "success", message: "Mascota creada correctament!" });
      setFormData(initialFormData);
    } catch (err) {
      console.error("Error creant mascota:", err);
      const errorMsg = err.response?.data?.detail || err.response?.data || err.message || "Error creant mascota.";
      setStatus({
        type: "error",
        message: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
    //   className="no-scroll-form"
      sx={{
          backgroundColor: colors.backgroundOrange,
          padding: 3,
          minHeight: 'calc(100vh - 90px)',
        // minHeight: "100vh",
        width: "100%",
        justifyContent: "center",
        
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          minHeight: "100vh",
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "nowrap",
           borderRadius:5,
        }}
        >
        {/* esquerra: Formulari */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            borderRadius:5,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              maxHeight: "600px", 
              overflowY: "auto", // ⬅️ CANVI: scroll només aquí
              paddingRight: 1,
            }}
            >
          <Card sx={{ borderRadius: 5, width: "100%",
            
            bgcolor: colors.lightColor,
            maxWidth: 800 }}>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{ mb: 3, fontWeight: "bold" }}
              >
                Afegir un nou animal
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      name="nombre"
                      label="Nom"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Espècie</InputLabel>
                      <Select
                        name="especie"
                        value={formData.especie}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="perro">Perro</MenuItem>
                        <MenuItem value="gato">Gato</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Gènere</InputLabel>
                      <Select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="macho">Macho</MenuItem>
                        <MenuItem value="hembra">Hembra</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      name="edad"
                      label="Edat"
                      type="number"
                      value={formData.edad}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Mida</InputLabel>
                      <Select
                        name="tamaño"
                        value={formData.tamaño}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="pequeño">Pequeño</MenuItem>
                        <MenuItem value="mediano">Mediano</MenuItem>
                        <MenuItem value="grande">Grande</MenuItem>
                        <MenuItem value="gigante">Gigante</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      name="peso"
                      label="Pes (kg)"
                      type="number"
                      value={formData.peso}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      name="color"
                      label="Color"
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Pujar foto
                        <input
                          type="file"
                          accept="image/*"
                          name="foto"
                          hidden
                          onChange={e => {
                            const file = e.target.files[0];
                            setFormData(prev => ({
                              ...prev,
                              foto: file || ""
                            }));
                            if (file) {
                              setPreviewUrl(URL.createObjectURL(file));
                            } else {
                              setPreviewUrl("");
                            }
                          }}
                        />
                      </Button>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.necesidades_especiales}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              necesidades_especiales: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Necessitats especials"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="descripcion_necesidades"
                      label="Descripció de necessitats especials"
                      value={formData.descripcion_necesidades}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Convivència amb altres animals</InputLabel>
                      <Select
                        name="convivencia_animales"
                        value={formData.convivencia_animales}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="no">
                          No pot conviure amb altres animals
                        </MenuItem>
                        <MenuItem value="misma_especie">
                          Només amb animals de la mateixa espècie
                        </MenuItem>
                        <MenuItem value="cualquier_especie">
                          Pot conviure amb qualsevol animal
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Convivència amb nens</InputLabel>
                      <Select
                        name="convivencia_ninos"
                        value={formData.convivencia_ninos}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="si">Sí</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Caràcter:
                    </Typography>
                    <FormGroup row>
                      {[
                        "cariñoso",
                        "jugueton",
                        "tranquilo",
                        "activo",
                        "sociable",
                        "independiente",
                        "protector",
                        "timido",
                        "obediente",
                      ].map((caracter) => (
                        <FormControlLabel
                          key={caracter}
                          control={
                            <Checkbox
                              checked={formData.caracter.includes(caracter)}
                              onChange={() =>
                                handleCheckboxChange("caracter", caracter)
                              }
                            />
                          }
                          label={
                            caracter.charAt(0).toUpperCase() + caracter.slice(1)
                          }
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="descripcion"
                      label="Descripció"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      name="ubicacion"
                      label="Ubicació"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                  >
                    {submitting ? "Enviant..." : "Afegir animal"}
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Cancel·lar
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              {status && (
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      status.type === "success" ? "success.main" : "error.main",
                    mb: 2,
                  }}
                >
                  {status.message}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* dreta: CardAnimal sticky */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            height: "60vh",
            position: "relative",
            
          }}
        >
          <Box
            sx={{
              position: "sticky",
              width: "100%",
              maxWidth: 800,
              zIndex: 2,
            }}
          >
            <Card
              sx={{
                borderRadius: 5,
                width: "100%",
                m: 0,
                p: 5,
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardContent sx={{ }}>
                <Typography variant="h5" sx={{ mb: 2 , maxHeight: "550px",}}>
                  Com queda el teu anunci:
                </Typography>
                <CardAnimal animal={{
                  ...formData,
                  foto: previewUrl || (typeof formData.foto === "string" ? formData.foto : "")
                }} isFavorito={false} onToggleFavorito={() => {}} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddAnimalForm;
