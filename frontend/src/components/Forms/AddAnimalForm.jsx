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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import CardPet from "../MostraMascotes/CardPet.jsx";
import { useColors } from "../../hooks/useColors.jsx";
import api from "../../api/client.js";
import CardPetDetail from "../MostraMascotes/CardPetDetail.jsx";
import ProfileMascotaView from "../MostraMascotes/ProfileMascotaView.jsx";
import gatDefecte from "../../assets/gat_defecte.png";
import gosDefecte from "../../assets/gos_defecte.png";
import PreviewDialog from "../MostraMascotes/PreviewDialog.jsx";

const AddAnimalForm = () => {
  const { t } = useTranslation();
  const { colors } = useColors();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [previewUrls, setPreviewUrls] = useState(["", "", ""]);
  // Totes les races de gos del backend
  const RAZAS_PERRO = [
    { value: "MESTIZO", label: t("breeds.mixed") },
    { value: "LABRADOR", label: t("breeds.labrador") },
    { value: "GOLDEN_RETRIEVER", label: t("breeds.goldenRetriever") },
    { value: "PASTOR_ALEMAN", label: t("breeds.germanShepherd") },
    { value: "HUSKY", label: t("breeds.husky") },
    { value: "BEAGLE", label: t("breeds.beagle") },
    { value: "BORDER_COLLIE", label: t("breeds.borderCollie") },
    { value: "ROTTWEILER", label: t("breeds.rottweiler") },
    { value: "PITBULL", label: t("breeds.pitbull") },
    { value: "TECKEL", label: t("breeds.teckel") },
    { value: "POODLE", label: t("breeds.poodle") },
    { value: "BICHON", label: t("breeds.bichon") },
    { value: "CHIHUAHUA", label: t("breeds.chihuahua") },
    { value: "YORKSHIRE_TERRIER", label: t("breeds.yorkshireTerrier") },
    { value: "POMERANIA", label: t("breeds.pomeranian") },
    { value: "MASTIN", label: t("breeds.mastiff") },
    { value: "BULLDOG_FRANCES", label: t("breeds.frenchBulldog") },
    { value: "AKITA_INU", label: t("breeds.akitaInu") },
    { value: "DOBERMAN", label: t("breeds.doberman") },
    { value: "BOXER", label: t("breeds.boxer") },
    { value: "COCKER_SPANIEL", label: t("breeds.cockerSpaniel") },
    { value: "GALGO", label: t("breeds.greyhound") },
    { value: "DOGO_ARGENTINO", label: t("breeds.dogoArgentino") },
    { value: "SAN_BERNARDO", label: t("breeds.saintBernard") },
    { value: "CAREA", label: t("breeds.carea") },
    { value: "PODENCO", label: t("breeds.podenco") },
    { value: "GRAN_DANES", label: t("breeds.greatDane") },
    { value: "CORGI", label: t("breeds.corgi") },
    { value: "SHIH_TZU", label: t("breeds.shihTzu") },
    { value: "SAMOYEDO", label: t("breeds.samoyed") },
    { value: "MALINOIS", label: t("breeds.malinois") },
    { value: "JACK_RUSSELL", label: t("breeds.jackRussell") },
    { value: "SETTER_INGLES", label: t("breeds.englishSetter") },
    { value: "PEKINES", label: t("breeds.pekingese") },
  ];

  // Totes les races de gat del backend
  const RAZAS_GATO = [
    { value: "MESTIZO", label: t("breeds.mixed") },
    { value: "SPHYNX", label: t("breeds.sphynx") },
    { value: "EUROPEO", label: t("breeds.european") },
    { value: "ANGORA_TURCO", label: t("breeds.turkishAngora") },
    { value: "SIAMES", label: t("breeds.siamese") },
    { value: "PERSA", label: t("breeds.persian") },
    { value: "BENGAL", label: t("breeds.bengal") },
    { value: "SIBERIANO", label: t("breeds.siberian") },
    { value: "SCOTTISH_FOLD", label: t("breeds.scottishFold") },
    { value: "AZUL_RUSO", label: t("breeds.russianBlue") },
    { value: "MAINE_COON", label: t("breeds.maineCoon") },
    { value: "BOSQUE_NORUEGA", label: t("breeds.norwegianForest") },
    { value: "TAILANDES", label: t("breeds.thai") },
    { value: "DEVON_REX", label: t("breeds.devonRex") },
    { value: "RAGDOLL", label: t("breeds.ragdoll") },
    { value: "ORIENTAL", label: t("breeds.oriental") },
    { value: "ABISINIO", label: t("breeds.abyssinian") },
  ];

  // Caràcters de gos del backend
  const CARACTER_PERRO = [
    { value: "CARINOSO", label: t("character.affectionate") },
    { value: "FALDERO", label: t("character.lapDog") },
    { value: "DEPENDIENTE", label: t("character.dependent") },
    { value: "DUO_INSEPARABLE", label: t("character.inseparableDuo") },
    { value: "TIMIDO", label: t("character.shy") },
    { value: "MIEDOSO", label: t("character.fearful") },
    { value: "JUGUETON", label: t("character.playful") },
    { value: "ACTIVO_ENERGICO", label: t("character.activeEnergetic") },
    { value: "TRANQUILO", label: t("character.calm") },
    { value: "TRABAJADOR", label: t("character.hardWorking") },
    { value: "SOCIABLE", label: t("character.sociable") },
    { value: "PROTECTOR_GUARDIAN", label: t("character.protectiveGuardian") },
    { value: "DOMINANTE_PERROS", label: t("character.dominantWithDogs") },
    { value: "REACTIVO", label: t("character.reactive") },
    { value: "LIDERAZGO", label: t("character.leadership") },
    { value: "DESCONFIADO_EXTRANOS", label: t("character.distrustfulOfStrangers") },
    { value: "OBEDIENTE", label: t("character.obedient") },
    { value: "OLAFATEADOR", label: t("character.sniffer") },
    { value: "LADRADOR", label: t("character.barker") },
    { value: "ESCAPISTA", label: t("character.escapist") },
    { value: "EXCAVADOR", label: t("character.digger") },
    { value: "GLOTON", label: t("character.glutton") },
    { value: "CABEZOTA", label: t("character.stubborn") },
    { value: "INTELIGENTE", label: t("character.intelligent") },
    { value: "SENSIBLE", label: t("character.sensitive") },
    { value: "LEAL", label: t("character.loyal") },
  ];

  // Caràcters de gat del backend
  const CARACTER_GATO = [
    { value: "CARINOSO", label: t("character.affectionate") },
    { value: "FALDERO", label: t("character.lapCat") },
    { value: "DEPENDIENTE", label: t("character.dependent") },
    { value: "INDEPENDIENTE", label: t("character.independent") },
    { value: "TIMIDO", label: t("character.shy") },
    { value: "ASUSTADIZO", label: t("character.skittish") },
    { value: "JUGUETON", label: t("character.playful") },
    { value: "JUGUETON_INTENSO", label: t("character.intenselyPlayful") },
    { value: "ACTIVO", label: t("character.active") },
    { value: "TRANQUILO", label: t("character.calm") },
    { value: "CAZADOR", label: t("character.hunter") },
    { value: "SOCIABLE", label: t("character.sociable") },
    { value: "AFECTIVO_CONOCIDOS", label: t("character.affectionateWithFamiliar") },
    { value: "TERRITORIAL", label: t("character.territorial") },
    { value: "SEMIFERAL", label: t("character.semiFeral") },
    { value: "OBSERVADOR", label: t("character.observer") },
    { value: "ADAPTABLE", label: t("character.adaptable") },
    { value: "DIVA", label: t("character.diva") },
    { value: "LIMPIO", label: t("character.clean") },
  ];

  const initialFormData = {
    nombre: "",
    especie: "",
    raza: "",
    raza_perro: "",
    raza_gato: "",
    genero: "",
    edad: "",
    tamaño: "",
    color: "",
    foto: "",
    foto2: "",
    foto3: "",
    caracter: [], // Ara és un array per multiselect
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

  // Sincronizar raza y caràcter cuando cambia la especie
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      raza: "",
      caracter: [], // Reset caràcter quan canvia l'espècie
    }));
  }, [formData.especie]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la especie, resetear la raza i caràcter
    if (name === "especie") {
      setFormData((prev) => ({
        ...prev,
        especie: value,
        raza: "MESTIZO",
        raza_perro: value === "PERRO" ? "MESTIZO" : prev.raza_perro,
        raza_gato: value === "GATO" ? "MESTIZO" : prev.raza_gato,
        caracter: [], // Reset caràcter
      }));
    } else if (name === "raza") {
      // Sincronizar raza con el campo correcto según especie
      setFormData((prev) => ({
        ...prev,
        raza: value,
        raza_perro: prev.especie === "PERRO" ? value : prev.raza_perro,
        raza_gato: prev.especie === "GATO" ? value : prev.raza_gato,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handler per al multiselect de caràcter (checkboxes)
  const handleCaracterChange = (caracterValue) => {
    setFormData((prev) => {
      const currentCaracter = prev.caracter || [];
      if (currentCaracter.includes(caracterValue)) {
        // Treure si ja està seleccionat
        return {
          ...prev,
          caracter: currentCaracter.filter((c) => c !== caracterValue),
        };
      } else {
        // Afegir si no està seleccionat
        return {
          ...prev,
          caracter: [...currentCaracter, caracterValue],
        };
      }
    });
  };

  const handleGenerateDescription = async () => {
    setGeneratingDescription(true);
    setStatus(null);

    try {
      // Determinar quina raça usar segons l'espècie
      const razaActual = formData.especie === 'PERRO' 
        ? (formData.raza_perro || formData.raza || '')
        : (formData.raza_gato || formData.raza || '');

      // Preparar los datos para enviar a la IA MODULAR
      // Normalizamos los valores a lo que espera el backend
      const especieNorm = (formData.especie || '').toString().toLowerCase(); // 'perro' | 'gato'
      const sexoNorm = (formData.genero || '').toString().toLowerCase(); // 'macho' | 'hembra'
      const tamanoNorm = (formData.tamaño || '').toString().toLowerCase(); // 'pequeño' | 'mediano' | 'grande' | 'gigante'
      const edadNorm = formData.edad !== '' && formData.edad !== null && formData.edad !== undefined
        ? parseInt(formData.edad, 10)
        : null;

      // Convivencia con niños: asegurar booleano o cadena vacía
      const convNinosNorm = typeof formData.convivencia_ninos === 'boolean'
        ? formData.convivencia_ninos
        : formData.convivencia_ninos === 'true'
          ? true
          : formData.convivencia_ninos === 'false'
            ? false
            : '';

      // Convivencia con animales: IA entiende sí/no; mapeamos opciones a 'si' | 'no' | ''
      let convAnimalesNorm = '';
      if (formData.convivencia_animales === 'no') convAnimalesNorm = 'no';
      else if (formData.convivencia_animales === 'misma_especie' || formData.convivencia_animales === 'cualquier_especie') convAnimalesNorm = 'si';

      const dataForIA = {
        nombre: formData.nombre || 'Mascota',
        especie: especieNorm,
        sexo: sexoNorm,
        edad: edadNorm,
        tamano: tamanoNorm,
        raza: razaActual,
        caracter_necesidad: Array.isArray(formData.caracter) ? formData.caracter.join(', ') : '',
        convivencia_ninos: convNinosNorm,
        convivencia_animales: convAnimalesNorm,
        historia_breve: formData.descripcion_necesidades || '',
      };

      console.log("📤 Enviando datos a IA:", dataForIA);
      const res = await api.post("/ia/generar-bio/", dataForIA);
      console.log("📥 Respuesta de IA:", res.data);

      if (res.data.biografia) {
        setFormData((prev) => ({
          ...prev,
          descripcion: res.data.biografia,
        }));
        setStatus({
          type: "success",
          message: t("addAnimalForm.successGenerated"),
        });
        setTimeout(() => setStatus(null), 3000);
      } else {
        throw new Error("No se recibió descripción del servidor");
      }
    } catch (err) {
      console.error("❌ Error generant descripció amb IA:", err);
      console.error("Error details:", err.response?.data || err.message);

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Error desconocido";

      setStatus({
        type: "error",
        message: `${t("addAnimalForm.errorGenerating")}: ${errorMsg}. ${t(
          "addAnimalForm.manualDescription"
        )}`,
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
        const defaultImagePath =
          formData.especie === "PERRO" ? gosDefecte : gatDefecte;
        const defaultImageName =
          formData.especie === "PERRO" ? "gos_defecte.png" : "gat_defecte.png";

        try {
          // Carregar la imatge per defecte com a File object
          const response = await fetch(defaultImagePath);
          const blob = await response.blob();
          fotoToUpload = new File([blob], defaultImageName, {
            type: blob.type,
          });
        } catch (err) {
          console.warn("No s'ha pogut carregar la imatge per defecte:", err);
        }
      }

      // Camps que necessiten conversió a majúscules per al backend
      const upperCaseFields = ['especie', 'genero', 'raza_perro', 'raza_gato', 'caracter_perro', 'caracter_gato'];
      
      // Camps que NO s'han d'enviar al backend (no existeixen al model)
      const excludeFields = ['raza', 'tamaño', 'tamano', 'caracter', 'convivencia_ninos', 'convivencia_animales', 'color', 'desparasitado', 'esterilizado', 'con_microchip', 'vacunado', 'necesidades_especiales', 'descripcion_necesidades'];

      // Construir array estado_legal_salud - enviar como valores separados
      const estadoLegalSalud = [];
      if (formData.desparasitado) estadoLegalSalud.push('DESPARASITADO');
      if (formData.esterilizado) estadoLegalSalud.push('ESTERILIZADO');
      if (formData.vacunado) estadoLegalSalud.push('VACUNADO');
      if (formData.con_microchip) estadoLegalSalud.push('MICROCHIP');
      
      // Afegir estado_legal_salud al FormData como valores separados (no joinados)
      estadoLegalSalud.forEach(valor => {
        formDataToSend.append('estado_legal_salud', valor);
      });

      // Afegir caràcter com a array (multiselect)
      if (formData.caracter && formData.caracter.length > 0) {
        const backendField = formData.especie === 'PERRO' ? 'caracter_perro' : 'caracter_gato';
        formData.caracter.forEach(c => formDataToSend.append(backendField, c));
      }

      // Afegir les fotos addicionals (foto2 i foto3)
      if (formData.foto2) {
        formDataToSend.append('foto2', formData.foto2);
      }
      if (formData.foto3) {
        formDataToSend.append('foto3', formData.foto3);
      }

      // Afegir tots els camps del formulari
      Object.keys(formData).forEach((key) => {
        // Procesar tamaño especialmente
        if (key === "tamaño" && formData[key]) {
          // 1. Convertir a mayúsculas
          let valueToSend = formData[key].toUpperCase().replace(/\s+/g, '_');
          // 2. Normalizar acentos: NFD descompone caracteres con acento, luego elimina marcas diacríticas
          valueToSend = valueToSend.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          // 3. Enviar como 'tamano' (sin acento)
          formDataToSend.append('tamano', valueToSend);
          return; // Saltar al siguiente campo
        }

        // Saltar camps que no existeixen al backend
        if (excludeFields.includes(key)) {
          return; // Saltar al següent camp
        }
        
        if (key === "foto") {
          if (fotoToUpload) {
            formDataToSend.append(key, fotoToUpload);
          }
        } else if (key === "foto2" || key === "foto3") {
          // Les fotos 2 i 3 ja s'han afegit abans
          return;
        } else if (upperCaseFields.includes(key) && formData[key]) {
          // Convertir a majúscules i reemplaçar espais per guions baixos
          const valueToSend = formData[key].toUpperCase().replace(/\s+/g, '_');
          formDataToSend.append(key, valueToSend);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // DEBUG: Mostrar què s'envia al backend
      console.log("📤 Dades enviades al backend:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      // Usar axios amb l'API client (afegeix token automàticament)
      const res = await api.post("/mascota/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Mascota creada:", res.data);
      setStatus({
        type: "success",
        message: t("addAnimalForm.successCreated"),
      });
      setFormData(initialFormData);
      setPreviewUrls(["", "", ""]);
    } catch (err) {
      console.error("Error creant mascota:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data ||
        err.message ||
        t("addAnimalForm.errorCreating");
      setStatus({
        type: "error",
        message:
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        padding: { xs: 2, md: 3 },
        minHeight: { xs: "auto", md: "calc(100vh - 90px)" },
        width: "100%",
        justifyContent: "center",
        transition: "background-color 0.3s ease",
        overflow: "visible",
      }}
      >
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        sx={{
          minHeight: { xs: "auto", md: "100vh" },
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: { xs: "wrap", md: "nowrap" },
          borderRadius: 5,
          flexDirection: { xs: "column", md: "row" },
          overflow: { xs: "visible", md: "auto" },
        }}
        >
        {/* Formulari - sempre primer */}
        <Grid
          size={{ xs: 12, md: 6.5 }}
          sx={{
            borderRadius: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            maxHeight: { xs: "none", md: "80vh" },
            overflowY: { xs: "visible", md: "auto" },
            paddingRight: { xs: 0, md: 1 },
            order: { xs: 1, md: 1 },
            width: "100%",
          }}
        >
          <Card
            sx={{
              borderRadius: 5,
              width: "100%",

              bgcolor: colors.lightColor,
              transition: "background-color 0.3s ease",
              maxWidth: 800,
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{ 
                  mb: 1, 
                  color: colors.darkBlue,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                }}
              >
                {t("addAnimalForm.title")}
              </Typography>
              {/* Label explicatiu per mòbil */}
              {isMobile && (
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ 
                    mb: 3, 
                    color: colors.orange,
                    fontStyle: "italic",
                  }}
                >
                  {t("addAnimalForm.mobilePreviewHint")}
                </Typography>
              )}
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="nombre"
                      label={t("addAnimalForm.name")}
                      value={formData.nombre}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="filled" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
                      <InputLabel >{t("addAnimalForm.species")}</InputLabel>
                      <Select
                        name="especie"
                        value={formData.especie}
                        onChange={handleInputChange}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem value="PERRO">
                          {t("addAnimalForm.dog")}
                        </MenuItem>
                        <MenuItem value="GATO">
                          {t("addAnimalForm.cat")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel >{t("addAnimalForm.breed")}</InputLabel>
                      <Select
                        name="raza"
                        value={formData.raza}
                        onChange={handleInputChange}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {formData.especie === "PERRO"
                          ? RAZAS_PERRO.map((raza) => (
                              <MenuItem key={raza.value} value={raza.value}>
                                {raza.label}
                              </MenuItem>
                            ))
                          : RAZAS_GATO.map((raza) => (
                              <MenuItem key={raza.value} value={raza.value}>
                                {raza.label}
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>{t("addAnimalForm.gender")}</InputLabel>
                      <Select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem value="MACHO">
                          {t("addAnimalForm.male")}
                        </MenuItem>
                        <MenuItem value="HEMBRA">
                          {t("addAnimalForm.female")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="edad"
                      label={t("addAnimalForm.age")}
                      type="number"
                      value={formData.edad}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>{t("addAnimalForm.size")}</InputLabel>
                      <Select
                        name="tamaño"
                        value={formData.tamaño}
                        onChange={handleInputChange}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {formData.especie === "GATO"
                          ? [
                              <MenuItem value="pequeño" key="pequeño">
                                {t("addAnimalForm.catSmallWeight")}
                              </MenuItem>,
                              <MenuItem value="mediano" key="mediano">
                                {t("addAnimalForm.catMediumWeight")}
                              </MenuItem>,
                              <MenuItem value="grande" key="grande">
                                {t("addAnimalForm.catLargeWeight")}
                              </MenuItem>,
                              <MenuItem value="gigante" key="gigante">
                                {t("addAnimalForm.catGiantWeight")}
                              </MenuItem>,
                            ]
                          : [
                              <MenuItem value="pequeño" key="pequeño">
                                {t("addAnimalForm.dogSmallWeight")}
                              </MenuItem>,
                              <MenuItem value="mediano" key="mediano">
                                {t("addAnimalForm.dogMediumWeight")}
                              </MenuItem>,
                              <MenuItem value="grande" key="grande">
                                {t("addAnimalForm.dogLargeWeight")}
                              </MenuItem>,
                              <MenuItem value="gigante" key="gigante">
                                {t("addAnimalForm.dogGiantWeight")}
                              </MenuItem>,
                            ]}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>{t("addAnimalForm.color")}</InputLabel>
                      <Select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {formData.especie === "gato"
                          ? [
                              <MenuItem key="negro" value="negro">
                                {t("addAnimalForm.black")}
                              </MenuItem>,
                              <MenuItem key="blanco" value="blanco">
                                {t("addAnimalForm.white")}
                              </MenuItem>,
                              <MenuItem key="marrón" value="marrón">
                                {t("addAnimalForm.brown")}
                              </MenuItem>,
                              <MenuItem key="gris" value="gris">
                                {t("addAnimalForm.gray")}
                              </MenuItem>,
                              <MenuItem key="naranja" value="naranja">
                                {t("addAnimalForm.orange")}
                              </MenuItem>,
                              <MenuItem key="dorado" value="dorado">
                                {t("addAnimalForm.golden")}
                              </MenuItem>,
                              <MenuItem key="crema" value="crema">
                                {t("addAnimalForm.cream")}
                              </MenuItem>,
                              <MenuItem key="bicolor" value="bicolor">
                                {t("addAnimalForm.bicolor")}
                              </MenuItem>,
                              <MenuItem key="tricolor" value="tricolor">
                                {t("addAnimalForm.tricolor")}
                              </MenuItem>,
                              <MenuItem key="manchado" value="manchado">
                                {t("addAnimalForm.spotted")}
                              </MenuItem>,
                            ]
                          : [
                              <MenuItem key="negro" value="negro">
                                {t("addAnimalForm.black")}
                              </MenuItem>,
                              <MenuItem key="blanco" value="blanco">
                                {t("addAnimalForm.white")}
                              </MenuItem>,
                              <MenuItem key="marrón" value="marrón">
                                {t("addAnimalForm.brown")}
                              </MenuItem>,
                              <MenuItem key="gris" value="gris">
                                {t("addAnimalForm.gray")}
                              </MenuItem>,
                              <MenuItem key="naranja" value="naranja">
                                {t("addAnimalForm.orange")}
                              </MenuItem>,
                              <MenuItem key="dorado" value="dorado">
                                {t("addAnimalForm.golden")}
                              </MenuItem>,
                              <MenuItem key="crema" value="crema">
                                {t("addAnimalForm.cream")}
                              </MenuItem>,
                              <MenuItem key="bicolor" value="bicolor">
                                {t("addAnimalForm.bicolor")}
                              </MenuItem>,
                              <MenuItem key="tricolor" value="tricolor">
                                {t("addAnimalForm.tricolor")}
                              </MenuItem>,
                              <MenuItem key="manchado" value="manchado">
                                {t("addAnimalForm.spotted")}
                              </MenuItem>,
                            ]}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      {t("addAnimalForm.photos")} (màxim 3)
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {[0, 1, 2].map((index) => {
                        const fotoKey =
                          index === 0 ? "foto" : `foto${index + 1}`;
                        return (
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              width: 96,
                              height: 96,
                            }}
                          >
                            <Button
                              variant="outlined"
                              component="label"
                              sx={{
                                width: "100%",
                                height: "100%",
                                minWidth: 0,
                                p: 0,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                                borderRadius: 2,
                              }}
                            >
                              {previewUrls[index] ? (
                                <Box
                                  component="img"
                                  src={previewUrls[index]}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <Typography
                                  variant="caption"
                                  sx={{ textAlign: "center", px: 1 }}
                                >
                                  {t("addAnimalForm.uploadPhoto")} {index + 1}
                                </Typography>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                name={fotoKey}
                                hidden
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  setFormData((prev) => ({
                                    ...prev,
                                    [fotoKey]: file || "",
                                  }));
                                  if (file) {
                                    const newPreviewUrls = [...previewUrls];
                                    newPreviewUrls[index] =
                                      URL.createObjectURL(file);
                                    setPreviewUrls(newPreviewUrls);
                                  } else {
                                    const newPreviewUrls = [...previewUrls];
                                    newPreviewUrls[index] = "";
                                    setPreviewUrls(newPreviewUrls);
                                  }
                                }}
                              />
                            </Button>
                            {previewUrls[index] && (
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  p: 0.5,
                                  bgcolor: "rgba(255,255,255,0.9)",
                                  "&:hover": { bgcolor: "error.light" },
                                }}
                                onClick={() => {
                                  const fotoKey =
                                    index === 0 ? "foto" : `foto${index + 1}`;
                                  setFormData((prev) => ({
                                    ...prev,
                                    [fotoKey]: "",
                                  }));
                                  const newPreviewUrls = [...previewUrls];
                                  newPreviewUrls[index] = "";
                                  setPreviewUrls(newPreviewUrls);
                                }}
                              >
                                <CloseIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
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
                      label={t("addAnimalForm.specialNeeds")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      name="descripcion_necesidades"
                      label={t("addAnimalForm.specialNeedsDescription")}
                      value={formData.descripcion_necesidades}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>
                        {t("addAnimalForm.coexistenceAnimals")}
                      </InputLabel>
                      <Select
                        name="convivencia_animales"
                        value={formData.convivencia_animales}
                        onChange={handleInputChange}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem value="no">
                          {t("addAnimalForm.noAnimals")}
                        </MenuItem>
                        <MenuItem value="misma_especie">
                          {t("addAnimalForm.sameSpecies")}
                        </MenuItem>
                        <MenuItem value="cualquier_especie">
                          {t("addAnimalForm.anyAnimal")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>
                        {t("addAnimalForm.coexistenceChildren")}
                      </InputLabel>
                      <Select
                        name="convivencia_ninos"
                        value={formData.convivencia_ninos}
                        onChange={handleInputChange}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem value={true}>
                          {t("addAnimalForm.yes")}
                        </MenuItem>
                        <MenuItem value={false}>
                          {t("addAnimalForm.no")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Se ha eliminado la sección de compatibilidad (apto_ninos, necesita_compania_animal, nivel_experiencia) */}

                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: 2, fontWeight: "bold" }}
                    >
                      {t("addAnimalForm.mainCharacter")}
                    </Typography>
                    <FormGroup row sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {(formData.especie === "PERRO" ? CARACTER_PERRO : CARACTER_GATO).map((caracter) => (
                        <FormControlLabel
                          key={caracter.value}
                          control={
                            <Checkbox
                              checked={formData.caracter?.includes(caracter.value) || false}
                              onChange={() => handleCaracterChange(caracter.value)}
                              size="small"
                            />
                          }
                          label={caracter.label}
                          sx={{ 
                            minWidth: '150px',
                            '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                          }}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: 2, fontWeight: "bold" }}
                    >
                      {t("addAnimalForm.healthStatus")}
                    </Typography>
                    <FormGroup row sx={{ gap: 2 }}>
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
                        label={t("addAnimalForm.dewormed")}
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
                        label={t("addAnimalForm.sterilized")}
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
                        label={t("addAnimalForm.microchipped")}
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
                        label={t("addAnimalForm.vaccinated")}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {t("addAnimalForm.petDescription")}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleGenerateDescription}
                        disabled={generatingDescription || !formData.nombre}
                        startIcon={
                          generatingDescription ? (
                            <CircularProgress size={16} />
                          ) : null
                        }
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          fontSize: "0.75rem",
                        }}
                      >
                        {generatingDescription
                          ? t("addAnimalForm.generating")
                          : t("addAnimalForm.generateWithAI")}
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={8}
                      name="descripcion"
                      label={t("addAnimalForm.description")}
                      placeholder={t("addAnimalForm.descriptionPlaceholder")}
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      helperText={t("addAnimalForm.descriptionHelper")}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
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
                    {submitting
                      ? t("addAnimalForm.submitting")
                      : t("addAnimalForm.addAnimal")}
                  </Button>
                  <Button variant="outlined" color="secondary">
                    {t("addAnimalForm.cancel")}
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
        {/* Preview - a sota en mòbil, a la dreta en desktop */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            height: { xs: "auto", md: "auto" },
            position: "relative",
            order: { xs: 2, md: 2 },
            mt: { xs: 2, md: 0 },
            pb: { xs: 4, md: 0 },
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: { xs: "relative", md: "sticky" },
              width: "100%",
              maxWidth: { xs: 400, md: 800 },
              zIndex: 2,
            }}
          >
            <Card
              sx={{
                borderRadius: 5,
                width: "100%",
                m: 0,
                p: { xs: 2, md: 5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, maxHeight: "550px" }}>
                  {t("addAnimalForm.previewTitle")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    mb: 2,
                    fontStyle: "italic",
                    opacity: 0.7,
                  }}
                >
                  {t("addAnimalForm.clickToViewFullProfile")}
                </Typography>
                <Box
                  onClick={() => setOpenPreviewDialog(true)}
                  sx={{ cursor: "pointer" }}
                >
                  <CardPet
                    animal={{
                      ...formData,
                      foto:
                        previewUrls[0] ||
                        (typeof formData.foto === "string"
                          ? formData.foto
                          : ""),
                      foto2:
                        previewUrls[1] ||
                        (typeof formData.foto2 === "string"
                          ? formData.foto2
                          : ""),
                      foto3:
                        previewUrls[2] ||
                        (typeof formData.foto3 === "string"
                          ? formData.foto3
                          : ""),
                    }}
                    isFavorito={false}
                    showFavoriteButton={false}
                    onToggleFavorito={() => {}}
                  />
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
        previewUrls={previewUrls}
      />
    </Box>
  );
};

export default AddAnimalForm;
