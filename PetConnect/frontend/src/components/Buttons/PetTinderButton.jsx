import React from "react";
import { Button } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../hooks/useColors";
import { useTranslation } from "react-i18next";

/**
 * Componente reutilizable para botones sticky de navegación PetTinder
 * 
 * Props:
 * - route: string - Ruta a la que navegar (ej: "/inici-usuari-pettinder")
 * - labelKey: string - Clave de traducción para el label (ej: "iniciUsuari.petTinderButton")
 * - icon: ReactElement - (opcional) Icono personalizado. Por defecto: PetsIcon
 */
function PetTinderButton({ route, labelKey, icon: CustomIcon }) {
  const navigate = useNavigate();
  const { colors } = useColors();
  const { t } = useTranslation();
  const Icon = CustomIcon || PetsIcon;

  return (
    <Button
      variant="contained"
      onClick={() => navigate(route)}
      sx={{
        position: "fixed",
        top: { xs: 120, sm: 125 },
        right: { xs: 16, sm: 60 },
        backgroundColor: colors.blue,
        color: "white",
        px: { xs: 2.5, sm: 4 },
        py: { xs: 1.2, sm: 3 },
        fontSize: { xs: "0.95rem", sm: "1.1rem" },
        fontWeight: "bold",
        borderRadius: 50,
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        boxShadow: `0 6px 20px ${colors.blue}60`,
        zIndex: 1000,
        animation: { xs: "none", sm: "pulse 2s ease-in-out infinite" },
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
      }}
    >
      <Icon sx={{ fontSize: 28 }} />
      {t(labelKey)}
    </Button>
  );
}

export default PetTinderButton;
