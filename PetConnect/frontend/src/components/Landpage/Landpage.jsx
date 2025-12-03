import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import gatImatgeInfEsq from "../../assets/gat-cantonada.png";
import gatImatgeSupDreta from "../../assets/gat-superior.png";
import gosImatgeCentre from "../../assets/gos-baix.png";
import "./petjades.css";
import { useColors } from "../../hooks/useColors";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Landpage() {
  const navigate = useNavigate();
  const { colors } = useColors();
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const [cursorColor, setCursorColor] = useState(colors.darkPurple);

  const handleMouseMove = (e) => {
    if (isHovering) {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Detectar si el cursor està sobre un element interactiu
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const button = elementBelow?.closest("button");
      const isInteractive = button !== null;
      
      if (isInteractive) {
        // Comprovar el text del botó per determinar el color
        const buttonText = button.textContent;
        if (buttonText.includes("Ja tens compte")) {
          setCursorColor(colors.darkOrange);
        } else {
          setCursorColor(colors.darkBlue);
        }
      } else {
        setCursorColor(colors.darkPurple);
      }
      
      setIsOverInteractive(isInteractive);
    }
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        minHeight: "calc(100vh - 90px)",
        width: "100%",
        bgcolor: colors.background,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        cursor: isHovering ? "none" : "default",
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Cursor personalitzat amb icona PetsIcon */}
      {isHovering && (
        <Box
          sx={{
            position: "fixed",
            left: cursorPos.x,
            top: cursorPos.y,
            pointerEvents: "none",
            zIndex: 9999,
            transform: "translate(-50%, -50%)",
          }}
        >
          <PetsIcon
            sx={{
              fontSize: isOverInteractive ? "32px" : "24px",
              color: cursorColor,
              opacity: 0.8,
              transition: "all 0.2s ease-in-out",
            }}
          />
        </Box>
      )}
      <Box className="petjades-container">
        <PetsIcon className="petjada petjada-1" />
        <PetsIcon className="petjada petjada-2" />
        <PetsIcon className="petjada petjada-3" />
        <PetsIcon className="petjada petjada-4" />
        <PetsIcon className="petjada petjada-5" />
        <PetsIcon className="petjada petjada-6" />
        <PetsIcon className="petjada petjada-7" />
        <PetsIcon className="petjada petjada-8" />
      </Box>

      {/* Contingut principal centrat */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, md: 6 },
          zIndex: 2,
        }}
      >
        {/* Títol */}
        <Typography
          className="custom-title"
          variant="h1"
          sx={{
            fontFamily: "'Rubik Bubbles', sans-serif",
            fontSize: {
              xs: "2.8rem",
              sm: "3.5rem",
              md: "5rem",
              lg: "6rem",
            },
            textAlign: "center",
            mb: 2,
          }}
        >
          PetConnect
        </Typography>

        {/* Subtítol */}
        <Typography
        className="custom-subtitle"
          variant="h4"
          sx={{
            fontFamily: "'Rubik Bubbles', sans-serif",
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.6rem" },
            mb: 4,
            fontWeight: 500,
            opacity: 0.9,
            lineHeight: 1.4,
            textAlign: "center",
            // background: `linear-gradient(90deg, ${colors.blue}, ${colors.orange})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t('landpage.subtitle')}
        </Typography>

        {/* Botons */}
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ width: "100%", maxWidth: "320px", mb: 4 }}
        >
          <Button
          className="custom-color-button-orange"
            onClick={() => navigate("/formulari-dialog")}
            variant="contained"
            sx={{
              bgcolor: colors.orange,
              color: "white",
              borderRadius: "50px",
              py: 1.5,
              px: 4,
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 500,
              textTransform: "none",
              cursor: "none !important",
              boxShadow: `0 8px 20px ${colors.orange}40`,
              "&:hover": {
                bgcolor: colors.darkOrange,
                transform: "translateY(-4px) scale(1.02)",
                boxShadow: `0 12px 30px ${colors.orange}60`,
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            {t('landpage.registerButton')}
          </Button>

          <Button
          className="custom-color-button-blue"
            onClick={() => navigate("/formulari-acces")}
            variant="contained"
            sx={{
              bgcolor: colors.blue,
              color: "white",
              borderRadius: "50px",
              py: 1.2,
              px: 3.5,
              fontSize: { xs: "0.9rem", md: "1rem" },
              fontWeight: 500,
              textTransform: "none",
              cursor: "none !important",
              boxShadow: `0 8px 20px ${colors.blue}40`,
              "&:hover": {
                bgcolor: colors.darkBlue,
                transform: "translateY(-2px)",
                boxShadow: `0 8px 20px ${colors.blue}60`,
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            {t('landpage.loginButton')}
          </Button>
        </Box>
<Box
  display="flex"
  justifyContent="center"
  gap={{ xs: 1.5, sm: 2.5 }}
  flexWrap="wrap"
  sx={{ mt: 3 }}
>
  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
  >
    <Typography sx={{ fontSize: '24px' }}>✅</Typography>
    <Typography
      sx={{
        color: colors.textDark,
        fontSize: { xs: '0.85rem', sm: '0.95rem' },
      }}
    >
      {t('landpage.feature1')}
    </Typography>
  </Box>

  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
  >
    <Typography sx={{ fontSize: '24px' }}>❤️</Typography>
    <Typography
      sx={{
        color: colors.textDark,
        fontSize: { xs: '0.85rem', sm: '0.95rem' },
      }}
    >
      {t('landpage.feature2')}
    </Typography>
  </Box>

  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
  >
    <Typography sx={{ fontSize: '24px' }}>⭐</Typography>
    <Typography
      sx={{
        color: colors.textDark,
        fontSize: { xs: '0.85rem', sm: '0.95rem' },
      }}
    >
      {t('landpage.feature3')}
    </Typography>
  </Box>
</Box>
  
      </Box>

      {/* Imatges decoratives - posicionades als costats */}
      <Box
        component="img"
        src={gatImatgeSupDreta}
        alt="Gat"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: { xs: 120, sm: 180, md: 220 },
          height: "auto",
          objectFit: "cover",
          opacity: 0.9,
          zIndex: 1,
        }}
      />

      <Box
        component="img"
        src={gatImatgeInfEsq}
        alt="Gat"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: { xs: 140, sm: 200, md: 260 },
          height: "auto",
          objectFit: "cover",
          opacity: 0.9,
          zIndex: 1,
        }}
      />

      <Box
        component="img"
        src={gosImatgeCentre}
        alt="Gos"
        sx={{
          position: "absolute",
          bottom: 0,
          left: "70%",
          // transform: "translateX(-10%)",
          width: { xs: 200, sm: 200, md: 250 },
          height: "auto",
          objectFit: "cover",
          opacity: 0.9,
          zIndex: 1,
          display: { sm: "block" },
        }}
      />
    </Box>
  );
}
