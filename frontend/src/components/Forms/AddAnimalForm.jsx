import React, { useState, useEffect } from "react";
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
  Chip,
  Autocomplete,
} from "@mui/material";
import CardAnimal from "../home/CardAnimal.jsx";
import { colors } from "../../constants/colors.jsx";
import api from "../../api/client";

const AddAnimalForm = () => {
    const [previewUrl, setPreviewUrl] = useState("");
  const initialFormData = {
    nombre: "",
    especie: "gato",
    raza: "",
    raza_perro: "",
    raza_gato: "",
    genero: "hembra",
    edad: "",
    tamaño: "",
    color: "",
    foto: "",
    caracter: [],
    convivencia_animales: "",
    convivencia_ninos: "",
    desparasitado: false,
    esterilizado: false,
    con_microchip: false,
    vacunado: false,
    necesidades_especiales: false,
    descripcion_necesidades: "",
    descripcion: "",
    adoptado: false,
    oculto: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [status, setStatus] = useState(null); // {type: 'success'|'error', message: ''}
  
  // Estado para las opciones del formulario
  const [formChoices, setFormChoices] = useState({
    especies: [],
    generos: [],
    razas_perros: [],
    razas_gatos: [],
    tamanos: [],
    caracteres: [],
    convivencia_animales: [],
    colores: [],
    convivencia_ninos: []
  });

  // Cargar opciones del formulario desde el backend
  useEffect(() => {
    const fetchFormChoices = async () => {
      try {
        const res = await api.get("/form-choices/");
        setFormChoices(res.data);
      } catch (error) {
        console.error("Error cargando opciones del formulario:", error);
      }
    };
    fetchFormChoices();
  }, []);

  // Sincronizar raza cuando cambia la especie
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      raza: ''
    }));
  }, [formData.especie]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia la especie, resetear la raza
    if (name === 'especie') {
      setFormData((prev) => ({
        ...prev,
        especie: value,
        raza: 'mestizo',
        raza_perro: value === 'perro' ? 'mestizo' : prev.raza_perro,
        raza_gato: value === 'gato' ? 'mestizo' : prev.raza_gato,
      }));
    } else if (name === 'raza') {
      // Sincronizar raza con el campo correcto según especie
      setFormData((prev) => ({
        ...prev,
        raza: value,
        raza_perro: prev.especie === 'perro' ? value : prev.raza_perro,
        raza_gato: prev.especie === 'gato' ? value : prev.raza_gato,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCaracterChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      caracter: value,
    }));
  };

  const handleGenerateDescription = async () => {
    setGeneratingDescription(true);
    setStatus(null);
    
    try {
      // Preparar los datos para enviar a la IA
      const dataForIA = {
        nombre: formData.nombre || "Mascota",
        especie: formData.especie,
        raza_perro: formData.especie === 'perro' ? formData.raza : undefined,
        raza_gato: formData.especie === 'gato' ? formData.raza : undefined,
        edad: parseInt(formData.edad) || 1,
        genero: formData.genero,
        tamaño: formData.tamaño,
        caracter: Array.isArray(formData.caracter) ? formData.caracter.join(', ') : formData.caracter || '',
        convivencia_ninos: formData.convivencia_ninos === "" ? undefined : formData.convivencia_ninos,
        convivencia_animales: formData.convivencia_animales,
        descripcion_necesidades: formData.descripcion_necesidades,
        // Estado de salud
        desparasitado: formData.desparasitado,
        esterilizado: formData.esterilizado,
        con_microchip: formData.con_microchip,
        vacunado: formData.vacunado
      };

      console.log('📤 Enviando datos a IA:', dataForIA);
      const res = await api.post("/generate-description/", dataForIA);
      console.log('📥 Respuesta de IA:', res.data);
      
      if (res.data.success && res.data.descripcion) {
        setFormData(prev => ({
          ...prev,
          descripcion: res.data.descripcion
        }));
        setStatus({ type: "success", message: "¡Descripción generada con IA! 🤖" });
        setTimeout(() => setStatus(null), 3000);
      } else {
        throw new Error('No se recibió descripción del servidor');
      }
    } catch (err) {
      console.error("❌ Error generant descripció amb IA:", err);
      console.error("Error details:", err.response?.data || err.message);
      
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || err.message || "Error desconocido";
      
      setStatus({
        type: "error",
        message: `Error: ${errorMsg}. Puedes escribir la descripción manualmente.`
      });
    } finally {
      setGeneratingDescription(false);
    }
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
        if (key === 'foto' && formData[key]) {
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
                    <Autocomplete
                      options={formChoices.especies.map(e => e.value)}
                      value={formData.especie}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          especie: newValue || '',
                          raza: '',
                          raza_perro: newValue === 'perro' ? '' : prev.raza_perro,
                          raza_gato: newValue === 'gato' ? '' : prev.raza_gato,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Espècie" />
                      )}
                      getOptionLabel={(option) => {
                        const found = formChoices.especies.find(e => e.value === option);
                        return found ? found.label : option;
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={(formData.especie === 'perro' 
                        ? formChoices.razas_perros 
                        : formChoices.razas_gatos
                      ).map(r => r.value)}
                      value={formData.raza}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          raza: newValue || '',
                          raza_perro: prev.especie === 'perro' ? newValue || '' : prev.raza_perro,
                          raza_gato: prev.especie === 'gato' ? newValue || '' : prev.raza_gato,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Raça" />
                      )}
                      getOptionLabel={(option) => {
                        const razas = formData.especie === 'perro' ? formChoices.razas_perros : formChoices.razas_gatos;
                        const found = razas.find(r => r.value === option);
                        return found ? found.label : option;
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={formChoices.generos.map(g => g.value)}
                      value={formData.genero}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, genero: newValue || '' }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Gènere" />
                      )}
                      getOptionLabel={(option) => {
                        const found = formChoices.generos.find(g => g.value === option);
                        return found ? found.label : option;
                      }}
                    />
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
                    <Autocomplete
                      options={formChoices.tamanos.map(t => t.value)}
                      value={formData.tamaño}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, tamaño: newValue || '' }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Mida" />
                      )}
                      getOptionLabel={(option) => {
                        const found = formChoices.tamanos.find(t => t.value === option);
                        return found ? found.label : option;
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={formChoices.colores.map(c => c.value)}
                      value={formData.color}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, color: newValue || '' }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Color" />
                      )}
                      getOptionLabel={(option) => {
                        const found = formChoices.colores.find(c => c.value === option);
                        return found ? found.label : option;
                      }}
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
                    <Autocomplete
                      options={formChoices.convivencia_animales.map(c => c.value)}
                      value={formData.convivencia_animales}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, convivencia_animales: newValue || '' }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Convivència amb altres animals" />
                      )}
                      getOptionLabel={(option) => {
                        const found = formChoices.convivencia_animales.find(c => c.value === option);
                        return found ? found.label : option;
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={formChoices.convivencia_ninos.map(c => c.value)}
                      value={formData.convivencia_ninos}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, convivencia_ninos: newValue === null ? '' : newValue }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Convivència amb nens" />
                      )}
                      getOptionLabel={(option) => {
                        const found = formChoices.convivencia_ninos.find(c => c.value === option);
                        return found ? found.label : (option === true ? 'Sí' : 'No');
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      multiple
                      options={formChoices.caracteres.map(c => c.value)}
                      value={formData.caracter}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          caracter: newValue
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Caràcter (pots seleccionar múltiples i buscar)"
                          placeholder="Escriu per buscar..."
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const found = formChoices.caracteres.find(c => c.value === option);
                          return (
                            <Chip
                              label={found ? found.label : option}
                              {...getTagProps({ index })}
                              size="small"
                            />
                          );
                        })
                      }
                      getOptionLabel={(option) => {
                        const found = formChoices.caracteres.find(c => c.value === option);
                        return found ? found.label : option;
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Estat de salut:
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.desparasitado}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                desparasitado: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Desparasitat"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.esterilizado}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                esterilizado: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Esterilitzat"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.con_microchip}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                con_microchip: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Amb microxip"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.vacunado}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                vacunado: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Vacunat"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        Descripció de la mascota
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleGenerateDescription}
                        disabled={generatingDescription || !formData.nombre}
                        startIcon={generatingDescription ? <CircularProgress size={16} /> : null}
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: 2,
                          fontSize: '0.75rem'
                        }}
                      >
                        {generatingDescription ? 'Generant amb IA...' : '✨ Generar amb IA'}
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={10}
                      name="descripcion"
                      label="Descripció"
                      placeholder="Escriu una descripció o genera-la automàticament amb IA"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      helperText="Pots generar una descripció automàtica amb IA o escriure-la tu mateix/a"
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
