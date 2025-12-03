import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
  CardMedia,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import CardPet from "../MostraMascotes/CardPet.jsx";
import { useColors } from "../../hooks/useColors";
import api from "../../api/client";
import CardPetDetail from "../MostraMascotes/CardPetDetail.jsx";
import ProfileMascotaView from "../MostraMascotes/ProfileMascotaView.jsx";
import gatDefecte from "../../assets/gat_defecte.png";
import gosDefecte from "../../assets/gos_defecte.png";
import PreviewDialog from "./PreviewDialog.jsx";

const AddAnimalForm = () => {
  const { t } = useTranslation();
  const { colors } = useColors();
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
    caracter: "",
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
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

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
        caracter: formData.caracter || 'cariñoso',
        convivencia_ninos: formData.convivencia_ninos === "" ? undefined : formData.convivencia_ninos,
        convivencia_animales: formData.convivencia_animales,
        descripcion_necesidades: formData.descripcion_necesidades
      };

      console.log('📤 Enviando datos a IA:', dataForIA);
      const res = await api.post("/generate-description/", dataForIA);
      console.log('📥 Respuesta de IA:', res.data);
      
      if (res.data.success && res.data.descripcion) {
        setFormData(prev => ({
          ...prev,
          descripcion: res.data.descripcion
        }));
        setStatus({ type: "success", message: t('addAnimalForm.successGenerated') });
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
        message: `${t('addAnimalForm.errorGenerating')}: ${errorMsg}. ${t('addAnimalForm.manualDescription')}`
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
      
      // Si no hi ha foto, carregar la imatge per defecte segons l'espècie
      let fotoToUpload = formData.foto;
      
      if (!formData.foto) {
        // Determinar quina imatge per defecte utilitzar
        const defaultImagePath = formData.especie === 'perro' ? gosDefecte : gatDefecte;
        const defaultImageName = formData.especie === 'perro' ? 'gos_defecte.png' : 'gat_defecte.png';
        
        try {
          // Carregar la imatge per defecte com a File object
          const response = await fetch(defaultImagePath);
          const blob = await response.blob();
          fotoToUpload = new File([blob], defaultImageName, { type: blob.type });
        } catch (err) {
          console.warn('No s\'ha pogut carregar la imatge per defecte:', err);
        }
      }
      
      // Afegir tots els camps del formulari
      Object.keys(formData).forEach(key => {
        if (key === 'foto') {
          if (fotoToUpload) {
            formDataToSend.append(key, fotoToUpload);
          }
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
      setStatus({ type: "success", message: t('addAnimalForm.successCreated') });
      setFormData(initialFormData);
    } catch (err) {
      console.error("Error creant mascota:", err);
      const errorMsg = err.response?.data?.detail || err.response?.data || err.message || t('addAnimalForm.errorCreating');
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
          backgroundColor: colors.background,
          padding: 3,
          minHeight: 'calc(100vh - 90px)',
        // minHeight: "100vh",
        width: "100%",
        justifyContent: "center",
        transition: 'background-color 0.3s ease',
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
            transition: 'background-color 0.3s ease',
            maxWidth: 800 }}>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{ mb: 3, color: colors.darkBlue, }}
              >
                {t('addAnimalForm.title')}
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      name="nombre"
                      label={t('addAnimalForm.name')}
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.species')}</InputLabel>
                      <Select
                        name="especie"
                        value={formData.especie}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="perro">{t('addAnimalForm.dog')}</MenuItem>
                        <MenuItem value="gato">{t('addAnimalForm.cat')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.breed')}</InputLabel>
                      <Select
                        name="raza"
                        value={formData.raza}
                        onChange={handleInputChange}
                      >
                        {formData.especie === 'perro' ? [
                            <MenuItem key="mestizo" value="mestizo">{t('addAnimalForm.mixed')}</MenuItem>,
                            <MenuItem key="labrador" value="labrador">{t('addAnimalForm.labrador')}</MenuItem>,
                            <MenuItem key="pastor_aleman" value="pastor_aleman">{t('addAnimalForm.germanShepherd')}</MenuItem>,
                            <MenuItem key="bulldog" value="bulldog">{t('addAnimalForm.bulldog')}</MenuItem>,
                            <MenuItem key="beagle" value="beagle">{t('addAnimalForm.beagle')}</MenuItem>
                        ] : [
                            <MenuItem key="mestizo" value="mestizo">{t('addAnimalForm.mixed')}</MenuItem>,
                            <MenuItem key="siames" value="siames">{t('addAnimalForm.siamese')}</MenuItem>,
                            <MenuItem key="persa" value="persa">{t('addAnimalForm.persian')}</MenuItem>
                        ]}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.gender')}</InputLabel>
                      <Select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="macho">{t('addAnimalForm.male')}</MenuItem>
                        <MenuItem value="hembra">{t('addAnimalForm.female')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      name="edad"
                      label={t('addAnimalForm.age')}
                      type="number"
                      value={formData.edad}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.size')}</InputLabel>
                      <Select
                        name="tamaño"
                        value={formData.tamaño}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="pequeño">{t('addAnimalForm.small')}</MenuItem>
                        <MenuItem value="mediano">{t('addAnimalForm.medium')}</MenuItem>
                        <MenuItem value="grande">{t('addAnimalForm.large')}</MenuItem>
                        <MenuItem value="gigante">{t('addAnimalForm.giant')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.color')}</InputLabel>
                      <Select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                      >
                        {formData.especie === 'gato' ? [
                          <MenuItem key="negro" value="negro">{t('addAnimalForm.black')}</MenuItem>,
                          <MenuItem key="blanco" value="blanco">{t('addAnimalForm.white')}</MenuItem>,
                          <MenuItem key="marrón" value="marrón">{t('addAnimalForm.brown')}</MenuItem>,
                          <MenuItem key="gris" value="gris">{t('addAnimalForm.gray')}</MenuItem>,
                          <MenuItem key="naranja" value="naranja">{t('addAnimalForm.orange')}</MenuItem>,
                          <MenuItem key="dorado" value="dorado">{t('addAnimalForm.golden')}</MenuItem>,
                          <MenuItem key="crema" value="crema">{t('addAnimalForm.cream')}</MenuItem>,
                          <MenuItem key="bicolor" value="bicolor">{t('addAnimalForm.bicolor')}</MenuItem>,
                          <MenuItem key="tricolor" value="tricolor">{t('addAnimalForm.tricolor')}</MenuItem>,
                          <MenuItem key="manchado" value="manchado">{t('addAnimalForm.spotted')}</MenuItem>
                        ] : [
                          <MenuItem key="negro" value="negro">{t('addAnimalForm.black')}</MenuItem>,
                          <MenuItem key="blanco" value="blanco">{t('addAnimalForm.white')}</MenuItem>,
                          <MenuItem key="marrón" value="marrón">{t('addAnimalForm.brown')}</MenuItem>,
                          <MenuItem key="gris" value="gris">{t('addAnimalForm.gray')}</MenuItem>,
                          <MenuItem key="naranja" value="naranja">{t('addAnimalForm.orange')}</MenuItem>,
                          <MenuItem key="dorado" value="dorado">{t('addAnimalForm.golden')}</MenuItem>,
                          <MenuItem key="crema" value="crema">{t('addAnimalForm.cream')}</MenuItem>,
                          <MenuItem key="bicolor" value="bicolor">{t('addAnimalForm.bicolor')}</MenuItem>,
                          <MenuItem key="tricolor" value="tricolor">{t('addAnimalForm.tricolor')}</MenuItem>,
                          <MenuItem key="manchado" value="manchado">{t('addAnimalForm.spotted')}</MenuItem>
                        ]}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        {t('addAnimalForm.uploadPhoto')}
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
                      label={t('addAnimalForm.specialNeeds')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="descripcion_necesidades"
                      label={t('addAnimalForm.specialNeedsDescription')}
                      value={formData.descripcion_necesidades}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.coexistenceAnimals')}</InputLabel>
                      <Select
                        name="convivencia_animales"
                        value={formData.convivencia_animales}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="no">
                          {t('addAnimalForm.noAnimals')}
                        </MenuItem>
                        <MenuItem value="misma_especie">
                          {t('addAnimalForm.sameSpecies')}
                        </MenuItem>
                        <MenuItem value="cualquier_especie">
                          {t('addAnimalForm.anyAnimal')}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.coexistenceChildren')}</InputLabel>
                      <Select
                        name="convivencia_ninos"
                        value={formData.convivencia_ninos}
                        onChange={handleInputChange}
                      >
                        <MenuItem value={true}>{t('addAnimalForm.yes')}</MenuItem>
                        <MenuItem value={false}>{t('addAnimalForm.no')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addAnimalForm.mainCharacter')}</InputLabel>
                      <Select
                        name="caracter"
                        value={formData.caracter}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="cariñoso">{t('addAnimalForm.affectionate')}</MenuItem>
                        <MenuItem value="jugueton">{t('addAnimalForm.playful')}</MenuItem>
                        <MenuItem value="tranquilo">{t('addAnimalForm.calm')}</MenuItem>
                        <MenuItem value="activo">{t('addAnimalForm.active')}</MenuItem>
                        <MenuItem value="sociable">{t('addAnimalForm.sociable')}</MenuItem>
                        <MenuItem value="independiente">{t('addAnimalForm.independent')}</MenuItem>
                        <MenuItem value="protector">{t('addAnimalForm.protective')}</MenuItem>
                        <MenuItem value="timido">{t('addAnimalForm.shy')}</MenuItem>
                        <MenuItem value="obediente">{t('addAnimalForm.obedient')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {t('addAnimalForm.healthStatus')}
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
                        label={t('addAnimalForm.dewormed')}
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
                        label={t('addAnimalForm.sterilized')}
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
                        label={t('addAnimalForm.microchipped')}
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
                        label={t('addAnimalForm.vaccinated')}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        {t('addAnimalForm.petDescription')}
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
                        {generatingDescription ? t('addAnimalForm.generating') : t('addAnimalForm.generateWithAI')}
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      name="descripcion"
                      label={t('addAnimalForm.description')}
                      placeholder={t('addAnimalForm.descriptionPlaceholder')}
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      helperText={t('addAnimalForm.descriptionHelper')}
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
                    {submitting ? t('addAnimalForm.submitting') : t('addAnimalForm.addAnimal')}
                  </Button>
                  <Button variant="outlined" color="secondary">
                    {t('addAnimalForm.cancel')}
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
        {/* dreta: CardPet sticky */}
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
                  {t('addAnimalForm.previewTitle')}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    color: 'text.secondary',
                    mb: 2,
                    fontStyle: 'italic',
                    opacity: 0.7
                  }}
                >
                  {t('addAnimalForm.clickToViewFullProfile')}
                </Typography>
                <Box onClick={() => setOpenPreviewDialog(true)} sx={{ cursor: 'pointer' }}>
                  <CardPet animal={{
                    ...formData,
                    foto: previewUrl || (typeof formData.foto === "string" ? formData.foto : "")
                  }} isFavorito={false} onToggleFavorito={() => {}} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Dialog de Preview amb dos components */}
      <PreviewDialog
        openPreviewDialog={openPreviewDialog}
        setOpenPreviewDialog={setOpenPreviewDialog}
        formData={formData}
        previewUrl={previewUrl}
      />
    </Box>
  );
};

export default AddAnimalForm;
