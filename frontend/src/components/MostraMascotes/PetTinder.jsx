import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useColors } from "../../hooks/useColors";
import api from "../../../../../frontend/src/api/client.js";
import ChatMiniList from "../Chat/ChatMiniList.jsx";
import Chat from "../Chat/Chat.jsx";
import CardPet from "./CardPet.jsx";
import CardPetDetail from "./CardPetDetail.jsx";
import PetTinderButton from "../../../../../frontend/src/components/Buttons/PetTinderButton.jsx";

function PetTinder() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  
  // Llista de recomanacions IA i índex actual
  const [recomanacions, setRecomanacions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback al sistema antic si la IA falla
  const fetchNextAnimalFallback = useCallback(() => {
    api
      .get("/pettinder/next/")
      .then((response) => {
        if (response.data.id) {
          setAnimal(response.data);
          setRecomanacions([response.data]);
        } else {
          setAnimal({ message: response.data.message });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(t('petTinder.errorFetch'), err);
        setError(t('petTinder.errorLoading'));
        setLoading(false);
      });
  }, [t]);

  // Funció per carregar recomanacions IA
  const fetchRecomanacions = useCallback(() => {
    setLoading(true);
    setError(null);
    setMessage("");

    // Crida al sistema de recomanació IA
    api
      .get("/ia/recomendacion/?limit=50")
      .then((response) => {
        const llista = response.data.recomendaciones || [];
        setRecomanacions(llista);
        setCurrentIndex(0);
        
        if (llista.length > 0) {
          setAnimal(llista[0]);
        } else {
          setAnimal({ message: response.data.mensaje || "No hi ha més mascotes disponibles!" });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(t('petTinder.errorFetch'), err);
        // Fallback al sistema antic si falla la IA
        fetchNextAnimalFallback();
      });
  }, [t, fetchNextAnimalFallback]);

  // Funció per passar al següent animal de la llista
  const goToNextAnimal = useCallback(() => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < recomanacions.length) {
      setCurrentIndex(nextIndex);
      setAnimal(recomanacions[nextIndex]);
    } else {
      // S'han acabat les recomanacions, recarregar
      fetchRecomanacions();
    }
  }, [currentIndex, recomanacions, fetchRecomanacions]);

  // Se ejecuta al montar el componente
  useEffect(() => {
    fetchRecomanacions();
  }, [fetchRecomanacions]);

  // Función genérica para manejar las acciones (Like/Dislike)
  const handleAction = (actionType) => {
    if (!animal || animal.message) return;

    const actionData = {
      animal_id: animal.id,
      action: actionType,
    };

    api
      .post("/pettinder/action/", actionData)
      .then((response) => {
        setMessage(
          `${t('petTinder.action')} ${
            actionType === "like" ? t('petTinder.actionLike') : t('petTinder.actionDislike')
          } ${t('petTinder.actionRegistered')} ${animal.nombre}!`
        );
        // Si és un like i el backend retorna chat_id, obrim el xat
        if (
          actionType === "like" &&
          response.data.is_like &&
          response.data.chat_id
        ) {
          // En mòbil, naveguem a la pàgina del xat a pantalla completa
          if (isMobile) {
            navigate(`/chat/${response.data.chat_id}`);
          } else {
            // En desktop, obrim el xat inline
            setSelectedChatId(response.data.chat_id);
          }
        }
        // Passar al següent animal de la llista de recomanacions
        setTimeout(() => goToNextAnimal(), 500);
      })
      .catch((err) => {
        console.error(`Error al registrar ${actionType}:`, err);
        setMessage(t('petTinder.errorAction'));
      });
  };

  // --- Renderitzat ---
  // Capçalera - sempre visible, adaptada per mòbil
  const renderHeader = () => (
    <Box sx={{ 
      textAlign: "center", 
      py: { xs: 1, md: 4 },
      position: "relative",
    }}>
      {/* Botó de xats només visible en mòbil */}
      <IconButton 
        onClick={() => navigate('/chats')}
        sx={{ 
          display: { xs: "flex", md: "none" },
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: colors.orange,
          color: "white",
          "&:hover": { backgroundColor: colors.darkOrange }
        }}
      >
        <ChatIcon />
      </IconButton>
      
      <Typography
        variant="h3"
        component="h1"
        sx={{
          color: colors.orange,
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 1, md: 2 },
          fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        <PetsIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
        {t('petTinder.title')}
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          color: colors.darkBlue,
          fontSize: { xs: "0.9rem", md: "1.25rem" },
          px: { xs: 2, md: 0 },
        }}
      >
        {t('petTinder.subtitle')}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ backgroundColor: colors.background, minHeight: "100vh" }}>
        {renderHeader()}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: { xs: "80vh", md: "50vh" },
          }}
        >
          <CircularProgress sx={{ color: colors.orange }} size={60} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ backgroundColor: colors.background, minHeight: "100vh" }}>
        {renderHeader()}
        <Container sx={{ mt: 4, px: { xs: 2, md: 3 } }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  // Si no quedan animales disponibles
  if (animal && animal.message) {
    return (
      <Box
        sx={{
          backgroundColor: colors.background,
          minHeight: "100vh",
        }}
      >
        {renderHeader()}
        <Box textAlign="center" mt={{ xs: 4, md: 6 }} px={2}>
          <Typography variant="h5" color="text.secondary">
            {animal.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  // --- Layout MÒBIL: només card i botons ---
  if (isMobile) {
    return (
      <Box sx={{ 
        backgroundColor: colors.background, 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        {renderHeader()}
        
        {/* Contingut principal - Card centrada */}
        <Box sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          px: 2,
          pt: 10,
          pb: 2,
        }}>
          {message && (
            <Alert
              severity="success"
              sx={{ mb: 2, width: "100%", maxWidth: 360 }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          )}
          
          {/* Card de la mascota */}
          <Box 
            sx={{ 
              width: "100%",
              maxWidth: 360, 
              height: "auto",
              maxHeight: "60vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CardPet 
              animal={animal} 
              sx={{ 
                width: "100%", 
                height: "100%",
                maxHeight: "55vh",
              }} 
              showFavoriteButton={false} 
            />
          </Box>

          {/* Botons d'acció */}
          <Box
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              mt: 3, 
              gap: 2,
              width: "100%",
              maxWidth: 360,
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<CloseIcon />}
              onClick={() => handleAction("dislike")}
              sx={{
                flex: 1,
                backgroundColor: colors.purple,
                color: "white",
                borderRadius: "50px",
                py: 1.5,
                fontSize: "0.95rem",
                "&:hover": {
                  backgroundColor: colors.darkBlue,
                },
                transition: "all 0.2s",
              }}
            >
              {t('petTinder.dislikeButton')}
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<FavoriteIcon />}
              onClick={() => handleAction("like")}
              sx={{
                flex: 1,
                backgroundColor: colors.orange,
                color: "white",
                borderRadius: "50px",
                py: 1.5,
                fontSize: "0.95rem",
                "&:hover": {
                  backgroundColor: colors.darkOrange,
                },
                transition: "all 0.2s",
              }}
            >
              {t('petTinder.likeButton')}
            </Button>
          </Box>
        </Box>

        {/* Botó sticky cap a Galeria */}
        <PetTinderButton 
          route="/inici-usuari-galeria" 
          labelKey="petTinder.galleryButton" 
        />
      </Box>
    );
  }

  // --- Layout DESKTOP amb ChatMiniList, CardPet sempre visible i Chat a la dreta ---
  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      {renderHeader()}
    
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { 
            md: "280px 1fr 280px",
            lg: "320px 1fr 320px",
          },
          gap: { md: 2, lg: 4 },
          maxWidth: "1400px",
          margin: "0 auto",
          px: 3,
          pb: 3,
        }}
      >
        {/* Panell esquerre: mini llista o xat inline */}
        <Box sx={{ height: 600 }}>
          {selectedChatId ? (
            <Chat
              chatId={selectedChatId}
              onClose={() => setSelectedChatId(null)}
              embedded
            />
          ) : (
            <ChatMiniList maxHeight={600} onSelectChat={setSelectedChatId} />
          )}
        </Box>

        {/* Columna central: Card de mascota sempre visible */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {message && (
            <Alert
              severity="success"
              sx={{ mb: 2, width: "100%", maxWidth: 380 }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          )}
          <Box 
            sx={{ 
              width: "100%",
              maxWidth: 380, 
              height: 480,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CardPet 
              animal={animal} 
              sx={{ width: "100%", height: "100%" }} 
              showFavoriteButton={false} 
            />
          </Box>

          {/* botons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<CloseIcon />}
              onClick={() => handleAction("dislike")}
              sx={{
                backgroundColor: colors.purple,
                color: "white",
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: colors.darkBlue,
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s",
              }}
            >
              {t('petTinder.dislikeButton')}
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<FavoriteIcon />}
              onClick={() => handleAction("like")}
              sx={{
                backgroundColor: colors.orange,
                color: "white",
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: colors.darkOrange,
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s",
              }}
            >
              {t('petTinder.likeButton')}
            </Button>
          </Box>
        </Box>

        {/* Columna dreta: Detalls de la mascota */}
        <Box sx={{ height: "fit-content", maxHeight: 600 }}>
          <CardPetDetail animal={animal} />
        </Box>
      </Box>

      {/* Botó sticky cap a Galeria */}
      <PetTinderButton 
        route="/inici-usuari-galeria" 
        labelKey="petTinder.galleryButton" 
      />
    </Box>
  );
}

export default PetTinder;
