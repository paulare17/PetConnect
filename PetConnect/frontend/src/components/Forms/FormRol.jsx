import React from "react";
import PetsIcon from "@mui/icons-material/Pets";
import { Typography, Box } from "@mui/material";
import petsImageOrange from "../../assets/paw-orange.svg";
import petsImageBlue from "../../assets/paw-blue.svg";
import { colors } from "../../constants/colors.jsx";

export default function EscollirRol() {
  return (
    <Box
      sx={{
        bgcolor: colors.backgroundOrange,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        gap: 3,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: colors.darkBlue,
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        Com vols registrar-te?
      </Typography>

      {/* Container per a les imatges */}
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: { xs: 4, md: 6 }, // ✅ Més gap per als textos
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* ✅ Container per imatge + text (Protectora) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2, // ✅ Espai entre imatge i text
            cursor: "pointer", // ✅ Tot el container és clickable
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)", // ✅ Efecte hover més subtil per tot el bloc
            },
          }}
        >
          <Box
            component="img"
            src={petsImageOrange}
            alt="Petjada protectora"
            sx={{
              width: { xs: 200, sm: 250, md: 300 },
              height: "auto",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)", // ✅ Efecte hover específic per la imatge
              },
            }}
          />
          {/* ✅ Text baix de la imatge */}
          <Typography
            variant="h5"
            sx={{
              color: colors.orange,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" }, // ✅ Responsive font
            }}
          >
            Sóc una Protectora
          </Typography>
        </Box>

        {/* ✅ Container per imatge + text (Usuari) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2, // ✅ Espai entre imatge i text
            cursor: "pointer", // ✅ Tot el container és clickable
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)", // ✅ Efecte hover més subtil per tot el bloc
            },
          }}
        >
          <Box
            component="img"
            src={petsImageBlue}
            alt="Petjada usuari"
            sx={{
              width: { xs: 200, sm: 250, md: 300 },
              height: "auto",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)", // ✅ Efecte hover específic per la imatge
              },
            }}
          />
          {/* ✅ Text baix de la imatge */}
          <Typography
            variant="h5"
            sx={{
              color: colors.blue,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" }, // ✅ Responsive font
            }}
          >
            Vull adoptar
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
