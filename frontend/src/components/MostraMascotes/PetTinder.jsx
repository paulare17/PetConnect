import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useColors } from "../../hooks/useColors";
import api from "../../api/client.js";
import ChatMiniList from "../Chat/ChatMiniList.jsx";
import Chat from "../Chat/Chat.jsx";
import CardPet from "./CardPet.jsx";
import CardPetDetail from "./CardPetDetail.jsx";

function PetTinder() {
  const { t } = useTranslation();
  const { colors } = useColors();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Función que se encarga de cargar el siguiente animal
  const fetchNextAnimal = useCallback(() => {
    setLoading(true);
    setAnimal(null); // Limpiamos el animal anterior
    setMessage(""); // Limpiamos mensajes

    // Llama al endpoint de PetTinder Next
    api
      .get("/pettinder/next/")
      .then((response) => {
        // Si la respuesta incluye un animal, lo mostramos
        if (response.data.id) {
          setAnimal(response.data);
        } else {
          // Si no hay más animales, mostramos el mensaje de "no quedan"
          setAnimal({ message: response.data.message });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(t('petTinder.errorFetch'), err);
        setError(t('petTinder.errorLoading'));
        setLoading(false);
      });
  }, []);

  // Se ejecuta al montar el componente
  useEffect(() => {
    fetchNextAnimal();
  }, [fetchNextAnimal]);

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
        // Si és un like i el backend retorna chat_id, obrim el xat inline
        if (
          actionType === "like" &&
          response.data.is_like &&
          response.data.chat_id
        ) {
          setSelectedChatId(response.data.chat_id);
        }
        // La card canvia a següent animal quan fem like/dislike
        setTimeout(() => fetchNextAnimal(), 500);
      })
      .catch((err) => {
        console.error(`Error al registrar ${actionType}:`, err);
        setMessage(t('petTinder.errorAction'));
      });
  };

  // --- Renderitzat ---
  // Capçalera sempre visible
  const renderHeader = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          color: colors.orange,
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <PetsIcon sx={{ fontSize: 48 }} />
        {t('petTinder.title')}
      </Typography>
      <Typography variant="h6" sx={{ color: colors.darkBlue }}>
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
            minHeight: "50vh",
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
        <Container sx={{ mt: 4 }}>
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
        <Box textAlign="center" mt={6}>
          <Typography variant="h5" color="text.secondary">
            {animal.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  // --- Layout amb ChatMiniList, CardPet sempre visible i Chat a la dreta ---
  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      {renderHeader()}
    
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 320px",
          gap: 4,
          maxWidth: "1400px",
          margin: "0 auto",
          px: 3,
          pb: 3,
        }}
      >
        {/* Panell esquerre: mini llista o xat inline */}
        <Box sx={{ height: 600, width: 400 }}>
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
              width: 380, 
              height: 480,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CardPet animal={animal} sx={{ width: "100%", height: "100%" }} />
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
      <Button
          variant="contained"
          onClick={() => navigate("/inici-usuari-galeria")}
          sx={{
            position: "fixed",
            top: 125,
            right: 60,
            backgroundColor: colors.blue,
            color: "white",
            px: 4,
            py: 3,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: 50,
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            boxShadow: `0 6px 20px ${colors.blue}60`,
            zIndex: 1000,
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.20)" },
            },
            "&:hover": {
              backgroundColor: colors.darkBlue,
              transform: "translateY(-2px) scale(1.05)",
              boxShadow: `0 8px 25px ${colors.orange}80`,
            },
            transition: "all 0.3s ease",
            // Responsive
            "@media (max-width: 600px)": {
              px: 2.5,
              py: 1.2,
              fontSize: "0.95rem",
              top: 16,
              right: 16,
            },
          }}
        >
          <PetsIcon sx={{ fontSize: 28 }} />
          {t('petTinder.galleryButton')}
        </Button>
    </Box>
  );
}

export default PetTinder;
